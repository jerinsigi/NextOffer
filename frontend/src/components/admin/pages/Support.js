import React, { useState, useEffect } from 'react';
import './Support.css';

const Support = () => {
    const [activeTab, setActiveTab] = useState('tickets');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contact');
            if (response.ok) {
                const data = await response.json();
                const formattedTickets = data.map(submission => ({
                    id: submission._id,
                    user: submission.fullName,
                    userEmail: submission.email,
                    company: 'Public User',
                    subject: submission.subject,
                    category: 'General Inquiry',
                    priority: 'Medium',
                    status: submission.status,
                    created: new Date(submission.createdAt).toLocaleString(),
                    lastUpdated: new Date(submission.createdAt).toLocaleString(),
                    messages: 1,
                    description: submission.message,
                    assignee: 'Unassigned'
                }));
                setTickets(formattedTickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
            // Hardcoded tickets removed in favor of dynamic data
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setTickets(prevTickets => prevTickets.map(ticket =>
                    ticket.id === id ? { ...ticket, status: newStatus } : ticket
                ));

                if (selectedTicket && selectedTicket.id === id) {
                    setSelectedTicket(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const feedback = [
        {
            id: 'FB-0089',
            user: 'Emma Wilson',
            userEmail: 'emma.w@techstart.com',
            company: 'TechStart',
            rating: 5,
            category: 'Platform',
            subject: 'Excellent AI interview quality',
            message: 'The AI interviewer asks really relevant questions based on the resume. Our hiring quality has improved significantly!',
            created: '2025-12-06 11:00 AM',
            status: 'New'
        },
        {
            id: 'FB-0088',
            user: 'David Chen',
            userEmail: 'david@futuretech.com',
            company: 'FutureTech',
            rating: 4,
            category: 'Feature',
            subject: 'Love the integrity monitoring',
            message: 'The integrity detection is great, but would love to see more detailed reports on candidate behavior patterns.',
            created: '2025-12-06 09:30 AM',
            status: 'Reviewed'
        },
        {
            id: 'FB-0087',
            user: 'Lisa Martinez',
            userEmail: 'lisa.m@datawise.com',
            company: 'DataWise',
            rating: 3,
            category: 'UI/UX',
            subject: 'Dashboard could be more intuitive',
            message: 'Some features are hard to find. A guided tour for new users would be helpful.',
            created: '2025-12-05 03:20 PM',
            status: 'Reviewed'
        },
        {
            id: 'FB-0086',
            user: 'James Taylor',
            userEmail: 'james@cloudnine.io',
            company: 'CloudNine',
            rating: 5,
            category: 'Platform',
            subject: 'Game changer for remote hiring',
            message: 'This platform has completely transformed our remote hiring process. Highly recommend!',
            created: '2025-12-05 01:15 PM',
            status: 'Archived'
        }
    ];

    const bugReports = [
        {
            id: 'BUG-0234',
            user: 'Tech Admin',
            userEmail: 'admin@techcorp.com',
            severity: 'Critical',
            status: 'Open',
            subject: 'Interview recording not saving',
            description: 'Interview sessions complete but video recordings are not being saved to the database.',
            created: '2025-12-06 10:00 AM',
            browser: 'Chrome 120',
            os: 'Windows 11'
        },
        {
            id: 'BUG-0233',
            user: 'Sarah K.',
            userEmail: 'sarah@startup.com',
            severity: 'Medium',
            status: 'In Progress',
            subject: 'Export button not working on Safari',
            description: 'The export to CSV button on the leaderboard page does not work on Safari browser.',
            created: '2025-12-06 08:45 AM',
            browser: 'Safari 17',
            os: 'macOS Sonoma'
        },
        {
            id: 'BUG-0232',
            user: 'Mike R.',
            userEmail: 'mike@dataco.com',
            severity: 'Low',
            status: 'Resolved',
            subject: 'Typo in email notification',
            description: 'There is a spelling error in the interview completion email template.',
            created: '2025-12-05 02:30 PM',
            browser: 'N/A',
            os: 'N/A'
        }
    ];

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'High': return 'bg-danger';
            case 'Medium': return 'bg-warning';
            case 'Low': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Open': return 'bg-danger';
            case 'In Progress': return 'bg-warning';
            case 'Under Review': return 'bg-info';
            case 'Resolved': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
            ></i>
        ));
    };

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Support & Feedback</h1>
                    <p className="text-muted">Manage support tickets, user feedback, and bug reports</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-download me-2"></i>Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-danger bg-opacity-20 text-danger">
                            <i className="bi bi-ticket-detailed fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Open Tickets</div>
                            <div className="stat-value">3</div>
                            <div className="stat-change negative">
                                <i className="bi bi-arrow-up"></i> 2 new today
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                            <i className="bi bi-clock-history fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Avg Response Time</div>
                            <div className="stat-value">2.5h</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-down"></i> 15% faster
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-success bg-opacity-20 text-success">
                            <i className="bi bi-chat-heart fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">New Feedback</div>
                            <div className="stat-value">12</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 4.5 avg rating
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-bug fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active Bugs</div>
                            <div className="stat-value">8</div>
                            <div className="stat-change negative">
                                <i className="bi bi-arrow-up"></i> 2 critical
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="support-tabs mb-4">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tickets')}
                        >
                            <i className="bi bi-ticket-detailed me-2"></i>
                            Support Tickets
                            <span className="badge bg-danger ms-2">3</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'feedback' ? 'active' : ''}`}
                            onClick={() => setActiveTab('feedback')}
                        >
                            <i className="bi bi-chat-heart me-2"></i>
                            User Feedback
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'bugs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bugs')}
                        >
                            <i className="bi bi-bug me-2"></i>
                            Bug Reports
                            <span className="badge bg-warning ms-2">2</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Support Tickets Tab */}
            {activeTab === 'tickets' && (
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="dashboard-card">
                            <div className="card-header-custom">
                                <h5 className="card-title mb-0">All Support Tickets</h5>
                                <div className="d-flex gap-2">
                                    <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                        <option>All Status</option>
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>
                                    </select>
                                    <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                        <option>All Priority</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ticket-list">
                                {tickets.map(ticket => (
                                    <div
                                        key={ticket.id}
                                        className={`ticket-item ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="ticket-id text-muted">{ticket.id}</span>
                                                    <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                                                        {ticket.priority}
                                                    </span>
                                                    <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <h6 className="ticket-subject mb-1">{ticket.subject}</h6>
                                                <div className="ticket-meta">
                                                    <span><i className="bi bi-person me-1"></i>{ticket.user}</span>
                                                    <span><i className="bi bi-building me-1"></i>{ticket.company}</span>
                                                    <span><i className="bi bi-tag me-1"></i>{ticket.category}</span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <small className="text-muted d-block">{ticket.created}</small>
                                                <span className="badge bg-primary bg-opacity-20 text-primary">
                                                    <i className="bi bi-chat-dots me-1"></i>{ticket.messages}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ticket Details Panel */}
                    <div className="col-lg-5">
                        <div className="dashboard-card sticky-top" style={{ top: '90px' }}>
                            {selectedTicket ? (
                                <>
                                    <div className="card-header-custom">
                                        <h5 className="card-title mb-0">Ticket Details</h5>
                                        <button className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <div className="d-flex gap-2 mb-3">
                                                <span className={`badge ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                                                    {selectedTicket.priority} Priority
                                                </span>
                                                <span className={`badge ${getStatusBadgeClass(selectedTicket.status)}`}>
                                                    {selectedTicket.status}
                                                </span>
                                            </div>
                                            <h5 className="text-light mb-3">{selectedTicket.subject}</h5>

                                            <div className="ticket-info-grid mb-4">
                                                <div className="info-item">
                                                    <label className="text-muted small">Full Name</label>
                                                    <div className="text-light">{selectedTicket.user}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Email Address</label>
                                                    <div className="text-light">{selectedTicket.userEmail}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Ticket ID</label>
                                                    <div className="text-light">{selectedTicket.id}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Created</label>
                                                    <div className="text-light">{selectedTicket.created}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="text-muted small mb-2 d-block">Message</label>
                                                <div className="bg-dark bg-opacity-25 p-3 rounded-3 border border-secondary border-opacity-25">
                                                    <p className="text-light mb-0">{selectedTicket.description}</p>
                                                </div>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button className="btn btn-primary">
                                                    <i className="bi bi-reply me-2"></i>Reply to Ticket
                                                </button>
                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={() => handleStatusUpdate(selectedTicket.id, 'Resolved')}
                                                >
                                                    <i className="bi bi-check-circle me-2"></i>Mark as Resolved
                                                </button>
                                                <button className="btn btn-outline-warning">
                                                    <i className="bi bi-person-plus me-2"></i>Assign to Team
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-5 text-center">
                                    <i className="bi bi-ticket-detailed fs-1 text-muted mb-3 d-block"></i>
                                    <p className="text-muted">Select a ticket to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* User Feedback Tab */}
            {activeTab === 'feedback' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">User Feedback</h5>
                        <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                            <option>All Ratings</option>
                            <option>5 Stars</option>
                            <option>4 Stars</option>
                            <option>3 Stars</option>
                            <option>2 Stars</option>
                            <option>1 Star</option>
                        </select>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            {feedback.map(item => (
                                <div key={item.id} className="col-md-6">
                                    <div className="feedback-card">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <div className="mb-2">
                                                    {renderStars(item.rating)}
                                                </div>
                                                <h6 className="text-light mb-1">{item.subject}</h6>
                                                <small className="text-muted">{item.id}</small>
                                            </div>
                                            <span className={`badge ${item.status === 'New' ? 'bg-primary' : item.status === 'Reviewed' ? 'bg-success' : 'bg-secondary'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-light mb-3">{item.message}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-muted d-block">{item.user} - {item.company}</small>
                                                <small className="text-muted">{item.created}</small>
                                            </div>
                                            <span className="badge bg-info bg-opacity-20 text-info">{item.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bug Reports Tab */}
            {activeTab === 'bugs' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Bug Reports</h5>
                        <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                            <option>All Severity</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Bug ID</th>
                                    <th>Subject</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Reporter</th>
                                    <th>Environment</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bugReports.map(bug => (
                                    <tr key={bug.id}>
                                        <td><span className="text-primary">{bug.id}</span></td>
                                        <td>{bug.subject}</td>
                                        <td>
                                            <span className={`badge ${bug.severity === 'Critical' ? 'bg-danger' :
                                                bug.severity === 'High' ? 'bg-warning' :
                                                    bug.severity === 'Medium' ? 'bg-info' : 'bg-secondary'
                                                }`}>
                                                {bug.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(bug.status)}`}>
                                                {bug.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div>{bug.user}</div>
                                            <small className="text-muted">{bug.userEmail}</small>
                                        </td>
                                        <td>
                                            <div><small>{bug.browser}</small></div>
                                            <small className="text-muted">{bug.os}</small>
                                        </td>
                                        <td>{bug.created}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-primary">
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-success">
                                                    <i className="bi bi-check"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;
