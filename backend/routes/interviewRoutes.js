const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');



router.post('/schedule', interviewController.scheduleInterview);
router.put('/schedule', interviewController.updateSchedule);
router.post('/complete', interviewController.completeInterview);
router.get('/user-results/:userId', interviewController.getUserInterviewResults);
router.get('/report/:sessionId', interviewController.getInterviewReport);
router.get('/:interviewId', interviewController.getInterviewSession);

module.exports = router;
