import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../common/dashboard/DashboardLayout.css';
import '../common/Navbar.css';
import logo from '../../logo.svg';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [userData, setUserData] = useState({ name: 'Admin', role: 'System Administrator', avatar: null });
    const location = useLocation();
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.read).length;

    const loadUserData = useCallback(async () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);

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
                        name: profileData.full_name || user.username || 'Admin',
                        role: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Administrator',
                        avatar: profileData.image_url ?
                            (profileData.image_url.startsWith('http') || profileData.image_url.startsWith('data')
                                ? profileData.image_url
                                : `http://localhost:5000${profileData.image_url}`)
                            : null
                    });
                } else {
                    // Fallback to localStorage data if API fails
                    setUserData({
                        name: user.username || 'Admin',
                        role: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Administrator',
                        avatar: user.image_url ?
                            (user.image_url.startsWith('http') || user.image_url.startsWith('data')
                                ? user.image_url
                                : `http://localhost:5000${user.image_url}`)
                            : null
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Use localStorage data as fallback
                setUserData({
                    name: user.username || 'Admin',
                    role: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Administrator',
                    avatar: null
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
            icon: 'bi-speedometer2',
            path: '/admin/dashboard',
            badge: null
        },
        {
            title: 'Company Management',
            icon: 'bi-building',
            path: '/admin/companies',
            badge: null
        },
        {
            title: 'User Management',
            icon: 'bi-people',
            path: '/admin/users',
            badge: null
        },
        {
            title: 'Job Descriptions',
            icon: 'bi-file-text',
            path: '/admin/jobs',
            badge: null
        },
        {
            title: 'Job Categories',
            icon: 'bi-folder',
            path: '/admin/job-categories',
            badge: null
        },
        {
            title: 'Skills',
            icon: 'bi-stars',
            path: '/admin/skills',
            badge: null
        },
        {
            title: 'Reports & Analytics',
            icon: 'bi-graph-up',
            path: '/admin/reports',
            badge: null
        },
        {
            title: 'Settings',
            icon: 'bi-gear',
            path: '/admin/settings',
            badge: null
        },
        {
            title: 'My Profile',
            icon: 'bi-person',
            path: '/admin/profile',
            badge: null
        },
        {
            title: 'Logs & Audit',
            icon: 'bi-file-earmark-text',
            path: '/admin/logs',
            badge: null
        },
        {
            title: 'Support & Feedback',
            icon: 'bi-headset',
            path: '/admin/support',
            badge: 3
        }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        // Clear all user session data
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
                    <Link to="/admin/dashboard" className="sidebar-brand white-brand-text">
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
                                                <span className="badge bg-danger rounded-pill">{item.badge}</span>
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
                <header className="dashboard-navbar enhanced-navbar scrolled">
                    <div className="navbar-left">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/admin/dashboard">Admin</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="navbar-right">

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
                                                            notif.type === 'application' ? '✅' :
                                                                notif.type === 'company' ? '🏢' :
                                                                    notif.type === 'system' ? '🛡️' : '🔔'}
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
                                        onClick={() => navigate('/admin/dashboard')}
                                    >
                                        <i className="bi bi-bell me-1"></i>
                                        Close
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Admin Profile Dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn btn-profile d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <div className="avatar">
                                    {userData.avatar ? (
                                        <img src={userData.avatar} alt={userData.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <i className="bi bi-person-circle fs-4"></i>
                                    )}
                                </div>
                                <div className="profile-info d-none d-md-block">
                                    <div className="profile-name">{userData.name}</div>
                                    <div className="profile-role">{userData.role}</div>
                                </div>
                                <i className="bi bi-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/admin/profile">
                                        <i className="bi bi-person me-2"></i>My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/admin/settings">
                                        <i className="bi bi-gear me-2"></i>Settings
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
                            <Link to="/admin/documentation" className="footer-link">Documentation</Link>
                            <Link to="/admin/support" className="footer-link">Support</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/help" className="footer-link">Help</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;


