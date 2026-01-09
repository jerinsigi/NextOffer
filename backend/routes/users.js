const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = require('../middleware/upload');

// Get Profile
router.post('/profile', userController.getProfile);

// Update Profile (with file upload support)
router.put('/profile', upload.single('profileImage'), userController.updateProfile);

module.exports = router;
