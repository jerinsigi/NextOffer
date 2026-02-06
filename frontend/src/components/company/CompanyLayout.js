import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../common/dashboard/DashboardLayout.css';
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

    // Helper to resolve logo URL
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('data:')) return logoPath; // Base64
        if (logoPath.startsWith('http')) return logoPath; // Absolute URL
        return `http://localhost:5000${logoPath}`; // Relative backend path
    };

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
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <Link to="/company/dashboard" className="sidebar-brand white-brand-text">
                        <img src={logo} alt="NextOffer" className="brand-logo" />
                        {!sidebarCollapsed && <span className="brand-text white-brand-text">NextOffer</span>}
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
                <header className="dashboard-navbar">
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
                                    {getLogoUrl(companyLogo) ? (
                                        <img src={getLogoUrl(companyLogo)} alt={companyName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <i className="bi bi-building fs-4"></i>
                                    )}
                                </div>
                                <div className="profile-info d-none d-md-block">
                                    <div className="profile-name">{companyName}</div>
                                    <div className="profile-role">Company Admin</div>
                                </div>
                                <i className="bi bi-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/company/profile">
                                        <i className="bi bi-building me-2"></i>Company Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/company/settings">
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

