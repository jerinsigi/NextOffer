import React, { useState, useEffect } from 'react';
import './Reports.css';
import Loader from '../../common/Loader';

const Reports = () => {
    const [dateRange, setDateRange] = useState('last7days');
    const [selectedMetric, setSelectedMetric] = useState('overview');
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        overview: { totalCandidates: 0, interviewsConducted: 0, hiringRate: 0, integrityViolations: 0 },
        interviewTrends: [],
        jobsData: [],
        skillsAnalysis: [],
        integrityMetrics: [],
        hiringFunnel: []
    });

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) {
                    setLoading(false);
                    return;
                }
                const user = JSON.parse(userStr);

                const response = await fetch(`http://localhost:5000/api/reports/company-stats?email=${user.email}&dateRange=${dateRange}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [dateRange]);

    const {
        overview,
        interviewTrends,
        jobsData,
        skillsAnalysis,
        integrityMetrics,
        hiringFunnel
    } = stats;

    const exportReport = (format) => {
        alert(`Exporting report in ${format.toUpperCase()} format...`);
    };

    if (loading) return <Loader inline />;

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
                        <div className="metric-value">{overview.totalCandidates.toLocaleString()}</div>
                        <div className="metric-label">Total Candidates</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-camera-video-fill text-success"></i>
                        </div>
                        <div className="metric-value">{overview.interviewsConducted.toLocaleString()}</div>
                        <div className="metric-label">Interviews Conducted</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-graph-up-arrow text-info"></i>
                        </div>
                        <div className="metric-value">{overview.hiringRate}%</div>
                        <div className="metric-label">Avg Hiring Rate</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="metric-card">
                        <div className="metric-header">
                            <i className="bi bi-shield-fill-exclamation text-danger"></i>
                        </div>
                        <div className="metric-value">{overview.integrityViolations}</div>
                        <div className="metric-label">Integrity Violations</div>
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
                                {interviewTrends && interviewTrends.length > 0 ? (
                                    (() => {
                                        const width = 500;
                                        const startX = 80;
                                        const dx = interviewTrends.length > 1 ? width / (interviewTrends.length - 1) : 0;
                                        const maxY = Math.max(1, ...interviewTrends.map(t => Math.max(t.interviews || 0, t.completed || 0, t.flagged || 0)));
                                        const getY = (val) => 230 - ((val || 0) / maxY) * 180;
                                        
                                        const totalPoints = interviewTrends.map((t, i) => `${startX + i * dx},${getY(t.interviews)}`).join(' ');
                                        const completedPoints = interviewTrends.map((t, i) => `${startX + i * dx},${getY(t.completed)}`).join(' ');
                                        const flaggedPoints = interviewTrends.map((t, i) => `${startX + i * dx},${getY(t.flagged)}`).join(' ');

                                        return (
                                            <svg className="line-chart" viewBox="0 0 600 250">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <line key={i} x1="40" y1={50 + i * 40} x2="580" y2={50 + i * 40} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                                ))}
                                                <polyline points={totalPoints} fill="none" stroke="#6366f1" strokeWidth="3" />
                                                <polyline points={completedPoints} fill="none" stroke="#10b981" strokeWidth="3" />
                                                <polyline points={flaggedPoints} fill="none" stroke="#ef4444" strokeWidth="3" />
                                                {interviewTrends.map((item, i) => (
                                                    <g key={i}>
                                                        <circle cx={startX + i * dx} cy={getY(item.interviews)} r="4" fill="#6366f1" />
                                                        <circle cx={startX + i * dx} cy={getY(item.completed)} r="4" fill="#10b981" />
                                                        <circle cx={startX + i * dx} cy={getY(item.flagged)} r="4" fill="#ef4444" />
                                                        {(interviewTrends.length <= 7 || i % Math.ceil(interviewTrends.length/7) === 0) && (
                                                            <text x={startX + i * dx} y="245" textAnchor="middle" fill="#94a3b8" fontSize="10">
                                                                {item.date ? item.date.split('-').slice(1).join('/') : ''}
                                                            </text>
                                                        )}
                                                    </g>
                                                ))}
                                            </svg>
                                        );
                                    })()
                                ) : (
                                    <div className="text-center text-muted mt-5">No interview data available for this range.</div>
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

            {/* Jobs Performance */}
            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Job Performance Breakdown</h5>
                            <button className="btn btn-sm btn-outline-primary">View All Jobs</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Interviews</th>
                                        <th>Total Candidates</th>
                                        <th>Avg Score</th>
                                        <th>Violations</th>
                                        <th>Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobsData.map((job, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        {job.name ? job.name.substring(0, 2).toUpperCase() : 'J'}
                                                    </div>
                                                    <span className="fw-bold">{job.name}</span>
                                                </div>
                                            </td>
                                            <td>{job.interviews}</td>
                                            <td>{job.candidates}</td>
                                            <td>
                                                <span className={`fw-bold ${job.avgScore >= 85 ? 'text-success' :
                                                        job.avgScore >= 75 ? 'text-warning' : 'text-danger'
                                                    }`}>
                                                    {job.avgScore}%
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-danger bg-opacity-20 text-danger">
                                                    {job.violations}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="progress" style={{ height: '8px', width: '150px' }}>
                                                    <div
                                                        className={`progress-bar ${job.avgScore >= 85 ? 'bg-success' :
                                                                job.avgScore >= 75 ? 'bg-warning' : 'bg-danger'
                                                            }`}
                                                        style={{ width: `${job.avgScore}%` }}
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
                                            <div className="text-primary fw-bold fs-4">{hiringFunnel.find(s => s.stage === 'Interview Completed')?.percentage || 0}%</div>
                                            <small className="text-muted">Interview Completion Rate</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="text-success fw-bold fs-4">{hiringFunnel.find(s => s.stage === 'Shortlisted')?.percentage || 0}%</div>
                                            <small className="text-muted">Shortlist Rate</small>
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
