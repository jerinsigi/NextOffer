const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = require('../middleware/upload');
const resumeUpload = require('../middleware/resumeUpload');

// Get Profile
router.post('/profile', userController.getProfile);

// Update Profile (with file upload support for both profile image and resume)
router.put('/profile', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 }
]), userController.updateProfile);

module.exports = router;
