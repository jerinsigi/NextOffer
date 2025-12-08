import React from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div className="header-content">
                    <div className="greeting-section">
                        <h1 className="page-title">Welcome Back, John! 👋</h1>
                        <p className="text-muted">Ready to take the next step in your career journey?</p>
                    </div>
                    <div className="motivation-card">
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="motivation-text">"Success is not final, failure is not fatal"</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <i className="bi bi-briefcase me-2"></i>Browse Jobs
                    </button>
                    <button className="btn btn-outline-primary">
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
                            <div className="stat-value">12</div>
                            <div className="stat-change positive">
                                <i className="bi bi-plus-circle me-1"></i> 3 new this week
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
                            <div className="stat-value">5</div>
                            <div className="stat-change positive">
                                <i className="bi bi-calendar-check me-1"></i> 2 scheduled
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
                            <div className="stat-value">78%</div>
                            <div className="stat-change positive">
                                <i className="bi bi-trophy me-1"></i> +5% improvement
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
                            <div className="stat-value">24</div>
                            <div className="stat-change positive">
                                <i className="bi bi-fire me-1"></i> 8 this month
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
                            <button className="btn btn-sm btn-outline-primary">View All</button>
                        </div>
                        <div className="interview-list">
                            <div className="interview-item">
                                <div className="interview-icon">
                                    <i className="bi bi-camera-video-fill text-primary"></i>
                                </div>
                                <div className="interview-details">
                                    <h6 className="interview-title">Senior Software Developer</h6>
                                    <p className="interview-company">
                                        <i className="bi bi-building me-2"></i>TechCorp Inc.
                                    </p>
                                    <div className="interview-meta">
                                        <span className="badge bg-primary me-2">
                                            <i className="bi bi-calendar me-1"></i>Dec 10, 2025
                                        </span>
                                        <span className="badge bg-info">
                                            <i className="bi bi-clock me-1"></i>10:00 AM
                                        </span>
                                    </div>
                                </div>
                                <div className="interview-actions">
                                    <button className="btn btn-sm btn-primary">
                                        <i className="bi bi-play-circle me-1"></i>Join
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="bi bi-info-circle"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="interview-item">
                                <div className="interview-icon">
                                    <i className="bi bi-camera-video-fill text-success"></i>
                                </div>
                                <div className="interview-details">
                                    <h6 className="interview-title">Full Stack Developer</h6>
                                    <p className="interview-company">
                                        <i className="bi bi-building me-2"></i>StartupXYZ
                                    </p>
                                    <div className="interview-meta">
                                        <span className="badge bg-primary me-2">
                                            <i className="bi bi-calendar me-1"></i>Dec 12, 2025
                                        </span>
                                        <span className="badge bg-info">
                                            <i className="bi bi-clock me-1"></i>2:30 PM
                                        </span>
                                    </div>
                                </div>
                                <div className="interview-actions">
                                    <button className="btn btn-sm btn-outline-primary" disabled>
                                        <i className="bi bi-clock me-1"></i>Scheduled
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Recent Applications</h5>
                            <button className="btn btn-sm btn-outline-primary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Match</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Senior Software Developer</td>
                                        <td>TechCorp Inc.</td>
                                        <td>Dec 5, 2025</td>
                                        <td><span className="badge bg-warning">Interview Scheduled</span></td>
                                        <td><span className="text-success fw-bold">92%</span></td>
                                    </tr>
                                    <tr>
                                        <td>Full Stack Developer</td>
                                        <td>StartupXYZ</td>
                                        <td>Dec 4, 2025</td>
                                        <td><span className="badge bg-info">Resume Reviewed</span></td>
                                        <td><span className="text-success fw-bold">85%</span></td>
                                    </tr>
                                    <tr>
                                        <td>Backend Engineer</td>
                                        <td>CloudTech</td>
                                        <td>Dec 3, 2025</td>
                                        <td><span className="badge bg-secondary">Under Review</span></td>
                                        <td><span className="text-warning fw-bold">78%</span></td>
                                    </tr>
                                    <tr>
                                        <td>DevOps Specialist</td>
                                        <td>DataCo</td>
                                        <td>Dec 1, 2025</td>
                                        <td><span className="badge bg-success">Completed</span></td>
                                        <td><span className="text-success fw-bold">88%</span></td>
                                    </tr>
                                </tbody>
                            </table>
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
                                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                                        <circle cx="60" cy="60" r="54" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset="67.86" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                                    </svg>
                                    <div className="progress-text">
                                        <span className="fs-3 fw-bold text-primary">80%</span>
                                    </div>
                                </div>
                                <p className="text-muted mb-0">Good progress! Complete your profile to increase visibility.</p>
                            </div>
                            <div className="profile-checklist">
                                <div className="checklist-item completed">
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                    <span>Resume Uploaded</span>
                                </div>
                                <div className="checklist-item completed">
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                    <span>Skills Added</span>
                                </div>
                                <div className="checklist-item">
                                    <i className="bi bi-circle text-muted"></i>
                                    <span>Add Work Experience</span>
                                </div>
                                <div className="checklist-item">
                                    <i className="bi bi-circle text-muted"></i>
                                    <span>Complete Practice Interview</span>
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
                            <div className="job-item">
                                <div className="job-header">
                                    <h6 className="job-title">React Developer</h6>
                                    <span className="badge bg-success">95% Match</span>
                                </div>
                                <p className="job-company">
                                    <i className="bi bi-building me-2"></i>Innovation Labs
                                </p>
                                <p className="job-location">
                                    <i className="bi bi-geo-alt me-2"></i>Remote
                                </p>
                                <button className="btn btn-sm btn-outline-primary w-100">
                                    <i className="bi bi-arrow-right me-1"></i>View Details
                                </button>
                            </div>

                            <div className="job-item">
                                <div className="job-header">
                                    <h6 className="job-title">Node.js Developer</h6>
                                    <span className="badge bg-success">88% Match</span>
                                </div>
                                <p className="job-company">
                                    <i className="bi bi-building me-2"></i>Tech Solutions
                                </p>
                                <p className="job-location">
                                    <i className="bi bi-geo-alt me-2"></i>Hybrid
                                </p>
                                <button className="btn btn-sm btn-outline-primary w-100">
                                    <i className="bi bi-arrow-right me-1"></i>View Details
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="p-3">
                            <button className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-lightbulb me-2"></i>Start Practice Interview
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-file-earmark-arrow-up me-2"></i>Update Resume
                            </button>
                            <button className="btn btn-outline-primary w-100">
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
