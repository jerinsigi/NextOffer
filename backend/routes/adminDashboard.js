const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const adminActivityController = require('../controllers/adminActivityController');

// GET /api/admin/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/admin/dashboard/activity
router.get('/activity', adminActivityController.getPlatformActivity);

module.exports = router;
