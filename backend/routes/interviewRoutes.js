const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');



router.post('/schedule', interviewController.scheduleInterview);
router.put('/schedule', interviewController.updateSchedule);
router.get('/:interviewId', interviewController.getInterviewSession);
router.post('/complete', interviewController.completeInterview);
router.get('/user-results/:userId', interviewController.getUserInterviewResults);

module.exports = router;
