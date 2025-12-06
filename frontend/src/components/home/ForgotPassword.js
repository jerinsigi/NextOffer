import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import AuthNavbar from '../common/AuthNavbar';
import Footer from '../common/Footer';

const ForgotPassword = () => {


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
            <AuthNavbar />

            {/* Main Content */}
            <div className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            {/* Forgot Password Card */}
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="icon-box bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-key fs-3"></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-light mb-2">Forgot Password?</h2>
                                    <p className="text-muted">Enter your email and we'll send you a link to reset your password.</p>
                                </div>

                                {/* Form */}
                                <form>
                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-envelope me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg mb-4"
                                    >
                                        <i className="bi bi-send me-2"></i>Send Reset Link
                                    </button>
                                </form>

                                {/* Back to Login */}
                                <div className="text-center border-top border-secondary pt-3">
                                    <p className="text-muted small mb-0">
                                        Remember your password?
                                        <Link to="/login" className="text-primary text-decoration-none ms-1 fw-bold">
                                            Back to Login
                                        </Link>
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

export default ForgotPassword;
