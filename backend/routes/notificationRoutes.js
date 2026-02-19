const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// ─── IMPORTANT: Specific/static paths MUST come before parameterized routes ───

// Mark all as read for a user (PATCH /mark-all-read/:email)
router.patch('/mark-all-read/:email', notificationController.markAllAsRead);

// Mark single notification as read (PATCH /:id/read)
router.patch('/:id/read', notificationController.markAsRead);

// Clear all notifications for a user (DELETE /clear-all/:email)
router.delete('/clear-all/:email', notificationController.clearAll);

// Delete single notification (DELETE /:id)
router.delete('/:id', notificationController.deleteNotification);

// Get all notifications for a user (GET /:email)
router.get('/:email', notificationController.getNotifications);

module.exports = router;
