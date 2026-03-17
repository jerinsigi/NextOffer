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

    const [violationsData, setViolationsData] = useState([]);
    const [complianceRules, setComplianceRules] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        moderate: 0,
        minor: 0,
        tabSwitching: 0,
        gazeAversion: 0,
        presenceAnomaly: 0,
        underReview: 0
    });

    useEffect(() => {
        const fetchIntegrityData = async () => {
             const userStr = localStorage.getItem('user');
             if (!userStr) {
                 setLoading(false);
                 return;
             }
             const user = JSON.parse(userStr);
             try {
                  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/companies/integrity-stats`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ email: user.email })
                  });
                  
                  if (response.ok) {
                      const data = await response.json();
                      setStats(data.stats);
                      setViolationsData(data.violationsData);
                      setComplianceRules(data.complianceRules || []);
                  }
             } catch (error) {
                 console.error('Failed to fetch integrity stats:', error);
             } finally {
                 setLoading(false);
             }
        };

        fetchIntegrityData();
    }, []);

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

    if (loading) return <Loader inline />;

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Integrity & Compliance</h1>
                    <p className="text-muted">Monitor and review integrity violations and candidate behavior</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-danger">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-shield-exclamation fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Violations</div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-change negative">
                                <i className="bi bi-arrow-up me-1"></i> {stats.critical} critical
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-warning">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-eye-slash fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Gaze Aversion</div>
                            <div className="stat-value">{stats.gazeAversion}</div>
                            <div className="stat-change neutral">
                                <i className="bi bi-activity me-1"></i> Eye tracking
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-info">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-window fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tab Switching</div>
                            <div className="stat-value">{stats.tabSwitching}</div>
                            <div className="stat-change neutral">
                                <i className="bi bi-app-indicator me-1"></i> Browser monitor
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-card-primary">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-person-x fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Presence Anomaly</div>
                            <div className="stat-value">{stats.presenceAnomaly}</div>
                            <div className="stat-change neutral">
                                <i className="bi bi-person-bounding-box me-1"></i> Face detection
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
