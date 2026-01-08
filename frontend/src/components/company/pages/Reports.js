import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
    const [dateRange, setDateRange] = useState('last7days');
    const [selectedMetric, setSelectedMetric] = useState('overview');

    // Sample data for charts
    const interviewTrends = [
        { date: 'Dec 1', interviews: 45, completed: 38, flagged: 3 },
        { date: 'Dec 2', interviews: 52, completed: 47, flagged: 2 },
        { date: 'Dec 3', interviews: 48, completed: 42, flagged: 4 },
        { date: 'Dec 4', interviews: 61, completed: 55, flagged: 5 },
        { date: 'Dec 5', interviews: 58, completed: 51, flagged: 3 },
        { date: 'Dec 6', interviews: 67, completed: 59, flagged: 6 }
    ];

    const companiesData = [
        { name: 'TechCorp Inc.', interviews: 156, candidates: 423, avgScore: 87, violations: 12 },
        { name: 'StartupXYZ', interviews: 98, candidates: 287, avgScore: 82, violations: 8 },
        { name: 'DataCo', interviews: 134, candidates: 356, avgScore: 79, violations: 15 },
        { name: 'CloudTech', interviews: 87, candidates: 198, avgScore: 91, violations: 4 },
        { name: 'InnovateLabs', interviews: 112, candidates: 289, avgScore: 85, violations: 9 }
    ];

    const skillsAnalysis = [
        { skill: 'JavaScript', demand: 245, avgScore: 78, passRate: 65 },
        { skill: 'Python', demand: 198, avgScore: 82, passRate: 71 },
        { skill: 'React', demand: 167, avgScore: 75, passRate: 62 },
        { skill: 'Node.js', demand: 145, avgScore: 80, passRate: 68 },
        { skill: 'SQL', demand: 132, avgScore: 84, passRate: 74 },
        { skill: 'AWS', demand: 123, avgScore: 77, passRate: 64 },
        { skill: 'Docker', demand: 98, avgScore: 81, passRate: 69 }
    ];

    const integrityMetrics = [
        { type: 'Tab Switching', count: 68, percentage: 53.5 },
        { type: 'Gaze Aversion', count: 45, percentage: 35.4 },
        { type: 'Presence Anomaly', count: 14, percentage: 11.1 }
    ];

    const hiringFunnel = [
        { stage: 'Total Applications', count: 12543, percentage: 100 },
        { stage: 'Resume Screened', count: 8945, percentage: 71.3 },
        { stage: 'Interview Completed', count: 5234, percentage: 41.7 },
        { stage: 'Passed Integrity', count: 4876, percentage: 38.9 },
        { stage: 'Shortlisted', count: 2156, percentage: 17.2 }
    ];

    const exportReport = (format) => {
        alert(`Exporting report in ${format.toUpperCase()} format...`);
    };

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
                        <option value="last3months">Last 3 Months</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-download me-2"></i>Export Report
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#!" onClick={() => exportReport('pdf')}>
                                <i className="bi bi-file-earmark-pdf me-2"></i>Export as PDF
                            </a></li>
                            <li><a className="dropdown-item" href="#!" onClick={() => exportReport('excel')}>
                                <i className="bi bi-file-earmark-excel me-2"></i>Export as Excel
                            </a></li>
                            <li><a className="dropdown-item" href="#!" onClick={() => exportReport('csv')}>
                                <i className="bi bi-file-earmark-text me-2"></i>Export as CSV
                            </a></li>
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
                            <span className="metric-change positive">+12.5%</span>
                        </div>
                        <div className="metric-value">12,543</div>
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
                            <span className="metric-change positive">+8.3%</span>
                        </div>
                        <div className="metric-value">5,234</div>
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
                            <span className="metric-change positive">+5.1%</span>
                        </div>
                        <div className="metric-value">84.2%</div>
                        <div className="metric-label">Avg Success Rate</div>
                        <div className="metric-bar">
                            <div className="metric-bar-fill bg-info" style={{ width: '84%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-shield-fill-exclamation text-danger"></i>
                            <span className="metric-change negative">-3.2%</span>
                        </div>
                        <div className="metric-value">127</div>
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
                                    <span className="legend-dot bg-primary"></span>Total
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot bg-success"></span>Completed
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot bg-danger"></span>Flagged
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="chart-container">
                                <svg className="line-chart" viewBox="0 0 600 250">
                                    {/* Grid lines */}
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
                                    
                                    {/* Total interviews line */}
                                    <polyline
                                        points="80,150 170,120 260,135 350,90 440,105 530,75"
                                        fill="none"
                                        stroke="#6366f1"
                                        strokeWidth="3"
                                    />
                                    
                                    {/* Completed interviews line */}
                                    <polyline
                                        points="80,165 170,130 260,150 350,105 440,120 530,95"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                    />
                                    
                                    {/* Flagged interviews line */}
                                    <polyline
                                        points="80,215 170,220 260,210 350,205 440,215 530,200"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="3"
                                    />
                                    
                                    {/* Data points */}
                                    {interviewTrends.map((item, i) => (
                                        <g key={i}>
                                            <circle cx={80 + i * 90} cy={250 - item.interviews * 3} r="4" fill="#6366f1" />
                                            <circle cx={80 + i * 90} cy={250 - item.completed * 3} r="4" fill="#10b981" />
                                            <circle cx={80 + i * 90} cy={250 - item.flagged * 10} r="4" fill="#ef4444" />
                                            <text x={80 + i * 90} y="240" textAnchor="middle" fill="#94a3b8" fontSize="12">
                                                {item.date}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
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
                                    <text x="100" y="95" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="bold">127</text>
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
                                                className={`progress-bar ${
                                                    index === 0 ? 'bg-danger' : index === 1 ? 'bg-warning' : 'bg-purple'
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
                                        <th>Avg Score</th>
                                        <th>Violations</th>
                                        <th>Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companiesData.map((company, index) => (
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
                                                <span className={`fw-bold ${
                                                    company.avgScore >= 85 ? 'text-success' :
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
                                                        className={`progress-bar ${
                                                            company.avgScore >= 85 ? 'bg-success' :
                                                            company.avgScore >= 75 ? 'bg-warning' : 'bg-danger'
                                                        }`}
                                                        style={{ width: `${company.avgScore}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                            {skillsAnalysis.map((skill, index) => (
                                <div key={index} className="skill-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-light fw-bold">{skill.skill}</span>
                                        <div className="d-flex gap-3">
                                            <small className="text-muted">
                                                <i className="bi bi-briefcase me-1"></i>{skill.demand} jobs
                                            </small>
                                            <small className="text-success">
                                                {skill.passRate}% pass rate
                                            </small>
                                        </div>
                                    </div>
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div
                                            className="progress-bar bg-gradient-primary"
                                            style={{ width: `${(skill.demand / 250) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <small className="text-muted">Avg Score: {skill.avgScore}%</small>
                                        <small className="text-primary">{skill.demand} positions</small>
                                    </div>
                                </div>
                            ))}
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
                                    <div key={index} className="funnel-stage" style={{ width: `${stage.percentage}%` }}>
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
                                            <div className="text-primary fw-bold fs-4">38.9%</div>
                                            <small className="text-muted">Integrity Pass Rate</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="text-success fw-bold fs-4">17.2%</div>
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
