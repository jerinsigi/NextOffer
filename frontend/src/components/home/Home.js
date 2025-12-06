import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';

class Home extends PureComponent {
    componentDidMount() {
        initAnimations();
    }

    render() {
        return (
            <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden">
                {/* Background Shapes */}
                <div className="shape-blob shape-blob-1"></div>
                <div className="shape-blob shape-blob-2"></div>

                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent pt-4 fixed-top">
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
                                    <Link className="nav-link active px-3" aria-current="page" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link px-3" href="#about">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link px-3" href="#features">Features</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link px-3" href="#contact">Contact</a>
                                </li>
                            </ul>
                            <div className="d-flex ms-lg-3">
                                <button className="btn btn-outline-light me-3 px-4 rounded-pill" onClick={() => this.props.navigate('/login')}>Login</button>
                                <button className="btn btn-primary px-4 rounded-pill shadow-lg" onClick={() => this.props.navigate('/register')}>Get Started</button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-grow-1">
                    {/* Hero Section */}
                    <section className="hero-section d-flex align-items-center text-center text-light bg-gradient-hero position-relative" style={{ minHeight: '100vh', paddingTop: '120px' }}>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    {/* Feature Badges */}
                                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap animate-on-scroll">
                                        <span className="badge bg-primary bg-opacity-25 text-light px-3 py-2 rounded-pill">
                                            <i className="bi bi-check-circle me-2"></i>AI Resume Screening
                                        </span>
                                        <span className="badge bg-primary bg-opacity-25 text-light px-3 py-2 rounded-pill">
                                            <i className="bi bi-check-circle me-2"></i>Live Voice Interviews
                                        </span>
                                        <span className="badge bg-primary bg-opacity-25 text-light px-3 py-2 rounded-pill">
                                            <i className="bi bi-check-circle me-2"></i>Integrity Monitoring
                                        </span>
                                    </div>

                                    <h1 className="display-1 fw-bold mb-4 animate-on-scroll">
                                        AI-Powered Pre-Screening <br />
                                        That <span className="text-primary">Eliminates Hiring Guesswork</span>
                                    </h1>
                                    <p className="lead mb-4 text-light opacity-75 animate-on-scroll" style={{ fontSize: '1.3rem' }}>
                                        Replace manual resume reviews with AI-driven screening, multimodal interviews, <br />
                                        and integrity enforcement—all in one automated platform.
                                    </p>

                                    {/* Key Statistics */}
                                    <div className="row g-4 mb-5 mt-4 animate-on-scroll">
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                                                <h2 className="display-4 fw-bold text-primary mb-2">90%</h2>
                                                <p className="text-light mb-0">Reduced Time-to-Hire</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                                                <h2 className="display-4 fw-bold text-primary mb-2">100%</h2>
                                                <p className="text-light mb-0">Candidate Authenticity</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                                                <h2 className="display-4 fw-bold text-primary mb-2">3-Stage</h2>
                                                <p className="text-light mb-0">AI Validation Pipeline</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTAs */}
                                    <div className="d-flex justify-content-center gap-3 mb-5 animate-on-scroll flex-wrap">
                                        <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg">
                                            <i className="bi bi-play-circle me-2"></i>Schedule Demo
                                        </button>
                                        <button className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                                            Start Free Trial
                                        </button>
                                    </div>

                                    {/* Scroll Indicator */}
                                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 animate-on-scroll">
                                        <a href="#about" className="text-light text-decoration-none">
                                            <div className="d-flex flex-column align-items-center">
                                                <small className="mb-2 opacity-75">Learn More</small>
                                                <i className="bi bi-chevron-down fs-4 animate-bounce"></i>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Wave Divider */}
                        <div className="wave-divider bottom">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="wave-fill-features"></path>
                            </svg>
                        </div>
                    </section>

