const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = require('../middleware/upload');
const resumeUpload = require('../middleware/resumeUpload');

// Admin routes
router.get('/admin/users', userController.getAllUsers);
router.put('/admin/users/:userId/suspend', userController.suspendUser);
router.put('/admin/users/:userId/activate', userController.activateUser);
router.delete('/admin/users/:userId', userController.deleteUser);
router.post('/admin/users/:userId/reset-password', userController.resetUserPassword);
router.post('/admin/users/admin', userController.addAdmin);

// Get Profile
router.post('/profile', userController.getProfile);

// Update Profile (with file upload support for both profile image and resume)
router.put('/profile', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 }
]), userController.updateProfile);

module.exports = router;
