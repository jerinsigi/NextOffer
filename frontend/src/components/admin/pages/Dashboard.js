import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Adjust API URL if needed based on project config
                const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats');
                setStats(response.data.stats);
                setRecentInterviews(response.data.recentInterviews);
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
                    <div className="stat-card">
                        <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                            <i className="bi bi-building fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Companies</div>
                            <div className="stat-value">{loading ? '...' : stats.totalCompanies}</div>
                            {/* Comparison removed as we don't calculate history yet */}
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-success bg-opacity-20 text-success">
                            <i className="bi bi-people fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active Candidates</div>
                            <div className="stat-value">{loading ? '...' : stats.totalCandidates}</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-camera-video fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Interviews Today</div>
                            <div className="stat-value">{loading ? '...' : stats.interviewsToday}</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-danger bg-opacity-20 text-danger">
                            <i className="bi bi-shield-exclamation fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Integrity Violations</div>
                            <div className="stat-value">{loading ? '...' : stats.totalViolations}</div>
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
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/admin/logs')}>View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Company</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                                    ) : recentInterviews.length > 0 ? (
                                        recentInterviews.map((interview) => (
                                            <tr key={interview.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                            {interview.candidateInitials}
                                                        </div>
                                                        <span>{interview.candidate}</span>
                                                    </div>
                                                </td>
                                                <td>{interview.company}</td>
                                                <td>{interview.position}</td>
                                                <td>
                                                    <span className={`badge bg-${interview.status === 'completed' ? 'success' : interview.status === 'ongoing' ? 'warning' : 'secondary'}`}>
                                                        {interview.status}
                                                    </span>
                                                </td>
                                                <td>{formatTime(interview.time)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center text-muted">No recent interviews</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Only - System Health Removed */}
                <div className="col-xl-4">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="p-3">
                            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/admin/companies')}>
                                <i className="bi bi-plus-circle me-2"></i>Manage Companies
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/admin/reports')}>
                                <i className="bi bi-file-earmark-text me-2"></i>View Reports
                            </button>
                            <button className="btn btn-outline-primary w-100" onClick={() => navigate('/admin/logs')}>
                                <i className="bi bi-shield-check me-2"></i>Review Violations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