                    {/* About Us Section: Mission & Comparison */}
                    <section className="py-5 bg-gradient-features position-relative" id="about">
                        <div className="container position-relative z-2">
                            {/* Mission Header */}
                            <div className="row justify-content-center mb-5">
                                <div className="col-lg-8 text-center animate-on-scroll">
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">OUR MISSION</span>
                                    <h2 className="display-5 fw-bold mb-4">Building the Future of Hiring with <span className="text-white">Integrity & AI</span></h2>
                                    <div className="p-4 glass-card rounded-4 d-inline-block">
                                        <p className="lead text-light mb-0 fst-italic">
                                            "To replace the noise of traditional recruitment with a signal of pure potential, ensuring every hire is authentic, verified, and data-backed."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* The Shift: Comparison */}
                            <div className="row g-4 mb-5">
                                {/* The Old Way */}
                                <div className="col-lg-6 animate-on-scroll delay-100">
                                    <div className="comparison-card old-way p-5 rounded-4 h-100 border border-secondary border-opacity-50">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="icon-box bg-secondary bg-opacity-10 text-secondary rounded-circle me-3" style={{ width: '50px', height: '50px' }}>
                                                <i className="bi bi-hourglass-split fs-4"></i>
                                            </div>
                                            <h3 className="fw-bold text-secondary mb-0">The Old Way</h3>
                                        </div>
                                        <ul className="list-unstyled">
                                            <li className="mb-3 d-flex align-items-start text-muted">
                                                <i className="bi bi-x-circle-fill text-danger me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-light">Overwhelming Noise</strong>
                                                    <span>Hundreds of unqualified resumes flooding your inbox.</span>
                                                </div>
                                            </li>
                                            <li className="mb-3 d-flex align-items-start text-muted">
                                                <i className="bi bi-x-circle-fill text-danger me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-light">Proxy Candidates</strong>
                                                    <span>Unverified applicants using cheat sheets or stand-ins.</span>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start text-muted">
                                                <i className="bi bi-x-circle-fill text-danger me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-light">Slow Feedback Loops</strong>
                                                    <span>Weeks lost scheduling first-round technical screens.</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* The NextOffer Way */}
                                <div className="col-lg-6 animate-on-scroll delay-200">
                                    <div className="comparison-card new-way p-5 rounded-4 h-100 border border-primary position-relative overflow-hidden">
                                        <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                            <i className="bi bi-check-lg display-1 text-primary"></i>
                                        </div>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="icon-box bg-primary bg-opacity-20 text-primary rounded-circle me-3" style={{ width: '50px', height: '50px' }}>
                                                <i className="bi bi-stars fs-4"></i>
                                            </div>
                                            <h3 className="fw-bold text-primary mb-0">The NextOffer Way</h3>
                                        </div>
                                        <ul className="list-unstyled">
                                            <li className="mb-3 d-flex align-items-start text-light">
                                                <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block">Instant Filtering</strong>
                                                    <span className="opacity-75">AI ranks candidates by semantic relevance instantly.</span>
                                                </div>
                                            </li>
                                            <li className="mb-3 d-flex align-items-start text-light">
                                                <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block">100% Verified</strong>
                                                    <span className="opacity-75">Biometric and browser-based integrity enforcement.</span>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start text-light">
                                                <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <strong className="d-block">Real-Time Insights</strong>
                                                    <span className="opacity-75">Immediate, data-rich reports on candidate performance.</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Our DNA: Values */}
                            <div className="row g-4">
                                <div className="col-md-4 animate-on-scroll delay-300">
                                    <div className="value-card text-center p-4 rounded-4 bg-dark border border-secondary border-opacity-25 h-100">
                                        <i className="bi bi-lightbulb text-warning fs-2 mb-3 d-block"></i>
                                        <h5 className="fw-bold text-light">Innovation</h5>
                                        <p className="text-muted small mb-0">Pushing the boundaries of what AI can do for human connection.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 animate-on-scroll delay-400">
                                    <div className="value-card text-center p-4 rounded-4 bg-dark border border-secondary border-opacity-25 h-100">
                                        <i className="bi bi-eye text-info fs-2 mb-3 d-block"></i>
                                        <h5 className="fw-bold text-light">Transparency</h5>
                                        <p className="text-muted small mb-0">No black boxes. Just clear, explainable hiring data.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 animate-on-scroll delay-500">
                                    <div className="value-card text-center p-4 rounded-4 bg-dark border border-secondary border-opacity-25 h-100">
                                        <i className="bi bi-lightning-charge text-primary fs-2 mb-3 d-block"></i>
                                        <h5 className="fw-bold text-light">Speed</h5>
                                        <p className="text-muted small mb-0">Accelerating growth by removing the hiring bottleneck.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Wave Divider */}
                        <div className="wave-divider bottom" style={{ transform: 'none' }}>
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="wave-fill-footer"></path>
                            </svg>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-5 bg-darker" id="features">
                        <div className="container">
                            <div className="text-center mb-5 animate-on-scroll">
                                <h2 className="display-4 fw-bold">Key Features</h2>
                                <p className="lead text-light opacity-75">A comprehensive suite of tools to validate candidate potential.</p>
                            </div>
                            <div className="row g-4">
                                <div className="col-md-4 animate-on-scroll delay-100">
                                    <div className="card h-100 glass-card p-4 rounded-4 transition-all">
                                        <div className="card-body text-center">
                                            <img src={require('../../assets/resume-icon.png')} alt="Resume Screening" className="mb-4" style={{ height: '80px' }} />
                                            <h4 className="card-title fw-bold mb-3">Automated Resume Screening</h4>
                                            <p className="card-text text-muted">
                                                Semantic comparison between resumes and JDs to extract key skills and identify qualification gaps automatically.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 animate-on-scroll delay-200">
                                    <div className="card h-100 glass-card p-4 rounded-4 transition-all">
                                        <div className="card-body text-center">
                                            <img src={require('../../assets/interview-icon.png')} alt="Multimodal Simulation" className="mb-4" style={{ height: '80px' }} />
                                            <h4 className="card-title fw-bold mb-3">Multimodal Simulation Engine</h4>
                                            <p className="card-text text-muted">
                                                Real-time, turn-based voice interviews with a dynamic AI that adapts questioning logic based on resume analysis.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 animate-on-scroll delay-300">
                                    <div className="card h-100 glass-card p-4 rounded-4 transition-all">
                                        <div className="card-body text-center">
                                            <img src={require('../../assets/integrity-icon.png')} alt="Integrity Enforcement" className="mb-4" style={{ height: '80px' }} />
                                            <h4 className="card-title fw-bold mb-3">Integrity Enforcement Layer</h4>
                                            <p className="card-text text-muted">
                                                Client-side computer vision and browser telemetry to detect suspicious behaviors like gaze aversion and tab switching.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Wave Divider */}
                        <div className="wave-divider bottom">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="wave-fill-benefits"></path>
                            </svg>
                        </div>
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="py-5 bg-gradient-benefits position-relative" id="why-us">
                        <div className="container position-relative z-2">
                            {/* Top Section: Header & Stats */}
                            <div className="row align-items-center mb-5">
                                <div className="col-lg-6 animate-on-scroll">
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">WHY CHOOSE US</span>
                                    <h2 className="display-4 fw-bold mb-4">Partner with an AI That Delivers <span className="text-white">Real Results</span></h2>
                                    <p className="lead text-muted mb-5">
                                        NextOffer doesn't just screen candidates—it validates potential. Our data-driven approach combines semantic analysis with behavioral AI to help you build world-class teams.
                                    </p>

                                    <div className="row g-4">
                                        <div className="col-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">90%</h3>
                                            <small className="text-muted">Reduced Time-to-Hire</small>
                                        </div>
                                        <div className="col-4 border-start border-secondary ps-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">100%</h3>
                                            <small className="text-muted">Candidate Authenticity</small>
                                        </div>
                                        <div className="col-4 border-start border-secondary ps-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">3x</h3>
                                            <small className="text-muted">Faster Scaling</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 animate-on-scroll delay-100 text-center">
                                    <img src={require('../../assets/solution-icon.png')} alt="AI Analysis" className="img-fluid" style={{ maxHeight: '400px' }} />
                                </div>
                            </div>

                            {/* Middle Section: Cards */}
                            <div className="row g-4 mb-5">
                                <div className="col-lg-4 animate-on-scroll delay-100">
                                    <div className="card h-100 bg-dark border-secondary p-4 rounded-4">
                                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-lightning-charge fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3">Instant Filtering</h4>
                                        <p className="text-muted mb-4">
                                            Automatically parse and rank thousands of resumes against your JD in seconds, not days.
                                        </p>
                                        <a href="#features" className="text-primary text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-4 animate-on-scroll delay-200">
                                    <div className="card h-100 bg-dark border-primary p-4 rounded-4 position-relative shadow-lg" style={{ transform: 'scale(1.05)', zIndex: 2 }}>
                                        <div className="position-absolute top-0 end-0 mt-3 me-3">
                                            <span className="badge bg-primary">Most Popular</span>
                                        </div>
                                        <div className="icon-box bg-primary text-white rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-graph-up-arrow fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3 text-white">Deep Insights</h4>
                                        <p className="text-light opacity-75 mb-4">
                                            Go beyond keywords. Our AI analyzes behavioral cues and technical depth during voice interviews.
                                        </p>
                                        <a href="#features" className="text-primary text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-4 animate-on-scroll delay-300">
                                    <div className="card h-100 bg-dark border-secondary p-4 rounded-4">
                                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-shield-check fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3">Secure Testing</h4>
                                        <p className="text-muted mb-4">
                                            Eliminate proxy candidates with military-grade proctoring and identity verification.
                                        </p>
                                        <a href="#features" className="text-primary text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Process & Capabilities */}
                            <div className="row g-5 align-items-center">
                                <div className="col-lg-6 animate-on-scroll">
                                    <div className="process-timeline">
                                        <div className="process-item d-flex gap-3 mb-4">
                                            <div className="process-number bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '50px', height: '50px' }}>01</div>
                                            <div>
                                                <h5 className="fw-bold mb-1">Discovery & Screening</h5>
                                                <p className="text-muted small">Semantic matching of resumes to JDs.</p>
                                            </div>
                                        </div>
                                        <div className="process-item d-flex gap-3 mb-4">
                                            <div className="process-number bg-dark border border-secondary text-light rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '50px', height: '50px' }}>02</div>
                                            <div>
                                                <h5 className="fw-bold mb-1">AI Voice Interview</h5>
                                                <p className="text-muted small">Interactive technical & behavioral assessment.</p>
                                            </div>
                                        </div>
                                        <div className="process-item d-flex gap-3 mb-4">
                                            <div className="process-number bg-dark border border-secondary text-light rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '50px', height: '50px' }}>03</div>
                                            <div>
                                                <h5 className="fw-bold mb-1">Integrity Validation</h5>
                                                <p className="text-muted small">Real-time proctoring and identity checks.</p>
                                            </div>
                                        </div>
                                        <div className="process-item d-flex gap-3">
                                            <div className="process-number bg-dark border border-secondary text-light rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '50px', height: '50px' }}>04</div>
                                            <div>
                                                <h5 className="fw-bold mb-1">Optimization</h5>
                                                <p className="text-muted small">Data-backed hiring decisions & reports.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 animate-on-scroll delay-100">
                                    <h3 className="display-6 fw-bold mb-4">Our Core Capabilities</h3>
                                    <p className="text-muted mb-4">
                                        We provide a comprehensive ecosystem that handles the heavy lifting of recruitment, allowing you to focus on the final decision.
                                    </p>

                                    <ul className="list-unstyled mb-5">
                                        <li className="mb-3 d-flex align-items-center text-light">
                                            <i className="bi bi-check-circle-fill text-primary me-3"></i>Strategic Planning & Consulting
                                        </li>
                                        <li className="mb-3 d-flex align-items-center text-light">
                                            <i className="bi bi-check-circle-fill text-primary me-3"></i>Custom Development Solutions
                                        </li>
                                        <li className="mb-3 d-flex align-items-center text-light">
                                            <i className="bi bi-check-circle-fill text-primary me-3"></i>Ongoing Support & Optimization
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Wave Divider */}
                        <div className="wave-divider bottom" style={{ transform: 'none' }}>
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="wave-fill-footer"></path>
                            </svg>
                        </div>
                    </section>
                </main>

                {/* Contact Section */}
                <section className="py-5 bg-darker position-relative" id="contact">
                    <div className="container position-relative z-2">
                        <div className="text-center mb-5 animate-on-scroll">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">CONTACT</span>
                            <h2 className="display-4 fw-bold">Need Help? <span className="text-primary">Contact Us</span></h2>
                        </div>

                        <div className="row g-5">
                            {/* Left Column: Info */}
                            <div className="col-lg-6 animate-on-scroll delay-100">
                                <div className="mb-4">
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill mb-3">
                                        <i className="bi bi-rocket-takeoff me-2"></i>Let's Build Something Amazing
                                    </span>
                                    <h3 className="display-6 fw-bold mb-4">Ready to Transform Your Digital Presence?</h3>
                                    <p className="text-muted mb-5">
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                    </p>
                                </div>

                                <div className="d-flex flex-column gap-3 mb-5">
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-4">
                                            <i className="bi bi-envelope fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Email</h5>
                                            <p className="mb-1 text-light">hello@example.com</p>
                                            <small className="text-muted">We reply within 4 hours</small>
                                        </div>
                                    </div>
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-4">
                                            <i className="bi bi-telephone fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Phone</h5>
                                            <p className="mb-1 text-light">+1 (555) 234-5678</p>
                                            <small className="text-muted">Mon-Fri, 9AM-6PM EST</small>
                                        </div>
                                    </div>
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-4">
                                            <i className="bi bi-geo-alt fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Office</h5>
                                            <p className="mb-1 text-light">5632 Market Street, San Francisco, CA 94102</p>
                                            <small className="text-muted">Visit us anytime</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="row border-top border-secondary pt-4 mt-4">
                                    <div className="col-4 border-end border-secondary">
                                        <h4 className="fw-bold text-primary mb-0">2.5k+</h4>
                                        <small className="text-muted">Happy Clients</small>
                                    </div>
                                    <div className="col-4 border-end border-secondary">
                                        <h4 className="fw-bold text-primary mb-0">4.9/5</h4>
                                        <small className="text-muted">Client Rating</small>
                                    </div>
                                    <div className="col-4">
                                        <h4 className="fw-bold text-primary mb-0">15min</h4>
                                        <small className="text-muted">Avg Response</small>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <div className="col-lg-6 animate-on-scroll delay-200">
                                <div className="contact-form-card p-5 rounded-5 h-100">
                                    <h3 className="fw-bold mb-2">Start Your Project</h3>
                                    <p className="text-muted mb-4">Tell us about your project and we'll get back to you with a tailored solution.</p>

                                    <form>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Full Name</label>
                                            <input type="text" className="form-control form-control-dark p-3 rounded-3" placeholder="" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Email Address</label>
                                            <input type="email" className="form-control form-control-dark p-3 rounded-3" placeholder="" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Subject</label>
                                            <input type="text" className="form-control form-control-dark p-3 rounded-3" placeholder="" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Message</label>
                                            <textarea className="form-control form-control-dark p-3 rounded-3" rows="4" placeholder=""></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg">
                                            Send Message <i className="bi bi-arrow-right ms-2"></i>
                                        </button>
                                    </form>

                                    <div className="mt-4 text-center">
                                        <small className="text-muted">
                                            <i className="bi bi-shield-lock me-2"></i>Your information is secure and will never be shared
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-darker text-light py-5 mt-auto border-top border-secondary animate-on-scroll">
                    <div className="container">
                        <div className="row">
                            {/* Brand Column */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <h3 className="fw-bold text-light mb-4">NextOffer</h3>
                                <p className="text-muted mb-4">
                                    An automated, AI-driven pre-screening ecosystem designed to replace manual technical interviews with a three-stage validation pipeline: Resume Screening, Multimodal Simulation, and Integrity Enforcement.
                                </p>
                                <div className="d-flex gap-2">
                                    <a href="#!" className="social-icon"><i className="bi bi-twitter"></i></a>
                                    <a href="#!" className="social-icon"><i className="bi bi-facebook"></i></a>
                                    <a href="#!" className="social-icon"><i className="bi bi-instagram"></i></a>
                                    <a href="#!" className="social-icon"><i className="bi bi-linkedin"></i></a>
                                </div>
                            </div>

                            {/* Useful Links */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <h5 className="fw-bold text-light mb-4">Useful Links</h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><Link to="/" className="text-decoration-none text-muted hover-text-primary">Home</Link></li>
                                    <li className="mb-2"><a href="#about" className="text-decoration-none text-muted hover-text-primary">About us</a></li>
                                    <li className="mb-2"><a href="#features" className="text-decoration-none text-muted hover-text-primary">Features</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Terms of service</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Privacy policy</a></li>
                                </ul>
                            </div>

                            {/* Our Services */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <h5 className="fw-bold text-light mb-4">Our Services</h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Resume Screening</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Multimodal Simulation</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Integrity Enforcement</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Candidate Reports</a></li>
                                    <li className="mb-2"><a href="#!" className="text-decoration-none text-muted hover-text-primary">Data-Driven Hiring</a></li>
                                </ul>
                            </div>

                            {/* Contact Us */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <h5 className="fw-bold text-light mb-4">Contact Us</h5>
                                <p className="text-muted mb-2">A108 Adam Street</p>
                                <p className="text-muted mb-4">New York, NY 535022<br />United States</p>
                                <p className="text-muted mb-2"><strong>Phone:</strong> +1 5589 55488 55</p>
                                <p className="text-muted"><strong>Email:</strong> info@example.com</p>
                            </div>
                        </div>
                        <div className="text-center pt-4 border-top border-secondary mt-4">
                            <div className="mb-2">&copy; Copyright <strong>NextOffer</strong>. All Rights Reserved</div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

// HOC to wrap the class component and provide navigate functionality
function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

export default HomeWithNavigate;