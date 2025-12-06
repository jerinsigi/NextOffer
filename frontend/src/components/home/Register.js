import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import logo from '../../logo.svg';

const Register = () => {
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent pt-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-light fs-3 d-flex align-items-center gap-2" to="/">
                        <img src={logo} alt="NextOffer Logo" style={{ height: '40px' }} />
                        NextOffer
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link px-3" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3" href="/#features">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3" href="/#about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3" href="/#contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Register Section */}
            <div className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            {/* Register Card */}
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="icon-box bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-person-plus fs-3"></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-light mb-2">Create Account</h2>
                                    <p className="text-muted">Join NextOffer today</p>
                                </div>

                                {/* Register Form */}
                                <form>
                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-person me-2"></i>Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-envelope me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-lock me-2"></i>Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Create a password"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-shield-lock me-2"></i>Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="agreeTerms"
                                                required
                                            />
                                            <label className="form-check-label text-light small" htmlFor="agreeTerms">
                                                I agree to the <a href="#!" className="text-primary text-decoration-none">Terms of Service</a> and <a href="#!" className="text-primary text-decoration-none">Privacy Policy</a>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg mb-3"
                                    >
                                        <i className="bi bi-person-plus-fill me-2"></i>Sign Up
                                    </button>

                                    {/* Divider */}
                                    <div className="position-relative my-4">
                                        <hr className="text-muted" />
                                        <span className="position-absolute top-50 start-50 translate-middle bg-dark px-3 text-muted small">
                                            or register with
                                        </span>
                                    </div>

                                    {/* Social Login */}
                                    <div className="row g-2 mb-4">
                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-light w-100 py-2 rounded-3"
                                            >
                                                <i className="bi bi-google me-2"></i>Google
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-light w-100 py-2 rounded-3"
                                            >
                                                <i className="bi bi-microsoft me-2"></i>Microsoft
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Sign In Link */}
                                <div className="text-center pt-3 border-top border-secondary">
                                    <p className="text-muted small mb-0">
                                        Already have an account?
                                        <Link to="/login" className="text-primary text-decoration-none ms-1 fw-bold">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-transparent text-light py-4 mt-auto border-top border-secondary border-opacity-25">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <small className="text-muted">
                                &copy; 2025 <strong className="text-light">NextOffer</strong>. All Rights Reserved
                            </small>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <a href="#!" className="text-muted text-decoration-none small me-3">Privacy Policy</a>
                            <a href="#!" className="text-muted text-decoration-none small me-3">Terms of Service</a>
                            <a href="#!" className="text-muted text-decoration-none small">Help</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register;
