import React, { useState, useEffect } from 'react';
import './Logs.css';
import Loader from '../../common/Loader';

const Logs = () => {
    const [selectedLog, setSelectedLog] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    useEffect(() => {
        fetchActivityLogs();
    }, []);

    const fetchActivityLogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/dashboard/activity');
            if (response.ok) {
                const data = await response.json();
                
                // Format the timestamps to look nicer
                const formattedData = data.map(log => ({
                    ...log,
                    timestamp: new Date(log.timestamp).toLocaleString()
                }));
                
                setActivityLogs(formattedData);
            }
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return <Loader />;
    }

    const filteredLogs = activityLogs.filter(log => {
        const matchesSearch = searchTerm === '' || 
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All Categories' || log.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Logs & Audit Trail</h1>
                    <p className="text-muted">Monitor system activity, admin actions, and error logs</p>
                </div>
            </div>

            {/* Activity Logs Area */}
            <div className="row g-4 mt-2">
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <select 
                                        className="form-select form-select-sm form-select-dark" 
                                        style={{ width: 'auto' }}
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="All Categories">All Categories</option>
                                        <option value="Company Registration">Company Registration</option>
                                        <option value="User Registration">User Registration</option>
                                        <option value="Content">Content (Jobs)</option>
                                        <option value="Application">Application</option>
                                        <option value="System">System</option>
                                    </select>
                                </div>
                            </div>
                            <div className="log-list">
                                {filteredLogs.length > 0 ? filteredLogs.map(log => (
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
                                                        <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary">
                                                            {log.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center p-4 text-muted">
                                        No activity logs found matching the filters.
                                    </div>
                                )}
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
                                                <span className={`badge ${
                                                    selectedLog.severity === 'Critical' ? 'bg-danger' :
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
            </div>
    );
};

export default Logs;
