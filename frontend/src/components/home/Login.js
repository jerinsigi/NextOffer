import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        initAnimations();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.email, // Can be email or username
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info (you might want to use localStorage or context)
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                }

                // Redirect based on user type
                if (data.user.usertype === 'company') {
                    navigate('/company/dashboard');
                } else if (data.user.usertype === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                // Handle specific error cases
                if (data.status === 'inactive') {
                    setMessage({
                        type: 'warning',
                        text: data.message || 'Your account is pending admin approval.'
                    });
                } else {
                    setMessage({
                        type: 'error',
                        text: data.message || 'Login failed. Please check your credentials.'
                    });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Get Firebase ID token
            const idToken = await user.getIdToken();

            // Send token to backend for verification
            const response = await fetch('http://localhost:5000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                }

                // Redirect based on user type
                if (data.user.usertype === 'company') {
                    navigate('/company/dashboard');
                } else if (data.user.usertype === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                setMessage({
                    type: 'error',
                    text: data.message || 'Google sign-in failed. Please try again.'
                });
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                setMessage({ type: 'info', text: 'Sign-in cancelled.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to sign in with Google. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden bg-gradient-hero">
            {/* Background Shapes */}
            <div className="shape-blob shape-blob-1"></div>
            <div className="shape-blob shape-blob-2"></div>

            {/* Navbar */}
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Login Section */}
            <div className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            {/* Login Card */}
                            <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                {/* Header with Message */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="icon-box bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-person-lock fs-3"></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-light mb-2">Welcome Back</h2>
                                    <p className="text-muted">Sign in to continue to NextOffer</p>

                                    {/* Success/Error/Warning Message */}
                                    {message.text && (
                                        <div className={`alert ${message.type === 'success' ? 'alert-success' : message.type === 'warning' ? 'alert-warning' : 'alert-danger'} mt-3`} role="alert">
                                            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : message.type === 'warning' ? 'bi-exclamation-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                            {message.text}
                                        </div>
                                    )}
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-envelope me-2"></i>Email or Username
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your email or username"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-light small fw-bold mb-2">
                                            <i className="bi bi-lock me-2"></i>Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control form-control-dark p-3 rounded-3"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Remember & Forgot */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="rememberMe"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <label className="form-check-label text-light small" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password" className="text-primary text-decoration-none small">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                                            </>
                                        )}
                                    </button>

                                    {/* Divider */}
                                    <div className="position-relative my-4">
                                        <hr className="text-muted" />
                                        <span className="position-absolute top-50 start-50 translate-middle bg-dark px-3 text-muted small">
                                            or continue with
                                        </span>
                                    </div>

                                    {/* Social Login */}
                                    <div className="row g-2 mb-4">
                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-light w-100 py-2 rounded-3"
                                                onClick={handleGoogleSignIn}
                                                disabled={loading}
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

                                {/* Sign Up Link */}
                                <div className="text-center pt-3 border-top border-secondary">
                                    <p className="text-muted small mb-2">
                                        Don't have an account?
                                        <Link to="/register" className="text-primary text-decoration-none ms-1 fw-bold">
                                            Sign Up
                                        </Link>
                                    </p>
                                    <p className="text-muted small mb-0">
                                        Want to hire talent?
                                        <Link to="/company/register" className="text-info text-decoration-none ms-1 fw-bold">
                                            Register Company
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="text-center mt-4 animate-on-scroll delay-100">
                                <small className="text-light opacity-75">
                                    <i className="bi bi-shield-check me-2"></i>
                                    Your data is secure with 256-bit encryption
                                </small>
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

export default Login;
