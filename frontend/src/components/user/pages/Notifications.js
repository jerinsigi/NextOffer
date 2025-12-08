import React, { useState } from 'react';
import './Notifications.css';

const Notifications = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'interview',
            title: 'Interview Scheduled',
            message: 'Your interview with TechCorp for Senior Developer position is scheduled for Dec 12, 2025 at 2:00 PM',
            timestamp: '2 hours ago',
            read: false,
            icon: '📅',
            color: 'primary',
            actionRequired: true,
            actions: [
                { label: 'View Details', type: 'primary' },
                { label: 'Reschedule', type: 'outline' }
            ]
        },
        {
            id: 2,
            type: 'application',
            title: 'Application Status Updated',
            message: 'Your application for Full Stack Developer at StartupXYZ has been shortlisted',
            timestamp: '5 hours ago',
            read: false,
            icon: '✅',
            color: 'success',
            actionRequired: false
        },
        {
            id: 3,
            type: 'result',
            title: 'Interview Results Available',
            message: 'Your interview results for Backend Engineer at CloudTech are now available',
            timestamp: '1 day ago',
            read: true,
            icon: '📊',
            color: 'info',
            actionRequired: true,
            actions: [
                { label: 'View Results', type: 'primary' }
            ]
        },
        {
            id: 4,
            type: 'course',
            title: 'New Course Recommendation',
            message: 'Based on your profile, we recommend "Advanced System Design" course',
            timestamp: '1 day ago',
            read: true,
            icon: '📚',
            color: 'warning',
            actionRequired: false
        },
        {
            id: 5,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'Congratulations! You\'ve completed 10 practice interviews',
            timestamp: '2 days ago',
            read: true,
            icon: '🏆',
            color: 'success',
            actionRequired: false
        },
        {
            id: 6,
            type: 'interview',
            title: 'Interview Reminder',
            message: 'Your interview with DataCorp is in 24 hours. Make sure you\'re prepared!',
            timestamp: '2 days ago',
            read: false,
            icon: '⏰',
            color: 'primary',
            actionRequired: true,
            actions: [
                { label: 'Prepare', type: 'primary' }
            ]
        },
        {
            id: 7,
            type: 'application',
            title: 'Application Received',
            message: 'Your application for Machine Learning Engineer at AI Labs has been received',
            timestamp: '3 days ago',
            read: true,
            icon: '📨',
            color: 'info',
            actionRequired: false
        },
        {
            id: 8,
            type: 'system',
            title: 'Profile Completion',
            message: 'Your profile is 85% complete. Add certifications to increase visibility',
            timestamp: '4 days ago',
            read: true,
            icon: '👤',
            color: 'warning',
            actionRequired: true,
            actions: [
                { label: 'Complete Profile', type: 'outline' }
            ]
        },
        {
            id: 9,
            type: 'result',
            title: 'Practice Interview Feedback',
            message: 'New AI feedback available for your recent JavaScript practice session',
            timestamp: '5 days ago',
            read: true,
            icon: '💡',
            color: 'info',
            actionRequired: false
        },
        {
            id: 10,
            type: 'job',
            title: 'New Job Match',
            message: '3 new jobs match your skills and preferences',
            timestamp: '1 week ago',
            read: true,
            icon: '💼',
            color: 'success',
            actionRequired: true,
            actions: [
                { label: 'View Jobs', type: 'primary' }
            ]
        }
    ]);

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        interviewReminders: true,
        applicationUpdates: true,
        courseRecommendations: true,
        weeklyDigest: false
    });

    const filterOptions = [
        { key: 'all', label: 'All', icon: 'fa-bell' },
        { key: 'unread', label: 'Unread', icon: 'fa-circle' },
        { key: 'interview', label: 'Interviews', icon: 'fa-calendar' },
        { key: 'application', label: 'Applications', icon: 'fa-file-alt' },
        { key: 'result', label: 'Results', icon: 'fa-chart-bar' },
        { key: 'course', label: 'Courses', icon: 'fa-graduation-cap' }
    ];

    const getFilteredNotifications = () => {
        if (activeFilter === 'all') {
            return notifications;
        } else if (activeFilter === 'unread') {
            return notifications.filter(n => !n.read);
        } else {
            return notifications.filter(n => n.type === activeFilter);
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const toggleSetting = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = getFilteredNotifications();

    return (
        <div className="notifications-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <i className="fas fa-bell me-2"></i>
                        Notifications
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </h2>
                    <p className="text-muted">Stay updated with your latest activities</p>
                </div>
                <div className="header-actions">
                    {unreadCount > 0 && (
                        <button className="btn btn-outline-primary" onClick={markAllAsRead}>
                            <i className="fas fa-check-double me-1"></i> Mark All Read
                        </button>
                    )}
                    <button className="btn btn-primary" data-toggle="settings">
                        <i className="fas fa-cog me-1"></i> Settings
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="notification-stats">
                <div className="stat-item">
                    <div className="stat-icon unread">
                        <i className="fas fa-circle"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{unreadCount}</div>
                        <div className="stat-label">Unread</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon total">
                        <i className="fas fa-bell"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{notifications.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon action">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">
                            {notifications.filter(n => n.actionRequired).length}
                        </div>
                        <div className="stat-label">Action Required</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon today">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">
                            {notifications.filter(n => n.timestamp.includes('hour') || n.timestamp.includes('minutes')).length}
                        </div>
                        <div className="stat-label">Today</div>
                    </div>
                </div>
            </div>

            <div className="notifications-content">
                {/* Filters */}
                <div className="notifications-sidebar">
                    <div className="filter-section">
                        <h4>Filters</h4>
                        <div className="filter-list">
                            {filterOptions.map(filter => (
                                <button
                                    key={filter.key}
                                    className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter.key)}
                                >
                                    <i className={`fas ${filter.icon}`}></i>
                                    <span>{filter.label}</span>
                                    {filter.key === 'unread' && unreadCount > 0 && (
                                        <span className="filter-count">{unreadCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <div className="settings-panel">
                        <h4>
                            <i className="fas fa-cog me-2"></i>
                            Notification Settings
                        </h4>
                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Email Notifications</div>
                                    <div className="setting-description">Receive updates via email</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={() => toggleSetting('emailNotifications')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Push Notifications</div>
                                    <div className="setting-description">Browser push notifications</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.pushNotifications}
                                        onChange={() => toggleSetting('pushNotifications')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Interview Reminders</div>
                                    <div className="setting-description">24h before interviews</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.interviewReminders}
                                        onChange={() => toggleSetting('interviewReminders')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Application Updates</div>
                                    <div className="setting-description">Status change alerts</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.applicationUpdates}
                                        onChange={() => toggleSetting('applicationUpdates')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Course Recommendations</div>
                                    <div className="setting-description">Learning suggestions</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.courseRecommendations}
                                        onChange={() => toggleSetting('courseRecommendations')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Weekly Digest</div>
                                    <div className="setting-description">Summary every Monday</div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.weeklyDigest}
                                        onChange={() => toggleSetting('weeklyDigest')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="notifications-main">
                    <div className="notifications-header">
                        <h3>
                            {activeFilter === 'all' && 'All Notifications'}
                            {activeFilter === 'unread' && 'Unread Notifications'}
                            {activeFilter === 'interview' && 'Interview Notifications'}
                            {activeFilter === 'application' && 'Application Notifications'}
                            {activeFilter === 'result' && 'Result Notifications'}
                            {activeFilter === 'course' && 'Course Notifications'}
                        </h3>
                        {notifications.length > 0 && (
                            <button className="btn-text-danger" onClick={clearAll}>
                                <i className="fas fa-trash me-1"></i> Clear All
                            </button>
                        )}
                    </div>

                    {filteredNotifications.length > 0 ? (
                        <div className="notifications-list">
                            {filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${!notification.read ? 'unread' : ''} ${notification.color}`}
                                >
                                    {!notification.read && <div className="unread-indicator"></div>}
                                    
                                    <div className="notification-icon">
                                        {notification.icon}
                                    </div>
                                    
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <h4>{notification.title}</h4>
                                            <span className="notification-time">
                                                <i className="far fa-clock"></i>
                                                {notification.timestamp}
                                            </span>
                                        </div>
                                        <p className="notification-message">{notification.message}</p>
                                        
                                        {notification.actionRequired && notification.actions && (
                                            <div className="notification-actions">
                                                {notification.actions.map((action, index) => (
                                                    <button
                                                        key={index}
                                                        className={`btn btn-sm ${action.type === 'primary' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="notification-controls">
                                        {!notification.read && (
                                            <button
                                                className="control-btn"
                                                onClick={() => markAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                        <button
                                            className="control-btn delete"
                                            onClick={() => deleteNotification(notification.id)}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-bell-slash fa-4x"></i>
                            <h5>No notifications</h5>
                            <p className="text-muted">
                                {activeFilter === 'all' 
                                    ? "You're all caught up!" 
                                    : `No ${activeFilter} notifications`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
