const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const resumeUpload = require('../middleware/resumeUpload');

// Upload resume to user's library
router.post('/upload', resumeUpload.single('resumeFile'), resumeController.uploadResume);

// Get all resumes for a user's library
router.get('/user/:email', resumeController.getUserResumes);

// Delete a resume from the library
router.delete('/:resumeId', resumeController.deleteResume);

// Rename (retag) a resume
router.patch('/:resumeId/rename', resumeController.renameResume);

module.exports = router;
