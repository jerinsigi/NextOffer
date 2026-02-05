const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.submitContactForm);
router.get('/', contactController.getAllSubmissions);
router.put('/:id/status', contactController.updateSubmissionStatus);

module.exports = router;
