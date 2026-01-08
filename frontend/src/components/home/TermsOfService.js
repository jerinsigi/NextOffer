import React, { useEffect } from 'react';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        initAnimations();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden bg-gradient-hero">
            {/* Background Shapes */}
            <div className="shape-blob shape-blob-1"></div>
            <div className="shape-blob shape-blob-2"></div>

            {/* Navbar */}
            <Navbar showButtons={true} />

            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Terms of Service Content */}
            <div className="flex-grow-1 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                <h1 className="display-5 fw-bold text-light mb-4">Terms of Service</h1>
                                <p className="text-muted mb-5">Last Updated: December 2025</p>

                                <div className="text-light opacity-90">
                                    <h4 className="fw-bold text-light mb-3">1. Acceptance of Terms</h4>
                                    <p className="mb-4 text-muted">
                                        By accessing and using NextOffer, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">2. Service Description</h4>
                                    <p className="mb-4 text-muted">
                                        NextOffer provides an AI-driven recruitment platform including but not limited to resume screening, multimodal interviews, and integrity enforcement functionality. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">3. User Responsibilities</h4>
                                    <p className="mb-4 text-muted">
                                        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">4. Intellectual Property</h4>
                                    <p className="mb-4 text-muted">
                                        The Service and its original content, features, and functionality are and will remain the exclusive property of NextOffer and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">5. Limtation of Liability</h4>
                                    <p className="mb-4 text-muted">
                                        In no event shall NextOffer, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">6. Changes to Terms</h4>
                                    <p className="mb-0 text-muted">
                                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsOfService;
