import React, { useEffect } from 'react';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PrivacyPolicy = () => {
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

            {/* Privacy Policy Content */}
            <div className="flex-grow-1 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                <h1 className="display-5 fw-bold text-light mb-4">Privacy Policy</h1>
                                <p className="text-muted mb-5">Last Updated: December 2025</p>

                                <div className="text-light opacity-90">
                                    <h4 className="fw-bold text-light mb-3">1. Information We Collect</h4>
                                    <p className="mb-4 text-muted">
                                        We collect information you provide directly to us, such as when you create an account, update your profile, or use our interactive features. This includes personal identifiers, professional information, and audiovisual data during interviews.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">2. How We Use Your Information</h4>
                                    <p className="mb-4 text-muted">
                                        We use the collected information to provide, maintain, and improve our services, to process your job applications, and to communicate with you. AI analysis is used solely for the purpose of candidate evaluation and matching.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">3. Data Security</h4>
                                    <p className="mb-4 text-muted">
                                        We implement appropriate technical and organizational measures to protect the security of your personal information. This includes 256-bit encryption for data in transit and at rest.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">4. Sharing of Information</h4>
                                    <p className="mb-4 text-muted">
                                        We do not sell your personal information. We may share your information with potential employers as part of the recruitment process or with third-party service providers who assist us in operating our platform.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">5. Your Rights</h4>
                                    <p className="mb-4 text-muted">
                                        You have the right to access, correct, or delete your personal information. You may also object to the processing of your data or request data portability.
                                    </p>

                                    <h4 className="fw-bold text-light mb-3">6. Cookies and Tracking</h4>
                                    <p className="mb-0 text-muted">
                                        We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
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

export default PrivacyPolicy;
