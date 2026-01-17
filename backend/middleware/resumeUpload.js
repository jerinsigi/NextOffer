const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure resume upload directory exists
const resumeDir = 'upload/resumes/';
if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}

// Set up storage engine for resumes
const storage = multer.diskStorage({
    destination: './upload/resumes/',
    filename: function (req, file, cb) {
        cb(null, 'resume-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type for resumes (PDF, DOC, DOCX)
function checkResumeFileType(file, cb) {
    // Allowed extensions
    const filetypes = /pdf|doc|docx/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only PDF and Word documents are allowed!');
    }
}

// Init resume upload
const resumeUpload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkResumeFileType(file, cb);
    }
});

module.exports = resumeUpload;
