import React, { useState, useEffect } from 'react';
import './Support.css';
import Loader from '../../common/Loader';

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
            case 'New': return 'bg-danger';
            case 'Read': return 'bg-info';
            case 'Resolved': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Support & Feedback</h1>
                    <p className="text-muted">Manage support tickets, user feedback, and bug reports</p>
                </div>
            </div>

            {/* Support Tickets Main Area */}
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">All Contact Submissions</h5>
                            <div className="d-flex gap-2">
                                <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                    <option>All Status</option>
                                    <option>New</option>
                                    <option>Read</option>
                                    <option>Resolved</option>
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
                                    <h5 className="card-title mb-0">Message Details</h5>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedTicket(null)}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="mb-3">
                                        <div className="d-flex gap-2 mb-3">
                                            <span className={`badge ${getStatusBadgeClass(selectedTicket.status)}`}>
                                                {selectedTicket.status || 'New'}
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
                                                <div className="text-light text-truncate" title={selectedTicket.id}>{selectedTicket.id.substring(0, 10)}...</div>
                                            </div>
                                            <div className="info-item">
                                                <label className="text-muted small">Created</label>
                                                <div className="text-light">{selectedTicket.created}</div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="text-muted small mb-2 d-block">Message</label>
                                            <div className="bg-dark bg-opacity-25 p-3 rounded-3 border border-secondary border-opacity-25" style={{ whiteSpace: 'pre-wrap' }}>
                                                <p className="text-light mb-0">{selectedTicket.description}</p>
                                            </div>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <a href={`mailto:${selectedTicket.userEmail}?subject=Re: ${selectedTicket.subject}`} className="btn btn-primary">
                                                <i className="bi bi-reply me-2"></i>Reply via Email
                                            </a>

                                            {selectedTicket.status !== 'Resolved' && (
                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={() => handleStatusUpdate(selectedTicket.id, 'Resolved')}
                                                >
                                                    <i className="bi bi-check-circle me-2"></i>Mark as Resolved
                                                </button>
                                            )}

                                            {selectedTicket.status !== 'Read' && selectedTicket.status !== 'Resolved' && (
                                                <button
                                                    className="btn btn-outline-info"
                                                    onClick={() => handleStatusUpdate(selectedTicket.id, 'Read')}
                                                >
                                                    <i className="bi bi-eye me-2"></i>Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-5 text-center">
                                <i className="bi bi-envelope-paper fs-1 text-muted mb-3 d-block"></i>
                                <p className="text-muted">Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Support;
