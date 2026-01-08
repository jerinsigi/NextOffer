import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../logo.svg';
import './Navbar.css';

const Navbar = ({ scrolled, activeSection, onScrollToTop }) => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleMouseEnter = (dropdownName) => {
        setActiveDropdown(dropdownName);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    return (
        <nav className={`enhanced-navbar fixed-top ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <a
                        className="navbar-brand"
                        href="/"
                        onClick={onScrollToTop}
                    >
                        <img src={logo} alt="NextOffer Logo" className="brand-logo" />
                        <span className="brand-text">NextOffer</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="navbar-menu">
                        <ul className="nav-links">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                                    href="/"
                                    onClick={onScrollToTop}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                                    href="#about"
                                >
                                    About
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                                    href="#features"
                                >
                                    Features
                                </a>
                            </li>

                            {/* Resources Dropdown */}
                            <li
                                className="nav-item dropdown"
                                onMouseEnter={() => handleMouseEnter('resources')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="nav-link dropdown-toggle">
                                    Resources
                                </span>
                                <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'show' : ''}`}>
                                    <div className="dropdown-content">
                                        <a href="#blog" className="dropdown-item">
                                            <i className="bi bi-newspaper"></i>
                                            <div>
                                                <div className="item-title">Blog</div>
                                                <div className="item-desc">Latest insights and updates</div>
                                            </div>
                                        </a>
                                        <a href="#documentation" className="dropdown-item">
                                            <i className="bi bi-book"></i>
                                            <div>
                                                <div className="item-title">Documentation</div>
                                                <div className="item-desc">Complete guides and tutorials</div>
                                            </div>
                                        </a>
                                        <a href="#case-studies" className="dropdown-item">
                                            <i className="bi bi-graph-up"></i>
                                            <div>
                                                <div className="item-title">Case Studies</div>
                                                <div className="item-desc">Success stories from our clients</div>
                                            </div>
                                        </a>
                                        <a href="#faq" className="dropdown-item">
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
                            <div
                                className="dropdown get-started-dropdown"
                                onMouseEnter={() => handleMouseEnter('getstarted')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="btn btn-primary dropdown-toggle">
                                    Get Started
                                </button>
                                <div className={`dropdown-menu ${activeDropdown === 'getstarted' ? 'show' : ''}`}>
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
                                            onClick={() => navigate('/register?type=company')}
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
                    <button className="mobile-menu-toggle" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
