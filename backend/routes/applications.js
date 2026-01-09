const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/apply', applicationController.applyForJob);
router.get('/user/:candidateId', applicationController.getUserApplications);
router.get('/job/:jobId', applicationController.getJobApplications);

module.exports = router;
