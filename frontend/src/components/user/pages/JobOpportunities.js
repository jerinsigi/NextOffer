import React, { useState, useEffect } from 'react';
import './JobOpportunities.css';

const JobOpportunities = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);

    // Modal & Selection State
    const [selectedJob, setSelectedJob] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Application State
    const [userApplications, setUserApplications] = useState([]);
    const [applying, setApplying] = useState(false);

    // Application Form
    const [applicationForm, setApplicationForm] = useState({
        resumeUrl: '',
        coverLetter: ''
    });

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = React.useMemo(() => userStr ? JSON.parse(userStr) : null, [userStr]);

    useEffect(() => {
        fetchActiveJobs();
        fetchJobCategories();
        if (user) {
            fetchUserApplications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount. User from localStorage is stable for the session.

    const fetchActiveJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/job-descriptions/active');
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/job-categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchUserApplications = async () => {
        if (!user || (!user._id && !user.id)) return; // Ensure we have ID
        // Note: user object in storage might differ, typically has _id from mongo
        const userId = user._id || user.id;
        try {
            const response = await fetch(`http://localhost:5000/api/applications/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const hasApplied = (jobId) => {
        return userApplications.some(app => app.Fk_job_id && (app.Fk_job_id === jobId || app.Fk_job_id._id === jobId));
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to apply.');
            return;
        }

        setApplying(true);
        try {
            const payload = {
                candidateId: user._id || user.id,
                jobId: selectedJob._id,
                resumeUrl: applicationForm.resumeUrl || user.resumeUrl || '', // Fallback to profile resume if available
                coverLetter: applicationForm.coverLetter
            };

            const response = await fetch('http://localhost:5000/api/applications/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Application submitted successfully!');
                fetchUserApplications(); // Update application list
                setShowDetailModal(false);
                setApplicationForm({ resumeUrl: '', coverLetter: '' });
            } else {
                alert(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error applying:', error);
            alert('Error submitting application');
        } finally {
            setApplying(false);
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
        // Pre-fill resume if user has one in profile (mock logic if user object has it)
        if (user && user.resumeUrl) {
            setApplicationForm(prev => ({ ...prev, resumeUrl: user.resumeUrl }));
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.Fk_company_id?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || job.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || job.job_title === categoryFilter; // Simplistic matching
        return matchesSearch && matchesType && matchesCategory;
    });

    return (
        <div className="job-opportunities-container">
            <div className="jobs-header">
                <h2>Job Opportunities</h2>
                <p className="text-muted">Find and apply for the perfect job that matches your skills.</p>
            </div>

            {/* Search & Filter */}
            <div className="jobs-search-section">
                <div className="search-grid">
                    <div className="search-input-wrapper">
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by job title or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        className="filter-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
            </div>

            {/* Job Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="jobs-grid">
                    {filteredJobs.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <h5 className="text-muted">No jobs found matching your criteria.</h5>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job._id} className="user-job-card" onClick={() => handleViewDetails(job)}>
                                <div className="job-card-top">
                                    <div className="company-logo-wrapper">
                                        {job.Fk_company_id?.logoUrl ? (
                                            <img src={`http://localhost:5000${job.Fk_company_id.logoUrl}`} alt="Logo" className="company-logo-img" />
                                        ) : (
                                            <span className="company-fallback">{job.Fk_company_id?.companyName?.[0] || 'C'}</span>
                                        )}
                                    </div>
                                    <span className="job-type-tag">{job.type}</span>
                                </div>
                                <div className="job-info">
                                    <h3>{job.job_title}</h3>
                                    <div className="company-name">
                                        {job.Fk_company_id?.companyName || 'Unknown Company'}
                                        {hasApplied(job._id) && <i className="bi bi-check-circle-fill text-success ms-2" title="Applied"></i>}
                                    </div>
                                </div>
                                <div className="job-meta-grid">
                                    <div className="meta-item">
                                        <i className="bi bi-geo-alt"></i> {job.location}
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-currency-dollar"></i> {job.salary}
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-briefcase"></i> {job.experience_required}
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-people"></i> {job.department}
                                    </div>
                                </div>
                                <div className="job-card-actions">
                                    <span className="posted-date">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    <button className="btn-view-details">
                                        {hasApplied(job._id) ? 'View Status' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Job Details Modal */}
            {showDetailModal && selectedJob && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content job-apply-modal">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    {selectedJob.job_title}
                                    <span className="text-muted ms-2 fs-6">at {selectedJob.Fk_company_id?.companyName}</span>
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {/* Job Info Row */}
                                <div className="d-flex justify-content-between mb-4 flex-wrap gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="company-logo-wrapper" style={{ width: '60px', height: '60px' }}>
                                            {selectedJob.Fk_company_id?.logoUrl ? (
                                                <img src={`http://localhost:5000${selectedJob.Fk_company_id.logoUrl}`} alt="Logo" className="company-logo-img" />
                                            ) : (
                                                <span className="company-fallback fs-4">{selectedJob.Fk_company_id?.companyName?.[0] || 'C'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="fs-5 fw-bold">{selectedJob.department}</div>
                                            <div className="text-muted"><i className="bi bi-geo-alt"></i> {selectedJob.location}</div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fs-5 fw-bold text-success">{selectedJob.salary}</div>
                                        <div className="text-muted">{selectedJob.type}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <h6 className="text-primary mb-2">Description</h6>
                                    <p className="text-light opacity-75">{selectedJob.description}</p>
                                </div>

                                {/* Requirements & Benefits Grid */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <h6 className="text-primary mb-2">Requirements</h6>
                                        <ul className="list-unstyled">
                                            {selectedJob.requirements && selectedJob.requirements.map((req, idx) => (
                                                <li key={idx} className="mb-1 d-flex gap-2">
                                                    <i className="bi bi-dot text-primary"></i> <span className="opacity-75">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary mb-2">Benefits</h6>
                                        <ul className="list-unstyled">
                                            {selectedJob.benefits && selectedJob.benefits.map((ben, idx) => (
                                                <li key={idx} className="mb-1 d-flex gap-2">
                                                    <i className="bi bi-check2 text-success"></i> <span className="opacity-75">{ben}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Application Section */}
                                {hasApplied(selectedJob._id) ? (
                                    <div className="already-applied-banner">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        You have already applied for this position.
                                    </div>
                                ) : (
                                    <div className="apply-section">
                                        <h5 className="mb-3">Apply Now</h5>
                                        <form onSubmit={handleApply}>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Resume URL (Link to your CV/Portfolio)</label>
                                                <input
                                                    type="url"
                                                    className="form-control bg-dark-input"
                                                    placeholder="https://..."
                                                    value={applicationForm.resumeUrl}
                                                    onChange={(e) => setApplicationForm({ ...applicationForm, resumeUrl: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Cover Letter (Optional)</label>
                                                <textarea
                                                    className="form-control bg-dark-input"
                                                    rows="3"
                                                    placeholder="Explain why you're a good fit..."
                                                    value={applicationForm.coverLetter}
                                                    onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-2" disabled={applying}>
                                                {applying ? 'Submitting...' : 'Submit Application'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobOpportunities;
