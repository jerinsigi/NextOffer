import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const otpRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
        window.scrollTo(0, 0);
        initAnimations();
    }, [email, navigate]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (timer > 0 && !isOtpVerified) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, isOtpVerified]);

    // OTP Logic (Same as CompanyRegister)
    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.toUpperCase();
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Auto-verify when 6 digits are entered
        const otpString = newOtp.join('');
        if (otpString.length === 6) {
            verifyOtp(otpString);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const verifyOtp = async (otpString) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString })
            });
            const data = await response.json();

            if (response.ok) {
                console.log('OTP Verified - setting isOtpVerified to true');
                setIsOtpVerified(true);
                setMessage({ type: 'success', text: 'Code verified! Please set your new password.' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Invalid code' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setCanResend(false);
        setTimer(30);
        setMessage({ type: '', text: '' });
        setOtp(['', '', '', '', '', '']); // Clear OTP fields
        otpRefs.current[0].focus(); // Focus first input

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'New code sent!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to resend code' });
                setCanResend(true); // Allow retry immediately on fail
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error.' });
            setCanResend(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        const otpString = otp.join('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: otpString,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Reset failed' });
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
                                        <div className="icon-box bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-shield-lock fs-3"></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-light mb-2">Reset Password</h2>
                                    <p className="text-muted">Enter the code sent to <strong className="text-light">{email}</strong></p>

                                    {message.text && (
                                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                                            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                            {message.text}
                                        </div>
                                    )}
                                </div>

                                {/* OTP Input Section */}
                                <div className="mb-4 text-center">
                                    <label className="form-label text-light small fw-bold mb-3">Verification Code</label>
                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => otpRefs.current[index] = el}
                                                type="text"
                                                maxLength="1"
                                                className={`form-control form-control-dark text-center fw-bold rounded-3 ${isOtpVerified ? 'bg-success bg-opacity-10 border-success' : ''}`}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    fontSize: '1.5rem',
                                                    padding: '0.25rem',
                                                    lineHeight: 'normal',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                disabled={isOtpVerified || loading}
                                            />
                                        ))}
                                    </div>

                                    {/* Resend Timer / Link */}
                                    {!isOtpVerified && (
                                        <div className="small">
                                            {canResend ? (
                                                <button
                                                    onClick={handleResendOtp}
                                                    className="btn btn-link text-warning text-decoration-none p-0"
                                                    disabled={loading}
                                                >
                                                    Resend Code
                                                </button>
                                            ) : (
                                                <span className="text-muted">
                                                    Resend code in <span className="text-light fw-bold">{timer}s</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Password Reset Form (Visible only after OTP verification) */}
                                {isOtpVerified && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label text-light small fw-bold mb-2">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg mb-3"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Resetting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg me-2"></i>Reset Password
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;
