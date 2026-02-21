import React, { useState, useEffect } from 'react';
import './Reports.css';
import axios from 'axios';

const Reports = () => {
    const [dateRange, setDateRange] = useState('last7days');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        overview: {
            totalCandidates: 0,
            interviewsConducted: 0,
            totalCompanies: 0,
            totalJobs: 0
        },
        interviewTrends: [],
        companiesData: [],
        skillsAnalysis: [],
        applicationStatus: []
    });

    useEffect(() => {
        fetchDashboardStats();
    }, [dateRange]);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/reports/dashboard-stats`, {
                params: { dateRange }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const exportReport = (format) => {
        alert(`Exporting report in ${format.toUpperCase()} format...`);
    };

    if (loading) {
        return (
            <div className="dashboard-container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const { overview, interviewTrends, companiesData, skillsAnalysis, applicationStatus } = stats;

    const totalApps = applicationStatus?.reduce((acc, curr) => acc + curr.count, 0) || 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return '#3b82f6';
            case 'Shortlisted': return '#f59e0b';
            case 'Interviewing': return '#8b5cf6';
            case 'Hired': return '#10b981';
            case 'Rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Applied': return 'bg-primary';
            case 'Shortlisted': return 'bg-warning';
            case 'Interviewing': return 'bg-purple';
            case 'Hired': return 'bg-success';
            case 'Rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    // Calculate Application Donut SVG Properties
    let dashOffsetAcc = 0;
    const donutCircles = applicationStatus?.map((item, index) => {
        const percentage = totalApps > 0 ? (item.count / totalApps) * 100 : 0;
        const dashArray = `${(percentage / 100) * 502} 502`; // 2 * PI * 80 = 502.6
        const circle = (
            <circle
                key={index}
                cx="100" cy="100" r="80"
                fill="none"
                stroke={getStatusColor(item.status)}
                strokeWidth="30"
                strokeDasharray={dashArray}
                strokeDashoffset={-dashOffsetAcc}
                transform="rotate(-90 100 100)"
            />
        );
        dashOffsetAcc += (percentage / 100) * 502;
        return circle;
    });

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="text-muted">Comprehensive insights and data-driven analytics</p>
                </div>
                <div className="header-actions">
                    <select
                        className="form-select form-select-dark"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="today">Today</option>
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-people-fill text-primary"></i>
                        </div>
                        <div className="metric-value">{overview.totalCandidates?.toLocaleString()}</div>
                        <div className="metric-label">Total Candidates</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-primary" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-building text-warning"></i>
                        </div>
                        <div className="metric-value">{overview.totalCompanies?.toLocaleString()}</div>
                        <div className="metric-label">Registered Companies</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-warning" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-briefcase-fill text-info"></i>
                        </div>
                        <div className="metric-value">{overview.totalJobs?.toLocaleString()}</div>
                        <div className="metric-label">Total Jobs Posted</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-info" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-camera-video-fill text-success"></i>
                        </div>
                        <div className="metric-value">{overview.interviewsConducted?.toLocaleString()}</div>
                        <div className="metric-label">Interviews Conducted</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-success" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4 mb-4">
                {/* Interview Trends */}
                <div className="col-lg-8">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Interview Trends</h5>
                            <div className="chart-legend">
                                <span className="legend-item">
                                    <span className="legend-dot bg-primary"></span>Interviews Scheduled
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot bg-success"></span>Completed
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="chart-container">
                                {interviewTrends?.length > 0 ? (
                                    <svg className="line-chart" viewBox="0 0 600 250">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <line
                                                key={i}
                                                x1="40"
                                                y1={50 + i * 40}
                                                x2="580"
                                                y2={50 + i * 40}
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="1"
                                            />
                                        ))}
                                        {(() => {
                                            const maxVal = Math.max(...interviewTrends.map(t => t.interviews), 10);
                                            const scaleY = (val) => 250 - (val / maxVal) * 200;

                                            const pointsInterviews = interviewTrends.map((t, i) =>
                                                `${80 + i * 80},${scaleY(t.interviews)}`
                                            ).join(' ');

                                            const pointsCompleted = interviewTrends.map((t, i) =>
                                                `${80 + i * 80},${scaleY(t.completed)}`
                                            ).join(' ');

                                            return (
                                                <>
                                                    <polyline
                                                        points={pointsInterviews}
                                                        fill="none"
                                                        stroke="#6366f1"
                                                        strokeWidth="3"
                                                    />
                                                    <polyline
                                                        points={pointsCompleted}
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="3"
                                                    />
                                                    {interviewTrends.map((item, i) => (
                                                        <g key={i}>
                                                            <circle cx={80 + i * 80} cy={scaleY(item.interviews)} r="4" fill="#6366f1" />
                                                            <circle cx={80 + i * 80} cy={scaleY(item.completed)} r="4" fill="#10b981" />
                                                            <text x={80 + i * 80} y="240" textAnchor="middle" fill="#94a3b8" fontSize="12">
                                                                {formatDate(item._id)}
                                                            </text>
                                                        </g>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </svg>
                                ) : (
                                    <div className="text-center text-muted py-5">No interview data available for this range</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Performance */}
            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Most Active Companies</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Jobs Posted</th>
                                        <th>Interviews Conducted</th>
                                        <th>Applications Received</th>
                                        <th>Activity Overview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companiesData?.length > 0 ? companiesData.map((company, index) => {
                                        const maxActivity = Math.max(...companiesData.map(c => c.totalJobs + c.interviews));
                                        const currentActivity = company.totalJobs + company.interviews;
                                        const activityWidth = maxActivity > 0 ? (currentActivity / maxActivity) * 100 : 0;

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                            {company.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="fw-bold">{company.name}</span>
                                                    </div>
                                                </td>
                                                <td>{company.totalJobs}</td>
                                                <td>{company.interviews}</td>
                                                <td>{company.candidates}</td>
                                                <td>
                                                    <div className="progress" style={{ height: '8px', width: '150px' }}>
                                                        <div
                                                            className="progress-bar bg-success"
                                                            style={{ width: `${activityWidth}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr><td colSpan="5" className="text-center text-muted">No company data found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Analysis */}
            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Top Skills in Demand</h5>
                        </div>
                        <div className="p-4">
                            <div className="row g-4">
                                {skillsAnalysis?.length > 0 ? skillsAnalysis.map((skill, index) => {
                                    const maxDemand = Math.max(...skillsAnalysis.map(s => s.demand));
                                    const percentage = maxDemand > 0 ? (skill.demand / maxDemand) * 100 : 0;
                                    return (
                                        <div key={index} className="col-md-6 col-lg-4">
                                            <div className="skill-item bg-dark bg-opacity-50 p-3 rounded border border-secondary border-opacity-25">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-light fw-bold">{skill.skill}</span>
                                                    <div className="d-flex gap-3">
                                                        <small className="text-primary">
                                                            <i className="bi bi-briefcase me-1"></i>{skill.demand} positions
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar bg-gradient-primary"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-12 text-center text-muted">No skills data available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
