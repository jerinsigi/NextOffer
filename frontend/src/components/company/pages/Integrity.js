import React, { useState, useEffect } from 'react';
import './Integrity.css';
import Loader from '../../common/Loader';

const Integrity = () => {
    const [activeTab, setActiveTab] = useState('violations');
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Sample violations data
    const violationsData = [
        {
            id: 1,
            candidateName: 'Michael Chen',
            candidateEmail: 'mchen@startupx.io',
            position: 'DevOps Engineer',
            company: 'StartupX',
            interviewId: 'INT-2024-003',
            violationType: 'Tab Switching',
            severity: 'Critical',
            timestamp: '2024-12-05 03:25:18 PM',
            duration: '8 seconds',
            occurrences: 3,
            description: 'Candidate switched browser tabs multiple times during technical questions',
            evidence: 'Screen recording captured tab switches to Google and Stack Overflow',
            action: 'Interview Terminated',
            reviewedBy: 'System Auto',
            status: 'Confirmed',
            integrityScore: 45
        },
        {
            id: 2,
            candidateName: 'Sarah Williams',
            candidateEmail: 'swilliams@email.com',
            position: 'UX/UI Designer',
            company: 'MegaCorp Ltd.',
            interviewId: 'INT-2024-004',
            violationType: 'Tab Switching',
            severity: 'Minor',
            timestamp: '2024-12-05 03:15:42 PM',
            duration: '3 seconds',
            occurrences: 1,
            description: 'Single tab switch detected during portfolio presentation',
            evidence: 'Brief tab switch to design file',
            action: 'Warning Issued',
            reviewedBy: 'Company - Sarah Johnson',
            status: 'Reviewed',
            integrityScore: 92
        },
        {
            id: 3,
            candidateName: 'Emily Chen',
            candidateEmail: 'emily.chen@email.com',
            position: 'Product Manager',
            company: 'Innovate Solutions',
            interviewId: 'INT-2024-002',
            violationType: 'Gaze Aversion',
            severity: 'Minor',
            timestamp: '2024-12-06 09:45:30 AM',
            duration: '12 seconds',
            occurrences: 2,
            description: 'Candidate looked away from screen multiple times',
            evidence: 'Eye tracking data shows prolonged off-screen gaze',
            action: 'Flagged for Review',
            reviewedBy: 'Pending',
            status: 'Under Review',
            integrityScore: 95
        },
        {
            id: 4,
            candidateName: 'James Wilson',
            candidateEmail: 'jwilson@email.com',
            position: 'Mobile App Developer',
            company: 'Global Industries',
            interviewId: 'INT-2024-007',
            violationType: 'Presence Anomaly',
            severity: 'Critical',
            timestamp: '2024-12-05 10:02:15 AM',
            duration: '45 seconds',
            occurrences: 1,
            description: 'Multiple persons detected in camera frame',
            evidence: 'AI detected 2 faces in frame during technical assessment',
            action: 'Interview Terminated',
            reviewedBy: 'System Auto',
            status: 'Confirmed',
            integrityScore: 45
        },
        {
            id: 5,
            candidateName: 'Alex Martinez',
            candidateEmail: 'alex.m@email.com',
            position: 'Data Scientist',
            company: 'NexGen Systems',
            interviewId: 'INT-2024-009',
            violationType: 'Gaze Aversion',
            severity: 'Moderate',
            timestamp: '2024-12-06 09:30:22 AM',
            duration: '25 seconds',
            occurrences: 2,
            description: 'Extended periods of looking away from screen',
            evidence: 'Gaze tracking shows candidate reading off-screen notes',
            action: 'Warning Issued',
            reviewedBy: 'Company - David Kim',
            status: 'Reviewed',
            integrityScore: 78
        },
        {
            id: 6,
            candidateName: 'Robert Taylor',
            candidateEmail: 'rtaylor@future.io',
            position: 'Backend Engineer',
            company: 'Future Tech',
            interviewId: 'INT-2024-012',
            violationType: 'Tab Switching',
            severity: 'Moderate',
            timestamp: '2024-12-04 02:18:45 PM',
            duration: '15 seconds',
            occurrences: 2,
            description: 'Multiple tab switches during coding challenge',
            evidence: 'Screen recording shows switches to IDE documentation',
            action: 'Flagged for Review',
            reviewedBy: 'Company - Lisa Anderson',
            status: 'Reviewed',
            integrityScore: 72
        },
        {
            id: 7,
            candidateName: 'Jennifer Lee',
            candidateEmail: 'jlee@enterprise.com',
            position: 'HR Manager',
            company: 'Enterprise Corp',
            interviewId: 'INT-2024-008',
            violationType: 'Gaze Aversion',
            severity: 'Minor',
            timestamp: '2024-12-06 10:05:12 AM',
            duration: '8 seconds',
            occurrences: 1,
            description: 'Brief gaze aversion during behavioral questions',
            evidence: 'Eye tracking detected momentary look away',
            action: 'No Action',
            reviewedBy: 'Company - John Smith',
            status: 'Dismissed',
            integrityScore: 98
        },
        {
            id: 8,
            candidateName: 'David Kim',
            candidateEmail: 'david.kim@techvision.com',
            position: 'Full Stack Developer',
            company: 'TechVision',
            interviewId: 'INT-2024-005',
            violationType: 'Presence Anomaly',
            severity: 'Moderate',
            timestamp: '2024-12-05 08:40:33 PM',
            duration: '10 seconds',
            occurrences: 1,
            description: 'Background movement detected during interview',
            evidence: 'Motion detected in background, likely family member passing',
            action: 'Warning Issued',
            reviewedBy: 'Company - Emma Johnson',
            status: 'Reviewed',
            integrityScore: 88
        }
    ];

    // Compliance rules data
    const complianceRules = [
        {
            id: 1,
            name: 'Tab Switching Detection',
            category: 'Browser Monitoring',
            enabled: true,
            sensitivity: 'High',
            threshold: '2 occurrences',
            action: 'Auto-terminate after 3 violations',
            lastUpdated: '2024-11-15'
        },
        {
            id: 2,
            name: 'Gaze Tracking',
            category: 'Eye Monitoring',
            enabled: true,
            sensitivity: 'Medium',
            threshold: '30 seconds total',
            action: 'Flag for review after 25 seconds',
            lastUpdated: '2024-11-20'
        },
        {
            id: 3,
            name: 'Presence Detection',
            category: 'Face Recognition',
            enabled: true,
            sensitivity: 'High',
            threshold: 'Multiple faces',
            action: 'Immediate termination',
            lastUpdated: '2024-11-10'
        },
        {
            id: 4,
            name: 'Audio Analysis',
            category: 'Voice Monitoring',
            enabled: true,
            sensitivity: 'Medium',
            threshold: 'Multiple voices detected',
            action: 'Flag for review',
            lastUpdated: '2024-11-25'
        },
        {
            id: 5,
            name: 'Copy-Paste Detection',
            category: 'Input Monitoring',
            enabled: false,
            sensitivity: 'Low',
            threshold: '5 paste actions',
            action: 'Warning notification',
            lastUpdated: '2024-10-30'
        }
    ];

    const filteredViolations = violationsData.filter(violation => {
        const matchesSearch = violation.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            violation.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            violation.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;
        const matchesType = typeFilter === 'all' || violation.violationType === typeFilter;
        return matchesSearch && matchesSeverity && matchesType;
    });

    const getSeverityBadge = (severity) => {
        const badges = {
            'Critical': 'severity-badge-critical',
            'Moderate': 'severity-badge-moderate',
            'Minor': 'severity-badge-minor'
        };
        return badges[severity] || 'severity-badge-minor';
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Confirmed': 'status-badge-confirmed',
            'Under Review': 'status-badge-review',
            'Reviewed': 'status-badge-reviewed',
            'Dismissed': 'status-badge-dismissed'
        };
        return badges[status] || 'status-badge-review';
    };

    const getActionBadge = (action) => {
        const badges = {
            'Interview Terminated': 'action-badge-terminated',
            'Warning Issued': 'action-badge-warning',
            'Flagged for Review': 'action-badge-flagged',
            'No Action': 'action-badge-none'
        };
        return badges[action] || 'action-badge-flagged';
    };

    const handleViolationClick = (violation) => {
        setSelectedViolation(violation);
    };

    const handleDismissViolation = (id) => {
        console.log('Dismissing violation:', id);
    };

    const handleConfirmViolation = (id) => {
        console.log('Confirming violation:', id);
    };

    const handleViewEvidence = (evidence) => {
        console.log('Viewing evidence:', evidence);
    };

    // Stats
    const stats = {
        total: violationsData.length,
        critical: violationsData.filter(v => v.severity === 'Critical').length,
        moderate: violationsData.filter(v => v.severity === 'Moderate').length,
        minor: violationsData.filter(v => v.severity === 'Minor').length,
        tabSwitching: violationsData.filter(v => v.violationType === 'Tab Switching').length,
        gazeAversion: violationsData.filter(v => v.violationType === 'Gaze Aversion').length,
        presenceAnomaly: violationsData.filter(v => v.violationType === 'Presence Anomaly').length,
        underReview: violationsData.filter(v => v.status === 'Under Review').length
    };

    if (loading) return <Loader inline />;

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Integrity & Compliance</h1>
                    <p className="text-muted">Monitor and review integrity violations and candidate behavior</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary me-2">
                        <i className="bi bi-download me-2"></i>Export Report
                    </button>
                    <button className="btn btn-primary">
                        <i className="bi bi-gear me-2"></i>Configure Rules
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-danger bg-opacity-20 text-danger">
                            <i className="bi bi-shield-exclamation fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Violations</div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-trend text-danger">
                                <i className="bi bi-arrow-up"></i> {stats.critical} critical
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                            <i className="bi bi-eye-slash fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Gaze Aversion</div>
                            <div className="stat-value">{stats.gazeAversion}</div>
                            <div className="stat-trend text-muted">
                                Eye tracking violations
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-window fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tab Switching</div>
                            <div className="stat-value">{stats.tabSwitching}</div>
                            <div className="stat-trend text-muted">
                                Browser monitoring
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                            <i className="bi bi-person-x fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Presence Anomaly</div>
                            <div className="stat-value">{stats.presenceAnomaly}</div>
                            <div className="stat-trend text-muted">
                                Face detection alerts
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-card">
                <div className="card-header-custom">
                    <div className="integrity-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'violations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('violations')}
                        >
                            <i className="bi bi-exclamation-triangle"></i>
                            Violations ({stats.total})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rules')}
                        >
                            <i className="bi bi-shield-check"></i>
                            Compliance Rules
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            <i className="bi bi-graph-up"></i>
                            Analytics
                        </button>
                    </div>
                    {activeTab === 'violations' && (
                        <div className="integrity-filters">
                            <div className="search-box">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="form-control-dark"
                                    placeholder="Search violations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="form-select-dark"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="Tab Switching">Tab Switching</option>
                                <option value="Gaze Aversion">Gaze Aversion</option>
                                <option value="Presence Anomaly">Presence Anomaly</option>
                            </select>
                            <select
                                className="form-select-dark"
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                            >
                                <option value="all">All Severity</option>
                                <option value="Critical">Critical</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Minor">Minor</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="integrity-content">
                    {activeTab === 'violations' && (
                        <>
                            <div className="violations-list">
                                {filteredViolations.map(violation => (
                                    <div
                                        key={violation.id}
                                        className={`violation-card ${selectedViolation?.id === violation.id ? 'selected' : ''}`}
                                        onClick={() => handleViolationClick(violation)}
                                    >
                                        <div className="violation-header">
                                            <div className="violation-candidate">
                                                <div className="candidate-avatar-sm">
                                                    {violation.candidateName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h6 className="candidate-name">{violation.candidateName}</h6>
                                                    <p className="violation-position">{violation.position} • {violation.company}</p>
                                                </div>
                                            </div>
                                            <div className="violation-badges">
                                                <span className={`severity-badge ${getSeverityBadge(violation.severity)}`}>
                                                    {violation.severity}
                                                </span>
                                                <span className={`status-badge ${getStatusBadge(violation.status)}`}>
                                                    {violation.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="violation-details">
                                            <div className="detail-row">
                                                <span className="detail-icon"><i className="bi bi-flag-fill"></i></span>
                                                <span className="detail-text">{violation.violationType}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-icon"><i className="bi bi-clock"></i></span>
                                                <span className="detail-text">{violation.timestamp}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-icon"><i className="bi bi-hourglass-split"></i></span>
                                                <span className="detail-text">Duration: {violation.duration} • {violation.occurrences} occurrences</span>
                                            </div>
                                        </div>

                                        <div className="violation-description">
                                            {violation.description}
                                        </div>

                                        <div className="violation-footer">
                                            <span className={`action-badge ${getActionBadge(violation.action)}`}>
                                                {violation.action}
                                            </span>
                                            <div className="violation-score">
                                                <span className="score-label">Integrity Score:</span>
                                                <span className={`score-value ${violation.integrityScore < 60 ? 'low' : violation.integrityScore < 85 ? 'medium' : 'high'}`}>
                                                    {violation.integrityScore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Violation Details Panel */}
                            {selectedViolation && (
                                <div className="violation-details-panel">
                                    <div className="panel-header">
                                        <h5>Violation Details</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setSelectedViolation(null)}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="panel-content">
                                        <div className="violation-profile">
                                            <div className="candidate-avatar-large">
                                                {selectedViolation.candidateName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <h4>{selectedViolation.candidateName}</h4>
                                            <p className="text-muted">{selectedViolation.candidateEmail}</p>
                                            <div className="badges-row">
                                                <span className={`severity-badge ${getSeverityBadge(selectedViolation.severity)}`}>
                                                    {selectedViolation.severity}
                                                </span>
                                                <span className={`status-badge ${getStatusBadge(selectedViolation.status)}`}>
                                                    {selectedViolation.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Violation Information</h6>
                                            <div className="detail-item">
                                                <span className="detail-label">Type:</span>
                                                <span className="detail-value">{selectedViolation.violationType}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Interview ID:</span>
                                                <span className="detail-value">{selectedViolation.interviewId}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Timestamp:</span>
                                                <span className="detail-value">{selectedViolation.timestamp}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Duration:</span>
                                                <span className="detail-value">{selectedViolation.duration}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Occurrences:</span>
                                                <span className="detail-value">{selectedViolation.occurrences}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Position Details</h6>
                                            <div className="detail-item">
                                                <span className="detail-label">Position:</span>
                                                <span className="detail-value">{selectedViolation.position}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Company:</span>
                                                <span className="detail-value">{selectedViolation.company}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Description</h6>
                                            <p className="violation-description-full">{selectedViolation.description}</p>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Evidence</h6>
                                            <div className="evidence-box">
                                                <i className="bi bi-file-earmark-text text-primary"></i>
                                                <p>{selectedViolation.evidence}</p>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleViewEvidence(selectedViolation.evidence)}
                                                >
                                                    <i className="bi bi-eye me-2"></i>View Evidence
                                                </button>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Action Taken</h6>
                                            <div className="detail-item">
                                                <span className="detail-label">Action:</span>
                                                <span className={`action-badge ${getActionBadge(selectedViolation.action)}`}>
                                                    {selectedViolation.action}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Reviewed By:</span>
                                                <span className="detail-value">{selectedViolation.reviewedBy}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Integrity Score</h6>
                                            <div className="score-display">
                                                <div className={`score-circle ${selectedViolation.integrityScore < 60 ? 'low' : selectedViolation.integrityScore < 85 ? 'medium' : 'high'}`}>
                                                    <span className="score-number">{selectedViolation.integrityScore}</span>
                                                    <span className="score-max">/100</span>
                                                </div>
                                                <div className="score-info">
                                                    <p className="score-status">
                                                        {selectedViolation.integrityScore >= 85 ? 'Good Standing' :
                                                            selectedViolation.integrityScore >= 60 ? 'Moderate Risk' : 'High Risk'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedViolation.status === 'Under Review' && (
                                            <div className="detail-section">
                                                <h6>Review Actions</h6>
                                                <button
                                                    className="btn btn-sm btn-success w-100 mb-2"
                                                    onClick={() => handleDismissViolation(selectedViolation.id)}
                                                >
                                                    <i className="bi bi-check-circle me-2"></i>Dismiss Violation
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger w-100"
                                                    onClick={() => handleConfirmViolation(selectedViolation.id)}
                                                >
                                                    <i className="bi bi-exclamation-circle me-2"></i>Confirm Violation
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'rules' && (
                        <div className="compliance-rules">
                            <div className="rules-list">
                                {complianceRules.map(rule => (
                                    <div key={rule.id} className="rule-card">
                                        <div className="rule-header">
                                            <div className="rule-info">
                                                <h5>{rule.name}</h5>
                                                <p className="rule-category">{rule.category}</p>
                                            </div>
                                            <div className="rule-toggle">
                                                <label className="toggle-switch">
                                                    <input type="checkbox" checked={rule.enabled} readOnly />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="rule-details">
                                            <div className="rule-item">
                                                <span className="rule-label">Sensitivity:</span>
                                                <span className={`sensitivity-badge ${rule.sensitivity.toLowerCase()}`}>
                                                    {rule.sensitivity}
                                                </span>
                                            </div>
                                            <div className="rule-item">
                                                <span className="rule-label">Threshold:</span>
                                                <span className="rule-value">{rule.threshold}</span>
                                            </div>
                                            <div className="rule-item">
                                                <span className="rule-label">Action:</span>
                                                <span className="rule-value">{rule.action}</span>
                                            </div>
                                            <div className="rule-item">
                                                <span className="rule-label">Last Updated:</span>
                                                <span className="rule-value">{rule.lastUpdated}</span>
                                            </div>
                                        </div>
                                        <div className="rule-actions">
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="bi bi-pencil"></i> Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="analytics-content">
                            <div className="analytics-grid">
                                <div className="analytics-card">
                                    <h6>Violation Trends (Last 30 Days)</h6>
                                    <div className="trend-chart">
                                        <div className="chart-placeholder">
                                            <i className="bi bi-graph-up fs-1 text-muted"></i>
                                            <p className="text-muted">Chart visualization coming soon</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="analytics-card">
                                    <h6>Violations by Type</h6>
                                    <div className="type-breakdown">
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <i className="bi bi-window text-info"></i>
                                                Tab Switching
                                            </div>
                                            <div className="breakdown-value">{stats.tabSwitching}</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <i className="bi bi-eye-slash text-warning"></i>
                                                Gaze Aversion
                                            </div>
                                            <div className="breakdown-value">{stats.gazeAversion}</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <i className="bi bi-person-x text-primary"></i>
                                                Presence Anomaly
                                            </div>
                                            <div className="breakdown-value">{stats.presenceAnomaly}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="analytics-card">
                                    <h6>Severity Distribution</h6>
                                    <div className="severity-breakdown">
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <span className="severity-dot critical"></span>
                                                Critical
                                            </div>
                                            <div className="breakdown-value">{stats.critical}</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <span className="severity-dot moderate"></span>
                                                Moderate
                                            </div>
                                            <div className="breakdown-value">{stats.moderate}</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="breakdown-label">
                                                <span className="severity-dot minor"></span>
                                                Minor
                                            </div>
                                            <div className="breakdown-value">{stats.minor}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Integrity;
