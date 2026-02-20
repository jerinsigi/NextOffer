const express = require('express');
const router = express.Router();
const { getSettings, getPublicSettings, updateSettings } = require('../controllers/settingsController');

// Get public-safe settings (no auth required)
router.route('/public').get(getPublicSettings);

// Get all settings (admin only)
router.route('/').get(getSettings);

// Update settings (admin only)
router.route('/').put(updateSettings);

module.exports = router;
