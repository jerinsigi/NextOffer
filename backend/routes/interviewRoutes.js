const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/schedule', interviewController.scheduleInterview);

module.exports = router;
