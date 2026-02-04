import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';

const XIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const LinkedinIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const YoutubeIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="footer-dark bg-darker pt-5 pb-4 border-top border-secondary border-opacity-25 text-light">
            <div className="container">
                <div className="row g-5">
                    {/* Brand Section */}
                    <div className="col-lg-4">
                        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-light mb-4">
                            <img src={logo} alt="NextOffer Logo" style={{ height: '32px', width: 'auto' }} />
                            <span className="fs-4 fw-bold">NextOffer</span>
                        </Link>
                        <p className="text-muted mb-4" style={{ maxWidth: '300px' }}>
                            Empowering recruitment with AI-driven screening, automated interviews, and integrity enforcement.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="https://instagram.com/" className="text-muted text-decoration-none hover-white transition-all">
                                <InstagramIcon size={20} />
                            </a>
                            <a href="https://x.com/" className="text-muted text-decoration-none hover-white transition-all">
                                <XIcon size={20} />
                            </a>
                            <a href="https://linkedin.com/" className="text-muted text-decoration-none hover-white transition-all">
                                <LinkedinIcon size={20} />
                            </a>
                            <a href="https://youtube.com/" className="text-muted text-decoration-none hover-white transition-all">
                                <YoutubeIcon size={20} />
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
