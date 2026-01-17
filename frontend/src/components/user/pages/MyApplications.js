import React, { useState, useEffect } from 'react';
import './MyApplications.css';

const MyApplications = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user applications from backend
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);

                // Get user from localStorage or sessionStorage
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

                if (!userStr) {
                    setError('User not logged in. Please login again.');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                const userEmail = user.email;

                if (!userEmail) {
                    setError('User email not found. Please login again.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/applications/user/${userEmail}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }

                const data = await response.json();
                setApplications(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Map backend status to frontend display
    const statusConfig = {
        'Applied': { label: 'Under Review', color: 'info', icon: 'bi-hourglass-split' },
        'Shortlisted': { label: 'Shortlisted', color: 'success', icon: 'bi-star-fill' },
        'Scheduled': { label: 'Interview Scheduled', color: 'warning', icon: 'bi-calendar-check' },
        'Interviewing': { label: 'Interview in Progress', color: 'primary', icon: 'bi-camera-video' },
        'Rejected': { label: 'Rejected', color: 'danger', icon: 'bi-x-circle' },
        'Hired': { label: 'Offer Received', color: 'success', icon: 'bi-check-circle-fill' },
        'not_interested': { label: 'Withdrawn', color: 'secondary', icon: 'bi-dash-circle' }
    };

    const getFilteredApplications = () => {
        let filtered = applications;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(app => app.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.Fk_job_id?.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.Fk_job_id?.Fk_company_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'company') {
                return (a.Fk_job_id?.Fk_company_id?.company_name || '').localeCompare(
                    b.Fk_job_id?.Fk_company_id?.company_name || ''
                );
            }
            return 0;
        });

        return filtered;
    };

    const filteredApplications = getFilteredApplications();

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'Applied').length,
        scheduled: applications.filter(a => ['Scheduled', 'Interviewing'].includes(a.status)).length,
        completed: applications.filter(a => ['Shortlisted', 'Hired'].includes(a.status)).length
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="applications-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">My Applications</h1>
                    <p className="text-muted">Track and manage your job applications</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">
                            <i className="bi bi-briefcase-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Applications</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-info">
                        <div className="stat-icon">
                            <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Review</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-warning">
                        <div className="stat-icon">
                            <i className="bi bi-calendar-check-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.scheduled}</div>
                            <div className="stat-label">Interviews Scheduled</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-success">
                        <div className="stat-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Shortlisted</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="filters-section mb-4">
                <div className="filters-bar">
                    <div className="filter-group">
                        <label className="filter-label">Status:</label>
                        <div className="status-filters">
                            <button
                                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'Scheduled' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('Scheduled')}
                            >
                                Scheduled
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'Applied' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('Applied')}
                            >
                                Review
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'Shortlisted' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('Shortlisted')}
                            >
                                Shortlisted
                            </button>
                        </div>
                    </div>

                    <div className="search-sort-group">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="company">Sort by Company</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="applications-list">
                {loading ? (
                    <div className="empty-state">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading your applications...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <i className="bi bi-exclamation-triangle fs-1 mb-3 text-danger"></i>
                        <h5>Error Loading Applications</h5>
                        <p className="text-muted">{error}</p>
                        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                            <i className="bi bi-arrow-clockwise me-2"></i>Retry
                        </button>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-inbox fs-1 mb-3"></i>
                        <h5>No applications found</h5>
                        <p className="text-muted">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    filteredApplications.map(app => {
                        const job = app.Fk_job_id || {};
                        const company = job.Fk_company_id || {};
                        const companyName = company.company_name || 'N/A';
                        const companyInitials = companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

                        return (
                            <div key={app._id} className="application-card">
                                <div className="application-header">
                                    <div className="company-info">
                                        <div className="company-logo">
                                            {company.logo ? (
                                                <img src={`http://localhost:5000${company.logo}`} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                companyInitials
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="job-title">{job.job_title || 'N/A'}</h5>
                                            <p className="company-name">
                                                <i className="bi bi-building me-2"></i>
                                                {companyName}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`status-badge status-${statusConfig[app.status]?.color || 'secondary'}`}>
                                        <i className={`bi ${statusConfig[app.status]?.icon || 'bi-circle'} me-2`}></i>
                                        {statusConfig[app.status]?.label || app.status}
                                    </span>
                                </div>

                                <div className="application-body">
                                    <div className="application-meta">
                                        <div className="meta-item">
                                            <i className="bi bi-geo-alt"></i>
                                            <span>{job.location || 'N/A'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="bi bi-clock"></i>
                                            <span>{job.type || 'N/A'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="bi bi-currency-dollar"></i>
                                            <span>{job.salary || 'N/A'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="bi bi-calendar"></i>
                                            <span>Applied: {formatDate(app.createdAt)}</span>
                                        </div>
                                    </div>

                                    {['Scheduled', 'Interviewing'].includes(app.status) && app.interviewDetails && (
                                        <div className="interview-alert">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-calendar-event fs-4 me-3"></i>
                                                <div>
                                                    <h6 className="mb-1">Interview Scheduled</h6>
                                                    <p className="mb-0 small">
                                                        {new Date(app.interviewDetails.started_at).toLocaleDateString(undefined, { dateStyle: 'medium' })} - {new Date(app.interviewDetails.ended_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                    </p>
                                                    <p className="mb-0 small text-muted">Please check your email for additional details.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback alert if no details but status is scheduled (e.g. old data) */}
                                    {['Scheduled', 'Interviewing'].includes(app.status) && !app.interviewDetails && (
                                        <div className="interview-alert">
                                            <i className="bi bi-exclamation-circle me-2"></i>
                                            <strong>Interview Scheduled</strong> - Please check your email for details
                                        </div>
                                    )}

                                    {app.coverLetter && (
                                        <div className="application-notes">
                                            <i className="bi bi-sticky me-2"></i>
                                            <span>{app.coverLetter}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="application-footer">
                                    <div className="action-buttons">
                                        {app.Fk_resume_id?.resume_path && (
                                            <a
                                                href={`http://localhost:5000${app.Fk_resume_id.resume_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary"
                                            >
                                                <i className="bi bi-file-earmark-pdf me-2"></i>View Resume
                                            </a>
                                        )}
                                        {['Scheduled', 'Interviewing'].includes(app.status) && (
                                            <a
                                                href="/user/interview"
                                                className="btn btn-primary"
                                                title="Go to Interview Center"
                                            >
                                                <i className="bi bi-camera-video me-2"></i>Start Interview
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyApplications;
