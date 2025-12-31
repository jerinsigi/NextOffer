import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Youtube, Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-dark bg-darker pt-5 pb-4 border-top border-secondary border-opacity-25 text-light">
            <div className="container">
                <div className="row g-5">
                    {/* Brand Section */}
                    <div className="col-lg-4">
                        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-light mb-4">
                            <span className="fs-4 fw-bold">NextOffer</span>
                        </Link>
                        <p className="text-muted mb-4" style={{ maxWidth: '300px' }}>
                            Empowering recruitment with AI-driven screening, automated interviews, and integrity enforcement.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#!" className="text-muted text-decoration-none hover-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#!" className="text-muted text-decoration-none hover-white transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#!" className="text-muted text-decoration-none hover-white transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="#!" className="text-muted text-decoration-none hover-white transition-all">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="col-lg-8">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <h5 className="fw-bold mb-4 text-white">Product</h5>
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    <li><a href="/#features" className="text-muted text-decoration-none hover-primary transition-all">Resume Screening</a></li>
                                    <li><a href="/#features" className="text-muted text-decoration-none hover-primary transition-all">AI Interviews</a></li>
                                    <li><a href="/#features" className="text-muted text-decoration-none hover-primary transition-all">Integrity Check</a></li>
                                    <li><a href="/#features" className="text-muted text-decoration-none hover-primary transition-all">Analytics</a></li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <h5 className="fw-bold mb-4 text-white">Company</h5>
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    <li><a href="/#about" className="text-muted text-decoration-none hover-primary transition-all">About Us</a></li>
                                    <li><a href="#!" className="text-muted text-decoration-none hover-primary transition-all">Careers</a></li>
                                    <li><a href="#!" className="text-muted text-decoration-none hover-primary transition-all">Blog</a></li>
                                    <li><a href="/#contact" className="text-muted text-decoration-none hover-primary transition-all">Contact</a></li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <h5 className="fw-bold mb-4 text-white">Legal</h5>
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    <li><Link to="/privacy" className="text-muted text-decoration-none hover-primary transition-all">Privacy Policy</Link></li>
                                    <li><Link to="/terms" className="text-muted text-decoration-none hover-primary transition-all">Terms of Service</Link></li>
                                    <li><a href="#!" className="text-muted text-decoration-none hover-primary transition-all">Cookie Policy</a></li>
                                    <li><a href="#!" className="text-muted text-decoration-none hover-primary transition-all">Security</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-top border-secondary border-opacity-25 mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="mb-0 text-muted small">
                        &copy; {new Date().getFullYear()} NextOffer Inc. All rights reserved.
                    </p>
                    <div className="d-flex gap-4">
                        <a href="#" className="text-muted text-decoration-none small hover-white">Performance</a>
                        <a href="#" className="text-muted text-decoration-none small hover-white">Accessibility</a>
                        <a href="#" className="text-muted text-decoration-none small hover-white">Sitemap</a>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .hover-white:hover { color: #fff !important; }
                    .hover-primary:hover { color: var(--bs-primary) !important; }
                    .footer-dark { background-color: #0B0F19; } /* Darker than body */
                `}
            </style>
        </footer>
    );
};

export default Footer;
