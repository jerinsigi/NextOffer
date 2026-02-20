import React, { useState, useEffect } from 'react';
import '../../common/dashboard/Dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCompanies: 0,
        totalCandidates: 0,
        interviewsToday: 0,
        totalViolations: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentCompanies, setRecentCompanies] = useState([]);
    const [recentSupportTickets, setRecentSupportTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Adjust API URL if needed based on project config
                const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats');
                setStats(response.data.stats);
                setRecentJobs(response.data.recentJobs || []);
                setRecentCompanies(response.data.recentCompanies || []);
                setRecentSupportTickets(response.data.recentSupportTickets || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="text-muted">Welcome back! Here's what's happening with NextOffer today.</p>
                </div>
                {/* Export Report Removed as it's likely dummy for now */}
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-primary">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-building fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Companies</div>
                            <div className="stat-value">{loading ? '...' : stats.totalCompanies}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-building-check me-1"></i> Registered
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-success">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-people fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active Candidates</div>
                            <div className="stat-value">{loading ? '...' : stats.totalCandidates}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-person-check me-1"></i> Registered
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-info">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-camera-video fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Interviews Today</div>
                            <div className="stat-value">{loading ? '...' : stats.interviewsToday}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-calendar-event me-1"></i> Scheduled
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-danger">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-shield-exclamation fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Integrity Violations</div>
                            <div className="stat-value">{loading ? '...' : stats.totalViolations}</div>
                            <div className="stat-change negative">
                                <i className="bi bi-exclamation-triangle me-1"></i> Requires Action
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="row g-4">
                <div className="col-xl-8">
                    {/* Recent Job Postings */}
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recent Job Postings</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/admin/jobs')}>View All Jobs</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Apps</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                                    ) : recentJobs.length > 0 ? (
                                        recentJobs.map((job) => (
                                            <tr key={job.id}>
                                                <td><span className="fw-semibold">{job.title}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <i className="bi bi-building me-2 text-muted"></i>
                                                        {job.company}
                                                    </div>
                                                </td>
                                                <td>{job.location}</td>
                                                <td>
                                                    <span className={`badge bg-${job.status === 'Active' ? 'success' : job.status === 'Draft' ? 'secondary' : 'warning'}`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td><span className="badge bg-primary rounded-pill">{job.applications}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="bi bi-briefcase x fs-3 d-block mb-2"></i>
                                                No recent job postings
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Companies */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recently Registered Companies</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/admin/companies')}>View Companies</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Industry</th>
                                        <th>Status</th>
                                        <th>Registered Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                                    ) : recentCompanies.length > 0 ? (
                                        recentCompanies.map((comp) => (
                                            <tr key={comp.id}>
                                                <td><span className="fw-semibold">{comp.name}</span></td>
                                                <td>{comp.industry}</td>
                                                <td>
                                                    <span className={`badge bg-${comp.status === 'Active' ? 'success' : comp.status === 'Pending' ? 'warning' : 'danger'}`}>
                                                        {comp.status}
                                                    </span>
                                                </td>
                                                <td>{formatTime(comp.date)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                <i className="bi bi-building-x fs-3 d-block mb-2"></i>
                                                No recent companies
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    {/* Quick Actions */}
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="p-3">
                            <button className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/admin/companies')}>
                                <i className="bi bi-building-check"></i> Review Pending Companies
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/admin/jobs')}>
                                <i className="bi bi-briefcase"></i> Manage Active Jobs
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/admin/logs')}>
                                <i className="bi bi-shield-exclamation"></i> Action Integrity Violations
                            </button>
                            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/admin/settings')}>
                                <i className="bi bi-gear"></i> Platform Settings
                            </button>
                        </div>
                    </div>

                    {/* Recent Support Tickets */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recent Support Tickets</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/admin/support')}>View All</button>
                        </div>
                        <div className="p-2">
                            {loading ? (
                                <div className="p-3 text-center text-muted">Loading...</div>
                            ) : recentSupportTickets.length === 0 ? (
                                <div className="p-3 text-center text-muted">
                                    <i className="bi bi-inbox-fill d-block fs-3 mb-1"></i>
                                    <small>No pending tickets</small>
                                </div>
                            ) : (
                                recentSupportTickets.map(ticket => (
                                    <div
                                        key={ticket.id}
                                        className="d-flex align-items-start gap-2 p-2 rounded mb-1"
                                        style={{
                                            cursor: 'pointer',
                                            background: ticket.status === 'New' ? 'rgba(99,102,241,0.08)' : 'transparent',
                                            borderLeft: ticket.status === 'New' ? '3px solid #6366f1' : '3px solid transparent',
                                            transition: 'background 0.2s'
                                        }}
                                        onClick={() => navigate('/admin/support')}
                                    >
                                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
                                            {ticket.status === 'Resolved' ? '✅' : ticket.status === 'In Progress' ? '⏳' : '📩'}
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className="mb-0 small fw-semibold text-truncate" style={{ color: 'var(--text-primary)' }}>{ticket.subject}</p>
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                {(() => {
                                                    const diff = (Date.now() - new Date(ticket.date)) / 1000;
                                                    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                                                    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
                                                    return `${Math.floor(diff / 86400)}d ago`;
                                                })()}
                                            </small>
                                        </div>
                                        {ticket.status === 'New' && <span className="badge bg-primary" style={{ fontSize: '0.6rem', flexShrink: 0 }}>New</span>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
