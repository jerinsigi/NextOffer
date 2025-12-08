import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="text-muted">Welcome back! Here's what's happening with NextOffer today.</p>
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
                        <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                            <i className="bi bi-building fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Companies</div>
                            <div className="stat-value">248</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 12% from last month
                            </div>
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
                            <div className="stat-value">12,543</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 8% from last month
                            </div>
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
                            <div className="stat-value">156</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 23% from yesterday
                            </div>
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
                            <div className="stat-value">12</div>
                            <div className="stat-change negative">
                                <i className="bi bi-arrow-down"></i> 15% from last week
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
                                        <th>Company</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                    JD
                                                </div>
                                                <span>John Doe</span>
                                            </div>
                                        </td>
                                        <td>TechCorp Inc.</td>
                                        <td>Senior Developer</td>
                                        <td><span className="badge bg-success">Completed</span></td>
                                        <td><span className="text-success fw-bold">87%</span></td>
                                        <td>5 min ago</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                    AS
                                                </div>
                                                <span>Alice Smith</span>
                                            </div>
                                        </td>
                                        <td>StartupXYZ</td>
                                        <td>UI/UX Designer</td>
                                        <td><span className="badge bg-warning">In Progress</span></td>
                                        <td><span className="text-muted">--</span></td>
                                        <td>12 min ago</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                    MB
                                                </div>
                                                <span>Mike Brown</span>
                                            </div>
                                        </td>
                                        <td>DataCo</td>
                                        <td>Data Analyst</td>
                                        <td><span className="badge bg-danger">Flagged</span></td>
                                        <td><span className="text-danger fw-bold">45%</span></td>
                                        <td>28 min ago</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                    SJ
                                                </div>
                                                <span>Sarah Johnson</span>
                                            </div>
                                        </td>
                                        <td>CloudTech</td>
                                        <td>DevOps Engineer</td>
                                        <td><span className="badge bg-success">Completed</span></td>
                                        <td><span className="text-success fw-bold">92%</span></td>
                                        <td>1 hour ago</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* System Health & Quick Stats */}
                <div className="col-xl-4">
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">System Health</h5>
                        </div>
                        <div className="p-3">
                            <div className="health-item mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">API Response Time</span>
                                    <span className="text-success fw-bold">98ms</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            <div className="health-item mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Database Load</span>
                                    <span className="text-warning fw-bold">67%</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: '67%' }}></div>
                                </div>
                            </div>
                            <div className="health-item">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Server Uptime</span>
                                    <span className="text-success fw-bold">99.9%</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '99.9%' }}></div>
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
                                <i className="bi bi-plus-circle me-2"></i>Add New Company
                            </button>
                            <button className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-file-earmark-text me-2"></i>View Reports
                            </button>
                            <button className="btn btn-outline-primary w-100">
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
