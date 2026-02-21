import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Loader from '../common/Loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CompanyRegister = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        industry: '',
        industry: '',
        phone: '',
        location: '',
        website: '',
        description: ''
    });

    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // OTP States
    const [step, setStep] = useState('register'); // 'register', 'otp', 'complete'
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [emailForOtp, setEmailForOtp] = useState('');
    const otpRefs = useRef([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!pageLoading) {
            initAnimations();
        }
    }, [pageLoading]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogo(null);
        setLogoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (!formData.phone || formData.phone.length < 8) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number.' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/companies/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password: formData.password,
                    companyName: formData.companyName,
                    industry: formData.industry,
                    phone: formData.phone,
                    location: formData.location,
                    website: formData.website,
                    description: formData.description,
                    logo: logoPreview
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Move to OTP step
                setEmailForOtp(formData.email);
                setStep('otp');
                setMessage({ type: 'success', text: 'Registration successful! Please verify your email.' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Registration failed' });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // OTP Handlers
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
        try {
            const response = await fetch('http://localhost:5000/api/companies/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailForOtp, otp: otpString })
            });

            const data = await response.json();

            if (response.ok) {
                setStep('complete');
            } else {
                setMessage({ type: 'error', text: data.message || 'Verification failed' });
                // Clear OTP on error? Maybe just keep it for correction
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Verification error' });
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/companies/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailForOtp })
            });
            if (response.ok) {
                alert('New OTP sent!');
                setOtp(['', '', '', '', '', '']); // Clear inputs
                otpRefs.current[0].focus();
            }
        } catch (error) {
            console.error(error);
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

            {pageLoading ? (
                <Loader />
            ) : (
                <div className="flex-grow-1 d-flex align-items-center py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7 col-md-9">
                                {/* Register Card */}
                                <div className="glass-card p-5 rounded-4 shadow-lg animate-on-scroll">
                                    {/* Header with Message */}
                                    <div className="text-center mb-4">
                                        <div className="mb-3">
                                            <div className="icon-box bg-info bg-opacity-20 text-info rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-building-add fs-3"></i>
                                            </div>
                                        </div>
                                        <h2 className="fw-bold text-light mb-2">Register Your Company</h2>
                                        <p className="text-muted">Join NextOffer and start hiring top talent</p>

                                        {/* Success/Error Message */}
                                        {message.text && (
                                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                                                <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                                {message.text}
                                            </div>
                                        )}
                                    </div>

                                    {/* Conditional Rendering based on Step */}
                                    {step === 'register' && (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-4">
                                                {/* Company Name */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-building me-2"></i>Company Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="companyName"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="Enter company name"
                                                        value={formData.companyName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Username */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-person-circle me-2"></i>Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="Choose a username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-envelope me-2"></i>Company Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="company@example.com"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Phone */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-telephone me-2"></i>Company Phone
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

                                                {/* Industry */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-briefcase me-2"></i>Industry
                                                    </label>
                                                    <select
                                                        name="industry"
                                                        className="form-select form-control-dark p-3 rounded-3"
                                                        value={formData.industry}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select industry</option>
                                                        <option value="Technology">Technology</option>
                                                        <option value="Finance">Finance</option>
                                                        <option value="Healthcare">Healthcare</option>
                                                        <option value="Education">Education</option>
                                                        <option value="E-commerce">E-commerce</option>
                                                        <option value="Manufacturing">Manufacturing</option>
                                                        <option value="Retail">Retail</option>
                                                        <option value="Consulting">Consulting</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                {/* Location */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-geo-alt me-2"></i>Location
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="City, Country"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Website */}
                                                <div className="col-12">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-globe me-2"></i>Company Website
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="website"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="https://www.company.com"
                                                        value={formData.website}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                {/* Description */}
                                                <div className="col-12">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-text-paragraph me-2"></i>Company Description
                                                    </label>
                                                    <textarea
                                                        name="description"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        rows="3"
                                                        placeholder="Brief description of your company"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                </div>

                                                {/* Company Logo */}
                                                <div className="col-12">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-image me-2"></i>Company Logo
                                                    </label>

                                                    {logoPreview ? (
                                                        <div className="position-relative">
                                                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                                                <img
                                                                    src={logoPreview}
                                                                    alt="Company Logo Preview"
                                                                    className="rounded-3"
                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                />
                                                                <div className="flex-grow-1">
                                                                    <p className="text-light mb-1 fw-bold">{logo?.name}</p>
                                                                    <small className="text-muted">{(logo?.size / 1024).toFixed(2)} KB</small>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm rounded-pill"
                                                                    onClick={handleRemoveLogo}
                                                                >
                                                                    <i className="bi bi-trash me-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="position-relative">
                                                            <input
                                                                type="file"
                                                                id="logoInput"
                                                                className="d-none"
                                                                accept="image/*"
                                                                onChange={handleLogoChange}
                                                            />
                                                            <label
                                                                htmlFor="logoInput"
                                                                className="d-flex flex-column align-items-center justify-content-center p-4 rounded-3 cursor-pointer"
                                                                style={{
                                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(13, 202, 240, 0.5)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                                                            >
                                                                <i className="bi bi-cloud-upload fs-1 text-info mb-2"></i>
                                                                <p className="text-light mb-1 fw-bold">Click to upload logo</p>
                                                                <small className="text-muted">or drag and drop</small>
                                                                <small className="text-muted mt-1">PNG, JPG, SVG (max. 2MB)</small>
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Password */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-lock me-2"></i>Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="Create a password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Confirm Password */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-light small fw-bold mb-2">
                                                        <i className="bi bi-shield-lock me-2"></i>Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        className="form-control form-control-dark p-3 rounded-3"
                                                        placeholder="Confirm your password"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms Checkbox */}
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
                                                className="btn btn-info w-100 py-3 rounded-3 fw-bold shadow-lg mb-3 text-white"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Registering...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-building-check me-2"></i>Register Company
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}

                                    {step === 'otp' && (
                                        <div className="text-center animate-fade-in">
                                            <div className="mb-4">
                                                <i className="bi bi-envelope-check fs-1 text-info"></i>
                                            </div>
                                            <h3 className="text-light mb-3">Verify Your Email</h3>
                                            <p className="text-muted mb-4">
                                                We've sent a 6-digit verification code to<br />
                                                <strong className="text-light">{emailForOtp}</strong>
                                            </p>

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
                                                onClick={resendOtp}
                                                className="btn btn-link text-info text-decoration-none mb-3"
                                            >
                                                Resend Code
                                            </button>

                                            {loading && <div className="text-info">Verifying...</div>}
                                        </div>
                                    )}

                                    {step === 'complete' && (
                                        <div className="text-center animate-fade-in">
                                            <div className="mb-4">
                                                <div className="icon-box bg-success bg-opacity-20 text-success rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                                    <i className="bi bi-check-lg fs-1"></i>
                                                </div>
                                            </div>
                                            <h3 className="text-light mb-3">Verification Successful!</h3>
                                            <p className="text-muted mb-4">
                                                Your email has been verified. Your account is now pending <strong className="text-light">Admin Approval</strong>.
                                                You will be notified once your account is active.
                                            </p>
                                            <Link to="/" className="btn btn-info px-4 py-2 rounded-3 text-white">
                                                Go to Home
                                            </Link>
                                        </div>
                                    )}

                                    {/* Divider & Social Login (Only show on register step) */}
                                    {step === 'register' && (
                                        <>
                                            <div className="position-relative my-4">
                                                <hr className="text-muted" />
                                                <span className="position-absolute top-50 start-50 translate-middle bg-dark px-3 text-muted small">
                                                    or register with
                                                </span>
                                            </div>
                                            <div className="row g-2 mb-4">
                                                <div className="col-6">
                                                    <button type="button" className="btn btn-outline-light w-100 py-2 rounded-3">
                                                        <i className="bi bi-google me-2"></i>Google
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <button type="button" className="btn btn-outline-light w-100 py-2 rounded-3">
                                                        <i className="bi bi-microsoft me-2"></i>Microsoft
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Sign In Link */}
                                    <div className="text-center pt-3 border-top border-secondary">
                                        <p className="text-muted small mb-0">
                                            Already have a company account?
                                            <Link to="/login" className="text-info text-decoration-none ms-1 fw-bold">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                {/* Security Badge */}
                                <div className="text-center mt-4 animate-on-scroll delay-100">
                                    <small className="text-light opacity-75">
                                        <i className="bi bi-shield-check me-2"></i>
                                        Your company data is secure with enterprise-grade encryption
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CompanyRegister;
