import React, { useEffect } from 'react';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Help = () => {
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
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Help Content */}
            <div className="flex-grow-1 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="text-center mb-5 animate-on-scroll">
                                <h1 className="display-5 fw-bold text-light mb-3">How can we help?</h1>
                                <p className="lead text-muted">Find answers to common questions or get in touch with our support team.</p>
                            </div>

                            {/* FAQ Accordion */}
                            <div className="accordion glass-card rounded-4 overflow-hidden mb-5 animate-on-scroll delay-100" id="faqAccordion">

                                {/* Item 1 */}
                                <div className="accordion-item bg-transparent border-0 border-bottom border-secondary border-opacity-25">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button bg-transparent text-light shadow-none fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                            Is NextOffer free to use for candidates?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body text-muted">
                                            Yes! Candidates can create a profile, take AI-driven interviews, and apply to unlimited jobs completely free of charge. We only charge recruitment agencies and employers for premium features.
                                        </div>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="accordion-item bg-transparent border-0 border-bottom border-secondary border-opacity-25">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button bg-transparent text-light shadow-none fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            How does the AI interview work?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body text-muted">
                                            Our AI interviewer asks you a series of technical and behavioral questions tailored to your experience. The session is recorded and analyzed to highlight your strengths to potential employers. You can practice as many times as you like!
                                        </div>
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div className="accordion-item bg-transparent border-0 border-bottom border-secondary border-opacity-25">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button bg-transparent text-light shadow-none fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Is my video interview data secure?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body text-muted">
                                            Absolutely. We use industry-standard 256-bit encryption to protect your data. Your interview recordings are only shared with employers you actively apply to or approve.
                                        </div>
                                    </div>
                                </div>

                                {/* Item 4 */}
                                <div className="accordion-item bg-transparent border-0">
                                    <h2 className="accordion-header" id="headingFour">
                                        <button className="accordion-button bg-transparent text-light shadow-none fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            How do I reset my password?
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body text-muted">
                                            If you've forgotten your password, go to the Login page and click "Forgot Password?". Enter your registered email address, and we'll send you a link to reset it securely.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="text-center animate-on-scroll delay-200">
                                <h4 className="text-light fw-bold mb-3">Still need help?</h4>
                                <p className="text-muted mb-4">Our support team is available 24/7 to assist you.</p>
                                <a href="mailto:support@nextoffer.com" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-lg">
                                    <i className="bi bi-envelope-fill me-2"></i>Contact Support
                                </a>
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

export default Help;
