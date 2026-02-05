import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { initAnimations } from '../../assets/js/animations';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import { TestimonialsColumns } from './TestimonialsColumns';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';

class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scrolled: false,
            activeSection: 'home',
            contactForm: {
                fullName: '',
                email: '',
                subject: '',
                message: ''
            },
            contactStatus: {
                loading: false,
                success: false,
                error: null
            }
        };
    }

    componentDidMount() {
        initAnimations();
        window.addEventListener('scroll', this.handleScroll);

        // Handle initial hash scroll with retry
        if (this.props.location && this.props.location.hash) {
            const id = this.props.location.hash.substring(1);
            this.scrollToSection(id);
        }
    }

    scrollToSection = (id, attempt = 0) => {
        // Max retries: 5 times (approx 1.5s total)
        if (attempt > 5) return;

        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed navbar (approx 100px)
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        } else {
            // Retry after small delay to allow render
            setTimeout(() => this.scrollToSection(id, attempt + 1), 300);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    scrollToTop = (e) => {
        if (e) e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.setState({ activeSection: 'home' });
        // Update URL to match standard behavior without reload
        window.history.pushState({}, '', '/');
    };

    handleContactChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            contactForm: {
                ...prevState.contactForm,
                [name]: value
            }
        }));
    };

    handleContactSubmit = async (e) => {
        e.preventDefault();
        this.setState({ contactStatus: { loading: true, success: false, error: null } });

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.contactForm)
            });

            if (response.ok) {
                this.setState({
                    contactStatus: { loading: false, success: true, error: null },
                    contactForm: { fullName: '', email: '', subject: '', message: '' }
                });
                setTimeout(() => {
                    this.setState(prevState => ({
                        contactStatus: { ...prevState.contactStatus, success: false }
                    }));
                }, 5000);
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            this.setState({
                contactStatus: { loading: false, success: false, error: error.message }
            });
        }
    };

    handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar background logic
        if (scrollY > 50) {
            if (!this.state.scrolled) this.setState({ scrolled: true });
        } else {
            if (this.state.scrolled) this.setState({ scrolled: false });
        }

        // Scroll Spy Logic
        const sections = ['about', 'features', 'contact'];
        let current = 'home';

        // Check offset of each section
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                // Offset of 100px for navbar height
                if (scrollY >= element.offsetTop - 150) {
                    current = section;
                }
            }
        }

        if (this.state.activeSection !== current) {
            this.setState({ activeSection: current });
        }
    };

    render() {
        const { activeSection } = this.state;
        return (
            <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden">


                {/* Navbar */}
                <Navbar
                    scrolled={this.state.scrolled}
                    activeSection={activeSection}
                    onScrollToTop={this.scrollToTop}
                />

                {/* Main Content */}
                <main className="flex-grow-1">
                    {/* Hero Section */}
                    <section className="hero-section d-flex align-items-center text-center position-relative" style={{ minHeight: '100vh', paddingTop: '120px' }}>
                        <div className="container position-relative z-2">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="py-5">
                                        <div className="mb-4">
                                            <span className="badge bg-primary bg-opacity-10 text-white border border-primary border-opacity-25 rounded-pill px-3 py-2 animate-on-scroll">
                                                <i className="bi bi-stars me-2"></i>AI-Powered Career Intelligence
                                            </span>
                                        </div>

                                        <h1 className="display-2 fw-bold mb-4 animate-on-scroll tracking-tight text-white">
                                            Ace Your Interview. <br />
                                            <span className="text-primary">Land Your Dream Job.</span>
                                        </h1>
                                        <p className="lead mb-5 text-muted animate-on-scroll mx-auto" style={{ fontSize: '1.25rem', maxWidth: '700px', lineHeight: '1.8' }}>
                                            The personal interview coach for everyone. Practice with real-time AI feedback on your speech, body language, and answers—tailored for any role.
                                        </p>

                                        {/* CTAs */}
                                        <div className="d-flex justify-content-center gap-3 animate-on-scroll mb-5">
                                            <button className="btn btn-primary btn-lg rounded-pill px-5 py-3" onClick={() => this.props.navigate('/register?type=user')}>
                                                Start Practice
                                            </button>
                                            <button className="btn btn-outline-light btn-lg rounded-pill px-5 py-3" onClick={() => this.props.navigate('/company/register')}>
                                                For Companies
                                            </button>
                                        </div>

                                        <div className="pt-5 border-top border-white border-opacity-10 animate-on-scroll">
                                            <p className="text-muted small text-uppercase spacing-wide mb-4">Candidates have landed offers at</p>
                                            <div className="d-flex justify-content-center gap-5 align-items-center opacity-50 flex-wrap">
                                                <span className="h5 mb-0 fw-bold text-white">Google</span>
                                                <span className="h5 mb-0 fw-bold text-white">Microsoft</span>
                                                <span className="h5 mb-0 fw-bold text-white">Amazon</span>
                                                <span className="h5 mb-0 fw-bold text-white">Netflix</span>
                                                <span className="h5 mb-0 fw-bold text-white h4">Uber</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* About Us Section: Mission & Comparison */}
                    <section className="py-5 bg-gradient-features position-relative" id="about">
                        <div className="container position-relative z-2">
                            {/* Mission Header */}
                            <div className="row justify-content-center mb-5">
                                <div className="col-lg-8 text-center animate-on-scroll">
                                    <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill mb-3 border border-light border-opacity-25">OUR MISSION</span>
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
                    </section>

                    {/* Features Section */}
                    <section className="py-5 bg-darker" id="features">
                        <div className="container"><br />
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
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="py-5 bg-gradient-benefits position-relative" id="why-us">
                        <div className="container position-relative z-2">
                            {/* Top Section: Header & Stats */}
                            <div className="row align-items-center mb-5">
                                <div className="col-lg-6 animate-on-scroll">
                                    <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill mb-3 border border-light border-opacity-25">WHY CHOOSE US</span>
                                    <h2 className="display-4 fw-bold mb-4">Partner with an AI That Delivers <span className="text-white">Real Results</span></h2>
                                    <p className="lead text-light opacity-75 mb-5">
                                        NextOffer doesn't just screen candidates—it validates potential. Our data-driven approach combines semantic analysis with behavioral AI to help you build world-class teams.
                                    </p>

                                    <div className="row g-4">
                                        <div className="col-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">90%</h3>
                                            <small className="text-light opacity-75">Reduced Time-to-Hire</small>
                                        </div>
                                        <div className="col-4 border-start border-light border-opacity-25 ps-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">100%</h3>
                                            <small className="text-light opacity-75">Candidate Authenticity</small>
                                        </div>
                                        <div className="col-4 border-start border-light border-opacity-25 ps-4">
                                            <h3 className="display-5 fw-bold text-white mb-0">3x</h3>
                                            <small className="text-light opacity-75">Faster Scaling</small>
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
                                    <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4">
                                        <div className="icon-box bg-white bg-opacity-10 text-white rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-lightning-charge fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3 text-white">Instant Filtering</h4>
                                        <p className="text-light opacity-75 mb-4">
                                            Automatically parse and rank thousands of resumes against your JD in seconds, not days.
                                        </p>
                                        <a href="#features" className="text-white text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-4 animate-on-scroll delay-200">
                                    <div className="card h-100 bg-primary border-primary p-4 rounded-4 position-relative shadow-lg" style={{ transform: 'scale(1.05)', zIndex: 2 }}>
                                        <div className="position-absolute top-0 end-0 mt-3 me-3">
                                            <span className="badge bg-white text-primary">Most Popular</span>
                                        </div>
                                        <div className="icon-box bg-white text-primary rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-graph-up-arrow fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3 text-white">Deep Insights</h4>
                                        <p className="text-white opacity-90 mb-4">
                                            Go beyond keywords. Our AI analyzes behavioral cues and technical depth during voice interviews.
                                        </p>
                                        <a href="#features" className="text-white text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-4 animate-on-scroll delay-300">
                                    <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4">
                                        <div className="icon-box bg-white bg-opacity-10 text-white rounded-3 p-3 mb-4" style={{ width: 'fit-content' }}>
                                            <i className="bi bi-shield-check fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold mb-3 text-white">Secure Testing</h4>
                                        <p className="text-light opacity-75 mb-4">
                                            Eliminate proxy candidates with military-grade proctoring and identity verification.
                                        </p>
                                        <a href="#features" className="text-white text-decoration-none fw-bold">Learn more <i className="bi bi-arrow-right"></i></a>
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

                    {/* Testimonials Section - Scrolling Columns */}
                    <TestimonialsColumns />
                </main>

                {/* Contact Section */}
                <section className="py-5 bg-darker position-relative" id="contact">
                    <div className="container position-relative z-2">
                        <div className="text-center mb-5 animate-on-scroll">
                            <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill mb-3 border border-light border-opacity-25">CONTACT</span>
                            <h2 className="display-4 fw-bold">Need Help? <span className="text-primary">Contact Us</span></h2>
                        </div>

                        <div className="row g-5">
                            {/* Left Column: Info */}
                            <div className="col-lg-6 animate-on-scroll delay-100">
                                <div className="mb-4">
                                    <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill mb-3 border border-light border-opacity-25">
                                        <i className="bi bi-rocket-takeoff me-2"></i>Get in Touch
                                    </span>
                                    <h3 className="display-6 fw-bold mb-4">Ready to Transform Your Hiring?</h3>
                                    <p className="text-muted mb-5">
                                        Experience the future of recruitment with NextOffer. Reach out to us for a demo, custom pricing, or any questions about our AI-driven platform.
                                    </p>
                                </div>

                                <div className="d-flex flex-column gap-3 mb-5">
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-white bg-opacity-10 text-white rounded-3 p-3 me-4">
                                            <i className="bi bi-envelope fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Email</h5>
                                            <p className="mb-1 text-light">team.nextoffer@gmail.com</p>
                                            <small className="text-muted">We reply within 4 hours</small>
                                        </div>
                                    </div>
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-white bg-opacity-10 text-white rounded-3 p-3 me-4">
                                            <i className="bi bi-telephone fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Phone</h5>
                                            <p className="mb-1 text-light">+91 98765 43210</p>
                                            <small className="text-muted">Mon-Fri, 9AM-6PM EST</small>
                                        </div>
                                    </div>
                                    <div className="contact-info-card p-4 rounded-4 d-flex align-items-center">
                                        <div className="icon-box bg-white bg-opacity-10 text-white rounded-3 p-3 me-4">
                                            <i className="bi bi-geo-alt fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">Office</h5>
                                            <p className="mb-1 text-light">Electronic City, Bengaluru, Karnataka 560100, India</p>
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
                                    <h3 className="fw-bold mb-2">Get in Touch</h3>
                                    <p className="text-muted mb-4">Have questions about our AI interview platform? We're here to help you succeed.</p>

                                    <form onSubmit={this.handleContactSubmit}>
                                        {this.state.contactStatus.success && (
                                            <div className="alert alert-success mb-4" role="alert">
                                                Message sent successfully! We'll get back to you soon.
                                            </div>
                                        )}
                                        {this.state.contactStatus.error && (
                                            <div className="alert alert-danger mb-4" role="alert">
                                                {this.state.contactStatus.error}
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark p-3 rounded-3"
                                                name="fullName"
                                                value={this.state.contactForm.fullName}
                                                onChange={this.handleContactChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-dark p-3 rounded-3"
                                                name="email"
                                                value={this.state.contactForm.email}
                                                onChange={this.handleContactChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark p-3 rounded-3"
                                                name="subject"
                                                value={this.state.contactForm.subject}
                                                onChange={this.handleContactChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-light small fw-bold">Message</label>
                                            <textarea
                                                className="form-control form-control-dark p-3 rounded-3"
                                                rows="4"
                                                name="message"
                                                value={this.state.contactForm.message}
                                                onChange={this.handleContactChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg"
                                            disabled={this.state.contactStatus.loading}
                                        >
                                            {this.state.contactStatus.loading ? 'Sending...' : 'Send Message'}
                                            {!this.state.contactStatus.loading && <i className="bi bi-arrow-right ms-2"></i>}
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
                <Footer />
            </div>
        )
    }
}

// HOC to wrap the class component and provide navigate functionality
function HomeWithNavigate(props) {
    const navigate = useNavigate();
    const location = useLocation();
    return <Home {...props} navigate={navigate} location={location} />;
}

export default HomeWithNavigate;