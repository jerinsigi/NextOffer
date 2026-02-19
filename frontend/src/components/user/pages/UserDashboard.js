import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalApplications: 0,
            interviews: 0,
            averageScore: 0,
            practiceSessions: 0
        },
        upcomingInterviews: [],
        recentApplications: [],
        recommendedJobs: [],
        profileStrength: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) {
                    navigate('/login');
                    return;
                }

                const user = JSON.parse(userStr);
                setUserName(user.username || 'User');

                // Fetch dashboard stats using email
                // Note: Ensure your backend runs on port 5000 or configure proxy
                const response = await fetch(`http://localhost:5000/api/dashboard/user-stats/${user.email}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const data = await response.json();
                setDashboardData(data);

                // Fetch notifications
                try {
                    const notifRes = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(user.email)}`);
                    if (notifRes.ok) {
                        const notifData = await notifRes.json();
                        setNotifications(notifData.slice(0, 4));
                    }
                } catch (notifErr) {
                    console.error('Error fetching notifications for dashboard:', notifErr);
                }

                setLoading(false);

            } catch (err) {
                console.error('Error loading dashboard:', err);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="dashboard-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div className="header-content">
                    <div className="greeting-section">
                        <h1 className="page-title">Welcome Back, {userName}! 👋</h1>
                        <p className="text-muted">Ready to take the next step in your career journey?</p>
                    </div>
                    <div className="motivation-card">
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="motivation-text">"Success is not final, failure is not fatal"</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/user/jobs')}>
                        <i className="bi bi-briefcase me-2"></i>Browse Jobs
                    </button>
                    <button className="btn btn-outline-primary" onClick={() => navigate('/user/practice')}>
                        <i className="bi bi-lightbulb me-2"></i>Practice
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-primary">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                                <i className="bi bi-file-earmark-check fs-3"></i>
                            </div>
                            <div className="stat-trend">
                                <i className="bi bi-arrow-up-short"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Applications</div>
                            <div className="stat-value">{dashboardData.stats.totalApplications}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-check-circle me-1"></i> Career Progress
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-success">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon bg-success bg-opacity-20 text-success">
                                <i className="bi bi-camera-video fs-3"></i>
                            </div>
                            <div className="stat-trend">
                                <i className="bi bi-arrow-up-short"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Interviews</div>
                            <div className="stat-value">{dashboardData.stats.interviews}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-calendar-check me-1"></i> Scheduled / Done
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-info">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon bg-info bg-opacity-20 text-info">
                                <i className="bi bi-graph-up fs-3"></i>
                            </div>
                            <div className="stat-trend success">
                                <i className="bi bi-arrow-up-short"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Average Score</div>
                            <div className="stat-value">{dashboardData.stats.averageScore}%</div>
                            <div className="stat-change positive">
                                <i className="bi bi-trophy me-1"></i> Performance
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-warning">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                                <i className="bi bi-lightbulb fs-3"></i>
                            </div>
                            <div className="stat-trend">
                                <i className="bi bi-arrow-up-short"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Practice Sessions</div>
                            <div className="stat-value">{dashboardData.stats.practiceSessions}</div>
                            <div className="stat-change positive">
                                <i className="bi bi-fire me-1"></i> Keep practicing!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="row g-4">
                {/* Upcoming Interviews */}
                <div className="col-xl-8">
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Upcoming Interviews</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/user/applications')}>View All</button>
                        </div>
                        <div className="interview-list">
                            {dashboardData.upcomingInterviews.length > 0 ? (
                                dashboardData.upcomingInterviews.map((interview) => (
                                    <div key={interview.id} className="interview-item">
                                        <div className="interview-icon">
                                            <i className="bi bi-camera-video-fill text-primary"></i>
                                        </div>
                                        <div className="interview-details">
                                            <h6 className="interview-title">{interview.jobTitle}</h6>
                                            <p className="interview-company">
                                                <i className="bi bi-building me-2"></i>{interview.company}
                                            </p>
                                            <div className="interview-meta">
                                                <span className="badge bg-primary me-2">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    {new Date(interview.date).toLocaleDateString()}
                                                </span>
                                                <span className="badge bg-info">
                                                    <i className="bi bi-clock me-1"></i>
                                                    {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="interview-actions">
                                            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/user/interview/${interview.id}`)}>
                                                <i className="bi bi-play-circle me-1"></i>Join
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-muted">
                                    <i className="bi bi-calendar-x fs-1 mb-2 d-block"></i>
                                    No upcoming interviews scheduled.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recent Applications</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/user/applications')}>View All</button>
                        </div>
                        <div className="table-responsive">
                            {dashboardData.recentApplications.length > 0 ? (
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Company</th>
                                            <th>Applied Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recentApplications.map((app) => (
                                            <tr key={app.id}>
                                                <td>{app.position}</td>
                                                <td>{app.company}</td>
                                                <td>{new Date(app.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge bg-${app.status === 'Hired' ? 'success' :
                                                        app.status === 'Rejected' ? 'danger' :
                                                            app.status === 'Interviewing' ? 'warning' :
                                                                'info'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-center text-muted">
                                    <i className="bi bi-file-earmark-x fs-1 mb-2 d-block"></i>
                                    No recent applications found. <br />
                                    <button className="btn btn-sm btn-primary mt-2" onClick={() => navigate('/user/jobs')}>Browse Jobs</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-xl-4">
                    {/* Profile Strength */}
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Profile Strength</h5>
                        </div>
                        <div className="p-3">
                            <div className="text-center mb-3">
                                <div className="progress-circle mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                    <svg viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <circle cx="60" cy="60" r="54" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray={`${dashboardData.profileStrength * 3.39} 339.29`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                                    </svg>
                                    <div className="progress-text">
                                        <span className="fs-3 fw-bold text-primary">{dashboardData.profileStrength}%</span>
                                    </div>
                                </div>
                                <p className="text-muted mb-0">Complete your profile to increase visibility.</p>
                            </div>
                            <div className="profile-checklist">
                                <div className={`checklist-item ${dashboardData.profileStrength > 0 ? 'completed' : ''}`}>
                                    <i className={`bi bi-${dashboardData.profileStrength > 0 ? 'check-circle-fill text-success' : 'circle text-muted'}`}></i>
                                    <span>Account Created</span>
                                </div>
                                <div className={`checklist-item ${dashboardData.stats.totalApplications > 0 ? 'completed' : ''}`}>
                                    <i className={`bi bi-${dashboardData.stats.totalApplications > 0 ? 'check-circle-fill text-success' : 'circle text-muted'}`}></i>
                                    <span>First Application</span>
                                </div>
                                <div className={`checklist-item ${dashboardData.stats.interviews > 0 ? 'completed' : ''}`}>
                                    <i className={`bi bi-${dashboardData.stats.interviews > 0 ? 'check-circle-fill text-success' : 'circle text-muted'}`}></i>
                                    <span>First Interview</span>
                                </div>
                                <div className={`checklist-item ${dashboardData.stats.averageScore > 0 ? 'completed' : ''}`}>
                                    <i className={`bi bi-${dashboardData.stats.averageScore > 0 ? 'check-circle-fill text-success' : 'circle text-muted'}`}></i>
                                    <span>Performance Score</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Jobs */}
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recommended for You</h5>
                        </div>
                        <div className="job-list">
                            {dashboardData.recommendedJobs.length > 0 ? (
                                dashboardData.recommendedJobs.map(job => (
                                    <div key={job.id} className="job-item">
                                        <div className="job-header">
                                            <h6 className="job-title">{job.title}</h6>
                                            <span className="badge bg-success">{job.match}% Match</span>
                                        </div>
                                        <p className="job-company">
                                            <i className="bi bi-building me-2"></i>{job.company}
                                        </p>
                                        <p className="job-location">
                                            <i className="bi bi-geo-alt me-2"></i>{job.location}
                                        </p>
                                        <button className="btn btn-sm btn-outline-primary w-100" onClick={() => navigate('/user/jobs')}>
                                            <i className="bi bi-arrow-right me-1"></i>View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-muted">
                                    No recommendations yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">
                                Recent Notifications
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="badge bg-danger rounded-pill ms-2" style={{ fontSize: '0.7rem' }}>
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/user/notifications')}>View All</button>
                        </div>
                        <div className="p-2">
                            {notifications.length === 0 ? (
                                <div className="p-3 text-center text-muted">
                                    <i className="bi bi-bell-slash d-block fs-3 mb-1"></i>
                                    <small>No notifications yet</small>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif._id}
                                        className="d-flex align-items-start gap-2 p-2 rounded mb-1"
                                        style={{
                                            cursor: 'pointer',
                                            background: !notif.read ? 'rgba(99,102,241,0.08)' : 'transparent',
                                            borderLeft: !notif.read ? '3px solid #6366f1' : '3px solid transparent',
                                            transition: 'background 0.2s'
                                        }}
                                        onClick={() => notif.link && navigate(notif.link)}
                                    >
                                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
                                            {notif.type === 'interview' ? '📅' :
                                                notif.type === 'result' ? '📊' :
                                                    notif.type === 'application' ? '✅' : '🔔'}
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className="mb-0 small fw-semibold text-truncate" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                {(() => {
                                                    const diff = (Date.now() - new Date(notif.createdAt)) / 1000;
                                                    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                                                    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
                                                    return `${Math.floor(diff / 86400)}d ago`;
                                                })()}
                                            </small>
                                        </div>
                                        {!notif.read && <span className="badge bg-primary" style={{ fontSize: '0.6rem', flexShrink: 0 }}>New</span>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="p-3">
                            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/user/practice')}>
                                <i className="bi bi-lightbulb me-2"></i>Start Practice Interview
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/user/profile')}>
                                <i className="bi bi-file-earmark-arrow-up me-2"></i>Update Resume
                            </button>
                            <button className="btn btn-outline-primary w-100" onClick={() => navigate('/user/applications')}>
                                <i className="bi bi-graph-up-arrow me-2"></i>View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
