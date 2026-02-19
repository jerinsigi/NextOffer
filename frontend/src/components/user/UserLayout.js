import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../common/dashboard/DashboardLayout.css';
import logo from '../../logo.svg';

const UserLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [userData, setUserData] = useState({ name: 'Guest', type: 'Candidate', avatar: null });
    const [userEmail, setUserEmail] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.read).length;

    const loadUserData = useCallback(async () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserEmail(user.email);

            // Try to fetch latest profile data from backend
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setUserData({
                        name: profileData.full_name || user.username || 'User',
                        type: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Candidate',
                        avatar: profileData.image_url ?
                            (profileData.image_url.startsWith('http') || profileData.image_url.startsWith('data')
                                ? profileData.image_url
                                : `http://localhost:5000${profileData.image_url}`)
                            : (profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : 'U')
                    });
                } else {
                    setUserData({
                        name: user.username || 'User',
                        type: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Candidate',
                        avatar: user.image_url ?
                            (user.image_url.startsWith('http') || user.image_url.startsWith('data')
                                ? user.image_url
                                : `http://localhost:5000${user.image_url}`)
                            : (user.username ? user.username.charAt(0).toUpperCase() : 'U')
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setUserData({
                    name: user.username || 'User',
                    type: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Candidate',
                    avatar: user.image_url ?
                        (user.image_url.startsWith('http') || user.image_url.startsWith('data')
                            ? user.image_url
                            : `http://localhost:5000${user.image_url}`)
                        : (user.username ? user.username.charAt(0).toUpperCase() : 'U')
                });
            }
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(user.email)}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    }, []);

    const formatTimeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const handleMarkRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Error marking notification read:', err);
        }
    };

    useEffect(() => {
        loadUserData();
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        window.addEventListener('userProfileUpdated', loadUserData);
        window.addEventListener('notificationsUpdated', fetchNotifications);

        return () => {
            clearInterval(interval);
            window.removeEventListener('userProfileUpdated', loadUserData);
            window.removeEventListener('notificationsUpdated', fetchNotifications);
        };
    }, [loadUserData, fetchNotifications]);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: 'bi-grid',
            path: '/user/dashboard',
            badge: null
        },
        {
            title: 'My Profile',
            icon: 'bi-person',
            path: '/user/profile',
            badge: null
        },
        {
            title: 'Job Opportunities',
            icon: 'bi-briefcase',
            path: '/user/jobs',
            badge: null
        },
        {
            title: 'My Applications',
            icon: 'bi-file-earmark-check',
            path: '/user/applications',
            badge: null
        },

        {
            title: 'Practice Interview',
            icon: 'bi-lightbulb',
            path: '/user/practice',
            badge: null
        },
        {
            title: 'Results & Feedback',
            icon: 'bi-graph-up-arrow',
            path: '/user/results',
            badge: null
        },
        {
            title: 'Skill Development',
            icon: 'bi-book',
            path: '/user/skills',
            badge: null
        },
        {
            title: 'Notifications',
            icon: 'bi-bell',
            path: '/user/notifications',
            badge: unreadCount > 0 ? unreadCount : null
        },
        {
            title: 'Help & Support',
            icon: 'bi-question-circle',
            path: '/user/help',
            badge: null
        }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <Link to="/user/dashboard" className="sidebar-brand white-brand-text">
                        <img src={logo} alt="NextOffer" className="brand-logo" />
                    </Link>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item, index) => (
                            <li key={index} className="nav-item">
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                    title={sidebarCollapsed ? item.title : ''}
                                >
                                    <i className={`bi ${item.icon} nav-icon`}></i>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="nav-text">{item.title}</span>
                                            {item.badge && (
                                                <span className={`badge ${typeof item.badge === 'number' ? 'bg-danger' : 'bg-success'} rounded-pill`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                {!sidebarCollapsed && (
                    <div className="sidebar-footer">
                        <button
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <i className="bi bi-box-arrow-left"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="dashboard-main">
                {/* Top Navbar */}
                <header className="dashboard-navbar">
                    <div className="navbar-left">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/user/dashboard">User</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="navbar-right">
                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <button
                                className="btn btn-icon"
                                type="button"
                                title="Start Practice Interview"
                                onClick={() => navigate('/user/practice')}
                            >
                                <i className="bi bi-play-circle fs-5"></i>
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="dropdown">
                            <button
                                className="btn btn-icon position-relative"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-bell fs-5"></i>
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end notification-dropdown" style={{ minWidth: '340px' }}>
                                <li className="dropdown-header d-flex justify-content-between align-items-center px-3 py-2">
                                    <h6 className="mb-0">Notifications</h6>
                                    {unreadCount > 0 && (
                                        <span className="badge bg-danger rounded-pill">{unreadCount} unread</span>
                                    )}
                                </li>
                                <li><hr className="dropdown-divider" /></li>

                                {notifications.length === 0 ? (
                                    <li className="px-3 py-3 text-center text-muted small">
                                        <i className="bi bi-bell-slash d-block fs-4 mb-1"></i>
                                        No notifications yet
                                    </li>
                                ) : (
                                    notifications.slice(0, 5).map(notif => (
                                        <li key={notif._id}>
                                            <div
                                                className={`dropdown-item d-flex align-items-start gap-2 py-2 ${!notif.read ? 'bg-primary bg-opacity-10' : ''}`}
                                                style={{ cursor: 'pointer', borderLeft: !notif.read ? '3px solid #6366f1' : '3px solid transparent' }}
                                                onClick={() => {
                                                    if (!notif.read) handleMarkRead(notif._id);
                                                    if (notif.link) navigate(notif.link);
                                                }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>
                                                    {notif.type === 'interview' ? '📅' :
                                                        notif.type === 'result' ? '📊' :
                                                            notif.type === 'application' ? '✅' : '🔔'}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p className="mb-0 small fw-semibold text-truncate">{notif.title}</p>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '0.72rem' }}>
                                                        {notif.message.length > 65 ? notif.message.substring(0, 65) + '…' : notif.message}
                                                    </p>
                                                    <small className="text-muted">{formatTimeAgo(notif.createdAt)}</small>
                                                </div>
                                                {!notif.read && (
                                                    <span className="badge bg-primary rounded-pill mt-1" style={{ fontSize: '0.6rem' }}>New</span>
                                                )}
                                            </div>
                                        </li>
                                    ))
                                )}

                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item text-center text-primary fw-semibold"
                                        onClick={() => navigate('/user/notifications')}
                                    >
                                        <i className="bi bi-bell me-1"></i>
                                        View All Notifications
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn btn-profile d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <div className="avatar">
                                    {userData.avatar && userData.avatar.length > 1 ? (
                                        <img
                                            src={userData.avatar}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: 32, height: 32 }}>
                                            {userData.avatar}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-info d-none d-md-block">
                                    <div className="profile-name">{userData.name}</div>
                                    <div className="profile-role">{userData.type}</div>
                                </div>
                                <i className="bi bi-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/user/profile">
                                        <i className="bi bi-person me-2"></i>My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/user/settings">
                                        <i className="bi bi-gear me-2"></i>Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/user/help">
                                        <i className="bi bi-question-circle me-2"></i>Help Center
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="dashboard-content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <span>© 2026 NextOffer. All rights reserved.</span>
                        </div>
                        <div className="footer-right">
                            <Link to="/user/help" className="footer-link">Help</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                            <Link to="/contact" className="footer-link">Contact Us</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default UserLayout;
