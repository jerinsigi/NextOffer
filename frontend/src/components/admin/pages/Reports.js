import React, { useState, useEffect, useCallback } from 'react';
import './Reports.css';
import axios from 'axios';
import Loader from '../../common/Loader';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Reports = () => {
    const [dateRange, setDateRange] = useState('last30days');
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('interviews'); // 'interviews' | 'applications'
    const [stats, setStats] = useState({
        overview: {
            totalCandidates: 0,
            interviewsConducted: 0,
            totalCompanies: 0,
            totalJobs: 0,
            totalApplications: 0,
            hiredCount: 0,
            hiringRate: 0
        },
        interviewTrends: [],
        applicationTrends: [],
        companiesData: [],
        skillsAnalysis: [],
        applicationStatus: [],
        jobCategoryDist: [],
        platformGrowth: { candidateGrowth: [], companyGrowth: [] }
    });

    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/api/reports/dashboard-stats`, {
                params: { dateRange }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    // ── Utilities ─────────────────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const formatMonth = (monthStr) => {
        const [y, m] = monthStr.split('-');
        return new Date(y, m - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    };

    const STATUS_COLORS = {
        Applied: '#3b82f6',
        Shortlisted: '#f59e0b',
        Interviewing: '#8b5cf6',
        Hired: '#10b981',
        Rejected: '#ef4444'
    };

    // ── SVG Line Chart Helper ──────────────────────────────────────────────────
    const buildLineChart = (data, keys, colors, labelFn, viewW = 560, viewH = 200) => {
        if (!data || data.length === 0) {
            return (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-bar-chart-line fs-2 mb-2 d-block opacity-50"></i>
                    <span>No data for this period</span>
                </div>
            );
        }
        const padL = 40, padR = 20, padT = 16, padB = 36;
        const chartW = viewW - padL - padR;
        const chartH = viewH - padT - padB;
        const maxVal = Math.max(...data.flatMap(d => keys.map(k => d[k] || 0)), 1);
        const scaleX = (i) => padL + (i / (data.length - 1 || 1)) * chartW;
        const scaleY = (v) => padT + chartH - (v / maxVal) * chartH;
        const gridLines = [0, 0.25, 0.5, 0.75, 1];

        return (
            <svg viewBox={`0 0 ${viewW} ${viewH}`} className="line-chart">
                {/* Grid */}
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line
                            x1={padL} y1={padT + chartH * (1 - g)}
                            x2={viewW - padR} y2={padT + chartH * (1 - g)}
                            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                        />
                        <text x={padL - 6} y={padT + chartH * (1 - g) + 4}
                            fill="#64748b" fontSize="10" textAnchor="end">
                            {Math.round(maxVal * g)}
                        </text>
                    </g>
                ))}
                {/* Lines & dots */}
                {keys.map((key, ki) => {
                    const pts = data.map((d, i) => `${scaleX(i)},${scaleY(d[key] || 0)}`).join(' ');
                    // Area fill
                    const areaPath = `M ${scaleX(0)},${padT + chartH} ` +
                        data.map((d, i) => `L ${scaleX(i)},${scaleY(d[key] || 0)}`).join(' ') +
                        ` L ${scaleX(data.length - 1)},${padT + chartH} Z`;
                    return (
                        <g key={key}>
                            <defs>
                                <linearGradient id={`grad${ki}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={colors[ki]} stopOpacity="0.25" />
                                    <stop offset="100%" stopColor={colors[ki]} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={areaPath} fill={`url(#grad${ki})`} />
                            <polyline points={pts} fill="none" stroke={colors[ki]} strokeWidth="2.5" strokeLinejoin="round" />
                            {data.map((d, i) => (
                                <circle key={i} cx={scaleX(i)} cy={scaleY(d[key] || 0)} r="3.5"
                                    fill={colors[ki]} stroke="#0f172a" strokeWidth="1.5" />
                            ))}
                        </g>
                    );
                })}
                {/* X labels */}
                {data.map((d, i) => {
                    const isFirst = i === 0;
                    const isLast = i === data.length - 1;
                    const showEvery = data.length > 10 ? Math.ceil(data.length / 6) : 1;
                    if (i % showEvery !== 0 && !isLast) return null;
                    return (
                        <text key={i} x={scaleX(i)} y={viewH - 6}
                            fill="#64748b" fontSize="10" textAnchor="middle">
                            {labelFn(d._id)}
                        </text>
                    );
                })}
            </svg>
        );
    };

    // ── Donut Chart ────────────────────────────────────────────────────────────
    const buildDonut = (data, colorMap) => {
        const total = data.reduce((acc, d) => acc + d.count, 0);
        if (total === 0) {
            return (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-pie-chart fs-2 mb-2 d-block opacity-50"></i>
                    <span>No applications yet</span>
                </div>
            );
        }
        const r = 70, cx = 90, cy = 90, stroke = 28;
        const circ = 2 * Math.PI * r;
        let offset = 0;
        const slices = data.map((item) => {
            const pct = item.count / total;
            const dash = pct * circ;
            const slice = (
                <circle key={item.status}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={colorMap[item.status] || '#64748b'}
                    strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeDashoffset={-offset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
            );
            offset += dash;
            return slice;
        });

        return (
            <div className="donut-chart-container flex-column w-100 mb-0">
                <svg viewBox="0 0 180 180" className="donut-chart mx-auto">
                    {slices}
                    <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">{total}</text>
                    <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="10">Total Apps</text>
                </svg>
                <div className="d-flex flex-column gap-2 mt-4 px-3 w-100">
                    {data.map(item => (
                        <div key={item.status} className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <span className="legend-dot" style={{ background: colorMap[item.status] || '#64748b' }}></span>
                                <span className="text-light" style={{ fontSize: '0.85rem' }}>{item.status}</span>
                            </div>
                            <div className="text-end">
                                <span className="text-white fw-bold me-2" style={{ fontSize: '0.9rem' }}>{item.count}</span>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{total > 0 ? Math.round((item.count / total) * 100) : 0}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Horizontal Bar Chart (Skills / Categories) ─────────────────────────────
    const buildHBar = (data, valueKey, labelKey, color) => {
        if (!data || data.length === 0) {
            return <div className="text-center text-muted py-4"><i className="bi bi-bar-chart d-block mb-2 fs-2 opacity-50"></i><span>No data</span></div>;
        }
        const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
        return (
            <div className="violation-list mt-0 pt-0">
                {data.map((item, i) => {
                    const pct = (item[valueKey] / maxVal) * 100;
                    return (
                        <div key={i} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-light text-truncate pe-2" style={{ fontSize: '0.85rem' }}>{item[labelKey] || item._id || 'Unknown'}</span>
                                <span className="text-light fw-bold" style={{ fontSize: '0.85rem' }}>{item[valueKey]}</span>
                            </div>
                            <div className="progress mx-0" style={{ height: '6px' }}>
                                <div className="progress-bar"
                                    style={{ width: `${pct}%`, background: color }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <Loader />;

    const {
        overview, interviewTrends, applicationTrends, companiesData,
        skillsAnalysis, applicationStatus, jobCategoryDist, platformGrowth
    } = stats;

    const trendData = activeChart === 'interviews' ? interviewTrends : applicationTrends;
    const trendKeys = activeChart === 'interviews' ? ['interviews', 'completed'] : ['applications', 'hired'];
    const trendColors = activeChart === 'interviews' ? ['#6366f1', '#10b981'] : ['#3b82f6', '#f59e0b'];
    const trendLabels = activeChart === 'interviews'
        ? [{ color: '#6366f1', label: 'Scheduled' }, { color: '#10b981', label: 'Completed' }]
        : [{ color: '#3b82f6', label: 'Applications' }, { color: '#f59e0b', label: 'Hired' }];

    const KPI_CARDS = [
        {
            icon: 'bi-people-fill',
            color: '#6366f1',
            bg: 'rgba(99,102,241,0.12)',
            value: overview.totalCandidates?.toLocaleString(),
            label: 'Total Candidates',
            sub: 'Registered users on platform'
        },
        {
            icon: 'bi-building',
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.12)',
            value: overview.totalCompanies?.toLocaleString(),
            label: 'Registered Companies',
            sub: 'Active hiring partners'
        },
        {
            icon: 'bi-briefcase-fill',
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.12)',
            value: overview.totalJobs?.toLocaleString(),
            label: 'Jobs Posted',
            sub: 'Open & closed positions'
        },
        {
            icon: 'bi-send-fill',
            color: '#8b5cf6',
            bg: 'rgba(139,92,246,0.12)',
            value: overview.totalApplications?.toLocaleString(),
            label: 'Total Applications',
            sub: 'Across all job postings'
        },
        {
            icon: 'bi-camera-video-fill',
            color: '#10b981',
            bg: 'rgba(16,185,129,0.12)',
            value: overview.interviewsConducted?.toLocaleString(),
            label: 'Interviews Completed',
            sub: 'AI interviews finished'
        },
        {
            icon: 'bi-trophy-fill',
            color: '#ec4899',
            bg: 'rgba(236,72,153,0.12)',
            value: `${overview.hiringRate ?? 0}%`,
            label: 'Platform Hiring Rate',
            sub: `${overview.hiredCount?.toLocaleString()} candidates hired`
        }
    ];

    return (
        <div className="dashboard-container">

            {/* ── Page Header ── */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="text-muted">Platform-wide insights and performance metrics</p>
                </div>
                <div className="header-actions">
                    <select
                        className="form-select form-select-dark d-inline-block w-auto"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="last90days">Last 90 Days</option>
                        <option value="alltime">All Time</option>
                    </select>
                    <button className="btn btn-outline-secondary ms-2" onClick={fetchDashboardStats} title="Refresh data">
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="row g-4 mb-4">
                {KPI_CARDS.map((card, i) => (
                    <div className="col-xl-2 col-lg-4 col-sm-6" key={i}>
                        <div className="metric-card" style={{ '--accent': card.color, '--accent-bg': card.bg }}>
                            <div className="metric-header">
                                <i className={`bi ${card.icon}`} style={{ color: card.color }}></i>
                            </div>
                            <div className="metric-value">{card.value}</div>
                            <div className="metric-label mb-0">{card.label}</div>
                            <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>{card.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Trend Chart + App Status Donut ── */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="dashboard-card h-100">
                        <div className="card-header-custom align-items-center">
                            <div>
                                <h5 className="card-title mb-0">Activity Trends</h5>
                                <p className="text-muted small mb-0 mt-1">Performance over selected period</p>
                            </div>
                            <div className="btn-group">
                                <button
                                    className={`btn btn-sm ${activeChart === 'interviews' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveChart('interviews')}
                                >Interviews</button>
                                <button
                                    className={`btn btn-sm ${activeChart === 'applications' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveChart('applications')}
                                >Applications</button>
                            </div>
                        </div>
                        <div className="p-4 pt-2">
                            <div className="chart-legend mb-3">
                                {trendLabels.map(l => (
                                    <span key={l.label} className="legend-item">
                                        <span className="legend-dot" style={{ background: l.color }}></span>
                                        {l.label}
                                    </span>
                                ))}
                            </div>
                            <div className="chart-container" style={{ height: '240px' }}>
                                {buildLineChart(trendData, trendKeys, trendColors, formatDate)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="dashboard-card h-100">
                        <div className="card-header-custom">
                            <div>
                                <h5 className="card-title mb-0">Application Status</h5>
                                <p className="text-muted small mb-0 mt-1">Breakdown by stage</p>
                            </div>
                        </div>
                        <div className="p-4 d-flex align-items-center justify-content-center flex-column h-100 pb-5">
                            {buildDonut(applicationStatus, STATUS_COLORS)}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Skills + Job Categories ── */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <div className="dashboard-card h-100">
                        <div className="card-header-custom">
                            <div>
                                <h5 className="card-title mb-0">Top Skills in Demand</h5>
                                <p className="text-muted small mb-0 mt-1">Based on job postings</p>
                            </div>
                            <span className="badge" style={{ backgroundColor: '#3b82f622', color: '#3b82f6' }}>{skillsAnalysis.length} skills</span>
                        </div>
                        <div className="p-4">
                            {buildHBar(skillsAnalysis, 'demand', 'skill', 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)')}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card h-100">
                        <div className="card-header-custom">
                            <div>
                                <h5 className="card-title mb-0">Jobs by Category</h5>
                                <p className="text-muted small mb-0 mt-1">Distribution of posted positions</p>
                            </div>
                            <span className="badge" style={{ backgroundColor: '#06b6d422', color: '#06b6d4' }}>{jobCategoryDist.length} categories</span>
                        </div>
                        <div className="p-4">
                            {buildHBar(jobCategoryDist, 'count', '_id', 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)')}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Top Companies Table ── */}
            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <div>
                                <h5 className="card-title mb-0">Top Companies by Activity</h5>
                                <p className="text-muted small mb-0 mt-1">Ranked by total jobs + interviews</p>
                            </div>
                            <span className="badge" style={{ backgroundColor: '#64748b', color: '#fff' }}>{companiesData.length} companies</span>
                        </div>
                        {companiesData.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-dark table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Company</th>
                                            <th>Jobs Posted</th>
                                            <th>Applications</th>
                                            <th>Interviews</th>
                                            <th>Hired</th>
                                            <th>Success Rate</th>
                                            <th>Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companiesData.map((company, index) => {
                                            const maxActivity = Math.max(...companiesData.map(c => c.totalJobs + c.interviews), 1);
                                            const activityPct = ((company.totalJobs + company.interviews) / maxActivity) * 100;
                                            const initials = company.name.substring(0, 2).toUpperCase();
                                            const avatarColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                                            const avatarColor = avatarColors[index % avatarColors.length];
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {index < 3 ? (
                                                            <span className="badge rounded-circle p-2" style={{ backgroundColor: `${avatarColor}22`, color: avatarColor }}>{index + 1}</span>
                                                        ) : (
                                                            <span className="text-muted">{index + 1}</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-sm rounded-circle d-flex align-items-center justify-content-center me-2" style={{ background: `${avatarColor}22`, color: avatarColor, width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                                {initials}
                                                            </div>
                                                            <span className="fw-bold">{company.name}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="text-muted fw-bold">{company.totalJobs}</span></td>
                                                    <td><span className="text-muted fw-bold">{company.candidates}</span></td>
                                                    <td><span className="text-muted fw-bold">{company.interviews}</span></td>
                                                    <td><span className="text-success fw-bold">{company.hired ?? 0}</span></td>
                                                    <td>
                                                        <span 
                                                            className="badge" 
                                                            style={{ 
                                                                color: company.successRate >= 50 ? '#10b981' : company.successRate >= 20 ? '#f59e0b' : '#ef4444',
                                                                backgroundColor: company.successRate >= 50 ? '#10b98122' : company.successRate >= 20 ? '#f59e0b22' : '#ef444422',
                                                                padding: '6px 12px'
                                                            }}
                                                        >
                                                            {company.successRate ?? 0}%
                                                        </span>
                                                    </td>
                                                    <td style={{ minWidth: '150px', verticalAlign: 'middle' }}>
                                                        <div className="progress mx-0" style={{ height: '6px' }}>
                                                            <div className="progress-bar"
                                                                style={{ width: `${activityPct}%`, background: avatarColor }}>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <i className="bi bi-building fs-1 d-block mb-3 opacity-50"></i>
                                <span>No company data available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Reports;

