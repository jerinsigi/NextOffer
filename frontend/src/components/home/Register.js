import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';

import Footer from '../common/Footer';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
const Register = () => {
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        education: '',
        experience_years: '',
        education: '',
        experience_years: '',
        education: '',
        experience_years: '',
        experience_years: '',
        profileImage: null
    });
    const [imagePreview, setImagePreview] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [step, setStep] = React.useState('details'); // 'details' or 'otp'
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [emailForOtp, setEmailForOtp] = React.useState('');
    const otpRefs = React.useRef([]);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!formData.phone || formData.phone.length < 8) {
            alert("Please enter a valid phone number.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('usertype', 'candidate');
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('education', formData.education);
            formDataToSend.append('experience_years', formData.experience_years);
            if (formData.profileImage) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                if (data.requireOtp) {
                    setEmailForOtp(data.email);
                    setStep('otp');
                    alert(data.message);
                } else {
                    alert('Registration successful! Please login.');
                    window.location.href = '/login';
                }
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const submitOtp = async (otpToVerify) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailForOtp,
                    otp: otpToVerify
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email verified successfully! Please login.');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('OTP Verification error:', error);
            alert('Something went wrong during verification.');
        }
    };

    const handleOtpChange = (index, value) => {
        // Allow alphanumeric
        const newOtp = [...otp];
        newOtp[index] = value.toUpperCase();
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Auto-submit if all filled
        const otpString = newOtp.join('');
        if (otpString.length === 6) {
            submitOtp(otpString);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);

        try {
            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Get Firebase ID token
            const idToken = await user.getIdToken();

            // Send token to backend for registration
            const response = await fetch('http://localhost:5000/api/auth/google-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    usertype: 'candidate' // Default to candidate
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful with Google! Please login.');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Google registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Google sign-up error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                alert('Sign-up cancelled.');
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                alert('An account already exists with this email. Please login instead.');
            } else {
                alert('Failed to sign up with Google. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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

                                {/* Register Form / OTP Form */}
                                {step === 'details' ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4 text-center">
                                            <div
                                                className="position-relative d-inline-block cursor-pointer"
                                                onClick={triggerFileInput}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-3 border-dark shadow-lg"
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile Preview"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    ) : (
                                                        <i className="bi bi-person-fill fs-1 text-light opacity-50"></i>
                                                    )}
                                                </div>
                                                <div
                                                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                                                    style={{ width: '35px', height: '35px', transform: 'translate(5px, 5px)' }}
                                                >
                                                    <i className="bi bi-camera-fill small"></i>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                name="profileImage"
                                                onChange={handleFileChange}
                                                className="d-none"
                                                accept="image/*"
                                            />
                                            <div className="mt-2">
                                                <small className="text-muted">Tap to upload profile picture</small>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold mb-2">
                                                <i className="bi bi-person me-2"></i>Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
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
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold mb-2">
                                                <i className="bi bi-telephone me-2"></i>Phone Number
                                            </label>
                                            <PhoneInput
                                                country={'in'}
                                                value={formData.phone}
                                                onChange={phone => setFormData({ ...formData, phone })}
                                                inputClass="form-control form-control-dark w-100 p-3 rounded-3"
                                                containerClass="form-control-dark rounded-3"
                                                buttonClass="bg-dark border-secondary rounded-start-3"
                                                dropdownClass="bg-dark text-light border-secondary"
                                                inputStyle={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: '#fff',
                                                    width: '100%',
                                                    height: '58px'
                                                }}
                                                buttonStyle={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                }}
                                                dropdownStyle={{
                                                    background: '#212529',
                                                    color: '#fff'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold mb-2">
                                                <i className="bi bi-briefcase me-2"></i>Experience (Years)
                                            </label>
                                            <input
                                                type="number"
                                                name="experience_years"
                                                value={formData.experience_years}
                                                onChange={handleChange}
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="0"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold mb-2">
                                                <i className="bi bi-mortarboard me-2"></i>Education
                                            </label>
                                            <input
                                                type="text"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="e.g. B.Tech Computer Science"
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
                                                value={formData.password}
                                                onChange={handleChange}
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
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="form-control form-control-dark p-3 rounded-3"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>

                                        <div className="mt-4 mb-4">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="agreeTerms"
                                                    required
                                                />
                                                <label className="form-check-label text-light small" htmlFor="agreeTerms">
                                                    I agree to the <Link to="/terms" className="text-primary text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-primary text-decoration-none">Privacy Policy</Link>
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
                                                    onClick={handleGoogleSignUp}
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
                                ) : (
                                    <div className="text-center animate-fade-in">
                                        <div className="mb-4">
                                            <i className="bi bi-envelope-check fs-1 text-info"></i>
                                        </div>
                                        <h3 className="text-light mb-3">Verify Your Email</h3>
                                        <div className="text-center mb-4">
                                            <p className="text-light">We've sent a 6-digit verification code to<br /><strong>{emailForOtp}</strong></p>
                                        </div>

                                        <div className="d-flex justify-content-center gap-2 mb-4">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={el => otpRefs.current[index] = el}
                                                    type="text"
                                                    maxLength="1"
                                                    className="form-control form-control-dark text-center fs-3 fw-bold rounded-3"
                                                    style={{ width: '50px', height: '60px' }}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep('details')}
                                            className="btn btn-outline-light w-100 py-3 rounded-3 fw-bold"
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>Back
                                        </button>
                                    </div>
                                )}

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
            <Footer />
        </div>
    );
};

export default Register;
