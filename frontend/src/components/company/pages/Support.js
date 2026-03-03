import React, { useState, useEffect } from 'react';
import './Support.css';
import Loader from '../../common/Loader';

const Support = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'technical',
        priority: 'medium',
        description: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // FAQ Categories
    const categories = [
        { key: 'all', label: 'All Topics', icon: 'bi-grid-fill' },
        { key: 'account', label: 'Company Profile', icon: 'bi-building' },
        { key: 'interview', label: 'Interviews', icon: 'bi-camera-video' },
        { key: 'candidates', label: 'Candidates', icon: 'bi-people' },
        { key: 'technical', label: 'Technical', icon: 'bi-gear' },
        { key: 'billing', label: 'Billing', icon: 'bi-credit-card' }
    ];

    // FAQ Data
    const faqs = [
        {
            id: 1,
            category: 'account',
            question: 'How do I update my company profile?',
            answer: 'You can update your company profile by navigating to Settings > Company Profile. Update your logo, description, and website to make your company more attractive to candidates.'
        },
        {
            id: 2,
            category: 'account',
            question: 'How do I invite team members?',
            answer: 'Go to the Users section in your dashboard. Click "Invite User", enter their email address, and select their role (Admin or Reviewer). They will receive an email invitation to join your workspace.'
        },
        {
            id: 3,
            category: 'interview',
            question: 'How do I create a new interview?',
            answer: 'Navigate to "Interviews" or "Jobs" and click "Create New". You can select predefined skills or create custom ones, set the duration, and the AI will automatically generate relevant questions.'
        },
        {
            id: 4,
            category: 'interview',
            question: 'Can I view the candidate\'s actual recording?',
            answer: 'Yes, once a candidate completes their interview, you can view the full recording, AI transcription, and behavior analysis in the Results section.'
        },
        {
            id: 5,
            category: 'interview',
            question: 'How is the integrity score calculated?',
            answer: 'Our AI monitors several factors including tab switching, face tracking, multiple persons in frame, and background noise. These are combined to generate a comprehensive integrity score.'
        },
        {
            id: 6,
            category: 'candidates',
            question: 'How do I invite candidates to take an interview?',
            answer: 'You can either share a public link for the job posting, or directly invite candidates by entering their email addresses or uploading a CSV file in the Candidates section.'
        },
        {
            id: 7,
            category: 'candidates',
            question: 'How do I filter candidates based on AI score?',
            answer: 'In the Candidates or Leaderboard view, you can use the filter options to sort candidates by their overall AI score, technical score, or communication skills.'
        },
        {
            id: 8,
            category: 'technical',
            question: 'Why are candidate recordings not playing?',
            answer: 'Ensure you are using a modern browser (Chrome, Firefox, Safari, or Edge) and have a stable internet connection. If the issue persists, clear your browser cache or contact support.'
        },
        {
            id: 9,
            category: 'technical',
            question: 'Can I integrate NextOffer with my ATS?',
            answer: 'Yes, NextOffer provides API access and integrations with major ATS platforms like Workable, Greenhouse, and Lever on our Enterprise plan. Check our developer docs for more info.'
        },
        {
            id: 10,
            category: 'billing',
            question: 'How does pricing work?',
            answer: 'We offer flexible pricing plans based on the number of interviews or active jobs per month. You can start with our Pay-As-You-Go plan or switch to an Annual subscription for volume discounts.'
        },
        {
            id: 11,
            category: 'billing',
            question: 'How do I upgrade my plan?',
            answer: 'Navigate to Settings > Billing and click "Upgrade Plan". Select the plan that fits your hiring needs. Upgrades take effect immediately.'
        }
    ];

    // Quick Actions
    const quickActions = [
        {
            title: 'Schedule a Demo',
            description: 'Learn how to use NextOffer effectively',
            icon: 'bi-camera-video',
            action: 'Schedule',
            color: 'primary'
        },
        {
            title: 'Report a Bug',
            description: 'Help us improve by reporting issues',
            icon: 'bi-bug',
            action: 'Report',
            color: 'danger'
        },
        {
            title: 'Feature Request',
            description: 'Suggest new features you\'d like to see',
            icon: 'bi-lightbulb',
            action: 'Request',
            color: 'warning'
        },
        {
            title: 'Video Tutorials',
            description: 'Watch step-by-step guides',
            icon: 'bi-play-circle',
            action: 'Watch',
            color: 'success'
        }
    ];

    // Support Stats
    const supportStats = [
        { label: 'Avg Response Time', value: '< 2 hours', icon: 'bi-clock-history' },
        { label: 'Articles', value: '150+', icon: 'bi-journal-text' },
        { label: 'Video Guides', value: '50+', icon: 'bi-camera-video' },
        { label: 'Satisfaction Rate', value: '98%', icon: 'bi-emoji-smile' }
    ];

    // Contact Methods
    const contactMethods = [
        {
            title: 'Live Chat',
            description: 'Chat with our support team',
            icon: 'bi-chat-dots',
            availability: 'Available 24/7',
            color: 'primary'
        },
        {
            title: 'Email Support',
            description: 'support@nextoffer.com',
            icon: 'bi-envelope',
            availability: 'Response within 2 hours',
            color: 'info'
        },
        {
            title: 'Phone Support',
            description: '+1 (555) 123-4567',
            icon: 'bi-telephone',
            availability: 'Mon-Fri, 9AM-6PM EST',
            color: 'success'
        },
        {
            title: 'Community Forum',
            description: 'Ask the community',
            icon: 'bi-people',
            availability: 'Active community',
            color: 'warning'
        }
    ];

    const getFilteredFaqs = () => {
        let filtered = faqs;

        if (activeCategory !== 'all') {
            filtered = filtered.filter(faq => faq.category === activeCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        console.log('Support ticket submitted:', ticketForm);
        // Reset form
        setTicketForm({
            subject: '',
            category: 'technical',
            priority: 'medium',
            description: ''
        });
        alert('Support ticket submitted successfully! We\'ll get back to you soon.');
    };

    const filteredFaqs = getFilteredFaqs();

    if (loading) return <Loader inline />;

    return (
        <div className="help-support-container dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4 border-0 pb-0">
                <div>
                    <h1 className="page-title">Support & Feedback</h1>
                    <p className="text-muted">Search our knowledge base or contact support</p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="help-hero">
                <h1>How can we help your team?</h1>
                <p>Find answers to common questions or get in touch</p>
                <div className="search-bar">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Search for help articles, FAQs, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Support Stats */}
            <div className="support-stats">
                {supportStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <i className={`bi ${stat.icon}`}></i>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <div key={index} className={`action-card ${action.color}`}>
                            <div className="action-icon">
                                <i className={`bi ${action.icon}`}></i>
                            </div>
                            <h4>{action.title}</h4>
                            <p>{action.description}</p>
                            <button className={`btn btn-${action.color}`}>
                                {action.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="section">
                <h2>
                    <i className="bi bi-question-circle me-2 text-primary"></i>
                    Frequently Asked Questions
                </h2>

                {/* Category Filters */}
                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            <i className={`bi ${cat.icon}`}></i>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="faq-list">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map(faq => (
                            <div
                                key={faq.id}
                                className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <h4>{faq.question}</h4>
                                    <i className={`bi bi-chevron-${expandedFaq === faq.id ? 'up' : 'down'}`}></i>
                                </div>
                                {expandedFaq === faq.id && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <i className="bi bi-search display-4"></i>
                            <h5 className="mt-3">No results found</h5>
                            <p className="text-muted">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Methods */}
            <div className="section">
                <h2>
                    <i className="bi bi-headset me-2 text-primary"></i>
                    Contact Support
                </h2>
                <div className="contact-methods-grid">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="contact-card">
                            <div className={`contact-icon ${method.color}`}>
                                <i className={`bi ${method.icon}`}></i>
                            </div>
                            <h4>{method.title}</h4>
                            <p className="contact-description">{method.description}</p>
                            <span className="availability">{method.availability}</span>
                            <button className={`btn btn-outline-${method.color}`}>
                                Contact
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Ticket */}
            <div className="section">
                <h2>
                    <i className="bi bi-ticket-detailed me-2 text-primary"></i>
                    Submit a Support Ticket
                </h2>
                <div className="ticket-form-container">
                    <form className="ticket-form" onSubmit={handleTicketSubmit}>
                        <div className="form-row">
                            <div className="form-group flex-grow-1">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    placeholder="Brief description of your issue"
                                    value={ticketForm.subject}
                                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-grow-1">
                                <label>Category *</label>
                                <select
                                    value={ticketForm.category}
                                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                                    required
                                >
                                    <option value="technical">Technical Issue</option>
                                    <option value="account">Account & Billing</option>
                                    <option value="interview">Interview Related</option>
                                    <option value="candidates">Candidate Management</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group flex-grow-1">
                                <label>Priority *</label>
                                <select
                                    value={ticketForm.priority}
                                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group w-100">
                            <label>Description *</label>
                            <textarea
                                placeholder="Please describe your issue in detail..."
                                rows="6"
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions mt-3">
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-send me-2"></i>
                                Submit Ticket
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => setTicketForm({
                                    subject: '',
                                    category: 'technical',
                                    priority: 'medium',
                                    description: ''
                                })}
                            >
                                Clear
                            </button>
                        </div>
                    </form>

                    <div className="ticket-info">
                        <div className="info-card mb-4">
                            <i className="bi bi-info-circle mb-2 d-block fs-3 text-primary"></i>
                            <h4>What to expect</h4>
                            <ul className="mb-0">
                                <li>We'll respond within 2 hours</li>
                                <li>You'll receive email updates</li>
                                <li>Track ticket status with our team</li>
                                <li>Average resolution time: 24 hours</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <i className="bi bi-lightbulb mb-2 d-block fs-3 text-warning"></i>
                            <h4>Tips for faster resolution</h4>
                            <ul className="mb-0">
                                <li>Be specific and detailed</li>
                                <li>Include screenshots if applicable</li>
                                <li>Mention browser and OS version</li>
                                <li>List steps to reproduce the issue</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resources */}
            <div className="section mb-5">
                <h2>
                    <i className="bi bi-book me-2 text-primary"></i>
                    Additional Resources
                </h2>
                <div className="resources-grid">
                    <a href="#" className="resource-card mb-2 d-block text-decoration-none">
                        <i className="bi bi-file-earmark-pdf mb-3 d-block text-danger fs-1"></i>
                        <h4>User Guide</h4>
                        <p className="text-muted">Complete platform documentation</p>
                    </a>
                    <a href="#" className="resource-card mb-2 d-block text-decoration-none">
                        <i className="bi bi-play-btn mb-3 d-block text-success fs-1"></i>
                        <h4>Video Tutorials</h4>
                        <p className="text-muted">Step-by-step video guides</p>
                    </a>
                    <a href="#" className="resource-card mb-2 d-block text-decoration-none">
                        <i className="bi bi-chat-square-text mb-3 d-block text-info fs-1"></i>
                        <h4>Community Forum</h4>
                        <p className="text-muted">Connect with other companies</p>
                    </a>
                    <a href="#" className="resource-card mb-2 d-block text-decoration-none">
                        <i className="bi bi-newspaper mb-3 d-block text-warning fs-1"></i>
                        <h4>What's New</h4>
                        <p className="text-muted">Latest updates and features</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Support;
