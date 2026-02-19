const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get user dashboard statistics
router.get('/user-stats/:candidateEmail', dashboardController.getUserDashboardStats);

module.exports = router;
