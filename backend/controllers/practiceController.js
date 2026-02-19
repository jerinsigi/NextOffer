const PracticeSession = require('../models/Practice_Session');
const PracticeQuestion = require('../models/Practice_Question');
const PracticeResponse = require('../models/Practice_Response');
const { generateInterviewQuestions, scoreResponse } = require('../utils/aiService');

/**
 * Create a new practice session - generates AI questions for selected skills
 */
exports.createPracticeSession = async (req, res) => {
    try {
        const { skills, questionCount, difficulty, email } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'At least one skill must be selected' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const count = parseInt(questionCount) || 5;

        // Create session in DB
        const session = new PracticeSession({
            candidateEmail: email,
            skills,
            questionCount: count,
            status: 'active'
        });
        await session.save();

        const difficultyLevel = difficulty || 'Medium';

        // Generate AI questions focused on selected skills
        const jobDescription = `Practice interview covering the following skills: ${skills.join(', ')}. 
        Generate technical interview questions at a ${difficultyLevel} difficulty level that specifically 
        test the candidate's knowledge and practical experience with these skills. 
        ${difficultyLevel === 'Easy' ? 'Focus on foundational concepts and definitions.' :
                difficultyLevel === 'Hard' ? 'Focus on advanced edge cases, system design, and deep technical knowledge.' :
                    'Include real-world scenarios and moderate technical depth.'}`;

        const resumeContext = `Candidate wants to practice: ${skills.join(', ')} at ${difficultyLevel} difficulty.`;

        const aiQuestions = await generateInterviewQuestions(
            resumeContext,
            jobDescription,
            count,
            skills
        );

        // Save questions to DB
        const questionsToInsert = aiQuestions.map((q, index) => ({
            practiceSessionId: session._id,
            question_text: q.question_text,
            topic: q.topic || skills[index % skills.length] || 'General',
            difficulty_level: q.difficulty_level || difficultyLevel,
            generated_by: 'AI',
            order: index
        }));

        await PracticeQuestion.insertMany(questionsToInsert);
        const savedQuestions = await PracticeQuestion.find({ practiceSessionId: session._id }).sort({ order: 1 });

        res.status(201).json({
            sessionId: session._id,
            skills,
            questionCount: count,
            questions: savedQuestions.map(q => ({
                id: q._id,
                question: q.question_text,
                topic: q.topic,
                difficulty: q.difficulty_level,
                duration: 300
            }))
        });

    } catch (error) {
        console.error('Error creating practice session:', error);
        res.status(500).json({ message: 'Error creating practice session', error: error.message });
    }
};

/**
 * Get a practice session and its questions
 */
