import React, { useState } from 'react';
import './Logs.css';

const Logs = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [selectedLog, setSelectedLog] = useState(null);

    const activityLogs = [
        {
            id: 'LOG-2045',
            timestamp: '2025-12-06 11:45:32',
            user: 'Vivek Kumar',
            userEmail: 'company@nextoffer.com',
            action: 'Updated Company Settings',
            target: 'TechCorp Inc.',
            category: 'Configuration',
            severity: 'Info',
            ipAddress: '192.168.1.100',
            details: 'Modified AI interview difficulty level from Medium to Hard',
            changes: { before: 'Medium', after: 'Hard' }
        },
        {
            id: 'LOG-2044',
            timestamp: '2025-12-06 11:30:15',
            user: 'Sarah Johnson',
            userEmail: 'sarah@cloudtech.com',
            action: 'Deleted Job Description',
            target: 'Senior Developer Position',
            category: 'Content',
            severity: 'Warning',
            ipAddress: '10.0.0.45',
            details: 'Permanently deleted job description JD-4523',
            changes: null
        },
        {
            id: 'LOG-2043',
            timestamp: '2025-12-06 11:15:08',
            user: 'System',
            userEmail: 'system@nextoffer.com',
            action: 'Integrity Violation Detected',
            target: 'Candidate #4589',
            category: 'Security',
            severity: 'Critical',
            ipAddress: '203.0.113.45',
            details: 'Multiple tab switches detected during interview session',
            changes: null
        },
        {
            id: 'LOG-2042',
            timestamp: '2025-12-06 10:55:22',
            user: 'Mike Brown',
            userEmail: 'mike@dataco.com',
            action: 'Created New User',
            target: 'Alice Williams (Recruiter)',
            category: 'User Management',
            severity: 'Info',
            ipAddress: '172.16.0.89',
            details: 'Added new recruiter account with basic permissions',
            changes: null
        },
        {
            id: 'LOG-2041',
            timestamp: '2025-12-06 10:30:45',
            user: 'Vivek Kumar',
            userEmail: 'company@nextoffer.com',
            action: 'Suspended User Account',
            target: 'John Doe (john.doe@example.com)',
            category: 'User Management',
            severity: 'Warning',
            ipAddress: '192.168.1.100',
            details: 'Account suspended due to policy violations',
            changes: { before: 'Active', after: 'Suspended' }
        },
        {
            id: 'LOG-2040',
            timestamp: '2025-12-06 10:10:18',
            user: 'System',
            userEmail: 'system@nextoffer.com',
            action: 'Database Backup Completed',
            target: 'Production Database',
            category: 'System',
            severity: 'Info',
            ipAddress: 'localhost',
            details: 'Automated daily backup completed successfully (Size: 2.4 GB)',
            changes: null
        },
        {
            id: 'LOG-2039',
            timestamp: '2025-12-06 09:45:33',
            user: 'Emma Wilson',
            userEmail: 'emma@techstart.com',
            action: 'Updated Job Description',
            target: 'Frontend Developer - Remote',
            category: 'Content',
            severity: 'Info',
            ipAddress: '198.51.100.23',
            details: 'Modified required skills and experience level',
            changes: null
        },
        {
            id: 'LOG-2038',
            timestamp: '2025-12-06 09:20:11',
            user: 'System',
            userEmail: 'system@nextoffer.com',
            action: 'Failed Login Attempt',
            target: 'company@nextoffer.com',
            category: 'Security',
            severity: 'Critical',
            ipAddress: '45.76.123.98',
            details: 'Multiple failed login attempts from suspicious IP',
            changes: null
        }
    ];

    const company = [
        {
            id: 'ADM-5067',
            timestamp: '2025-12-06 11:45:32',
            company: 'Super Company', companyEmail: 'scompany@nextoffer.com',
            action: 'Modified System Settings',
            module: 'Platform Configuration',
            description: 'Changed integrity threshold from 75% to 80%',
            ipAddress: '192.168.1.100',
            sessionId: 'SES-891234'
        },
        {
            id: 'ADM-5066',
            timestamp: '2025-12-06 10:30:45',
            company: 'Vivek Kumar',
            companyEmail: 'company@nextoffer.com',
            action: 'Suspended User Account',
            module: 'User Management',
            description: 'Suspended user: john.doe@example.com for policy violations',
            ipAddress: '192.168.1.100',
            sessionId: 'SES-891233'
        },
        {
            id: 'ADM-5065',
            timestamp: '2025-12-06 09:15:20',
            company: 'Vivek Kumar', companyEmail: 'company@nextoffer.com',
            action: 'Approved Company Registration',
            module: 'Company Management',
            description: 'Approved registration for CloudTech Solutions',
            ipAddress: '192.168.1.100',
            sessionId: 'SES-891232'
        },
        {
            id: 'ADM-5064',
            timestamp: '2025-12-05 16:40:12',
            company: 'Super Company', companyEmail: 'scompany@nextoffer.com',
            action: 'Updated AI Model Configuration',
            module: 'AI Settings',
            description: 'Updated resume screening AI model to v2.5',
            ipAddress: '192.168.1.100',
            sessionId: 'SES-891231'
        },
        {
            id: 'ADM-5063',
            timestamp: '2025-12-05 14:25:38',
            company: 'Vivek Kumar', companyEmail: 'company@nextoffer.com',
            action: 'Deleted Company Account',
            module: 'Company Management',
            description: 'Permanently deleted company: OldTech Inc.',
            ipAddress: '192.168.1.100',
            sessionId: 'SES-891230'
        }
    ];

    const apiLogs = [
        {
            id: 'API-8934',
            timestamp: '2025-12-06 11:50:23',
            endpoint: '/api/v1/interviews/start',
            method: 'POST',
            statusCode: 200,
            responseTime: '145ms',
            ipAddress: '203.0.113.67',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
            requestSize: '2.4 KB',
            responseSize: '5.1 KB'
        },
        {
            id: 'API-8933',
            timestamp: '2025-12-06 11:49:18',
            endpoint: '/api/v1/resume/upload',
            method: 'POST',
            statusCode: 201,
            responseTime: '892ms',
            ipAddress: '198.51.100.45',
            userAgent: 'Mozilla/5.0 (Macintosh)',
            requestSize: '1.2 MB',
            responseSize: '0.8 KB'
        },
        {
            id: 'API-8932',
            timestamp: '2025-12-06 11:48:05',
            endpoint: '/api/v1/auth/login',
            method: 'POST',
            statusCode: 401,
            responseTime: '56ms',
            ipAddress: '45.76.123.98',
            userAgent: 'PostmanRuntime/7.26.8',
            requestSize: '0.3 KB',
            responseSize: '0.2 KB'
        },
        {
            id: 'API-8931',
            timestamp: '2025-12-06 11:47:32',
            endpoint: '/api/v1/candidates/leaderboard',
            method: 'GET',
            statusCode: 200,
            responseTime: '234ms',
            ipAddress: '192.168.1.55',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
            requestSize: '0 KB',
            responseSize: '18.7 KB'
        },
        {
            id: 'API-8930',
            timestamp: '2025-12-06 11:46:10',
            endpoint: '/api/v1/jobs/create',
            method: 'POST',
            statusCode: 500,
            responseTime: '1203ms',
            ipAddress: '172.16.0.89',
            userAgent: 'Mozilla/5.0 (Macintosh)',
            requestSize: '4.5 KB',
            responseSize: '0.5 KB'
        }
    ];

    const errorLogs = [
        {
            id: 'ERR-3421',
            timestamp: '2025-12-06 11:46:10',
            level: 'Error',
            service: 'API Gateway',
            message: 'Database connection timeout',
            stackTrace: 'Error: Connection timeout at line 234 in db.service.js',
            affectedUsers: 12,
            resolved: false
        },
        {
            id: 'ERR-3420',
            timestamp: '2025-12-06 10:22:45',
            level: 'Warning',
            service: 'Resume Parser',
            message: 'Unable to extract skills from PDF',
            stackTrace: 'Warning: PDF parsing failed at resume.parser.js:156',
            affectedUsers: 3,
            resolved: true
        },
        {
            id: 'ERR-3419',
            timestamp: '2025-12-06 09:15:33',
            level: 'Critical',
            service: 'Interview Engine',
            message: 'WebRTC connection failed',
            stackTrace: 'Critical: ICE candidate gathering failed at webrtc.service.js:89',
            affectedUsers: 1,
            resolved: true
        },
        {
            id: 'ERR-3418',
            timestamp: '2025-12-05 18:30:20',
            level: 'Error',
            service: 'Email Service',
            message: 'SMTP server unreachable',
            stackTrace: 'Error: SMTP connection refused at email.service.js:45',
            affectedUsers: 8,
            resolved: true
        }
    ];

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'Critical': return 'text-danger';
            case 'Warning': return 'text-warning';
            case 'Info': return 'text-info';
            default: return 'text-muted';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'Critical': return 'bi-exclamation-triangle-fill';
            case 'Warning': return 'bi-exclamation-circle-fill';
            case 'Info': return 'bi-info-circle-fill';
            default: return 'bi-circle-fill';
        }
    };

    const getStatusCodeClass = (code) => {
        if (code >= 200 && code < 300) return 'text-success';
        if (code >= 400 && code < 500) return 'text-warning';
        if (code >= 500) return 'text-danger';
        return 'text-info';
    };

    const getMethodBadgeClass = (method) => {
        switch (method) {
            case 'GET': return 'bg-info';
            case 'POST': return 'bg-success';
            case 'PUT': return 'bg-warning';
            case 'DELETE': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Logs & Audit Trail</h1>
                    <p className="text-muted">Monitor system activity, company actions, and error logs</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-download me-2"></i>Export Logs
                    </button>
                    <button className="btn btn-outline-danger">
                        <i className="bi bi-trash me-2"></i>Clear Old Logs
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                            <i className="bi bi-activity fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Events Today</div>
                            <div className="stat-value">1,247</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 18% from yesterday
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-danger bg-opacity-20 text-danger">
                            <i className="bi bi-exclamation-triangle fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Critical Events</div>
                            <div className="stat-value">3</div>
                            <div className="stat-change negative">
                                <i className="bi bi-arrow-up"></i> 1 unresolved
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-hdd-network fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">API Requests</div>
                            <div className="stat-value">45.2K</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> 99.8% success
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon bg-success bg-opacity-20 text-success">
                            <i className="bi bi-shield-check fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Company Actions</div>
                            <div className="stat-value">127</div>
                            <div className="stat-change positive">
                                <i className="bi bi-arrow-up"></i> All authorized
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="logs-tabs mb-4">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                            onClick={() => setActiveTab('activity')}
                        >
                            <i className="bi bi-activity me-2"></i>
                            Activity Logs
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'company' ? 'active' : ''}`}
                            onClick={() => setActiveTab('company')}
                        >
                            <i className="bi bi-shield-lock me-2"></i>
                            Company Actions
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'api' ? 'active' : ''}`}
                            onClick={() => setActiveTab('api')}
                        >
                            <i className="bi bi-hdd-network me-2"></i>
                            API Logs
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'errors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('errors')}
                        >
                            <i className="bi bi-bug me-2"></i>
                            Error Logs
                            <span className="badge bg-danger ms-2">1</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Activity Logs Tab */}
            {activeTab === 'activity' && (
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="dashboard-card">
                            <div className="card-header-custom">
                                <h5 className="card-title mb-0">Activity Logs</h5>
                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm form-control-dark"
                                        placeholder="Search logs..."
                                        style={{ width: '200px' }}
                                    />
                                    <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                        <option>All Categories</option>
                                        <option>Configuration</option>
                                        <option>Content</option>
                                        <option>Security</option>
                                        <option>User Management</option>
                                        <option>System</option>
                                    </select>
                                </div>
                            </div>
                            <div className="log-list">
                                {activityLogs.map(log => (
                                    <div
                                        key={log.id}
                                        className={`log-item ${selectedLog?.id === log.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <div className="d-flex gap-3">
                                            <div className="log-icon">
                                                <i className={`bi ${getSeverityIcon(log.severity)} ${getSeverityClass(log.severity)}`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="log-action mb-1">{log.action}</h6>
                                                        <div className="log-meta">
                                                            <span><i className="bi bi-person me-1"></i>{log.user}</span>
                                                            <span><i className="bi bi-tag me-1"></i>{log.category}</span>
                                                            <span><i className="bi bi-bullseye me-1"></i>{log.target}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <small className="text-muted d-block">{log.timestamp}</small>
                                                        <span className="badge bg-secondary bg-opacity-20 text-secondary">
                                                            {log.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Log Details Panel */}
                    <div className="col-lg-5">
                        <div className="dashboard-card sticky-top" style={{ top: '90px' }}>
                            {selectedLog ? (
                                <>
                                    <div className="card-header-custom">
                                        <h5 className="card-title mb-0">Log Details</h5>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedLog(null)}>
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <i className={`bi ${getSeverityIcon(selectedLog.severity)} ${getSeverityClass(selectedLog.severity)} fs-4`}></i>
                                                <span className={`badge ${selectedLog.severity === 'Critical' ? 'bg-danger' :
                                                    selectedLog.severity === 'Warning' ? 'bg-warning' : 'bg-info'
                                                    }`}>
                                                    {selectedLog.severity}
                                                </span>
                                            </div>
                                            <h5 className="text-light mb-3">{selectedLog.action}</h5>

                                            <div className="log-info-grid mb-4">
                                                <div className="info-item">
                                                    <label className="text-muted small">Log ID</label>
                                                    <div className="text-light">{selectedLog.id}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Timestamp</label>
                                                    <div className="text-light">{selectedLog.timestamp}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">User</label>
                                                    <div className="text-light">{selectedLog.user}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Email</label>
                                                    <div className="text-light">{selectedLog.userEmail}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Category</label>
                                                    <div className="text-light">{selectedLog.category}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">Target</label>
                                                    <div className="text-light">{selectedLog.target}</div>
                                                </div>
                                                <div className="info-item">
                                                    <label className="text-muted small">IP Address</label>
                                                    <div className="text-light">{selectedLog.ipAddress}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="text-muted small mb-2 d-block">Details</label>
                                                <p className="text-light">{selectedLog.details}</p>
                                            </div>

                                            {selectedLog.changes && (
                                                <div className="changes-display mb-3">
                                                    <label className="text-muted small mb-2 d-block">Changes Made</label>
                                                    <div className="d-flex gap-3">
                                                        <div className="flex-grow-1">
                                                            <small className="text-muted d-block">Before</small>
                                                            <div className="change-value text-danger">{selectedLog.changes.before}</div>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-arrow-right text-muted"></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <small className="text-muted d-block">After</small>
                                                            <div className="change-value text-success">{selectedLog.changes.after}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-5 text-center">
                                    <i className="bi bi-file-earmark-text fs-1 text-muted mb-3 d-block"></i>
                                    <p className="text-muted">Select a log entry to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Company Actions Tab */}
            {activeTab === 'company' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Company Action Audit Trail</h5>
                        <input
                            type="text"
                            className="form-control form-control-sm form-control-dark"
                            placeholder="Search company actions..."
                            style={{ width: '250px' }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Action ID</th>
                                    <th>Timestamp</th>
                                    <th>Company</th>
                                    <th>Action</th>
                                    <th>Module</th>
                                    <th>Description</th>
                                    <th>IP Address</th>
                                    <th>Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {company.map(action => (
                                    <tr key={action.id}>
                                        <td><span className="text-primary">{action.id}</span></td>
                                        <td>{action.timestamp}</td>
                                        <td>
                                            <div>{action.company}</div>
                                            <small className="text-muted">{action.companyEmail}</small>
                                        </td>
                                        <td className="fw-bold text-light">{action.action}</td>
                                        <td><span className="badge bg-info bg-opacity-20 text-info">{action.module}</span></td>
                                        <td>{action.description}</td>
                                        <td><code className="text-muted">{action.ipAddress}</code></td>
                                        <td><small className="text-muted">{action.sessionId}</small></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* API Logs Tab */}
            {activeTab === 'api' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">API Request Logs</h5>
                        <div className="d-flex gap-2">
                            <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                <option>All Methods</option>
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>DELETE</option>
                            </select>
                            <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                                <option>All Status</option>
                                <option>2xx Success</option>
                                <option>4xx Client Error</option>
                                <option>5xx Server Error</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Timestamp</th>
                                    <th>Method</th>
                                    <th>Endpoint</th>
                                    <th>Status</th>
                                    <th>Response Time</th>
                                    <th>IP Address</th>
                                    <th>Request Size</th>
                                    <th>Response Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiLogs.map(api => (
                                    <tr key={api.id}>
                                        <td><span className="text-muted">{api.id}</span></td>
                                        <td>{api.timestamp}</td>
                                        <td><span className={`badge ${getMethodBadgeClass(api.method)}`}>{api.method}</span></td>
                                        <td><code className="text-info">{api.endpoint}</code></td>
                                        <td><span className={`fw-bold ${getStatusCodeClass(api.statusCode)}`}>{api.statusCode}</span></td>
                                        <td>{api.responseTime}</td>
                                        <td><code className="text-muted">{api.ipAddress}</code></td>
                                        <td>{api.requestSize}</td>
                                        <td>{api.responseSize}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Error Logs Tab */}
            {activeTab === 'errors' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Error & Exception Logs</h5>
                        <select className="form-select form-select-sm form-select-dark" style={{ width: 'auto' }}>
                            <option>All Levels</option>
                            <option>Critical</option>
                            <option>Error</option>
                            <option>Warning</option>
                        </select>
                    </div>
                    <div className="p-4">
                        <div className="error-logs-list">
                            {errorLogs.map(error => (
                                <div key={error.id} className="error-log-card mb-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`bi bi-exclamation-triangle-fill fs-3 ${error.level === 'Critical' ? 'text-danger' :
                                                error.level === 'Error' ? 'text-warning' : 'text-info'
                                                }`}></i>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className={`badge ${error.level === 'Critical' ? 'bg-danger' :
                                                        error.level === 'Error' ? 'bg-warning' : 'bg-info'
                                                        }`}>
                                                        {error.level}
                                                    </span>
                                                    <span className="text-muted">{error.id}</span>
                                                    {error.resolved ? (
                                                        <span className="badge bg-success">Resolved</span>
                                                    ) : (
                                                        <span className="badge bg-danger">Unresolved</span>
                                                    )}
                                                </div>
                                                <h6 className="text-light mb-1">{error.message}</h6>
                                                <small className="text-muted">
                                                    {error.service} • {error.timestamp} • Affected {error.affectedUsers} user(s)
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stack-trace-container">
                                        <label className="text-muted small mb-2">Stack Trace</label>
                                        <pre className="stack-trace">{error.stackTrace}</pre>
                                    </div>
                                    {!error.resolved && (
                                        <div className="mt-3">
                                            <button className="btn btn-sm btn-outline-success">
                                                <i className="bi bi-check-circle me-2"></i>Mark as Resolved
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;
