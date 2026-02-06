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
            avgSuccessRate: '0%',
            integrityViolations: 0
        },
        interviewTrends: [],
        companiesData: [],
        skillsAnalysis: [],
        hiringFunnel: [],
        integrityMetrics: []
    });

    useEffect(() => {
        fetchDashboardStats();
    }, [dateRange]);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            // Using relative path or full path based on setup. 
            // In Dashboard.js I used http://localhost:5000, so keeping it consistent.
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

    // Helper to format date for chart
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

    const { overview, interviewTrends, companiesData, skillsAnalysis, hiringFunnel, integrityMetrics } = stats;

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
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-download me-2"></i>Export Report
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => exportReport('pdf')}>
                                <i className="bi bi-file-earmark-pdf me-2"></i>Export as PDF
                            </button></li>
                            <li><button className="dropdown-item" onClick={() => exportReport('excel')}>
                                <i className="bi bi-file-earmark-excel me-2"></i>Export as Excel
                            </button></li>
                            <li><button className="dropdown-item" onClick={() => exportReport('csv')}>
                                <i className="bi bi-file-earmark-text me-2"></i>Export as CSV
                            </button></li>
                        </ul>
                    </div>
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
                            <div className="metric-bar-fill bg-primary" style={{ width: '75%' }}></div>
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
                            <div className="metric-bar-fill bg-success" style={{ width: '82%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-graph-up-arrow text-info"></i>
                        </div>
                        <div className="metric-value">{overview.avgSuccessRate}</div>
                        <div className="metric-label">Avg Success Rate</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-info" style={{ width: parseFloat(overview.avgSuccessRate) + '%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-shield-fill-exclamation text-danger"></i>
                        </div>
                        <div className="metric-value">{overview.integrityViolations}</div>
                        <div className="metric-label">Integrity Violations</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-danger" style={{ width: '15%' }}></div>
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
                                    <span className="legend-dot bg-primary"></span>Interviews
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot bg-success"></span>Completed
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="chart-container">
                                {interviewTrends.length > 0 ? (
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

                {/* Integrity Violations Breakdown */}
                <div className="col-lg-4">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Integrity Violations</h5>
                        </div>
                        <div className="p-4">
                            <div className="donut-chart-container">
                                <svg className="donut-chart" viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" strokeWidth="30" strokeDasharray="267 535" transform="rotate(-90 100 100)" />
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="30" strokeDasharray="188 535" strokeDashoffset="-267" transform="rotate(-90 100 100)" />
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#8b5cf6" strokeWidth="30" strokeDasharray="80 535" strokeDashoffset="-455" transform="rotate(-90 100 100)" />
                                    <text x="100" y="95" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="bold">{overview.integrityViolations}</text>
                                    <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="12">Total</text>
                                </svg>
                            </div>
                            <div className="violation-list">
                                {integrityMetrics.map((item, index) => (
                                    <div key={index} className="violation-item">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-light">{item.type}</span>
                                            <span className="text-primary fw-bold">{item.count}</span>
                                        </div>
                                        <div className="progress" style={{ height: '6px' }}>
                                            <div
                                                className={`progress-bar ${index === 0 ? 'bg-danger' : index === 1 ? 'bg-warning' : 'bg-purple'
                                                    }`}
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">{item.percentage}%</small>
                                    </div>
                                ))}
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
                            <h5 className="card-title mb-0">Company Performance Analysis</h5>
                            <button className="btn btn-sm btn-outline-primary">View All Companies</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Interviews</th>
                                        <th>Total Candidates</th>
                                        <th>Avg Score (Est)</th>
                                        <th>Violations</th>
                                        <th>Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companiesData.length > 0 ? companiesData.map((company, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        {company.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="fw-bold">{company.name}</span>
                                                </div>
                                            </td>
                                            <td>{company.interviews}</td>
                                            <td>{company.candidates}</td>
                                            <td>
                                                <span className={`fw-bold ${company.avgScore >= 85 ? 'text-success' :
                                                    company.avgScore >= 75 ? 'text-warning' : 'text-danger'
                                                    }`}>
                                                    {company.avgScore}%
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-danger bg-opacity-20 text-danger">
                                                    {company.violations}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="progress" style={{ height: '8px', width: '150px' }}>
                                                    <div
                                                        className={`progress-bar ${company.avgScore >= 85 ? 'bg-success' :
                                                            company.avgScore >= 75 ? 'bg-warning' : 'bg-danger'
                                                            }`}
                                                        style={{ width: `${company.avgScore}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="text-center text-muted">No company data found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Analysis and Hiring Funnel */}
            <div className="row g-4">
                {/* Top Skills in Demand */}
                <div className="col-lg-6">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Top Skills in Demand</h5>
                        </div>
                        <div className="p-4">
                            {skillsAnalysis.length > 0 ? skillsAnalysis.map((skill, index) => (
                                <div key={index} className="skill-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-light fw-bold">{skill.skill}</span>
                                        <div className="d-flex gap-3">
                                            <small className="text-muted">
                                                <i className="bi bi-briefcase me-1"></i>{skill.demand} jobs
                                            </small>
                                            {/* Removed random pass rate */}
                                        </div>
                                    </div>
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div
                                            className="progress-bar bg-gradient-primary"
                                            style={{ width: `${Math.min((skill.demand / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <small className="text-muted">Avg Score: {skill.avgScore || 0}%</small>
                                        <small className="text-primary">{skill.demand} positions</small>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-muted">No skills data available.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hiring Funnel */}
                <div className="col-lg-6">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Hiring Funnel</h5>
                        </div>
                        <div className="p-4">
                            <div className="funnel-container">
                                {hiringFunnel.map((stage, index) => (
                                    <div key={index} className="funnel-stage" style={{ width: `${Math.max(stage.percentage, 5)}%` }}>
                                        <div className="funnel-content">
                                            <div className="funnel-label">{stage.stage}</div>
                                            <div className="funnel-value">{stage.count.toLocaleString()}</div>
                                            <div className="funnel-percentage">{stage.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="funnel-metrics mt-4">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
                                            <div className="text-primary fw-bold fs-4">
                                                {hiringFunnel.find(s => s.stage === 'Passed Integrity')?.percentage || 0}%
                                            </div>
                                            <small className="text-muted">Integrity Pass Rate</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="text-success fw-bold fs-4">
                                                {hiringFunnel.find(s => s.stage === 'Shortlisted')?.percentage || 0}%
                                            </div>
                                            <small className="text-muted">Final Shortlist Rate</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
