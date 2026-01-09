const express = require('express');
const router = express.Router();
const jobDescriptionController = require('../controllers/jobDescriptionController');

router.post('/create', jobDescriptionController.createJob);
router.get('/company/:email', jobDescriptionController.getJobsByCompany);
router.get('/active', jobDescriptionController.getAllActiveJobs); // New route for users
router.get('/:id', jobDescriptionController.getJobById);
router.put('/:id', jobDescriptionController.updateJob);
router.delete('/:id', jobDescriptionController.deleteJob);

module.exports = router;
