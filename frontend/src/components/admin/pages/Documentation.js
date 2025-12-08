import React, { useState } from 'react';
import './Documentation.css';

const Documentation = () => {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchTerm, setSearchTerm] = useState('');

    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: 'bi-rocket-takeoff',
            content: [
                {
                    title: 'Welcome to NextOffer Admin',
                    description: 'This documentation will help you navigate and utilize all features of the NextOffer admin dashboard.',
                    items: [
                        'Dashboard Overview - Monitor key metrics and system health',
                        'Quick Actions - Access frequently used features',
                        'Navigation - Understanding the sidebar menu structure',
                        'User Roles - Admin, Super Admin, and their permissions'
                    ]
                },
                {
                    title: 'System Requirements',
                    description: 'Ensure your system meets the following requirements:',
                    items: [
                        'Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)',
                        'Minimum screen resolution: 1280x720',
                        'Stable internet connection',
                        'JavaScript enabled'
                    ]
                }
            ]
        },
        {
            id: 'user-management',
            title: 'User Management',
            icon: 'bi-people',
            content: [
                {
                    title: 'Managing Users',
                    description: 'Complete guide to user account management:',
                    items: [
                        'Create New Users - Add candidates, recruiters, or HR personnel',
                        'Edit User Profiles - Update user information and permissions',
                        'Suspend/Activate Accounts - Manage user access status',
                        'Reset Passwords - Help users regain account access',
                        'Delete Users - Permanently remove user accounts'
                    ]
                },
                {
                    title: 'User Roles & Permissions',
                    description: 'Understanding different user roles:',
                    items: [
                        'Candidate - Can take interviews and view their results',
                        'Recruiter - Can create jobs and review candidates',
                        'HR Manager - Full access to company data and reports',
                        'Admin - System-wide management capabilities',
                        'Super Admin - Complete system control and configuration'
                    ]
                }
            ]
        },
        {
            id: 'company-management',
            title: 'Company Management',
            icon: 'bi-building',
            content: [
                {
                    title: 'Company Accounts',
                    description: 'Managing registered companies:',
                    items: [
                        'Approve Registrations - Review and approve new company sign-ups',
                        'Company Profiles - View and edit company information',
                        'Subscription Management - Handle billing and plan changes',
                        'Activity Monitoring - Track company usage and engagement',
                        'Suspend/Terminate - Manage company account status'
                    ]
                },
                {
                    title: 'Company Settings',
                    description: 'Configure company-specific settings:',
                    items: [
                        'AI Interview Difficulty - Adjust question complexity',
                        'Branding Options - Company logo and color schemes',
                        'Email Templates - Customize automated communications',
                        'Integration Settings - Third-party service connections'
                    ]
                }
            ]
        },
        {
            id: 'job-management',
            title: 'Job Management',
            icon: 'bi-file-text',
            content: [
                {
                    title: 'Job Descriptions',
                    description: 'Managing job postings across the platform:',
                    items: [
                        'View All Jobs - Browse all job descriptions in the system',
                        'Job Status - Active, Draft, Closed, Paused states',
                        'Application Metrics - Track applications, shortlisted, interviewed',
                        'Job Settings - Edit requirements, skills, and descriptions',
                        'Close Jobs - Archive or delete job postings'
                    ]
                },
                {
                    title: 'Job Analytics',
                    description: 'Understanding job performance:',
                    items: [
                        'Application Rate - Number of candidates applying',
                        'Conversion Rate - Shortlist to hire ratio',
                        'Time to Fill - Average days to close a position',
                        'Quality Score - Candidate quality metrics'
                    ]
                }
            ]
        },
        {
            id: 'interview-monitoring',
            title: 'Interview Monitoring',
            icon: 'bi-camera-video',
            content: [
                {
                    title: 'Live Interview Tracking',
                    description: 'Monitor ongoing interviews in real-time:',
                    items: [
                        'Live Status - See currently active interviews',
                        'Progress Monitoring - Track interview completion',
                        'Integrity Score - Real-time violation detection',
                        'Terminate Interview - Emergency stop functionality',
                        'Recording Status - Verify recording is active'
                    ]
                },
                {
                    title: 'Interview Recordings',
                    description: 'Accessing and managing interview recordings:',
                    items: [
                        'View Recordings - Play back completed interviews',
                        'Download Videos - Save recordings locally',
                        'Timestamps - Navigate to specific questions',
                        'Transcripts - AI-generated interview transcripts',
                        'Storage Management - Archive or delete old recordings'
                    ]
                }
            ]
        },
        {
            id: 'integrity-compliance',
            title: 'Integrity & Compliance',
            icon: 'bi-shield-check',
            content: [
                {
                    title: 'Violation Monitoring',
                    description: 'Detecting and managing integrity violations:',
                    items: [
                        'Violation Types - Tab switching, multiple faces, unauthorized devices',
                        'Severity Levels - Critical, Moderate, Minor classifications',
                        'Automated Detection - AI-powered monitoring during interviews',
                        'Manual Review - Confirm or dismiss flagged violations',
                        'Evidence Collection - Screenshots and timestamps'
                    ]
                },
                {
                    title: 'Compliance Rules',
                    description: 'Configure integrity monitoring rules:',
                    items: [
                        'Tab Switch Detection - Monitor browser focus changes',
                        'Face Recognition - Ensure single person present',
                        'Audio Monitoring - Detect multiple voices',
                        'Screen Recording - Mandatory recording requirement',
                        'Threshold Settings - Configure sensitivity levels'
                    ]
                },
                {
                    title: 'Compliance Analytics',
                    description: 'Track integrity metrics:',
                    items: [
                        'Violation Breakdown - Statistics by type and severity',
                        'Trend Analysis - Violation patterns over time',
                        'Company Comparison - Identify high-risk organizations',
                        'Candidate Behavior - Red flag identification'
                    ]
                }
            ]
        },
        {
            id: 'reports-analytics',
            title: 'Reports & Analytics',
            icon: 'bi-graph-up',
            content: [
                {
                    title: 'System Reports',
                    description: 'Generate comprehensive system reports:',
                    items: [
                        'User Activity Reports - Login history, engagement metrics',
                        'Company Performance - Usage statistics and ROI',
                        'Interview Analytics - Completion rates, quality scores',
                        'Integrity Reports - Violation summaries and trends',
                        'Financial Reports - Subscription revenue and forecasts'
                    ]
                },
                {
                    title: 'Custom Reports',
                    description: 'Create tailored reports:',
                    items: [
                        'Date Range Selection - Filter by specific timeframes',
                        'Metric Selection - Choose relevant KPIs',
                        'Export Options - PDF, Excel, CSV formats',
                        'Scheduled Reports - Automated email delivery',
                        'Report Templates - Save frequently used configurations'
                    ]
                }
            ]
        },
        {
            id: 'system-settings',
            title: 'System Settings',
            icon: 'bi-gear',
            content: [
                {
                    title: 'Platform Configuration',
                    description: 'Core system settings:',
                    items: [
                        'Email Configuration - SMTP settings and templates',
                        'Security Settings - Password policies, session timeouts',
                        'AI Model Settings - Interview difficulty, grading algorithms',
                        'Storage Settings - File upload limits, retention policies',
                        'API Configuration - Rate limits, webhook endpoints'
                    ]
                },
                {
                    title: 'Appearance Settings',
                    description: 'Customize platform appearance:',
                    items: [
                        'Logo Upload - Platform branding',
                        'Color Scheme - Primary and accent colors',
                        'Email Branding - Customize automated emails',
                        'Terms & Policies - Update legal documents'
                    ]
                }
            ]
        },
        {
            id: 'logs-audit',
            title: 'Logs & Audit',
            icon: 'bi-file-earmark-text',
            content: [
                {
                    title: 'Activity Logs',
                    description: 'Track all system activities:',
                    items: [
                        'User Actions - Login, logout, profile changes',
                        'Admin Actions - Configuration changes, user management',
                        'System Events - Automated tasks, scheduled jobs',
                        'API Calls - External service interactions',
                        'Error Logs - System errors and warnings'
                    ]
                },
                {
                    title: 'Audit Trail',
                    description: 'Maintain compliance audit trails:',
                    items: [
                        'Data Changes - Who changed what and when',
                        'Security Events - Failed logins, permission changes',
                        'Export Logs - Download for external audit',
                        'Log Retention - Configure storage duration',
                        'Search & Filter - Find specific log entries'
                    ]
                }
            ]
        },
        {
            id: 'support',
            title: 'Support & Troubleshooting',
            icon: 'bi-headset',
            content: [
                {
                    title: 'Common Issues',
                    description: 'Solutions to frequently encountered problems:',
                    items: [
                        'Login Issues - Password reset, account lockout resolution',
                        'Recording Failures - Camera/microphone permission problems',
                        'Performance Issues - Slow loading, timeout errors',
                        'Integration Problems - Third-party service connection issues',
                        'Email Delivery - SMTP configuration troubleshooting'
                    ]
                },
                {
                    title: 'Getting Help',
                    description: 'How to contact support:',
                    items: [
                        'Support Tickets - Submit detailed issue reports',
                        'Live Chat - Real-time assistance during business hours',
                        'Email Support - support@nextoffer.com',
                        'Phone Support - Available for enterprise customers',
                        'Documentation - This comprehensive guide'
                    ]
                },
                {
                    title: 'Best Practices',
                    description: 'Recommended practices for optimal performance:',
                    items: [
                        'Regular Backups - Export important data regularly',
                        'Security Audits - Review logs and user permissions monthly',
                        'Browser Updates - Keep browser up to date',
                        'Clear Cache - Resolve display issues',
                        'Monitor Storage - Manage recording storage limits'
                    ]
                }
            ]
        },
        {
            id: 'api-reference',
            title: 'API Reference',
            icon: 'bi-code-square',
            content: [
                {
                    title: 'API Overview',
                    description: 'NextOffer provides RESTful APIs for integration:',
                    items: [
                        'Authentication - OAuth 2.0 and API key methods',
                        'Base URL - https://api.nextoffer.com/v1',
                        'Rate Limits - 1000 requests per hour',
                        'Response Format - JSON',
                        'Versioning - API version in URL path'
                    ]
                },
                {
                    title: 'Common Endpoints',
                    description: 'Frequently used API endpoints:',
                    items: [
                        'GET /users - List all users',
                        'POST /interviews - Create new interview',
                        'GET /interviews/:id - Get interview details',
                        'POST /jobs - Create job description',
                        'GET /reports - Generate reports'
                    ]
                }
            ]
        }
    ];

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.some(content =>
            content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const activeContent = sections.find(s => s.id === activeSection);

    return (
        <div className="documentation-page">
            <div className="documentation-header">
                <div className="header-content">
                    <h1>
                        <i className="bi bi-book me-3"></i>
                        Admin Documentation
                    </h1>
                    <p className="text-muted">
                        Complete guide to using the NextOffer admin dashboard
                    </p>
                </div>
                
                <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        className="form-control-dark"
                        placeholder="Search documentation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="documentation-container">
                {/* Sidebar Navigation */}
                <aside className="doc-sidebar">
                    <div className="sidebar-title">Contents</div>
                    <nav className="doc-nav">
                        {filteredSections.map(section => (
                            <button
                                key={section.id}
                                className={`doc-nav-item ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <i className={`bi ${section.icon} me-2`}></i>
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="doc-content">
                    {activeContent ? (
                        <>
                            <div className="doc-section-header">
                                <h2>
                                    <i className={`bi ${activeContent.icon} me-3`}></i>
                                    {activeContent.title}
                                </h2>
                            </div>

                            {activeContent.content.map((content, index) => (
                                <div key={index} className="doc-content-block">
                                    <h3>{content.title}</h3>
                                    <p className="content-description">{content.description}</p>
                                    <ul className="content-list">
                                        {content.items.map((item, idx) => (
                                            <li key={idx}>
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* Quick Links */}
                            <div className="doc-quick-links">
                                <h4>
                                    <i className="bi bi-link-45deg me-2"></i>
                                    Related Resources
                                </h4>
                                <div className="quick-links-grid">
                                    <a href="#!" className="quick-link-card">
                                        <i className="bi bi-youtube"></i>
                                        <span>Video Tutorials</span>
                                    </a>
                                    <a href="#!" className="quick-link-card">
                                        <i className="bi bi-file-earmark-pdf"></i>
                                        <span>PDF Guide</span>
                                    </a>
                                    <a href="#!" className="quick-link-card">
                                        <i className="bi bi-headset"></i>
                                        <span>Contact Support</span>
                                    </a>
                                    <a href="#!" className="quick-link-card">
                                        <i className="bi bi-chat-dots"></i>
                                        <span>Community Forum</span>
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-results">
                            <i className="bi bi-search fs-1 text-muted"></i>
                            <p>No documentation found matching your search.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Documentation;