exports.getPracticeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await PracticeSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Practice session not found' });
        }

        const questions = await PracticeQuestion.find({ practiceSessionId: sessionId }).sort({ order: 1 });
        const responses = await PracticeResponse.find({ practiceSessionId: sessionId });

        res.json({
            sessionId: session._id,
            skills: session.skills,
            questionCount: session.questionCount,
            status: session.status,
            questions: questions.map(q => ({
                id: q._id,
                question: q.question_text,
                topic: q.topic,
                difficulty: q.difficulty_level,
                duration: 300
            })),
            responses: responses.map(r => ({
                questionId: r.practiceQuestionId,
                ai_score: r.ai_score,
                feedback: r.feedback
            }))
        });

    } catch (error) {
        console.error('Error fetching practice session:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Submit a practice response and score it with AI
 */
exports.submitPracticeResponse = async (req, res) => {
    try {
        const { practiceQuestionId, practiceSessionId, candidateAnswer } = req.body;

        if (!practiceQuestionId || !practiceSessionId) {
            return res.status(400).json({ message: 'Question ID and session ID are required' });
        }

        const question = await PracticeQuestion.findById(practiceQuestionId);
        if (!question) {
            return res.status(404).json({ message: 'Practice question not found' });
        }

        // Score the response with AI (same function as real interviews)
        const scoringResult = await scoreResponse(
            question.question_text,
            candidateAnswer || '',
            question.topic,
            question.difficulty_level
        );

        // Check if response already exists (re-submit case)
        let response = await PracticeResponse.findOne({
            practiceQuestionId,
            practiceSessionId
        });

        if (response) {
            response.candidate_answer = candidateAnswer || '';
            response.ai_score = scoringResult.ai_score;
            response.confidence_score = scoringResult.confidence_score;
            response.feedback = scoringResult.feedback;
            response.submittedAt = new Date();
        } else {
            response = new PracticeResponse({
                practiceQuestionId,
                practiceSessionId,
                candidate_answer: candidateAnswer || '',
                ai_score: scoringResult.ai_score,
                confidence_score: scoringResult.confidence_score,
                feedback: scoringResult.feedback
            });
        }

        await response.save();

        res.status(201).json({
            message: 'Response submitted successfully',
            response: {
                id: response._id,
                ai_score: response.ai_score,
                confidence_score: response.confidence_score,
                feedback: response.feedback
            }
        });

    } catch (error) {
        console.error('Error submitting practice response:', error);
        res.status(500).json({ message: 'Error submitting response', error: error.message });
    }
};

/**
 * Complete a practice session - aggregate results and generate summary
 */
exports.completePracticeSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const session = await PracticeSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Practice session not found' });
        }

        // Fetch all questions and responses
        const questions = await PracticeQuestion.find({ practiceSessionId: sessionId }).sort({ order: 1 });
        const responses = await PracticeResponse.find({ practiceSessionId: sessionId });

        // Compute overall score
        let totalScore = 0;
        let scoredCount = 0;
        const feedbackParts = [];

        const questionsWithResults = questions.map(q => {
            const response = responses.find(r => r.practiceQuestionId.toString() === q._id.toString());
            const score = response ? (response.ai_score || 0) : 0;
            if (response && response.ai_score !== null && response.ai_score !== undefined) {
                totalScore += response.ai_score;
                scoredCount++;
            }
            if (response && response.feedback) {
                feedbackParts.push(`${q.topic}: ${response.feedback}`);
            }
            return {
                question: q.question_text,
                topic: q.topic,
                difficulty: q.difficulty_level,
                answer: response ? response.candidate_answer : '',
                ai_score: score,
                feedback: response ? response.feedback : 'No answer recorded'
            };
        });

        const overallScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

        // Determine strengths and improvements
        const strengths = [];
        const improvements = [];
        questionsWithResults.forEach(q => {
            if (q.ai_score >= 80) strengths.push(`${q.topic}: ${(q.feedback || '').substring(0, 80)}`);
            else if (q.ai_score < 70 && q.ai_score > 0) improvements.push(`${q.topic}: ${(q.feedback || '').substring(0, 80)}`);
        });

        if (strengths.length === 0) strengths.push('Completed all practice questions.');
        if (improvements.length === 0) improvements.push('Review key concepts and practice more.');

        const aiFeedbackSummary = feedbackParts.length > 0
            ? feedbackParts.join(' | ').substring(0, 500)
            : 'Practice session completed.';

        // Mark session as completed
        session.status = 'completed';
        session.overallScore = overallScore;
        session.aiFeedbackSummary = aiFeedbackSummary;
        session.completedAt = new Date();
        await session.save();

        res.status(200).json({
            message: 'Practice session completed',
            sessionId: session._id,
            overallScore,
            skills: session.skills,
            totalQuestions: questions.length,
            answeredQuestions: responses.length,
            strengths: strengths.slice(0, 4),
            improvements: improvements.slice(0, 4),
            aiFeedbackSummary,
            questions: questionsWithResults
        });

    } catch (error) {
        console.error('Error completing practice session:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get practice history for a user
 */
exports.getPracticeHistory = async (req, res) => {
    try {
        const { email } = req.params;
        const sessions = await PracticeSession.find({ candidateEmail: email, status: 'completed' })
            .sort({ completedAt: -1 })
            .limit(10);

        res.json(sessions.map(s => ({
            id: s._id,
            skills: s.skills,
            questionCount: s.questionCount,
            overallScore: s.overallScore,
            completedAt: s.completedAt
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
