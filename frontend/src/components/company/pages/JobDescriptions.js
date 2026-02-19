import React, { useState, useEffect } from 'react';
import './JobDescriptions.css';

const JobDescriptions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [jobCategories, setJobCategories] = useState([]); // State for categories
    const [availableSkills, setAvailableSkills] = useState([]); // State for skills autocomplete
    const [skillInput, setSkillInput] = useState(''); // Current skill input
    const [filteredSkills, setFilteredSkills] = useState([]); // Filtered skills for autocomplete
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode
    const [editJobId, setEditJobId] = useState(null); // ID of job being edited
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [applicantStatusFilter, setApplicantStatusFilter] = useState(null); // null = all, 'Shortlisted' = only shortlisted
    const [showCandidateDetailsModal, setShowCandidateDetailsModal] = useState(false);
    const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        job_title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience_required: '',
        salary: '',
        description: '',
        skills: [], // Array for tag input
        benefits: '', // Comma separated for input
        job_status: 'Draft',
        questions_count: 5,
        end_date: ''
    });

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchJobs();
        fetchJobCategories(); // Fetch categories on mount
        fetchSkills(); // Fetch skills on mount
    }, []);

    const fetchJobs = async () => {
        if (!user || !user.email) return;
        try {
            const response = await fetch(`http://localhost:5000/api/job-descriptions/company/${user.email}`);
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
                setJobCategories(data);
            }
        } catch (error) {
            console.error('Error fetching job categories:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/skills');
            if (response.ok) {
                const data = await response.json();
                setAvailableSkills(data);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setEditJobId(null);
        setFormData({
            job_title: '',
            department: '',
            location: '',
            type: 'Full-time',
            experience_required: '',
            salary: '',
            description: '',
            skills: [],
            benefits: '',
            questions_count: 5,
            job_status: 'Draft',
            end_date: ''
        });
        setSkillInput('');
        setShowCreateModal(true);
    };

    const handleEditJob = (job) => {
        setIsEditing(true);
        setEditJobId(job._id);
        const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toISOString().split('T')[0];
        };

        setFormData({
            job_title: job.job_title,
            department: job.department || '',
            location: job.location || '',
            type: job.type || 'Full-time',
            experience_required: job.experience_required || '',
            salary: job.salary || '',
            description: job.description || '',
            skills: job.skills || [],
            benefits: job.benefits ? job.benefits.join(', ') : '',
            job_status: job.job_status || 'Draft',
            questions_count: job.questions_count || 5,
            end_date: formatDate(job.end_date)
        });
        setShowCreateModal(true);
    };

    const handleSubmitJob = async (e) => {
        e.preventDefault();
        if (!user || !user.email) return;

        const payload = {
            ...formData,
            companyEmail: user.email,
            skills: formData.skills,
            benefits: formData.benefits.split(',').map(item => item.trim()).filter(i => i)
        };

        try {
            const url = isEditing
                ? `http://localhost:5000/api/job-descriptions/${editJobId}`
                : 'http://localhost:5000/api/job-descriptions/create';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedJob = await response.json();
                fetchJobs(); // Refresh list
                setShowCreateModal(false);

                // Update selected job if currently viewing the edited job
                if (selectedJob && isEditing && selectedJob._id === editJobId) {
                    setSelectedJob(updatedJob);
                }

                alert(isEditing ? 'Job updated successfully!' : 'Job created successfully!');
            } else {
                alert(isEditing ? 'Failed to update job' : 'Failed to create job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Error saving job');
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/job-descriptions/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchJobs();
                if (selectedJob && selectedJob._id === id) setSelectedJob(null);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/job-descriptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_status: newStatus })
            });
            if (response.ok) {
                fetchJobs();
                if (selectedJob && selectedJob._id === id) {
                    setSelectedJob(prev => ({ ...prev, job_status: newStatus }));
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleViewApplicants = async (job, statusFilter = null) => {
        setSelectedJobForApplicants(job);
        setShowApplicantsModal(true);
        setLoadingApplicants(true);
        setSelectedCandidates([]);
        setApplicantStatusFilter(statusFilter);

        try {
            const response = await fetch(`http://localhost:5000/api/applications/job/${job._id}`);
            if (response.ok) {
                const data = await response.json();
                // Filter based on status if provided
                const filteredData = statusFilter ? data.filter(app => app.status === statusFilter) : data;
                setApplicants(filteredData);
            } else {
                alert('Failed to fetch applicants');
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            alert('Error fetching applicants');
        } finally {
            setLoadingApplicants(false);
        }
    };

    // Interview Scheduling State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleData, setScheduleData] = useState({
        candidateIds: [], // Always array
        candidateNames: [], // For display
        startedAt: '',
        endedAt: ''
    });
    const [scheduling, setScheduling] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false); // Track if we are editing

    const handleScheduleClick = (applicant) => {
        // applicant is the Application object from getJobApplications
        // It has Fk_candidate_id populated
        const candidateId = applicant.Fk_candidate_id._id;
        const candidateName = applicant.Fk_candidate_id.full_name;

        // Check if already scheduled (rescheduling)
        if (['Scheduled', 'Interviewing'].includes(applicant.status) && applicant.interviewDetails) {
            setIsRescheduling(true);
            setScheduleData({
                candidateIds: [candidateId],
                candidateNames: [candidateName],
                startedAt: applicant.interviewDetails.started_at ? new Date(applicant.interviewDetails.started_at).toISOString().split('T')[0] : '',
                endedAt: applicant.interviewDetails.ended_at ? new Date(applicant.interviewDetails.ended_at).toISOString().split('T')[0] : ''
            });
        } else {
            setIsRescheduling(false);
            setScheduleData({
                candidateIds: [candidateId],
                candidateNames: [candidateName],
                startedAt: '',
                endedAt: ''
            });
        }
        setShowScheduleModal(true);
    };

    const handleBulkScheduleClick = () => {
        if (selectedCandidates.length === 0) return;

        // Bulk schedule is always new schedule for simplicity, unless we want to support bulk reschedule (complex).
        // Let's assume bulk is for new schedules.
        setIsRescheduling(false);

        // Find names for selected IDs
        const selectedApps = applicants.filter(app => selectedCandidates.includes(app._id));
        const names = selectedApps.map(app => app.Fk_candidate_id.full_name);
        const candidateIds = selectedApps.map(app => app.Fk_candidate_id._id);

        setScheduleData({
            candidateIds: candidateIds,
            candidateNames: names,
            startedAt: '',
            endedAt: ''
        });
        setShowScheduleModal(true);
    };

    const handleConfirmSchedule = async (e) => {
        e.preventDefault();
        setScheduling(true);

        try {
            const url = isRescheduling
                ? 'http://localhost:5000/api/interviews/schedule' // PUT
                : 'http://localhost:5000/api/interviews/schedule'; // POST

            const method = isRescheduling ? 'PUT' : 'POST';

            // For reschedule, we only support single candidate for now based on UI
            const payload = isRescheduling ? {
                candidateId: scheduleData.candidateIds[0], // Single ID for update
                jobId: selectedJobForApplicants._id,
                startedAt: scheduleData.startedAt,
                endedAt: scheduleData.endedAt
            } : {
                candidateIds: scheduleData.candidateIds,
                jobId: selectedJobForApplicants._id,
                startedAt: scheduleData.startedAt,
                endedAt: scheduleData.endedAt
            };

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(isRescheduling ? 'Interview rescheduled successfully!' : `Success! Scheduled interviews for ${data.successCount} candidate(s).`);
                setShowScheduleModal(false);
                setScheduleData({ candidateIds: [], candidateNames: [], startedAt: '', endedAt: '' }); // Reset
                setIsRescheduling(false);
                // Refresh applicants to show new status/dates
                handleViewApplicants(selectedJobForApplicants, applicantStatusFilter);
            } else {
                alert('Failed to process: ' + data.message);
            }
        } catch (error) {
            console.error('Error scheduling interviews:', error);
            alert('Error scheduling interviews');
        } finally {
            setScheduling(false);
        }
    };

    const handleSelectCandidate = (applicantId) => {
        setSelectedCandidates(prev => {
            if (prev.includes(applicantId)) {
                return prev.filter(id => id !== applicantId);
            } else {
                return [...prev, applicantId];
            }
        });
    };

    const handleSelectAllCandidates = (e) => {
        if (e.target.checked) {
            // Select ALL visible candidates
            const allCandidateIds = applicants.map(app => app._id);
            setSelectedCandidates(allCandidateIds);
        } else {
            setSelectedCandidates([]);
        }
    };

    const handleBulkShortlist = async () => {
        if (selectedCandidates.length === 0) {
            alert('Please select candidates to shortlist');
            return;
        }

        if (!window.confirm(`Are you sure you want to shortlist ${selectedCandidates.length} candidate(s)?`)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/applications/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationIds: selectedCandidates })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Success! ${data.shortlistedCount} candidate(s) have been shortlisted and notified via email.`);
                // Refresh applicants list
                handleViewApplicants(selectedJobForApplicants);
                // Refresh jobs list to update shortlisted count
                fetchJobs();
            } else {
                alert('Failed to shortlist candidates: ' + data.message);
            }
        } catch (error) {
            console.error('Error shortlisting candidates:', error);
            alert('Error shortlisting candidates. Please try again.');
        }
    };

    const handleIndividualShortlist = async (applicationId) => {
        if (!window.confirm('Are you sure you want to shortlist this candidate?')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/applications/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationIds: [applicationId] })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Candidate shortlisted successfully and notified via email!');
                // Refresh applicants list
                handleViewApplicants(selectedJobForApplicants);
                // Refresh jobs list to update shortlisted count
                fetchJobs();
            } else {
                alert('Failed to shortlist candidate: ' + data.message);
            }
        } catch (error) {
            console.error('Error shortlisting candidate:', error);
            alert('Error shortlisting candidate. Please try again.');
        }
    };

    const handleViewCandidateDetails = (applicant) => {
        setSelectedCandidateDetails(applicant.Fk_candidate_id);
        setShowCandidateDetailsModal(true);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || job.job_status === statusFilter;
        return matchesSearch && matchesStatus;
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

    const calculateDaysRemaining = (expiryDate) => {
        if (!expiryDate) return 0;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Stats
    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.job_status === 'Active').length,
        draft: jobs.filter(j => j.job_status === 'Draft').length,
        closed: jobs.filter(j => j.job_status === 'Closed').length,
        totalApplications: jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0),
        avgApplications: jobs.length ? Math.round(jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0) / jobs.length) : 0
    };

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Job Descriptions</h1>
                    <p className="text-muted">Manage all job postings and monitor applications</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleCreateClick}>
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
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {filteredJobs.length === 0 ? (
                                <div className="text-center py-5 w-100">
                                    <p className="text-muted">No jobs found.</p>
                                </div>
                            ) : (
                                filteredJobs.map(job => {
                                    const daysRemaining = calculateDaysRemaining(job.end_date);
                                    return (
                                        <div
                                            key={job._id}
                                            className={`job-card ${selectedJob?._id === job._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedJob(job)}
                                        >
                                            <div className="job-card-header">
                                                <div className="job-title-section">
                                                    <h5 className="job-title">{job.job_title}</h5>
                                                    <div className="job-meta">
                                                        <span className="job-location">
                                                            <i className="bi bi-geo-alt"></i>
                                                            {job.location || 'Remote'}
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

                                            {/* Skills Section */}
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="job-skills-preview">
                                                    {job.skills.slice(0, 3).map((skill, idx) => (
                                                        <span key={idx} className="skill-tag-small">{skill}</span>
                                                    ))}
                                                    {job.skills.length > 3 && (
                                                        <span className="skill-tag-small skill-overflow">+{job.skills.length - 3}</span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="job-metrics">
                                                <div
                                                    className="metric clickable"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewApplicants(job);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to view applicants"
                                                >
                                                    <div className="metric-value">{job.applications_count || 0}</div>
                                                    <div className="metric-label">Applications</div>
                                                </div>
                                                <div
                                                    className="metric clickable"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewApplicants(job, 'Shortlisted');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to view shortlisted candidates"
                                                >
                                                    <div className="metric-value">{job.shortlisted_count || 0}</div>
                                                    <div className="metric-label">Shortlisted</div>
                                                </div>
                                                <div
                                                    className="metric clickable"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewApplicants(job, 'Scheduled');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to view scheduled interviews"
                                                >
                                                    <div className="metric-value">{job.scheduled_count || 0}</div>
                                                    <div className="metric-label">Scheduled</div>
                                                </div>
                                            </div>

                                            <div className="job-footer">
                                                <div className="job-date-info">
                                                    <span className="posted-date">
                                                        Posted: {new Date(job.createdAt).toLocaleDateString()}
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
                                })
                            )}
                        </div>
                    )}

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
                                    <h6>Position Details</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Experience Required:</span>
                                        <span className="detail-value">{selectedJob.experience_required}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Salary Range:</span>
                                        <span className="detail-value">{selectedJob.salary}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedJob.location}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Department:</span>
                                        <span className="detail-value">{selectedJob.department}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Description</h6>
                                    <p className="job-description">{selectedJob.description}</p>
                                </div>

                                <div className="detail-section">
                                    <h6>Skills Required</h6>
                                    <div className="tags-list">
                                        {selectedJob.skills && selectedJob.skills.map((skill, idx) => (
                                            <span key={idx} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Benefits</h6>
                                    <div className="benefits-list">
                                        {selectedJob.benefits && selectedJob.benefits.map((benefit, idx) => (
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
                                            <div className="stat-number">{selectedJob.views || 0}</div>
                                            <div className="stat-label">Views</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-number">{selectedJob.applications_count || 0}</div>
                                            <div className="stat-label">Applications</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Timeline</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Posted Date:</span>
                                        <span className="detail-value">{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {selectedJob.end_date && (
                                        <div className="detail-item">
                                            <span className="detail-label">Expiry Date:</span>
                                            <span className="detail-value">{new Date(selectedJob.end_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleEditJob(selectedJob)}>
                                        <i className="bi bi-pencil me-2"></i>Edit Job
                                    </button>
                                    {selectedJob.job_status === 'Active' ? (
                                        <button className="btn btn-sm btn-warning w-100 mb-2" onClick={() => handleUpdateStatus(selectedJob._id, 'Paused')}>
                                            <i className="bi bi-pause-circle me-2"></i>Pause Posting
                                        </button>
                                    ) : (
                                        <button className="btn btn-sm btn-success w-100 mb-2" onClick={() => handleUpdateStatus(selectedJob._id, 'Active')}>
                                            <i className="bi bi-play-circle me-2"></i>Activate Posting
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

            {/* Create Job Modal */}
            {console.log('Rendering Modal, showCreateModal:', showCreateModal)}
            {showCreateModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg custom-modal-center">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{isEditing ? 'Edit Job' : 'Post New Job'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitJob} className="jd-modal-form">

                                    {/* Section: Basic Info */}
                                    <div className="jd-form-section">
                                        <div className="jd-section-header">
                                            <i className="bi bi-briefcase-fill"></i>
                                            <span>Basic Information</span>
                                        </div>
                                        <div className="jd-fields-grid">
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-tag-fill"></i> Job Title / Category
                                                </label>
                                                <select
                                                    className="jd-select"
                                                    value={formData.job_title}
                                                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select a Job Category</option>
                                                    {jobCategories.map(cat => (
                                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-building"></i> Department
                                                </label>
                                                <input
                                                    type="text"
                                                    className="jd-input"
                                                    placeholder="e.g. Engineering"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-geo-alt-fill"></i> Location
                                                </label>
                                                <input
                                                    type="text"
                                                    className="jd-input"
                                                    placeholder="e.g. Bangalore, Remote"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-clock-fill"></i> Job Type
                                                </label>
                                                <select
                                                    className="jd-select"
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                >
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="Part-time">Part-time</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Internship">Internship</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Compensation */}
                                    <div className="jd-form-section">
                                        <div className="jd-section-header">
                                            <i className="bi bi-cash-stack"></i>
                                            <span>Compensation & Experience</span>
                                        </div>
                                        <div className="jd-fields-grid">
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-person-workspace"></i> Experience Required
                                                </label>
                                                <input
                                                    type="text"
                                                    className="jd-input"
                                                    placeholder="e.g. 2-4 years"
                                                    value={formData.experience_required}
                                                    onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-currency-rupee"></i> Salary Range
                                                </label>
                                                <input
                                                    type="text"
                                                    className="jd-input"
                                                    placeholder="e.g. ₹8-12 LPA"
                                                    value={formData.salary}
                                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Description */}
                                    <div className="jd-form-section">
                                        <div className="jd-section-header">
                                            <i className="bi bi-file-text-fill"></i>
                                            <span>Job Description</span>
                                        </div>
                                        <div className="jd-field">
                                            <label className="jd-label">
                                                <i className="bi bi-card-text"></i> Description
                                            </label>
                                            <textarea
                                                className="jd-input jd-textarea"
                                                rows="4"
                                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Section: Skills */}
                                    <div className="jd-form-section">
                                        <div className="jd-section-header">
                                            <i className="bi bi-stars"></i>
                                            <span>Skills & Benefits</span>
                                        </div>
                                        <div className="jd-field">
                                            <label className="jd-label">
                                                <i className="bi bi-lightning-charge-fill"></i> Skills Required
                                            </label>
                                            <div className="jd-skills-box position-relative">
                                                {formData.skills.length > 0 && (
                                                    <div className="jd-skills-tags">
                                                        {formData.skills.map((skill, index) => (
                                                            <span key={index} className="jd-skill-tag">
                                                                {skill}
                                                                <button
                                                                    type="button"
                                                                    className="jd-skill-remove"
                                                                    onClick={() => {
                                                                        const newSkills = formData.skills.filter((_, i) => i !== index);
                                                                        setFormData({ ...formData, skills: newSkills });
                                                                    }}
                                                                >
                                                                    <i className="bi bi-x"></i>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="jd-skill-input-row">
                                                    <i className="bi bi-search jd-skill-search-icon"></i>
                                                    <input
                                                        type="text"
                                                        className="jd-skill-input"
                                                        placeholder={formData.skills.length === 0 ? "Search and add skills (e.g. React, Python)..." : "Add more skills..."}
                                                        value={skillInput}
                                                        onChange={(e) => {
                                                            setSkillInput(e.target.value);
                                                            const filtered = availableSkills
                                                                .filter(s => s.name.toLowerCase().includes(e.target.value.toLowerCase()))
                                                                .filter(s => !formData.skills.includes(s.name));
                                                            setFilteredSkills(e.target.value ? filtered : []);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ',') {
                                                                e.preventDefault();
                                                                const val = skillInput.trim();
                                                                if (val && !formData.skills.includes(val)) {
                                                                    setFormData({ ...formData, skills: [...formData.skills, val] });
                                                                    setSkillInput('');
                                                                    setFilteredSkills([]);
                                                                }
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setFilteredSkills([]);
                                                            }
                                                        }}
                                                        onBlur={() => setTimeout(() => setFilteredSkills([]), 150)}
                                                    />
                                                </div>
                                                {filteredSkills.length > 0 && (
                                                    <ul className="jd-skills-dropdown">
                                                        {filteredSkills.map(skill => (
                                                            <li key={skill._id}>
                                                                <button
                                                                    type="button"
                                                                    className="jd-skills-dropdown-item"
                                                                    onClick={() => {
                                                                        if (!formData.skills.includes(skill.name)) {
                                                                            setFormData({ ...formData, skills: [...formData.skills, skill.name] });
                                                                            setSkillInput('');
                                                                            setFilteredSkills([]);
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className={`${skill.icon} jd-dropdown-icon`}></i>
                                                                    <span>{skill.name}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <p className="jd-hint">Press <kbd>Enter</kbd> or <kbd>,</kbd> to add a custom skill</p>
                                        </div>
                                        <div className="jd-field">
                                            <label className="jd-label">
                                                <i className="bi bi-gift-fill"></i> Benefits <span className="jd-optional">(comma separated)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="jd-input"
                                                placeholder="e.g. Health Insurance, Flexible Hours, Remote Work"
                                                value={formData.benefits}
                                                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Section: Settings */}
                                    <div className="jd-form-section">
                                        <div className="jd-section-header">
                                            <i className="bi bi-gear-fill"></i>
                                            <span>Interview Settings</span>
                                        </div>
                                        <div className="jd-fields-grid jd-fields-grid-3">
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-question-circle-fill"></i> Questions Count
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    className="jd-input"
                                                    value={formData.questions_count}
                                                    onChange={(e) => setFormData({ ...formData, questions_count: parseInt(e.target.value) || 5 })}
                                                />
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-toggle-on"></i> Status
                                                </label>
                                                <select
                                                    className="jd-select"
                                                    value={formData.job_status}
                                                    onChange={(e) => setFormData({ ...formData, job_status: e.target.value })}
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Active">Active</option>
                                                </select>
                                            </div>
                                            <div className="jd-field">
                                                <label className="jd-label">
                                                    <i className="bi bi-calendar-x-fill"></i> Application End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className="jd-input"
                                                    value={formData.end_date}
                                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="jd-modal-footer">
                                        <button type="button" className="jd-btn-cancel" onClick={() => setShowCreateModal(false)}>
                                            <i className="bi bi-x-circle me-2"></i>Cancel
                                        </button>
                                        <button type="submit" className="jd-btn-submit">
                                            <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                                            {isEditing ? 'Save Changes' : 'Post Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            )}

            {/* Applicants Modal */}
            {showApplicantsModal && selectedJobForApplicants && (
                <div className="modal  modal-lg fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered" >
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <div>
                                    <h5 className="modal-title">
                                        {applicantStatusFilter === 'Shortlisted'
                                            ? `Shortlisted Candidates for ${selectedJobForApplicants.job_title}`
                                            : `Applicants for ${selectedJobForApplicants.job_title}`
                                        }
                                    </h5>
                                    <p className="text-muted mb-0 small">
                                        Total Candidates: <span className="badge bg-primary">{applicants.length}</span>
                                        {selectedCandidates.length > 0 && (
                                            <span className="ms-2">
                                                Selected: <span className="badge bg-success">{selectedCandidates.length}</span>
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowApplicantsModal(false);
                                        setSelectedJobForApplicants(null);
                                        setApplicants([]);
                                        setSelectedCandidates([]);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {loadingApplicants ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Loading applicants...</p>
                                    </div>
                                ) : applicants.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-inbox fs-1 text-muted"></i>
                                        <p className="text-muted mt-3">No applications yet</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-dark table-hover">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '50px' }}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={handleSelectAllCandidates}
                                                            checked={
                                                                applicants.length > 0 &&
                                                                selectedCandidates.length === applicants.length
                                                            }
                                                            disabled={applicants.length === 0}
                                                            title="Select all"
                                                        />
                                                    </th>
                                                    <th>#</th>
                                                    <th>Candidate</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Skills</th>
                                                    <th>Applied On</th>
                                                    <th>Status</th>
                                                    <th>Resume</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applicants.map((app, index) => (
                                                    <tr key={app._id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={selectedCandidates.includes(app._id)}
                                                                onChange={() => handleSelectCandidate(app._id)}
                                                                // Allow selection for any status if we want bulk actions universally, 
                                                                // but typically we only shortlist Applied, and schedule Shortlisted.
                                                                // User wants to bulk select shortlisted. So remove disable or make it smarter.
                                                                // Let's remove disable to allow flexibility, or check action compatibility later.
                                                                disabled={false}
                                                                title="Select candidate"
                                                            />
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {app.Fk_candidate_id?.image_url ? (
                                                                    <img
                                                                        src={app.Fk_candidate_id.image_url.startsWith('http') ? app.Fk_candidate_id.image_url : `http://localhost:5000${app.Fk_candidate_id.image_url}`}
                                                                        alt={app.Fk_candidate_id?.full_name}
                                                                        className="rounded-circle me-2"
                                                                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center"
                                                                        style={{ width: '32px', height: '32px' }}
                                                                    >
                                                                        {app.Fk_candidate_id?.full_name?.charAt(0).toUpperCase() || 'U'}
                                                                    </div>
                                                                )}
                                                                <strong>{app.Fk_candidate_id?.full_name || 'N/A'}</strong>
                                                            </div>
                                                        </td>
                                                        <td>{app.Fk_candidate_id?.email || 'N/A'}</td>
                                                        <td>{app.Fk_candidate_id?.phone || 'N/A'}</td>
                                                        <td>
                                                            {app.Fk_candidate_id?.skills && app.Fk_candidate_id.skills.length > 0 ? (
                                                                <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '250px' }}>
                                                                    {app.Fk_candidate_id.skills.slice(0, 3).map((skill, idx) => (
                                                                        <span key={idx} className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                                                                            {skill.name}
                                                                            {skill.level && (
                                                                                <span className="text-warning ms-1">• {skill.level}</span>
                                                                            )}
                                                                            {skill.years && (
                                                                                <span className="text-info ms-1">({skill.years}y)</span>
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                    {app.Fk_candidate_id.skills.length > 3 && (
                                                                        <span className="badge bg-dark" style={{ fontSize: '0.7rem' }}>+{app.Fk_candidate_id.skills.length - 3}</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted">No skills listed</span>
                                                            )}
                                                        </td>
                                                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={`badge bg-${app.status === 'Applied' ? 'info' : app.status === 'Shortlisted' ? 'success' : app.status === 'Rejected' ? 'danger' : 'secondary'}`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {app.Fk_resume_id?.resume_path ? (
                                                                <a
                                                                    href={`http://localhost:5000${app.Fk_resume_id.resume_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    <i className="bi bi-file-earmark-pdf me-1"></i>
                                                                    View
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted">No Resume</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <button
                                                                    className="btn btn-sm btn-info"
                                                                    title="View Details"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewCandidateDetails(app);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                                {app.status === 'Applied' && (
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        title="Shortlist"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleIndividualShortlist(app._id);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-check-circle"></i>
                                                                    </button>
                                                                )}
                                                                {!['Rejected', 'Scheduled', 'Interviewing'].includes(app.status) && (
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        title="Reject"
                                                                    >
                                                                        <i className="bi bi-x-circle"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {app.status === 'Shortlisted' && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-warning ms-1"
                                                                    title="Schedule Interview"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleScheduleClick(app);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-calendar-event"></i>
                                                                </button>
                                                            )}
                                                            {['Scheduled', 'Interviewing'].includes(app.status) && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-info ms-1"
                                                                    title="Edit Schedule"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleScheduleClick(app);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-secondary">
                                {selectedCandidates.length > 0 && applicantStatusFilter !== 'Shortlisted' && (
                                    <button
                                        type="button"
                                        className="btn btn-primary me-auto"
                                        title="Move selected candidates to next stage"
                                        onClick={handleBulkShortlist}
                                    >
                                        <i className="bi bi-arrow-right-circle me-2"></i>
                                        Shortlist Selected ({selectedCandidates.length})
                                    </button>
                                )}
                                {selectedCandidates.length > 0 && applicantStatusFilter === 'Shortlisted' && (
                                    <button
                                        type="button"
                                        className="btn btn-warning me-auto"
                                        title="Schedule Interview for selected"
                                        onClick={handleBulkScheduleClick}
                                    >
                                        <i className="bi bi-calendar-event me-2"></i>
                                        Schedule Selected ({selectedCandidates.length})
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowApplicantsModal(false);
                                        setSelectedJobForApplicants(null);
                                        setApplicants([]);
                                        setSelectedCandidates([]);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Interview Modal */}
            {console.log('Rendering Schedule Modal, show:', showScheduleModal)}
            {showScheduleModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{isRescheduling ? 'Reschedule Interview' : 'Schedule Interview'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowScheduleModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Scheduling interview for <strong>{scheduleData.candidateNames.length > 1 ? `${scheduleData.candidateNames.length} Candidates` : scheduleData.candidateNames[0]}</strong></p>
                                <p className="text-muted small"><strong>Job:</strong> {selectedJobForApplicants?.job_title}</p>
                                <form onSubmit={handleConfirmSchedule}>
                                    <div className="mb-3">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control bg-dark text-light border-secondary"
                                            value={scheduleData.startedAt}
                                            onChange={(e) => setScheduleData({ ...scheduleData, startedAt: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control bg-dark text-light border-secondary"
                                            value={scheduleData.endedAt}
                                            onChange={(e) => setScheduleData({ ...scheduleData, endedAt: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-warning" disabled={scheduling}>
                                            {scheduling ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    {isRescheduling ? 'Updating...' : 'Scheduling...'}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-send me-2"></i>
                                                    {isRescheduling ? 'Update Schedule' : 'Send Invitation'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Candidate Details Modal */}
            {showCandidateDetailsModal && selectedCandidateDetails && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1070 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Candidate Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCandidateDetailsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body candidate-details-body">
                                {/* Profile Header Section */}
                                <div className="candidate-profile-header mb-4 p-3 border border-secondary rounded">
                                    <div className="d-flex align-items-center gap-3">
                                        {selectedCandidateDetails.image_url ? (
                                            <img
                                                src={selectedCandidateDetails.image_url.startsWith('http')
                                                    ? selectedCandidateDetails.image_url
                                                    : `http://localhost:5000${selectedCandidateDetails.image_url}`}
                                                alt={selectedCandidateDetails.full_name}
                                                className="rounded-circle"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                                            >
                                                {selectedCandidateDetails.full_name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div className="flex-grow-1">
                                            <h4 className="mb-1">{selectedCandidateDetails.full_name}</h4>
                                            {selectedCandidateDetails.current_role && (
                                                <p className="text-primary mb-2">
                                                    <i className="bi bi-briefcase me-2"></i>
                                                    {selectedCandidateDetails.current_role}
                                                </p>
                                            )}
                                            {selectedCandidateDetails.location && (
                                                <p className="text-muted mb-0">
                                                    <i className="bi bi-geo-alt me-2"></i>
                                                    {selectedCandidateDetails.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="candidate-section mb-4">
                                    <h6 className="section-title mb-3">
                                        <i className="bi bi-envelope me-2"></i>
                                        Contact Information
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label className="text-muted small">Email</label>
                                                <p className="mb-0">
                                                    <i className="bi bi-envelope-fill me-2 text-primary"></i>
                                                    {selectedCandidateDetails.email}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedCandidateDetails.phone && (
                                            <div className="col-md-6">
                                                <div className="detail-item">
                                                    <label className="text-muted small">Phone</label>
                                                    <p className="mb-0">
                                                        <i className="bi bi-telephone-fill me-2 text-primary"></i>
                                                        {selectedCandidateDetails.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bio Section */}
                                {selectedCandidateDetails.bio && (
                                    <div className="candidate-section mb-4">
                                        <h6 className="section-title mb-3">
                                            <i className="bi bi-person-lines-fill me-2"></i>
                                            About
                                        </h6>
                                        <p className="text-light">{selectedCandidateDetails.bio}</p>
                                    </div>
                                )}

                                {/* Professional Details */}
                                <div className="candidate-section mb-4">
                                    <h6 className="section-title mb-3">
                                        <i className="bi bi-briefcase-fill me-2"></i>
                                        Professional Details
                                    </h6>
                                    <div className="row g-3">
                                        {selectedCandidateDetails.education && (
                                            <div className="col-md-6">
                                                <div className="detail-item">
                                                    <label className="text-muted small">Education</label>
                                                    <p className="mb-0">
                                                        <i className="bi bi-mortarboard-fill me-2 text-success"></i>
                                                        {selectedCandidateDetails.education}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedCandidateDetails.experience_years !== undefined && (
                                            <div className="col-md-6">
                                                <div className="detail-item">
                                                    <label className="text-muted small">Experience</label>
                                                    <p className="mb-0">
                                                        <i className="bi bi-clock-history me-2 text-warning"></i>
                                                        {selectedCandidateDetails.experience_years} {selectedCandidateDetails.experience_years === 1 ? 'year' : 'years'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Section */}
                                {selectedCandidateDetails.skills && selectedCandidateDetails.skills.length > 0 && (
                                    <div className="candidate-section mb-4">
                                        <h6 className="section-title mb-3">
                                            <i className="bi bi-code-slash me-2"></i>
                                            Skills
                                        </h6>
                                        <div className="skills-grid">
                                            {selectedCandidateDetails.skills.map((skill, index) => (
                                                <div key={index} className="skill-card p-3 border border-secondary rounded">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <strong className="text-primary">{skill.name}</strong>
                                                        {skill.level && (
                                                            <span className="badge bg-success">{skill.level}</span>
                                                        )}
                                                    </div>
                                                    {skill.years && (
                                                        <small className="text-muted">
                                                            <i className="bi bi-calendar3 me-1"></i>
                                                            {skill.years} {skill.years === 1 ? 'year' : 'years'} experience
                                                        </small>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links Section */}
                                {selectedCandidateDetails.social_links && (
                                    <div className="candidate-section mb-3">
                                        <h6 className="section-title mb-3">
                                            <i className="bi bi-link-45deg me-2"></i>
                                            Social Links
                                        </h6>
                                        <div className="social-links-grid">
                                            {selectedCandidateDetails.social_links.linkedin && (
                                                <a
                                                    href={selectedCandidateDetails.social_links.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary w-100"
                                                >
                                                    <i className="bi bi-linkedin me-2"></i>
                                                    LinkedIn Profile
                                                </a>
                                            )}
                                            {selectedCandidateDetails.social_links.github && (
                                                <a
                                                    href={selectedCandidateDetails.social_links.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-light w-100"
                                                >
                                                    <i className="bi bi-github me-2"></i>
                                                    GitHub Profile
                                                </a>
                                            )}
                                            {selectedCandidateDetails.social_links.portfolio && (
                                                <a
                                                    href={selectedCandidateDetails.social_links.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-info w-100"
                                                >
                                                    <i className="bi bi-globe me-2"></i>
                                                    Portfolio Website
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-secondary">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCandidateDetailsModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default JobDescriptions;
