const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');

// Create a new practice session (generates AI questions)
router.post('/create', practiceController.createPracticeSession);

// Submit a response to a practice question
router.post('/response', practiceController.submitPracticeResponse);

// Complete a practice session and get final results
router.post('/complete', practiceController.completePracticeSession);

// Get practice history for a user (must be before /:sessionId to avoid conflict)
router.get('/history/:email', practiceController.getPracticeHistory);

// Get an existing practice session (generic catch-all, must be last)
router.get('/:sessionId', practiceController.getPracticeSession);

module.exports = router;
