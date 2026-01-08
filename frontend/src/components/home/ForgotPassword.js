import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
        initAnimations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Navigate to Reset Password page, passing the email
                navigate('/reset-password', { state: { email } });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to send OTP' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden bg-gradient-hero">
            <div className="shape-blob shape-blob-1"></div>
            <div className="shape-blob shape-blob-2"></div>

            <Navbar />
            <div style={{ height: '80px' }}></div>

            <div className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="icon-box bg-warning bg-opacity-20 text-warning rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-key fs-3"></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-light mb-2">Forgot Password?</h2>
                                    <p className="text-muted">Enter your email to receive a reset code</p>

                                    {message.text && (
                                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                                            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                            {message.text}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-envelope me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-warning w-100 py-3 rounded-3 fw-bold shadow-lg mb-3 text-dark"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-2"></i>Send Reset Code
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <Link to="/login" className="text-decoration-none text-light small opacity-75 hover-opacity-100">
                                            <i className="bi bi-arrow-left me-1"></i>Back to Login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
