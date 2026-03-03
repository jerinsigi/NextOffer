import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Loader from '../../common/Loader';

const Dashboard = () => {
    const [company, setCompany] = useState(null);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeCandidates: 0,
        interviewsToday: 0,
        integrityViolations: 0,
        recentInterviews: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get user from storage
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) return;

                const user = JSON.parse(userStr);

                // Fetch full company details
                const profileResponse = await fetch('http://localhost:5000/api/companies/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (profileResponse.ok) {
                    const data = await profileResponse.json();
                    setCompany(data);
                }

                // Fetch Dashboard Stats
                const statsResponse = await fetch('http://localhost:5000/api/companies/dashboard-stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper to format time
    const formatTime = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        // If today, show "5 min ago" style or just time
        // For simplicity, let's just show standard time or relative
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h ago`;
        return date.toLocaleDateString();
    };

    if (loading) return <Loader inline />;

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">
                        {company ? company.company_name : 'Dashboard Overview'}
                    </h1>
                    <p className="text-muted">
                        {company
                            ? `Welcome back, ${company.company_name}! Here's what's happening today.`
                            : "Welcome back! Here's what's happening with NextOffer today."}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-primary">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-briefcase fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Jobs</div>
                            <div className="stat-value">{stats.totalJobs}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-check-circle me-1"></i> Active Posted Jobs
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
                            <div className="stat-value">{stats.activeCandidates}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-person-check me-1"></i> Total Applications
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
                            <div className="stat-value">{stats.interviewsToday}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-calendar-event me-1"></i> Scheduled Today
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
                            <div className="stat-value">{stats.integrityViolations}</div>
                            <div className="stat-change negative">
                                <i className="bi bi-exclamation-triangle me-1"></i> Flagged Sessions
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="row g-4">
                {/* Recent Interviews */}
                <div className="col-xl-8">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recent Interview Sessions</h5>
                            <button className="btn btn-sm btn-outline-primary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentInterviews.length > 0 ? (
                                        stats.recentInterviews.map((session) => (
                                            <tr key={session._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                            {session.candidateInitials}
                                                        </div>
                                                        <span>{session.candidate}</span>
                                                    </div>
                                                </td>
                                                <td>{session.position}</td>
                                                <td>
                                                    <span className={`badge ${session.status === 'completed' ? 'bg-success' :
                                                        session.status === 'ongoing' ? 'bg-warning' : 'bg-secondary'
                                                        }`}>
                                                        {session.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`${session.integrity_status === 'Flagged' ? 'text-danger fw-bold' : 'text-success fw-bold'
                                                        }`}>
                                                        {session.score}
                                                    </span>
                                                </td>
                                                <td>{formatTime(session.time)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No recent interviews found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* System Health & Quick Stats */}
                <div className="col-xl-4">
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Platform Status</h5>
                        </div>
                        <div className="p-3">
                            <div className="health-item mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Service Status</span>
                                    <span className="text-success fw-bold">Operational</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div className="health-item mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subscription</span>
                                    <span className="text-primary fw-bold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="p-3">
                            <button className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-plus-circle me-2"></i>Post New Job
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-file-earmark-text me-2"></i>Review Candidates
                            </button>
                            <button className="btn btn-outline-primary w-100">
                                <i className="bi bi-shield-check me-2"></i>Check Integrity Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
