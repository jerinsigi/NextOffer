const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.post('/login', authController.login);

// Change Password
router.post('/change-password', authController.changePassword);

module.exports = router;
