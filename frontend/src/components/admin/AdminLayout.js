import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../common/dashboard/DashboardLayout.css';
import '../common/Navbar.css';
import logo from '../../logo.svg';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationCount] = useState(5);
    const [userData, setUserData] = useState({ name: 'Admin', role: 'System Administrator', avatar: null });
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
        };

        loadUserData();
    }, []);

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
            title: 'System Settings',
            icon: 'bi-gear',
            path: '/admin/settings',
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
                                            <i className="bi bi-shield-exclamation text-danger me-3 fs-5"></i>
                                            <div>
                                                <p className="mb-1 small"><strong>Integrity Violation Detected</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                                    Candidate #4523 flagged for tab switching
                                                </p>
                                                <small className="text-muted">5 min ago</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item" href="#!">
                                        <div className="d-flex align-items-start">
                                            <i className="bi bi-building text-primary me-3 fs-5"></i>
                                            <div>
                                                <p className="mb-1 small"><strong>New Company Registration</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                                    TechCorp Inc. pending approval
                                                </p>
                                                <small className="text-muted">1 hour ago</small>
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

