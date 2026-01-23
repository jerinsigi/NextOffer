const InterviewResponse = require('../models/Interview_Response');
const InterviewQuestion = require('../models/Interview_Question');
const { scoreResponse } = require('../utils/aiService');

/**
 * Submit a candidate's response to an interview question
 */
exports.submitResponse = async (req, res) => {
    try {
        const { questionId, candidateAnswer } = req.body;

        if (!questionId || !candidateAnswer) {
            return res.status(400).json({
                message: 'Question ID and candidate answer are required'
            });
        }

        // Get the question details for context
        const question = await InterviewQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Score the response using AI
        const scoringResult = await scoreResponse(
            question.question_text,
            candidateAnswer,
            question.topic,
            question.difficulty_level
        );

        // Save the response with scores
        const response = new InterviewResponse({
            Fk_question_id: questionId,
            candidate_answer: candidateAnswer,
            ai_score: scoringResult.ai_score,
            confidence_score: scoringResult.confidence_score,
            feedback: scoringResult.feedback // Add this field to model if needed
        });

        await response.save();

        res.status(201).json({
            message: 'Response submitted successfully',
            response: {
                id: response._id,
                ai_score: response.ai_score,
                confidence_score: response.confidence_score,
                feedback: scoringResult.feedback
            }
        });

    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({
            message: 'Error submitting response',
            error: error.message
        });
    }
};

/**
 * Get all responses for an interview session
 */
exports.getSessionResponses = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Get all questions for the session
        const questions = await InterviewQuestion.find({ Fk_session_id: sessionId });
        const questionIds = questions.map(q => q._id);

        // Get all responses for these questions
        const responses = await InterviewResponse.find({
            Fk_question_id: { $in: questionIds }
        }).populate('Fk_question_id', 'question_text topic difficulty_level');

        // Calculate overall statistics
        const totalScore = responses.reduce((sum, r) => sum + (r.ai_score || 0), 0);
        const averageScore = responses.length > 0 ? totalScore / responses.length : 0;

        res.json({
            sessionId,
            totalQuestions: questions.length,
            answeredQuestions: responses.length,
            averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
            responses: responses.map(r => ({
                questionId: r.Fk_question_id._id,
                questionText: r.Fk_question_id.question_text,
                topic: r.Fk_question_id.topic,
                difficulty: r.Fk_question_id.difficulty_level,
                candidateAnswer: r.candidate_answer,
                aiScore: r.ai_score,
                confidenceScore: r.confidence_score,
                submittedAt: r.submitted_at
            }))
        });

    } catch (error) {
        console.error('Error getting session responses:', error);
        res.status(500).json({
            message: 'Error retrieving responses',
            error: error.message
        });
    }
};
