import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobOpportunities.css';

const JobOpportunities = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);

    // Modal & Selection State
    const [selectedJob, setSelectedJob] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'procedure'

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
    }, []);

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
        setActiveTab('overview');
        setShowDetailModal(true);
        setResumeFile(null);
        fetchSavedResumes();
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.Fk_company_id?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || job.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || job.job_title === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
    });

    return (
        <div className="job-opportunities-container">
            <div className="jobs-header-section text-center">
                <h2 className="display-5 fw-bold text-white mb-3">Explore Opportunities</h2>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Discover your next career move with top companies.
                </p>
            </div>

            {/* Enhanced Search & Filter */}
            <div className="jobs-search-container">
                <div className="search-bar-wrapper">
                    <i className="bi bi-search search-icon-large"></i>
                    <input
                        type="text"
                        className="search-input-large"
                        placeholder="Job title, keywords, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters-wrapper">
                    <div className="filter-group">
                        <i className="bi bi-tags text-primary"></i>
                        <select
                            className="filter-select-modern"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Any Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <i className="bi bi-clock text-primary"></i>
                        <select
                            className="filter-select-modern"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Any Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Job Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-grow text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="jobs-grid-modern">
                    {filteredJobs.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div className="empty-state">
                                <i className="bi bi-briefcase display-4 text-muted mb-3"></i>
                                <h5 className="text-white">No jobs found</h5>
                                <p className="text-muted">Try adjusting your search criteria.</p>
                            </div>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job._id} className="modern-job-card" onClick={() => handleViewDetails(job)}>
                                <div className="card-badge-top">
                                    <span className={`type-badge ${job.type?.toLowerCase().replace('-', '')}`}>{job.type}</span>
                                    {getApplication(job._id) && (
                                        <span className={`status-badge-small ${getApplication(job._id).status.toLowerCase()}`}>
                                            {getApplication(job._id).status}
                                        </span>
                                    )}
                                    {new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                                        <span className="new-badge">New</span>
                                    )}
                                </div>
                                <div className="job-card-header">
                                    <div className="company-logo-modern">
                                        {job.Fk_company_id?.logo ? (
                                            <img src={`http://localhost:5000${job.Fk_company_id.logo}`} alt="Logo" />
                                        ) : (
                                            <span>{job.Fk_company_id?.company_name?.[0] || 'C'}</span>
                                        )}
                                    </div>
                                    <div className="job-title-section">
                                        <h4>{job.job_title}</h4>
                                        <p className="company-text">{job.Fk_company_id?.company_name}</p>
                                    </div>
                                </div>
                                <div className="job-card-body">
                                    <div className="info-pill"><i className="bi bi-geo-alt-fill"></i> {job.location}</div>
                                    <div className="info-pill"><i className="bi bi-cash-stack"></i> {job.salary}</div>
                                </div>
                                <div className="job-card-footer">
                                    <div className="skills-preview">
                                        {job.skills?.slice(0, 3).map((skill, i) => (
                                            <span key={i} className="mini-skill">{skill}</span>
                                        ))}
                                        {job.skills?.length > 3 && <span className="mini-skill more">+{job.skills.length - 3}</span>}
                                    </div>
                                    <button className="btn-view-modern">
                                        View Details <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Enhanced Job Details Modal */}
            {showDetailModal && selectedJob && (
                <div className="modal-overlay">
                    <div className="modern-modal-content">
                        <button className="btn-close-modal" onClick={() => setShowDetailModal(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div className="modal-banner">
                            <div className="modal-company-info">
                                <div className="company-logo-large">
                                    {selectedJob.Fk_company_id?.logo ? (
                                        <img src={`http://localhost:5000${selectedJob.Fk_company_id.logo}`} alt="Logo" />
                                    ) : (
                                        <span>{selectedJob.Fk_company_id?.company_name?.[0] || 'C'}</span>
                                    )}
                                </div>
                                <div>
                                    <h3>{selectedJob.job_title}</h3>
                                    <p className="text-white-50 mb-0">{selectedJob.Fk_company_id?.company_name} • {selectedJob.location}</p>
                                </div>
                            </div>
                            <div className="modal-actions">
                                {getApplication(selectedJob._id) ? (
                                    <span className={`status-badge-large ${getApplication(selectedJob._id).status.toLowerCase()}`}>
                                        {getApplication(selectedJob._id).status}
                                    </span>
                                ) : (
                                    <button className="btn-apply-primary" onClick={() => setActiveTab('procedure')}>
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="modal-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'procedure' ? 'active' : ''}`}
                                onClick={() => setActiveTab('procedure')}
                            >
                                Application Procedure
                            </button>
                        </div>

                        <div className="modal-body-scroll">
                            {activeTab === 'overview' && (
                                <div className="overview-content fade-in">
                                    <div className="row g-4">
                                        <div className="col-lg-8">
                                            <div className="overview-section-card">
                                                <div className="mb-5">
                                                    <h5 className="section-title mb-3"><i className="bi bi-card-text text-primary"></i> About the Role</h5>
                                                    <p className="description-text">{selectedJob.description}</p>
                                                </div>

                                                <div className="mb-5">
                                                    <h5 className="section-title mb-3"><i className="bi bi-check-circle text-success"></i> Requirements</h5>
                                                    <ul className="modern-list">
                                                        {selectedJob.requirements?.map((req, i) => (
                                                            <li key={i}>{req}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h5 className="section-title mb-3"><i className="bi bi-gift text-warning"></i> Benefits</h5>
                                                    <ul className="modern-list">
                                                        {selectedJob.benefits?.map((ben, i) => (
                                                            <li key={i}>{ben}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="job-meta-card sticky-top" style={{ top: '1rem' }}>
                                                <div className="meta-row">
                                                    <i className="bi bi-cash"></i>
                                                    <div>
                                                        <label>Salary</label>
                                                        <span>{selectedJob.salary}</span>
                                                    </div>
                                                </div>
                                                <div className="meta-row">
                                                    <i className="bi bi-briefcase"></i>
                                                    <div>
                                                        <label>Experience</label>
                                                        <span>{selectedJob.experience_required}</span>
                                                    </div>
                                                </div>
                                                <div className="meta-row">
                                                    <i className="bi bi-people"></i>
                                                    <div>
                                                        <label>Department</label>
                                                        <span>{selectedJob.department}</span>
                                                    </div>
                                                </div>
                                                <div className="meta-row">
                                                    <i className="bi bi-clock"></i>
                                                    <div>
                                                        <label>Type</label>
                                                        <span>{selectedJob.type}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-top border-secondary">
                                                    <label className="text-muted small mb-2 d-block">Skills</label>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {selectedJob.skills?.map((skill, i) => (
                                                            <span key={i} className="skill-tag-modern">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'procedure' && (
                                <div className="procedure-content fade-in">
                                    {/* Procedure Steps removed as per request */}

                                    <div className="application-form-container mt-0">
                                        {getApplication(selectedJob._id) ? (
                                            <div className="text-center py-4">
                                                <div className="success-checkmark mb-3">
                                                    <i className="bi bi-check-circle-fill text-success display-4"></i>
                                                </div>
                                                <h5>Application Submitted</h5>
                                                <p className="text-muted">You have already applied for this position.</p>
                                                <div className="status-box mt-3 mx-auto" style={{ maxWidth: '400px' }}>
                                                    Current Status: <strong>{getApplication(selectedJob._id).status}</strong>
                                                </div>
                                                <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/user/applications')}>
                                                    Go to My Applications
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="apply-form-wrapper">
                                                <h5 className="mb-4">Complete Your Application</h5>
                                                <form onSubmit={handleApply}>
                                                    <div className="mb-4">
                                                        <label className="form-label-modern">Resume Source</label>
                                                        <div className="resume-toggle">
                                                            <div
                                                                className={`toggle-option ${resumeSource === 'library' ? 'active' : ''}`}
                                                                onClick={() => setResumeSource('library')}
                                                            >
                                                                <i className="bi bi-archive"></i> From Library
                                                            </div>
                                                            <div
                                                                className={`toggle-option ${resumeSource === 'upload' ? 'active' : ''}`}
                                                                onClick={() => setResumeSource('upload')}
                                                            >
                                                                <i className="bi bi-cloud-upload"></i> Upload New
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {resumeSource === 'library' ? (
                                                        <div className="mb-4">
                                                            {savedResumes.length > 0 ? (
                                                                <div className="saved-resumes-list">
                                                                    {savedResumes.map(r => (
                                                                        <div
                                                                            key={r._id}
                                                                            className={`saved-resume-item ${selectedResumeId === r._id ? 'selected' : ''}`}
                                                                            onClick={() => setSelectedResumeId(r._id)}
                                                                        >
                                                                            <i className="bi bi-file-earmark-pdf-fill text-danger me-3"></i>
                                                                            <div>
                                                                                <div className="fw-bold">{r.tag_name}</div>
                                                                                <div className="small text-muted">{r.original_filename}</div>
                                                                            </div>
                                                                            {selectedResumeId === r._id && <i className="bi bi-check-circle-fill text-primary ms-auto"></i>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="alert alert-warning">
                                                                    No saved resumes found. Please upload a new one.
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="mb-4">
                                                            <label className="upload-box">
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    accept=".pdf,.doc,.docx"
                                                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                                                />
                                                                <div className="text-center">
                                                                    <i className="bi bi-cloud-arrow-up display-6 text-primary mb-2"></i>
                                                                    <p className="mb-0">{resumeFile ? resumeFile.name : 'Click to Upload Resume'}</p>
                                                                    <small className="text-muted">PDF, DOC, DOCX (Max 5MB)</small>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )}

                                                    <div className="mb-4">
                                                        <label className="form-label-modern">Cover Letter</label>
                                                        <textarea
                                                            className="form-control-modern"
                                                            rows="4"
                                                            placeholder="Tell us why you're a great fit..."
                                                            value={applicationForm.coverLetter}
                                                            onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                                                        ></textarea>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="btn-submit-application"
                                                        disabled={applying || (resumeSource === 'library' && !selectedResumeId) || (resumeSource === 'upload' && !resumeFile)}
                                                    >
                                                        {applying ? 'Submitting...' : 'Submit Application'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobOpportunities;
