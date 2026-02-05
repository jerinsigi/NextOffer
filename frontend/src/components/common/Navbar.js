import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './Navbar.css';

const Navbar = ({ scrolled, activeSection, onScrollToTop }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (e, targetId) => {
        if (e?.preventDefault) e.preventDefault();

        if (location.pathname === '/') {
            // Already on home page, just scroll
            const element = document.getElementById(targetId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                // Update URL without reload
                window.history.pushState(null, '', `/#${targetId}`);
            } else if (targetId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', '/');
            }
        } else {
            // Not on home page, navigate to home with hash
            if (targetId === 'home') {
                navigate('/');
            } else {
                navigate(`/#${targetId}`);
            }
        }
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 991) setMobileMenuOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setMobileMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [mobileMenuOpen]);

    return (
        <nav className={`enhanced-navbar fixed-top ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link
                        className="navbar-brand"
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                onScrollToTop();
                            }
                        }}
                    >
                        <img src={logo} alt="NextOffer Logo" className="brand-logo" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-menu">
                        <ul className="nav-links">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                                    href="/"
                                    onClick={(e) => handleNavClick(e, 'home')}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                                    href="#about"
                                    onClick={(e) => handleNavClick(e, 'about')}
                                >
                                    About
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                                    href="#features"
                                    onClick={(e) => handleNavClick(e, 'features')}
                                >
                                    Features
                                </a>
                            </li>

                            {/* Resources Dropdown */}
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle">
                                    Resources
                                </span>
                                <div className="dropdown-menu">
                                    <div className="dropdown-content">
                                        <a
                                            href="#blog"
                                            className="dropdown-item"
                                            onClick={(e) => handleNavClick(e, 'blog')}
                                        >
                                            <i className="bi bi-newspaper"></i>
                                            <div>
                                                <div className="item-title">Blog</div>
                                                <div className="item-desc">Latest insights and updates</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#documentation"
                                            className="dropdown-item"
                                            onClick={(e) => handleNavClick(e, 'documentation')}
                                        >
                                            <i className="bi bi-book"></i>
                                            <div>
                                                <div className="item-title">Documentation</div>
                                                <div className="item-desc">Complete guides and tutorials</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#case-studies"
                                            className="dropdown-item"
                                            onClick={(e) => handleNavClick(e, 'case-studies')}
                                        >
                                            <i className="bi bi-graph-up"></i>
                                            <div>
                                                <div className="item-title">Case Studies</div>
                                                <div className="item-desc">Success stories from our clients</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#faq"
                                            className="dropdown-item"
                                            onClick={(e) => handleNavClick(e, 'faq')}
                                        >
                                            <i className="bi bi-question-circle"></i>
                                            <div>
                                                <div className="item-title">FAQ</div>
                                                <div className="item-desc">Common questions answered</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                                    href="#contact"
                                    onClick={(e) => handleNavClick(e, 'contact')}
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>

                        {/* Action Buttons */}
                        <div className="navbar-actions">
                            <button
                                className="btn btn-login"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>

                            {/* Get Started Dropdown */}
                            <div className="dropdown get-started-dropdown">
                                <button className="btn btn-primary dropdown-toggle">
                                    Get Started
                                </button>
                                <div className="dropdown-menu">
                                    <div className="dropdown-content">
                                        <button
                                            onClick={() => navigate('/register?type=user')}
                                            className="dropdown-item"
                                        >
                                            <i className="bi bi-person-circle"></i>
                                            <div>
                                                <div className="item-title">Register as User</div>
                                                <div className="item-desc">Join as a job seeker</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => navigate('/company/register')}
                                            className="dropdown-item"
                                        >
                                            <i className="bi bi-building"></i>
                                            <div>
                                                <div className="item-title">Register as Company</div>
                                                <div className="item-desc">Post jobs and hire talent</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen((v) => !v)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <div
                className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            />
            <div
                className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <div className="mobile-nav-header">
                    <span className="mobile-nav-title">Menu</span>
                    <button
                        type="button"
                        className="mobile-nav-close"
                        aria-label="Close menu"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="mobile-nav-section">
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'home'); setMobileMenuOpen(false); }}>
                        Home
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'about'); setMobileMenuOpen(false); }}>
                        About
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'features'); setMobileMenuOpen(false); }}>
                        Features
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'contact'); setMobileMenuOpen(false); }}>
                        Contact
                    </button>
                </div>

                <div className="mobile-nav-section">
                    <div className="mobile-nav-section-title">Resources</div>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'blog'); setMobileMenuOpen(false); }}>
                        Blog
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'documentation'); setMobileMenuOpen(false); }}>
                        Documentation
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'case-studies'); setMobileMenuOpen(false); }}>
                        Case Studies
                    </button>
                    <button className="mobile-nav-link" onClick={(e) => { handleNavClick(e, 'faq'); setMobileMenuOpen(false); }}>
                        FAQ
                    </button>
                </div>

                <div className="mobile-nav-actions">
                    <button className="btn btn-login" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                        Login
                    </button>
                    <button className="btn btn-primary" onClick={() => { setMobileMenuOpen(false); navigate('/register?type=user'); }}>
                        Get Started
                    </button>
                    <button className="btn btn-primary" onClick={() => { setMobileMenuOpen(false); navigate('/company/register'); }}>
                        For Companies
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
