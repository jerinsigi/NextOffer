import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './UserLayout.css';
import logo from '../../logo.svg';

const UserLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationCount] = useState(3);
    const [userData, setUserData] = useState({ name: 'Guest', type: 'Candidate', avatar: null });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
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
                            name: profileData.full_name || user.username || 'User',
                            type: user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Candidate',
                            avatar: profileData.image_url ?
                                (profileData.image_url.startsWith('http') || profileData.image_url.startsWith('data')
                                    ? profileData.image_url
                                    : `http://localhost:5000${profileData.image_url}`)
                                : (profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : 'U')
                        });
                    } else {
                        // Fallback to localStorage data if API fails
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
                    // Fallback to localStorage data
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
        };

        loadUserData();

        // Listen for profile updates
        window.addEventListener('userProfileUpdated', loadUserData);

        return () => {
            window.removeEventListener('userProfileUpdated', loadUserData);
        };
    }, []);

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
            badge: 'NEW'
        },
        {
            title: 'My Applications',
            icon: 'bi-file-earmark-check',
            path: '/user/applications',
            badge: null
        },
        {
            title: 'Interview Center',
            icon: 'bi-camera-video',
            path: '/user/interview',
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
            badge: notificationCount
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
        <div className={`user-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`user-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <Link to="/user/dashboard" className="sidebar-brand">
                        <img src={logo} alt="NextOffer" className="brand-logo" />
                        {!sidebarCollapsed && <span className="brand-text">NextOffer</span>}
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
                        <div className="sidebar-info">
                            <small className="text-muted">Version 1.0.0</small>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="user-main">
                {/* Top Navbar */}
                <header className="user-navbar">
                    <div className="navbar-left">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            className="hamburger-menu"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-4`}></i>
                        </button>

                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/user/dashboard">Home</Link>
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
                                {notificationCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end notification-dropdown">
                                <li className="dropdown-header">
                                    <h6 className="mb-0">Notifications</h6>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item" href="#!">
                                        <div className="d-flex align-items-start">
                                            <i className="bi bi-check-circle text-success me-3 fs-5"></i>
                                            <div>
                                                <p className="mb-1 small"><strong>Interview Scheduled</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                                    Your interview for Software Developer role is scheduled
                                                </p>
                                                <small className="text-muted">2 hours ago</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item text-center text-primary" href="#!">
                                        View All Notifications
                                    </a>
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
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="user-content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="user-footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <span>© 2025 NextOffer. All rights reserved.</span>
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
