const Notification = require('../models/Notification');

// ─── Internal utility ────────────────────────────────────────────────────────
// Called by other controllers to create a notification programmatically.
// Does NOT send an HTTP response.
const createNotification = async (userEmail, type, title, message, link = null) => {
    try {
        const notification = new Notification({
            userEmail: userEmail.toLowerCase(),
            type,
            title,
            message,
            link
        });
        await notification.save();
        return notification;
    } catch (err) {
        console.error('Failed to create notification:', err.message);
        return null;
    }
};

// ─── Route Handlers ──────────────────────────────────────────────────────────

// GET /api/notifications/:email
exports.getNotifications = async (req, res) => {
    try {
        const { email } = req.params;
        const notifications = await Notification.find({ userEmail: email.toLowerCase() })
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/notifications/unread-count/:email
exports.getUnreadCount = async (req, res) => {
    try {
        const { email } = req.params;
        const count = await Notification.countDocuments({
            userEmail: email.toLowerCase(),
            read: false
        });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/notifications/mark-all-read/:email
exports.markAllAsRead = async (req, res) => {
    try {
        const { email } = req.params;
        await Notification.updateMany(
            { userEmail: email.toLowerCase(), read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/notifications/clear-all/:email
exports.clearAll = async (req, res) => {
    try {
        const { email } = req.params;
        await Notification.deleteMany({ userEmail: email.toLowerCase() });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export utility so other controllers can use it
exports.createNotification = createNotification;
