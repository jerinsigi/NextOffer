import React, { useState } from 'react';
import './JobDescriptions.css';

const JobDescriptions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Sample job data
    const jobsData = [
        {
            id: 1,
            title: 'Senior Full Stack Developer',
            company: 'TechCorp Inc.',
            department: 'Engineering',
            location: 'San Francisco, CA',
            type: 'Full-time',
            experience: '5-7 years',
            salary: '$120k - $160k',
            status: 'Active',
            postedDate: '2024-11-15',
            expiryDate: '2025-01-15',
            applications: 147,
            shortlisted: 12,
            interviewed: 8,
            hired: 0,
            views: 1243,
            description: 'We are looking for an experienced Full Stack Developer to join our growing team...',
            requirements: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
            benefits: ['Health Insurance', '401(k)', 'Remote Work', 'Stock Options']
        },
        {
            id: 2,
            title: 'Product Manager',
            company: 'Innovate Solutions',
            department: 'Product',
            location: 'New York, NY',
            type: 'Full-time',
            experience: '3-5 years',
            salary: '$100k - $140k',
            status: 'Active',
            postedDate: '2024-11-20',
            expiryDate: '2025-01-20',
            applications: 89,
            shortlisted: 15,
            interviewed: 6,
            hired: 1,
            views: 876,
            description: 'Join our product team to drive innovation and user-centric design...',
            requirements: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
            benefits: ['Health Insurance', 'Flexible Hours', 'Professional Development']
        },
        {
            id: 3,
            title: 'DevOps Engineer',
            company: 'StartupX',
            department: 'Infrastructure',
            location: 'Austin, TX',
            type: 'Full-time',
            experience: '4-6 years',
            salary: '$110k - $150k',
            status: 'Closed',
            postedDate: '2024-10-05',
            expiryDate: '2024-12-05',
            applications: 234,
            shortlisted: 20,
            interviewed: 12,
            hired: 2,
            views: 2134,
            description: 'Looking for a DevOps Engineer to build and maintain our infrastructure...',
            requirements: ['Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Linux'],
            benefits: ['Health Insurance', 'Equity', 'Unlimited PTO']
        },
        {
            id: 4,
            title: 'UX/UI Designer',
            company: 'MegaCorp Ltd.',
            department: 'Design',
            location: 'Seattle, WA',
            type: 'Contract',
            experience: '2-4 years',
            salary: '$80k - $110k',
            status: 'Active',
            postedDate: '2024-11-25',
            expiryDate: '2025-01-25',
            applications: 56,
            shortlisted: 8,
            interviewed: 3,
            hired: 0,
            views: 567,
            description: 'We need a creative UX/UI Designer to craft beautiful user experiences...',
            requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
            benefits: ['Health Insurance', 'Remote Work', 'Design Budget']
        },
        {
            id: 5,
            title: 'Data Scientist',
            company: 'TechVision',
            department: 'Data Analytics',
            location: 'Boston, MA',
            type: 'Full-time',
            experience: '3-5 years',
            salary: '$115k - $155k',
            status: 'Active',
            postedDate: '2024-11-28',
            expiryDate: '2025-01-28',
            applications: 198,
            shortlisted: 18,
            interviewed: 10,
            hired: 0,
            views: 1456,
            description: 'Join our data team to build ML models and drive data-driven decisions...',
            requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
            benefits: ['Health Insurance', '401(k)', 'Learning Budget', 'Flexible Hours']
        },
        {
            id: 6,
            title: 'Mobile App Developer',
            company: 'Global Industries',
            department: 'Mobile',
            location: 'Chicago, IL',
            type: 'Full-time',
            experience: '4-6 years',
            salary: '$105k - $145k',
            status: 'Draft',
            postedDate: '2024-12-01',
            expiryDate: '2025-02-01',
            applications: 0,
            shortlisted: 0,
            interviewed: 0,
            hired: 0,
            views: 0,
            description: 'Seeking an experienced Mobile Developer to build cross-platform apps...',
            requirements: ['React Native', 'iOS', 'Android', 'JavaScript', 'Firebase'],
            benefits: ['Health Insurance', 'Stock Options', 'Remote Work']
        },
        {
            id: 7,
            title: 'Backend Engineer',
            company: 'Future Tech',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            experience: '5-8 years',
            salary: '$130k - $170k',
            status: 'Active',
            postedDate: '2024-11-10',
            expiryDate: '2025-01-10',
            applications: 312,
            shortlisted: 25,
            interviewed: 15,
            hired: 1,
            views: 2876,
            description: 'Looking for a senior backend engineer to architect scalable systems...',
            requirements: ['Go', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka'],
            benefits: ['Health Insurance', 'Remote Work', '401(k)', 'Unlimited PTO']
        },
        {
            id: 8,
            title: 'Marketing Manager',
            company: 'Enterprise Corp',
            department: 'Marketing',
            location: 'Los Angeles, CA',
            type: 'Full-time',
            experience: '4-6 years',
            salary: '$95k - $130k',
            status: 'Paused',
            postedDate: '2024-11-01',
            expiryDate: '2025-01-01',
            applications: 45,
            shortlisted: 5,
            interviewed: 2,
            hired: 0,
            views: 456,
            description: 'Lead our marketing initiatives and drive brand awareness...',
            requirements: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
            benefits: ['Health Insurance', 'Bonus', 'Flexible Hours']
        }
    ];

    const companies = ['All Companies', ...new Set(jobsData.map(job => job.company))];

    const filteredJobs = jobsData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        const matchesCompany = companyFilter === 'all' || job.company === companyFilter;
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

    const handleEditJob = (job) => {
        console.log('Editing job:', job);
    };

    const handleCloneJob = (jobId) => {
        console.log('Cloning job:', jobId);
    };

    const handlePauseJob = (jobId) => {
        console.log('Pausing job:', jobId);
    };

    const handleActivateJob = (jobId) => {
        console.log('Activating job:', jobId);
    };

    const handleCloseJob = (jobId) => {
        if (window.confirm('Are you sure you want to close this job posting?')) {
            console.log('Closing job:', jobId);
        }
    };

    const handleDeleteJob = (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            console.log('Deleting job:', jobId);
        }
    };

    const calculateDaysRemaining = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Stats
    const stats = {
        total: jobsData.length,
        active: jobsData.filter(j => j.status === 'Active').length,
        draft: jobsData.filter(j => j.status === 'Draft').length,
        closed: jobsData.filter(j => j.status === 'Closed').length,
        totalApplications: jobsData.reduce((sum, j) => sum + j.applications, 0),
        avgApplications: Math.round(jobsData.reduce((sum, j) => sum + j.applications, 0) / jobsData.length)
    };

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Job Descriptions</h1>
                    <p className="text-muted">Manage all job postings and monitor applications</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary me-2">
                        <i className="bi bi-download me-2"></i>Export Jobs
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i>Post New Job
                    </button>
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
                            <div className="stat-trend text-muted">
                                {stats.active} active, {stats.draft} draft
                            </div>
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
                            <div className="stat-trend text-success">
                                <i className="bi bi-arrow-up"></i> Accepting applications
                            </div>
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
                            <div className="stat-trend text-muted">
                                Avg {stats.avgApplications} per job
                            </div>
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
                            <div className="stat-trend text-muted">
                                Last 30 days
                            </div>
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
                            const daysRemaining = calculateDaysRemaining(job.expiryDate);
                            return (
                                <div 
                                    key={job.id} 
                                    className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
                                    onClick={() => handleJobClick(job)}
                                >
                                    <div className="job-card-header">
                                        <div className="job-title-section">
                                            <h5 className="job-title">{job.title}</h5>
                                            <div className="job-meta">
                                                <span className="company-name">
                                                    <i className="bi bi-building"></i>
                                                    {job.company}
                                                </span>
                                                <span className="job-location">
                                                    <i className="bi bi-geo-alt"></i>
                                                    {job.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="job-status-section">
                                            <span className={`status-badge ${getStatusBadge(job.status)}`}>
                                                {job.status}
                                            </span>
                                            <span className={`type-badge ${getTypeBadge(job.type)}`}>
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="job-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Department:</span>
                                            <span className="detail-value">{job.department}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Experience:</span>
                                            <span className="detail-value">{job.experience}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Salary:</span>
                                            <span className="detail-value">{job.salary}</span>
                                        </div>
                                    </div>

                                    <div className="job-metrics">
                                        <div className="metric">
                                            <div className="metric-value">{job.applications}</div>
                                            <div className="metric-label">Applications</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.shortlisted}</div>
                                            <div className="metric-label">Shortlisted</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.interviewed}</div>
                                            <div className="metric-label">Interviewed</div>
                                        </div>
                                        <div className="metric">
                                            <div className="metric-value">{job.hired}</div>
                                            <div className="metric-label">Hired</div>
                                        </div>
                                    </div>

                                    <div className="job-footer">
                                        <div className="job-date-info">
                                            <span className="posted-date">
                                                Posted: {job.postedDate}
                                            </span>
                                            {job.status === 'Active' && (
                                                <span className={`expiry-info ${daysRemaining < 7 ? 'expiring-soon' : ''}`}>
                                                    <i className="bi bi-clock"></i>
                                                    {daysRemaining > 0 
                                                        ? `${daysRemaining} days remaining`
                                                        : 'Expired'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="job-actions">
                                            <button 
                                                className="btn-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditJob(job);
                                                }}
                                                title="Edit Job"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                className="btn-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloneJob(job.id);
                                                }}
                                                title="Clone Job"
                                            >
                                                <i className="bi bi-files"></i>
                                            </button>
                                            {job.status === 'Active' ? (
                                                <button 
                                                    className="btn-icon warning"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePauseJob(job.id);
                                                    }}
                                                    title="Pause Job"
                                                >
                                                    <i className="bi bi-pause-circle"></i>
                                                </button>
                                            ) : job.status === 'Paused' || job.status === 'Draft' ? (
                                                <button 
                                                    className="btn-icon success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActivateJob(job.id);
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
                                                    handleDeleteJob(job.id);
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
                                    <h4>{selectedJob.title}</h4>
                                    <div className="badges-row">
                                        <span className={`status-badge ${getStatusBadge(selectedJob.status)}`}>
                                            {selectedJob.status}
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
                                        <span className="detail-value">{selectedJob.company}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Department:</span>
                                        <span className="detail-value">{selectedJob.department}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedJob.location}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Position Details</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Experience Required:</span>
                                        <span className="detail-value">{selectedJob.experience}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Salary Range:</span>
                                        <span className="detail-value">{selectedJob.salary}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Employment Type:</span>
                                        <span className="detail-value">{selectedJob.type}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Description</h6>
                                    <p className="job-description">{selectedJob.description}</p>
                                </div>

                                <div className="detail-section">
                                    <h6>Requirements</h6>
                                    <div className="tags-list">
                                        {selectedJob.requirements.map((req, idx) => (
                                            <span key={idx} className="skill-tag">{req}</span>
                                        ))}
                                    </div>
                                </div>

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

                                <div className="detail-section">
                                    <h6>Statistics</h6>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.views}</div>
                                            <div className="stat-label">Views</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.applications}</div>
                                            <div className="stat-label">Applications</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.shortlisted}</div>
                                            <div className="stat-label">Shortlisted</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.interviewed}</div>
                                            <div className="stat-label">Interviewed</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Timeline</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Posted Date:</span>
                                        <span className="detail-value">{selectedJob.postedDate}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Expiry Date:</span>
                                        <span className="detail-value">{selectedJob.expiryDate}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleEditJob(selectedJob)}>
                                        <i className="bi bi-pencil me-2"></i>Edit Job Posting
                                    </button>
                                    <button className="btn btn-sm btn-secondary w-100 mb-2" onClick={() => handleCloneJob(selectedJob.id)}>
                                        <i className="bi bi-files me-2"></i>Clone Job
                                    </button>
                                    {selectedJob.status === 'Active' ? (
                                        <button className="btn btn-sm btn-warning w-100 mb-2" onClick={() => handlePauseJob(selectedJob.id)}>
                                            <i className="bi bi-pause-circle me-2"></i>Pause Posting
                                        </button>
                                    ) : selectedJob.status === 'Paused' || selectedJob.status === 'Draft' ? (
                                        <button className="btn btn-sm btn-success w-100 mb-2" onClick={() => handleActivateJob(selectedJob.id)}>
                                            <i className="bi bi-play-circle me-2"></i>Activate Posting
                                        </button>
                                    ) : null}
                                    {selectedJob.status !== 'Closed' && (
                                        <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => handleCloseJob(selectedJob.id)}>
                                            <i className="bi bi-archive me-2"></i>Close Job
                                        </button>
                                    )}
                                    <button className="btn btn-sm btn-danger w-100" onClick={() => handleDeleteJob(selectedJob.id)}>
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
