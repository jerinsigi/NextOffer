import React, { useState } from 'react';
import './HelpSupport.css';

const HelpSupport = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'technical',
        priority: 'medium',
        description: ''
    });

    // FAQ Categories
    const categories = [
        { key: 'all', label: 'All Topics', icon: 'fa-th' },
        { key: 'account', label: 'Account', icon: 'fa-user-circle' },
        { key: 'interview', label: 'Interviews', icon: 'fa-video' },
        { key: 'application', label: 'Applications', icon: 'fa-file-alt' },
        { key: 'technical', label: 'Technical', icon: 'fa-cog' },
        { key: 'billing', label: 'Billing', icon: 'fa-credit-card' }
    ];

    // FAQ Data
    const faqs = [
        {
            id: 1,
            category: 'account',
            question: 'How do I update my profile information?',
            answer: 'You can update your profile by navigating to Settings > Profile. Click on any field to edit it, then save your changes. Make sure to keep your resume and skills up to date for better job matches.'
        },
        {
            id: 2,
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link expires in 24 hours for security purposes.'
        },
        {
            id: 3,
            category: 'interview',
            question: 'What are the system requirements for AI interviews?',
            answer: 'You need a webcam, microphone, stable internet connection (minimum 5 Mbps), and a modern browser (Chrome, Firefox, or Edge). Make sure to allow camera and microphone permissions when prompted.'
        },
        {
            id: 4,
            category: 'interview',
            question: 'Can I reschedule an interview?',
            answer: 'Yes, you can reschedule an interview up to 24 hours before the scheduled time. Go to My Applications, find the interview, and click "Reschedule". Note that you can only reschedule once per application.'
        },
        {
            id: 5,
            category: 'interview',
            question: 'How does the AI interview process work?',
            answer: 'Our AI analyzes your resume and generates personalized questions. The interview is recorded and evaluated based on technical accuracy, communication skills, problem-solving ability, and code quality. You\'ll receive detailed feedback within 24-48 hours.'
        },
        {
            id: 6,
            category: 'interview',
            question: 'What happens if my interview gets disconnected?',
            answer: 'If you experience a technical issue during the interview, you\'ll have the option to reconnect within 5 minutes. The system saves your progress, and you can continue from where you left off. Contact support if issues persist.'
        },
        {
            id: 7,
            category: 'application',
            question: 'How do I track my application status?',
            answer: 'Visit the "My Applications" page to see all your applications and their current status. You\'ll also receive email notifications and in-app notifications whenever there\'s a status update.'
        },
        {
            id: 8,
            category: 'application',
            question: 'Can I withdraw an application?',
            answer: 'Yes, you can withdraw an application at any time before the interview stage. Go to My Applications, select the application, and click "Withdraw". This action cannot be undone.'
        },
        {
            id: 9,
            category: 'technical',
            question: 'Why can\'t I access the interview page?',
            answer: 'This could be due to browser compatibility, blocked permissions, or network issues. Try using Chrome or Firefox, clear your browser cache, ensure camera/microphone permissions are granted, and check your internet connection.'
        },
        {
            id: 10,
            category: 'technical',
            question: 'My video is not working during practice sessions',
            answer: 'First, check if your browser has camera permissions enabled. Go to browser settings > Privacy > Camera and allow access for this site. Also, ensure no other application is using your camera.'
        },
        {
            id: 11,
            category: 'billing',
            question: 'Is NextOffer free to use?',
            answer: 'NextOffer offers both free and premium plans. The free plan includes basic job search, limited applications, and practice interviews. Premium plans offer unlimited applications, priority support, and advanced analytics.'
        },
        {
            id: 12,
            category: 'billing',
            question: 'How do I upgrade to premium?',
            answer: 'Go to Settings > Subscription and choose a premium plan. We accept all major credit cards and offer monthly or annual billing options. Annual plans come with a 20% discount.'
        }
    ];

    // Quick Actions
    const quickActions = [
        {
            title: 'Schedule a Demo',
            description: 'Learn how to use NextOffer effectively',
            icon: '🎥',
            action: 'Schedule',
            color: 'primary'
        },
        {
            title: 'Report a Bug',
            description: 'Help us improve by reporting issues',
            icon: '🐛',
            action: 'Report',
            color: 'danger'
        },
        {
            title: 'Feature Request',
            description: 'Suggest new features you\'d like to see',
            icon: '💡',
            action: 'Request',
            color: 'warning'
        },
        {
            title: 'Video Tutorials',
            description: 'Watch step-by-step guides',
            icon: '📚',
            action: 'Watch',
            color: 'success'
        }
    ];

    // Support Stats
    const supportStats = [
        { label: 'Avg Response Time', value: '< 2 hours', icon: 'fa-clock' },
        { label: 'Articles', value: '150+', icon: 'fa-book' },
        { label: 'Video Guides', value: '50+', icon: 'fa-video' },
        { label: 'Satisfaction Rate', value: '98%', icon: 'fa-smile' }
    ];

    // Contact Methods
    const contactMethods = [
        {
            title: 'Live Chat',
            description: 'Chat with our support team',
            icon: 'fa-comments',
            availability: 'Available 24/7',
            color: 'primary'
        },
        {
            title: 'Email Support',
            description: 'support@nextoffer.com',
            icon: 'fa-envelope',
            availability: 'Response within 2 hours',
            color: 'info'
        },
        {
            title: 'Phone Support',
            description: '+1 (555) 123-4567',
            icon: 'fa-phone',
            availability: 'Mon-Fri, 9AM-6PM EST',
            color: 'success'
        },
        {
            title: 'Community Forum',
            description: 'Ask the community',
            icon: 'fa-users',
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

    return (
        <div className="help-support-container">
            {/* Hero Section */}
            <div className="help-hero">
                <h1>How can we help you?</h1>
                <p>Search our knowledge base or contact support</p>
                <div className="search-bar">
                    <i className="fas fa-search"></i>
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
                        <i className={`fas ${stat.icon}`}></i>
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
                            <div className="action-icon">{action.icon}</div>
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
                    <i className="fas fa-question-circle me-2"></i>
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
                            <i className={`fas ${cat.icon}`}></i>
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
                                    <i className={`fas fa-chevron-${expandedFaq === faq.id ? 'up' : 'down'}`}></i>
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
                            <i className="fas fa-search fa-3x"></i>
                            <h5>No results found</h5>
                            <p className="text-muted">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Methods */}
            <div className="section">
                <h2>
                    <i className="fas fa-headset me-2"></i>
                    Contact Support
                </h2>
                <div className="contact-methods-grid">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="contact-card">
                            <div className={`contact-icon ${method.color}`}>
                                <i className={`fas ${method.icon}`}></i>
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
                    <i className="fas fa-ticket-alt me-2"></i>
                    Submit a Support Ticket
                </h2>
                <div className="ticket-form-container">
                    <form className="ticket-form" onSubmit={handleTicketSubmit}>
                        <div className="form-row">
                            <div className="form-group">
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
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    value={ticketForm.category}
                                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                                    required
                                >
                                    <option value="technical">Technical Issue</option>
                                    <option value="account">Account & Billing</option>
                                    <option value="interview">Interview Related</option>
                                    <option value="application">Application Status</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
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

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                placeholder="Please describe your issue in detail..."
                                rows="6"
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-paper-plane me-1"></i>
                                Submit Ticket
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
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
                        <div className="info-card">
                            <i className="fas fa-info-circle"></i>
                            <h4>What to expect</h4>
                            <ul>
                                <li>We'll respond within 2 hours</li>
                                <li>You'll receive email updates</li>
                                <li>Track ticket status in your dashboard</li>
                                <li>Average resolution time: 24 hours</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <i className="fas fa-lightbulb"></i>
                            <h4>Tips for faster resolution</h4>
                            <ul>
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
            <div className="section">
                <h2>
                    <i className="fas fa-book-open me-2"></i>
                    Additional Resources
                </h2>
                <div className="resources-grid">
                    <a href="#" className="resource-card">
                        <i className="fas fa-file-pdf"></i>
                        <h4>User Guide</h4>
                        <p>Complete platform documentation</p>
                    </a>
                    <a href="#" className="resource-card">
                        <i className="fas fa-play-circle"></i>
                        <h4>Video Tutorials</h4>
                        <p>Step-by-step video guides</p>
                    </a>
                    <a href="#" className="resource-card">
                        <i className="fas fa-comments"></i>
                        <h4>Community Forum</h4>
                        <p>Connect with other users</p>
                    </a>
                    <a href="#" className="resource-card">
                        <i className="fas fa-newspaper"></i>
                        <h4>What's New</h4>
                        <p>Latest updates and features</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
