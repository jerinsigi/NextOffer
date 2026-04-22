const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

const extractTextFromPDF = async (pdfPath) => {
    try {
        // Check if file is actually a PDF
        if (!pdfPath.toLowerCase().endsWith('.pdf')) {
            return null;
        }

        // FIX: Resume path from DB is like "/uploads/resumes/..." 
        // but actual folder on disk is "upload/resumes/..." (singular 'upload')
        // We need to map this correctly relative to backend root.
        let relativePath = pdfPath.startsWith('/') ? pdfPath.slice(1) : pdfPath;

        // If path starts with 'upload/', replace with 'upload/'
        if (relativePath.startsWith('upload/')) {
            relativePath = relativePath.replace('upload/', 'upload/');
        }

        const absolutePath = path.resolve(__dirname, '..', relativePath);

        if (!fs.existsSync(absolutePath)) {
            console.error('❌ PDF file not found at:', absolutePath);
            return null;
        }

        const dataBuffer = fs.readFileSync(absolutePath);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();

        if (data.text && data.text.length > 50) {
            return data.text;
        } else {
            return null;
        }

    } catch (error) {
        console.error('❌ Error extracting PDF text:', error.message);
        return null;
    }
};

/**
 * Generate interview questions deeply personalised to the candidate's resume.
 * Produces two batches:
 *   1. Resume-personalised  — based on actual projects, experience, tech stack in their CV
 *   2. Role / skill-based    — based on job requirements and required skills
 *
 * @param {string|null} resumeText  - Full text extracted from the candidate's PDF resume
 * @param {string}      jobTitle    - Job title being applied for
 * @param {string}      jobDesc     - Job description / requirements
 * @param {string[]}    skills      - Required skills listed on the job posting
 * @param {number}      totalCount  - Total questions to generate
 */
const generateResumeAwareQuestions = async (resumeText, jobTitle, jobDesc, skills = [], totalCount = 5) => {
    const hasResume = resumeText && resumeText.trim().length > 100;

    if (!process.env.GEMINI_API_KEY) {
        return getMockQuestions(totalCount);
    }

    const resumeCount = hasResume ? Math.ceil(totalCount * 0.5) : 0;
    const roleCount = totalCount - resumeCount;
    const skillsStr = skills.length > 0 ? skills.join(', ') : 'general software development skills';
    const resumeSnippet = hasResume ? resumeText.substring(0, 4000) : '';

    const prompt = `
You are a senior technical interviewer preparing a personalised interview for a candidate applying for the role of "${jobTitle}".

${hasResume ? `
=== CANDIDATE RESUME (analyse carefully) ===
${resumeSnippet}

Step 1 — Silently extract from the resume:
  • Professional summary / objective
  • Technical skills and tools listed
  • Work experience: companies, roles, responsibilities, achievements
  • Projects: names, technologies used, what the candidate built or contributed
  • Education and certifications

Step 2 — Generate ${resumeCount} RESUME-PERSONALISED questions that:
  - Directly reference something from THEIR resume (e.g. "I see you used React in your project X — tell me about …")
  - Probe depth of understanding on technologies they CLAIM to know
  - Ask about specific challenges, decisions, or outcomes in their listed experience
  - Cover different sections: at least one about a project, one about work experience or skills
  - topic should be labelled "Resume – <area>" (e.g. "Resume – Project Experience", "Resume – Skills Deep-Dive")
` : ''}

=== JOB ROLE REQUIREMENTS ===
Job Title: ${jobTitle}
Required Skills: ${skillsStr}
Job Description:
${(jobDesc || jobTitle).substring(0, 1500)}

Step ${hasResume ? 3 : 1} — Generate ${roleCount} ROLE-BASED questions that:
  - Assess technical depth on the required skills (${skillsStr})
  - Include at least one behavioural / situational question (STAR format expected)
  - Vary difficulty: mix Easy, Medium, Hard
  - topic should be labelled with the specific skill or area (e.g. "React", "System Design", "Leadership")

=== OUTPUT FORMAT ===
Return ONLY a valid JSON array (no markdown, no extra text) of exactly ${totalCount} objects, each with:
  "question_text" : string
  "topic"         : string
  "difficulty_level" : "Easy" | "Medium" | "Hard"
  "question_source"  : "resume" | "role"
`;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return parsed;
    } catch (err) {
        console.error('Error in generateResumeAwareQuestions:', err.message);
        return getMockQuestions(totalCount);
    }
};

// Keep the old function around as a simpler wrapper for backward compatibility
const generateInterviewQuestions = async (resumeText, jobDescription, count = 5, skills = []) => {
    return generateResumeAwareQuestions(resumeText, jobDescription, jobDescription, skills, count);
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

        if (!process.env.GEMINI_API_KEY) {
            return {
                ai_score: 75,
                confidence_score: 80,
                feedback: "Answer demonstrates understanding (mock evaluation)"
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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

const evaluateResumeMatch = async (resumeText, jobDescription, skills = []) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return {
                resume_score: 75,
                recommendation: "Candidate shows a good match for the role (mock evaluation)."
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const skillsStr = skills.length > 0 ? skills.join(', ') : 'general requirements';

        const prompt = `
            You are an expert technical recruiter evaluating a candidate's resume against a job description.
            
            === CANDIDATE RESUME ===
            ${resumeText ? resumeText.substring(0, 4000) : 'No resume provided.'}
            
            === JOB DESCRIPTION ===
            ${jobDescription ? jobDescription.substring(0, 1500) : 'No description provided.'}
            
            === REQUIRED SKILLS ===
            ${skillsStr}
            
            Evaluate the resume on these criteria:
            1. Relevance - Does the experience match the job description?
            2. Skills Match - Do they possess the required skills?
            
            Provide a response in ONLY valid JSON format with:
            - "resume_score": A number from 0-100 indicating how well the candidate matches the job.
            - "recommendation": A brief 1-2 sentence explanation of why they received this score and whether they are recommended for an interview.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const scoringResult = JSON.parse(jsonStr);

        return scoringResult;

    } catch (error) {
        console.error('Error evaluating resume match:', error);
        // Return neutral score on error
        return {
            resume_score: 50,
            recommendation: "Unable to fully evaluate the resume match automatically. Manual review is required."
        };
    }
};

module.exports = { extractTextFromPDF, generateInterviewQuestions, generateResumeAwareQuestions, scoreResponse, evaluateResumeMatch };

