const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');

// Submit a response to a question
router.post('/submit', responseController.submitResponse);

// Get all responses for a session
router.get('/session/:sessionId', responseController.getSessionResponses);

module.exports = router;
