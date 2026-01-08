const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const upload = require('../middleware/upload');

// Register
router.post('/register', upload.single('profileImage'), authController.register);

// OTP Verification
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);

// Login
router.post('/login', authController.login);

// Change Password
router.post('/change-password', authController.changePassword);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOTP);
router.post('/reset-password', authController.resetPassword);

// Google Authentication
router.post('/google-login', authController.googleLogin);
router.post('/google-register', authController.googleRegister);

module.exports = router;
