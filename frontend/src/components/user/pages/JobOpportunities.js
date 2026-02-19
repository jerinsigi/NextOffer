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
        coverLetter: ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    // Saved resumes state
    const [savedResumes, setSavedResumes] = useState([]);
    const [resumeSource, setResumeSource] = useState('library'); // 'library' | 'upload'
    const [selectedResumeId, setSelectedResumeId] = useState('');

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
        if (!user || !user.email) return;
        try {
            const response = await fetch(`http://localhost:5000/api/applications/user/${encodeURIComponent(user.email)}`);
            if (response.ok) {
                const data = await response.json();
                setUserApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchSavedResumes = async () => {
        if (!user || !user.email) return;
        try {
            const res = await fetch(`http://localhost:5000/api/resumes/user/${encodeURIComponent(user.email)}`);
            if (res.ok) {
                const data = await res.json();
                setSavedResumes(data);
                // Auto-select first resume if available
                if (data.length > 0) {
                    setSelectedResumeId(data[0]._id);
                    setResumeSource('library');
                } else {
                    setResumeSource('upload');
                }
            }
        } catch (error) {
            console.error('Error fetching saved resumes:', error);
        }
    };

    const getApplication = (jobId) => {
        return userApplications.find(app => app.Fk_job_id && (app.Fk_job_id === jobId || app.Fk_job_id._id === jobId));
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to apply.');
            return;
        }

        if (resumeSource === 'library' && !selectedResumeId) {
            alert('Please select a resume from your library or upload a new one.');
            return;
        }
        if (resumeSource === 'upload' && !resumeFile) {
            alert('Please upload your resume.');
            return;
        }

        setApplying(true);
        try {
            const formData = new FormData();
            formData.append('candidateEmail', user.email);
            formData.append('jobId', selectedJob._id);
            formData.append('coverLetter', applicationForm.coverLetter);

            if (resumeSource === 'library') {
                formData.append('resumeId', selectedResumeId);
            } else {
                formData.append('resumeFile', resumeFile);
            }

            const response = await fetch('http://localhost:5000/api/applications/apply', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Application submitted successfully!');
                fetchUserApplications();
                setShowDetailModal(false);
                setApplicationForm({ coverLetter: '' });
                setResumeFile(null);
                setSelectedResumeId(savedResumes.length > 0 ? savedResumes[0]._id : '');
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
        setResumeFile(null);
        fetchSavedResumes(); // Load saved resumes when modal opens
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.Fk_company_id?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
                                        {job.Fk_company_id?.logo ? (
                                            <img src={`http://localhost:5000${job.Fk_company_id.logo}`} alt="Logo" className="company-logo-img" />
                                        ) : (
                                            <span className="company-fallback">{job.Fk_company_id?.company_name?.[0] || 'C'}</span>
                                        )}
                                    </div>
                                    <span className="job-type-tag">{job.type}</span>
                                </div>
                                <div className="job-info">
                                    <h3>{job.job_title}</h3>
                                    <div className="company-name">
                                        {job.Fk_company_id?.company_name || 'Unknown Company'}
                                        {getApplication(job._id) && (
                                            <span className={`status-badge-small ${getApplication(job._id).status.toLowerCase()}`}>
                                                {getApplication(job._id).status}
                                            </span>
                                        )}
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
                                {/* Skills Tags */}
                                {job.skills && job.skills.length > 0 && (
                                    <div className="skills-tags-wrapper">
                                        {job.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="skill-tag-small">{skill}</span>
                                        ))}
                                        {job.skills.length > 3 && (
                                            <span className="skill-tag-small overflow-tag">+{job.skills.length - 3} more</span>
                                        )}
                                    </div>
                                )}
                                <div className="job-card-actions">
                                    <span className="posted-date">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    <button className="btn-view-details">
                                        {getApplication(job._id) ? 'View Status' : 'View Details'}
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
                                    <span className="text-muted ms-2 fs-6">at {selectedJob.Fk_company_id?.company_name}</span>
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {/* Job Info Row */}
                                <div className="d-flex justify-content-between mb-4 flex-wrap gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="company-logo-wrapper" style={{ width: '60px', height: '60px' }}>
                                            {selectedJob.Fk_company_id?.logo ? (
                                                <img src={`http://localhost:5000${selectedJob.Fk_company_id.logo}`} alt="Logo" className="company-logo-img" />
                                            ) : (
                                                <span className="company-fallback fs-4">{selectedJob.Fk_company_id?.company_name?.[0] || 'C'}</span>
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

                                {/* Skills Required */}
                                {selectedJob.skills && selectedJob.skills.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-2">Skills Required</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedJob.skills.map((skill, idx) => (
                                                <span key={idx} className="skill-tag-modal">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                {getApplication(selectedJob._id) ? (
                                    <div className="application-status-card">
                                        <div className="status-header">
                                            <h5 className="mb-0">Application Status</h5>
                                            <span className={`status-badge ${getApplication(selectedJob._id).status.toLowerCase()}`}>
                                                {getApplication(selectedJob._id).status}
                                            </span>
                                        </div>

                                        <div className="status-body">
                                            <div className="status-row">
                                                <i className="bi bi-calendar-check text-primary"></i>
                                                <div>
                                                    <span className="text-muted d-block small">Applied On</span>
                                                    <span>{new Date(getApplication(selectedJob._id).createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>

                                            {getApplication(selectedJob._id).interviewDetails && (
                                                <div className="status-row">
                                                    <i className="bi bi-camera-video text-warning"></i>
                                                    <div>
                                                        <span className="text-muted d-block small">Interview Scheduled</span>
                                                        <span>{new Date(getApplication(selectedJob._id).interviewDetails.started_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="status-row">
                                                <i className="bi bi-file-earmark-text text-info"></i>
                                                <div>
                                                    <span className="text-muted d-block small">Resume</span>
                                                    <span className="text-light">Attached to application</span>
                                                </div>
                                            </div>

                                            {getApplication(selectedJob._id).coverLetter && (
                                                <div className="mt-3 pt-3 border-top border-secondary">
                                                    <span className="text-muted small d-block mb-1">Cover Letter</span>
                                                    <p className="small mb-0 opacity-75 fst-italic">"{getApplication(selectedJob._id).coverLetter}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="apply-section">
                                        <h5 className="mb-3">Apply Now</h5>
                                        <form onSubmit={handleApply}>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Resume</label>

                                                {/* Toggle: Library vs Upload */}
                                                <div className="d-flex gap-2 mb-3">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${resumeSource === 'library' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => setResumeSource('library')}
                                                    >
                                                        <i className="bi bi-folder2-open me-1"></i> My Library
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${resumeSource === 'upload' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => setResumeSource('upload')}
                                                    >
                                                        <i className="bi bi-upload me-1"></i> Upload New
                                                    </button>
                                                </div>

                                                {resumeSource === 'library' ? (
                                                    savedResumes.length === 0 ? (
                                                        <div className="text-muted small p-3 border border-secondary rounded">
                                                            <i className="bi bi-info-circle me-1"></i>
                                                            No saved resumes. Go to <strong>Profile → My Resumes</strong> to upload one, or switch to "Upload New".
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex flex-column gap-2">
                                                            {savedResumes.map(r => (
                                                                <label
                                                                    key={r._id}
                                                                    className={`d-flex align-items-center gap-3 p-3 rounded cursor-pointer ${selectedResumeId === r._id ? 'border border-primary bg-primary bg-opacity-10' : 'border border-secondary'}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="savedResume"
                                                                        value={r._id}
                                                                        checked={selectedResumeId === r._id}
                                                                        onChange={() => setSelectedResumeId(r._id)}
                                                                        style={{ accentColor: 'var(--bs-primary)' }}
                                                                    />
                                                                    <i className="bi bi-file-earmark-pdf text-primary fs-5"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold text-light">{r.tag_name}</div>
                                                                        <div className="small text-muted">{r.original_filename}</div>
                                                                    </div>
                                                                    <span className="small text-muted">
                                                                        {new Date(r.uploaded_at).toLocaleDateString()}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )
                                                ) : (
                                                    <>
                                                        <input
                                                            type="file"
                                                            className="form-control bg-dark-input"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    if (file.size > 5000000) {
                                                                        alert('File size must be less than 5MB');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                                                                    if (!validTypes.includes(file.type)) {
                                                                        alert('Please upload a PDF or Word document');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    setResumeFile(file);
                                                                }
                                                            }}
                                                        />
                                                        {resumeFile && (
                                                            <div className="mt-2 d-flex align-items-center gap-2">
                                                                <i className="bi bi-file-earmark-text text-success"></i>
                                                                <span className="text-muted small">{resumeFile.name}</span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger ms-auto"
                                                                    onClick={() => setResumeFile(null)}
                                                                >
                                                                    <i className="bi bi-x"></i> Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
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
                                            {/* Resume required warning */}
                                            {((resumeSource === 'library' && !selectedResumeId) ||
                                                (resumeSource === 'upload' && !resumeFile)) && (
                                                    <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded" style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.35)' }}>
                                                        <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                                                        <span className="small text-warning">
                                                            {resumeSource === 'library'
                                                                ? 'Please select a resume from your library or switch to "Upload New".'
                                                                : 'Please upload your resume to continue.'}
                                                        </span>
                                                    </div>
                                                )}
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 py-2"
                                                disabled={applying ||
                                                    (resumeSource === 'library' && !selectedResumeId) ||
                                                    (resumeSource === 'upload' && !resumeFile)}
                                            >
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
