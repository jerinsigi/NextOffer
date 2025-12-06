import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-transparent text-light py-4 mt-auto border-top border-secondary border-opacity-25">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <small className="text-muted">
                            &copy; 2025 <strong className="text-light">NextOffer</strong>. All Rights Reserved
                        </small>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <Link to="/privacy" className="text-muted text-decoration-none small me-3">Privacy Policy</Link>
                        <Link to="/terms" className="text-muted text-decoration-none small me-3">Terms of Service</Link>
                        <Link to="/help" className="text-muted text-decoration-none small">Help</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
