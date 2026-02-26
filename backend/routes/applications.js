const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const resumeUpload = require('../middleware/resumeUpload');

router.post('/apply', resumeUpload.single('resumeFile'), applicationController.applyForJob);
router.get('/user/:candidateEmail', applicationController.getUserApplications);
router.get('/job/:jobId', applicationController.getJobApplications);
router.post('/shortlist', applicationController.shortlistCandidates); router.post('/job/:jobId/finalize', applicationController.finalizeHiring);
router.post('/job/:applicationId/reject', applicationController.rejectCandidate);

module.exports = router;
