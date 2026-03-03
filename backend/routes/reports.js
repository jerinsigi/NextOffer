const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// @route   GET /api/reports/dashboard-stats
// @desc    Get aggregated statistics for admin dashboard
// @access  Public (or Protected if auth middleware added)
router.get('/dashboard-stats', reportsController.getDashboardStats);

// @route   GET /api/reports/company-stats
// @desc    Get dashboard statistics for a specific company
// @access  Public (or Protected)
router.get('/company-stats', reportsController.getCompanyStats);

module.exports = router;
