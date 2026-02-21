import React, { useState, useEffect } from 'react';
import './JobDescriptions.css';
import Loader from '../../common/Loader';

const JobDescriptions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch jobs from database
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/job-descriptions/admin/all');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobsData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load job descriptions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const companies = ['All Companies', ...new Set(jobsData.map(job =>
        job.Fk_company_id?.company_name || 'Unknown Company'
    ))];

    const filteredJobs = jobsData.filter(job => {
        const companyName = job.Fk_company_id?.company_name || '';
        const matchesSearch = job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.job_status === statusFilter;
        const matchesCompany = companyFilter === 'all' || companyName === companyFilter;
        return matchesSearch && matchesStatus && matchesCompany;
    });

    const getStatusBadge = (status) => {
        const badges = {
            'Active': 'status-badge-active',
            'Draft': 'status-badge-draft',
            'Closed': 'status-badge-closed',
            'Paused': 'status-badge-paused'
        };
        return badges[status] || 'status-badge-draft';
    };

    const getTypeBadge = (type) => {
        const badges = {
            'Full-time': 'type-badge-fulltime',
            'Part-time': 'type-badge-parttime',
            'Contract': 'type-badge-contract',
            'Internship': 'type-badge-internship'
        };
        return badges[type] || 'type-badge-fulltime';
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };


    const handlePauseJob = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/job-descriptions/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_status: 'Paused' })
            });
            if (response.ok) {
                fetchJobs(); // Refresh the list
            }
        } catch (err) {
            console.error('Error pausing job:', err);
        }
    };

    const handleActivateJob = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/job-descriptions/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_status: 'Active' })
            });
            if (response.ok) {
                fetchJobs(); // Refresh the list
            }
        } catch (err) {
            console.error('Error activating job:', err);
        }
    };

    const handleCloseJob = async (jobId) => {
        if (window.confirm('Are you sure you want to close this job posting?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/job-descriptions/${jobId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ job_status: 'Closed' })
                });
                if (response.ok) {
                    fetchJobs(); // Refresh the list
                }
            } catch (err) {
                console.error('Error closing job:', err);
            }
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/job-descriptions/${jobId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchJobs(); // Refresh the list
                    setSelectedJob(null); // Clear selection
                }
            } catch (err) {
                console.error('Error deleting job:', err);
            }
        }
    };

    const calculateDaysRemaining = (expiryDate) => {
        if (!expiryDate) return 'No expiry';
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Stats
    const stats = {
        total: jobsData.length,
        active: jobsData.filter(j => j.job_status === 'Active').length,
        draft: jobsData.filter(j => j.job_status === 'Draft').length,
        closed: jobsData.filter(j => j.job_status === 'Closed').length,
        totalApplications: jobsData.reduce((sum, j) => sum + (j.applications_count || 0), 0),
        avgApplications: jobsData.length > 0 ? Math.round(jobsData.reduce((sum, j) => sum + (j.applications_count || 0), 0) / jobsData.length) : 0
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchJobs}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Job Descriptions</h1>
                    <p className="text-muted">Manage all job postings and monitor applications</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                            <i className="bi bi-briefcase fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Jobs</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-success bg-opacity-20 text-success">
                            <i className="bi bi-check-circle fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active Postings</div>
                            <div className="stat-value">{stats.active}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-person-lines-fill fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Applications</div>
                            <div className="stat-value">{stats.totalApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                            <i className="bi bi-archive fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Closed Jobs</div>
                            <div className="stat-value">{stats.closed}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="dashboard-card">
                <div className="card-header-custom">
                    <h5 className="card-title mb-0">All Job Postings</h5>
                    <div className="jobs-filters">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control-dark"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select-dark"
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                        >
                            <option value="all">All Companies</option>
                            {companies.slice(1).map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                        <select
                            className="form-select-dark"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Paused">Paused</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
                <div className="jobs-content">
                    <div className="jobs-grid">
                        {filteredJobs.map(job => {
                            const daysRemaining = calculateDaysRemaining(job.end_date);
                            return (
                                <div
                                    key={job._id}
                                    className={`job-card ${selectedJob?._id === job._id ? 'selected' : ''}`}
                                    onClick={() => handleJobClick(job)}
                                >
                                    <div className="job-card-header">
                                        <div className="job-title-section">
                                            <h5 className="job-title">{job.job_title}</h5>
                                            <div className="job-meta">
                                                <span className="company-name">
                                                    <i className="bi bi-building"></i>
                                                    {job.Fk_company_id?.company_name || 'Unknown Company'}
                                                </span>
                                                <span className="job-location">
                                                    <i className="bi bi-geo-alt"></i>
                                                    {job.location || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="job-status-section">
                                            <span className={`status-badge ${getStatusBadge(job.job_status)}`}>
                                                {job.job_status}
                                            </span>
                                            <span className={`type-badge ${getTypeBadge(job.type)}`}>
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="job-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Department:</span>
                                            <span className="detail-value">{job.department || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Experience:</span>
                                            <span className="detail-value">{job.experience_required || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Salary:</span>
                                            <span className="detail-value">{job.salary || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="job-metrics">
                                        <div className="metric">
                                            <div className="metric-value">{job.applications_count || 0}</div>
                                            <div className="metric-label">Applications</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.shortlisted_count || 0}</div>
                                            <div className="metric-label">Shortlisted</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.interviewed_count || 0}</div>
                                            <div className="metric-label">Interviewed</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.hired_count || 0}</div>
                                            <div className="metric-label">Hired</div>
                                        </div>
                                    </div>

                                    <div className="job-footer">
                                        <div className="job-date-info">
                                            <span className="posted-date">
                                                Posted: {formatDate(job.start_date)}
                                            </span>
                                            {job.job_status === 'Active' && job.end_date && (
                                                <span className={`expiry-info ${daysRemaining < 7 ? 'expiring-soon' : ''}`}>
                                                    <i className="bi bi-clock"></i>
                                                    {daysRemaining > 0
                                                        ? `${daysRemaining} days remaining`
                                                        : 'Expired'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="job-actions">
                                            {job.job_status === 'Active' ? (
                                                <button
                                                    className="btn-icon warning"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePauseJob(job._id);
                                                    }}
                                                    title="Pause Job"
                                                >
                                                    <i className="bi bi-pause-circle"></i>
                                                </button>
                                            ) : job.job_status === 'Paused' || job.job_status === 'Draft' ? (
                                                <button
                                                    className="btn-icon success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActivateJob(job._id);
                                                    }}
                                                    title="Activate Job"
                                                >
                                                    <i className="bi bi-play-circle"></i>
                                                </button>
                                            ) : null}
                                            <button
                                                className="btn-icon danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteJob(job._id);
                                                }}
                                                title="Delete Job"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Job Details Panel */}
                    {selectedJob && (
                        <div className="job-details-panel">
                            <div className="panel-header">
                                <h5>Job Details</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedJob(null)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="panel-content">
                                <div className="job-header-section">
                                    <h4>{selectedJob.job_title}</h4>
                                    <div className="badges-row">
                                        <span className={`status-badge ${getStatusBadge(selectedJob.job_status)}`}>
                                            {selectedJob.job_status}
                                        </span>
                                        <span className={`type-badge ${getTypeBadge(selectedJob.type)}`}>
                                            {selectedJob.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Company Information</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Company:</span>
                                        <span className="detail-value">{selectedJob.Fk_company_id?.company_name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Department:</span>
                                        <span className="detail-value">{selectedJob.department || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedJob.location || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Position Details</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Experience Required:</span>
                                        <span className="detail-value">{selectedJob.experience_required || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Salary Range:</span>
                                        <span className="detail-value">{selectedJob.salary || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Employment Type:</span>
                                        <span className="detail-value">{selectedJob.type}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Description</h6>
                                    <p className="job-description">{selectedJob.description || 'No description provided.'}</p>
                                </div>

                                {selectedJob.skills && selectedJob.skills.length > 0 && (
                                    <div className="detail-section">
                                        <h6>Required Skills</h6>
                                        <div className="tags-list">
                                            {selectedJob.skills.map((skill, idx) => (
                                                <span key={idx} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                                    <div className="detail-section">
                                        <h6>Benefits</h6>
                                        <div className="benefits-list">
                                            {selectedJob.benefits.map((benefit, idx) => (
                                                <div key={idx} className="benefit-item">
                                                    <i className="bi bi-check-circle text-success"></i>
                                                    <span>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="detail-section">
                                    <h6>Statistics</h6>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.views || 0}</div>
                                            <div className="stat-label">Views</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.applications_count || 0}</div>
                                            <div className="stat-label">Applications</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.shortlisted_count || 0}</div>
                                            <div className="stat-label">Shortlisted</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.interviewed_count || 0}</div>
                                            <div className="stat-label">Interviewed</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Timeline</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Posted Date:</span>
                                        <span className="detail-value">{formatDate(selectedJob.start_date)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Expiry Date:</span>
                                        <span className="detail-value">{formatDate(selectedJob.end_date)}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    {selectedJob.job_status === 'Active' ? (
                                        <button className="btn btn-sm btn-warning w-100 mb-2" onClick={() => handlePauseJob(selectedJob._id)}>
                                            <i className="bi bi-pause-circle me-2"></i>Pause Posting
                                        </button>
                                    ) : selectedJob.job_status === 'Paused' || selectedJob.job_status === 'Draft' ? (
                                        <button className="btn btn-sm btn-success w-100 mb-2" onClick={() => handleActivateJob(selectedJob._id)}>
                                            <i className="bi bi-play-circle me-2"></i>Activate Posting
                                        </button>
                                    ) : null}
                                    {selectedJob.job_status !== 'Closed' && (
                                        <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => handleCloseJob(selectedJob._id)}>
                                            <i className="bi bi-archive me-2"></i>Close Job
                                        </button>
                                    )}
                                    <button className="btn btn-sm btn-danger w-100" onClick={() => handleDeleteJob(selectedJob._id)}>
                                        <i className="bi bi-trash me-2"></i>Delete Job
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDescriptions;
