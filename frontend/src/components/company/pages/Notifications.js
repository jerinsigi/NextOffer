import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../common/dashboard/Notifications.css';
import Loader from '../../common/Loader';

const Notifications = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getUserEmail = () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr).email;
    };

    const fetchNotifications = useCallback(async () => {
        const email = getUserEmail();
        if (!email) return;
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const formatTimeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const filterOptions = [
        { key: 'all', label: 'All', icon: 'bi-bell' },
        { key: 'unread', label: 'Unread', icon: 'bi-circle-fill' },
        { key: 'interview', label: 'Interviews', icon: 'bi-camera-video' },
        { key: 'integrity', label: 'Integrity', icon: 'bi-shield-check' },
        { key: 'company', label: 'System', icon: 'bi-building' },
    ];

    const getFilteredNotifications = () => {
        if (activeFilter === 'all') return notifications;
        if (activeFilter === 'unread') return notifications.filter(n => !n.read);
        return notifications.filter(n => n.type === activeFilter);
    };

    const getFilterCount = (key) => {
        if (key === 'all') return notifications.length;
        if (key === 'unread') return notifications.filter(n => !n.read).length;
        return notifications.filter(n => n.type === key).length;
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllAsRead = async () => {
        const email = getUserEmail();
        if (!email) return;
        try {
            await fetch(`http://localhost:5000/api/notifications/mark-all-read/${encodeURIComponent(email)}`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'DELETE' });
            setNotifications(prev => prev.filter(n => n._id !== id));
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const clearAll = async () => {
        const email = getUserEmail();
        if (!email) return;
        try {
            await fetch(`http://localhost:5000/api/notifications/clear-all/${encodeURIComponent(email)}`, { method: 'DELETE' });
            setNotifications([]);
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'interview': return '📅';
            case 'integrity': return '🛡️';
            case 'company': return '🏢';
            case 'job': return '💼';
            default: return '🔔';
        }
    };

    const getTypeAccentColor = (type) => {
        switch (type) {
            case 'interview': return '#6366f1'; // Indigo
            case 'integrity': return '#ef4444'; // Red
            case 'company': return '#3b82f6'; // Blue
            case 'job': return '#f59e0b'; // Amber
            default: return '#94a3b8'; // Slate
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = getFilteredNotifications();

    if (loading) {
        return (
            <div className="notif-page">
                <Loader />
            </div>
        );
    }

    return (
        <div className="notif-page">

            {/* ── Header ── */}
            <div className="notif-header">
                <div>
                    <h2 className="notif-title">
                        <i className="bi bi-bell-fill me-2"></i>
                        Notifications
                        {unreadCount > 0 && (
                            <span className="notif-unread-badge">{unreadCount}</span>
                        )}
                    </h2>
                    <p className="notif-subtitle">Stay updated with your latest company activities</p>
                </div>
                <div className="d-flex gap-2">
                    {unreadCount > 0 && (
                        <button className="btn btn-outline-primary btn-sm" onClick={markAllAsRead}>
                            <i className="bi bi-check2-all me-1"></i> Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>
                            <i className="bi bi-trash me-1"></i> Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats row ── */}
            <div className="notif-stats-row">
                <div className="notif-stat-card" style={{ '--accent': '#ef4444' }}>
                    <span className="notif-stat-value">{unreadCount}</span>
                    <span className="notif-stat-label">Unread</span>
                </div>
                <div className="notif-stat-card" style={{ '--accent': '#6366f1' }}>
                    <span className="notif-stat-value">{notifications.length}</span>
                    <span className="notif-stat-label">Total</span>
                </div>
                <div className="notif-stat-card" style={{ '--accent': '#f59e0b' }}>
                    <span className="notif-stat-value">{notifications.filter(n => n.type === 'interview').length}</span>
                    <span className="notif-stat-label">Interviews</span>
                </div>
                <div className="notif-stat-card" style={{ '--accent': '#ef4444' }}>
                    <span className="notif-stat-value">{notifications.filter(n => n.type === 'integrity').length}</span>
                    <span className="notif-stat-label">Integrity</span>
                </div>
            </div>

            {/* ── Filter tabs ── */}
            <div className="notif-filter-tabs">
                {filterOptions.map(f => {
                    const count = getFilterCount(f.key);
                    return (
                        <button
                            key={f.key}
                            className={`notif-filter-tab ${activeFilter === f.key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.key)}
                        >
                            <i className={`bi ${f.icon} me-1`}></i>
                            {f.label}
                            {count > 0 && (
                                <span className="notif-tab-count">{count}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── List ── */}
            {filteredNotifications.length > 0 ? (
                <div className="notif-list">
                    {filteredNotifications.map(notif => (
                        <div
                            key={notif._id}
                            className={`notif-card ${!notif.read ? 'notif-card--unread' : ''}`}
                            style={{ '--type-color': getTypeAccentColor(notif.type) }}
                        >
                            <div className="notif-card-icon">
                                {getTypeIcon(notif.type)}
                            </div>

                            <div className="notif-card-body">
                                <div className="notif-card-top">
                                    <span className="notif-card-title">{notif.title}</span>
                                    <span className="notif-card-time">
                                        <i className="bi bi-clock me-1"></i>
                                        {formatTimeAgo(notif.createdAt)}
                                    </span>
                                </div>
                                <p className="notif-card-msg">{notif.message}</p>
                                {notif.link && (
                                    <button
                                        className="notif-card-cta"
                                        onClick={() => {
                                            if (!notif.read) markAsRead(notif._id);
                                            navigate(notif.link);
                                        }}
                                    >
                                        {notif.type === 'integrity' ? 'Review Log' :
                                            notif.type === 'interview' ? 'View Interview' :
                                                'View Details'}
                                        <i className="bi bi-arrow-right ms-1"></i>
                                    </button>
                                )}
                            </div>

                            <div className="notif-card-actions">
                                {!notif.read && (
                                    <button
                                        className="notif-action-btn"
                                        title="Mark as read"
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <i className="bi bi-check-lg"></i>
                                    </button>
                                )}
                                <button
                                    className="notif-action-btn notif-action-btn--delete"
                                    title="Delete"
                                    onClick={() => deleteNotification(notif._id)}
                                >
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="notif-empty">
                    <i className="bi bi-bell-slash notif-empty-icon"></i>
                    <h5>No notifications</h5>
                    <p className="text-muted">
                        {activeFilter === 'all'
                            ? "You're all caught up! Notifications will appear here when there's activity on your account."
                            : `No ${activeFilter} notifications found.`}
                    </p>
                    {activeFilter === 'all' && (
                        <button className="btn btn-primary mt-2" onClick={() => navigate('/company/dashboard')}>
                            <i className="bi bi-speedometer2 me-2"></i>Return to Dashboard
                        </button>
                    )}
                </div>
            )}

        </div>
    );
};

export default Notifications;
