const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// @route   GET /api/reports/dashboard-stats
// @desc    Get aggregated statistics for admin dashboard
// @access  Public (or Protected if auth middleware added)
router.get('/dashboard-stats', reportsController.getDashboardStats);

module.exports = router;
