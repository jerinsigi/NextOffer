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

module.exports = { extractTextFromPDF, generateInterviewQuestions };
