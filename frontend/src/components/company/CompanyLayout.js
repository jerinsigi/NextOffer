import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './CompanyLayout.css';
import logo from '../../logo.svg';

const CompanyLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationCount] = useState(5);
    const [companyName, setCompanyName] = useState('Company Admin');
    const [companyLogo, setCompanyLogo] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch company profile to get the name
    React.useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) return;

                const user = JSON.parse(userStr);
                const response = await fetch('http://localhost:5000/api/companies/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompanyName(data.company_name);
                    setCompanyLogo(data.logo);
                }
            } catch (error) {
                console.error('Error fetching company profile:', error);
            }
        };

        fetchCompanyProfile();
    }, []);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: 'bi-speedometer2',
            path: '/company/dashboard',
            badge: null
        },

        {
            title: 'User Management',
            icon: 'bi-people',
            path: '/company/users',
            badge: null
        },
        {
            title: 'Job Descriptions',
            icon: 'bi-file-text',
            path: '/company/jobs',
            badge: null
        },

        {
            title: 'Interview Monitoring',
            icon: 'bi-camera-video',
            path: '/company/interviews',
            badge: null
        },
        {
            title: 'Integrity & Compliance',
            icon: 'bi-shield-check',
            path: '/company/integrity',
            badge: 12
        },
        {
            title: 'Reports & Analytics',
            icon: 'bi-graph-up',
            path: '/company/reports',
            badge: null
        },
        {
            title: 'Settings',
            icon: 'bi-gear',
            path: '/company/settings',
            badge: null
        },
        {
            title: 'Logs & Audit',
            icon: 'bi-file-earmark-text',
            path: '/company/logs',
            badge: null
        },
        {
            title: 'Support & Feedback',
            icon: 'bi-headset',
            path: '/company/support',
            badge: 3
        }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="company-layout">
            {/* Sidebar */}
            <aside className={`company-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <Link to="/company/dashboard" className="sidebar-brand">
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
            <div className="company-main">
                {/* Top Navbar */}
                <header className="company-navbar">
                    <div className="navbar-left">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/company/dashboard">Company</Link>
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

                        {/* Company Profile Dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn btn-profile d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <div className="avatar">
                                    {companyLogo ? (
                                        <img src={companyLogo} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        companyName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="profile-info d-none d-md-block">
                                    <div className="profile-name">{companyName}</div>
                                </div>
                                <i className="bi bi-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/company/profile">
                                        <i className="bi bi-person me-2"></i>View Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/company/settings">
                                        <i className="bi bi-gear me-2"></i>Settings
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" type="button" onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                    }}>
                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="company-content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="company-footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <span>© 2025 NextOffer. All rights reserved.</span>
                        </div>
                        <div className="footer-right">
                            <Link to="/company/documentation" className="footer-link">Documentation</Link>
                            <Link to="/company/support" className="footer-link">Support</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/help" className="footer-link">Help</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CompanyLayout;
