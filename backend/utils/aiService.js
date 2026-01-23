const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

const extractTextFromPDF = async (pdfPath) => {
    try {
        // Check if file is actually a PDF
        if (!pdfPath.toLowerCase().endsWith('.pdf')) {
            console.warn('Resume is not a PDF file (found:', pdfPath, '). Skipping text extraction.');
            return null;
        }

        const absolutePath = path.resolve(__dirname, '..', pdfPath.startsWith('/') ? pdfPath.slice(1) : pdfPath);
        if (!fs.existsSync(absolutePath)) {
            console.error('PDF file not found:', absolutePath);
            return null;
        }
        const dataBuffer = fs.readFileSync(absolutePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        return null;
    }
};

const generateInterviewQuestions = async (resumeText, jobDescription, count = 5, skills = []) => {
    try {
        console.log('=== AI Question Generation ===');
        console.log('API Key Present:', !!process.env.GEMINI_API_KEY);
        console.log('Requested Count:', count);
        console.log('Skills:', skills);

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found. Using mock questions.');
            return getMockQuestions(count);
        }

        console.log('Calling Gemini API...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const skillsContext = skills.length > 0 ? `Focus specifically on assessing these required skills: ${skills.join(', ')}.` : '';

        const prompt = `
            You are an expert technical interviewer. Based on the following Candidate Resume and Job Description, generate ${count} tailored interview questions.
            ${skillsContext}
            
            Ensure the questions are specific to the technology stack mentioned (e.g., if JavaScript/React is mentioned, ask specific technical questions about them).
            
            Format the output as a JSON array of objects with keys: "question_text", "topic", "difficulty_level" (Easy, Medium, Hard).
            
            Job Description:
            ${jobDescription}
            
            Candidate Resume:
            ${resumeText.substring(0, 3000)} // Truncate to avoid limits if too long
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Error generating AI questions:', error);
        return getMockQuestions();
    }
};

const getMockQuestions = (count = 5) => {
    const allMocks = [
        { question_text: "Could you walk us through your most challenging project listed on your resume?", topic: "Experience", difficulty_level: "Medium" },
        { question_text: "How do your skills align with the requirements of this role?", topic: "Fit", difficulty_level: "Easy" },
        { question_text: "Describe a situation where you had to debug a complex issue.", topic: "Problem Solving", difficulty_level: "Medium" },
        { question_text: "What interests you most about this position?", topic: "Motivation", difficulty_level: "Easy" },
        { question_text: "Where do you see yourself in 5 years?", topic: "Career Goals", difficulty_level: "Medium" },
        { question_text: "Tell me about a time you had a conflict with a team member.", topic: "Behavioral", difficulty_level: "Medium" },
        { question_text: "How do you stay updated with the latest technology trends?", topic: "Learning", difficulty_level: "Easy" },
        { question_text: "Explain a complex technical concept to a non-technical person.", topic: "Communication", difficulty_level: "Hard" }
    ];
    // Return requested number of questions (repeat if needed, or just slice if enough)
    return allMocks.slice(0, count);
};

/**
 * Score a candidate's interview response using AI
 * @param {string} questionText - The interview question
 * @param {string} candidateAnswer - The candidate's answer
 * @param {string} expectedTopic - Expected topic/area (e.g., 'JavaScript', 'Leadership')
 * @param {string} difficultyLevel - Question difficulty (Easy, Medium, Hard)
 * @returns {Object} - { ai_score: 0-100, confidence_score: 0-100, feedback: string }
 */
const scoreResponse = async (questionText, candidateAnswer, expectedTopic = 'General', difficultyLevel = 'Medium') => {
    try {
        console.log('=== AI Response Scoring ===');
        console.log('Question Topic:', expectedTopic);
        console.log('Difficulty:', difficultyLevel);

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found. Using mock scoring.');
            return {
                ai_score: 75,
                confidence_score: 80,
                feedback: "Answer demonstrates understanding (mock evaluation)"
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are an expert technical interviewer evaluating a candidate's response to an interview question.
            
            Question: "${questionText}"
            Expected Topic/Area: ${expectedTopic}
            Difficulty Level: ${difficultyLevel}
            
            Candidate's Answer: "${candidateAnswer}"
            
            Evaluate the answer on these criteria:
            1. Relevance - Does it answer the question?
            2. Technical Accuracy - Is the information correct?
            3. Clarity - Is it well-communicated?
            4. Completeness - Is it thorough enough for the difficulty level?
            
            Provide a response in JSON format with:
            - "ai_score": A number from 0-100 representing overall quality
            - "confidence_score": A number from 0-100 representing your confidence in this evaluation
            - "feedback": A brief 1-2 sentence explanation of the score
            
            Be fair but maintain high standards. An excellent answer should score 85+.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const scoringResult = JSON.parse(jsonStr);

        console.log('AI Score:', scoringResult.ai_score);
        return scoringResult;

    } catch (error) {
        console.error('Error scoring response:', error);
        // Return neutral score on error
        return {
            ai_score: 70,
            confidence_score: 50,
            feedback: "Unable to fully evaluate. Answer recorded for manual review."
        };
    }
};

module.exports = { extractTextFromPDF, generateInterviewQuestions, scoreResponse };
