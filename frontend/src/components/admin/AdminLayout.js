import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/AdminLayout.css';
import logo from '../../logo.svg';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationCount] = useState(5);
    const location = useLocation();
    const navigate = useNavigate();

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
            title: 'Interview Monitoring',
            icon: 'bi-camera-video',
            path: '/admin/interviews',
            badge: null
        },
        {
            title: 'Integrity & Compliance',
            icon: 'bi-shield-check',
            path: '/admin/integrity',
            badge: 12
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
        // Add logout logic here
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <Link to="/admin/dashboard" className="sidebar-brand">
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
                        <div className="sidebar-info">
                            <small className="text-muted">Version 1.0.0</small>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="admin-main">
                {/* Top Navbar */}
                <header className="admin-navbar">
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
                        {/* Search Bar */}
                        <div className="search-bar">
                            <i className="bi bi-search search-icon"></i>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search users, companies, candidates..." 
                            />
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
                                    <i className="bi bi-person-circle fs-4"></i>
                                </div>
                                <div className="profile-info d-none d-md-block">
                                    <div className="profile-name">Vivek Kumar</div>
                                    <div className="profile-role">System Administrator</div>
                                </div>
                                <i className="bi bi-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/admin/profile">
                                        <i className="bi bi-person me-2"></i>My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/admin/settings">
                                        <i className="bi bi-gear me-2"></i>Settings
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
                <main className="admin-content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="admin-footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <span>© 2025 NextOffer. All rights reserved.</span>
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
