require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { extractTextFromPDF } = require('./utils/aiService');
const path = require('path');
const fs = require('fs');

const testGemini = async () => {
    console.log("--- Testing Gemini API Key ---");
    const key = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!key);
    if (key) console.log("API Key start:", key.substring(0, 5) + "...");

    if (!key) {
        console.error("ERROR: GEMINI_API_KEY is missing in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Say 'Hello from Gemini' if you can hear me.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Gemini Response:", response.text());
        console.log("SUCCESS: Gemini API is working.\n");
    } catch (error) {
        console.error("ERROR: Gemini API Call Failed:", error.message);
    }
};

const testPDF = async () => {
    console.log("--- Testing PDF Parsing ---");
    // Try to find a dummy resume or list uploads
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        console.log("Uploads directory not found.");
        return;
    }

    // Find first PDF
    const files = fs.readdirSync(uploadsDir);
    const pdfFile = files.find(f => f.endsWith('.pdf'));

    if (pdfFile) {
        console.log("Found PDF:", pdfFile);
        const text = await extractTextFromPDF(path.join('uploads', pdfFile));
        console.log("Extracted Text Length:", text ? text.length : "NULL");
        if (text) console.log("Preview:", text.substring(0, 50) + "...");
    } else {
        console.log("No PDF files found in uploads to test.");
    }
};

(async () => {
    await testGemini();
    await testPDF();
})();
