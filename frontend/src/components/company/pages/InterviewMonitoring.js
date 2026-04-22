import React, { useState, useEffect } from 'react';
import './InterviewMonitoring.css';
import Loader from '../../common/Loader';

const InterviewMonitoring = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [viewMode, setViewMode] = useState('jobs'); // 'jobs' or 'applications'
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [hireCount, setHireCount] = useState(1);
    const [finalizeLoading, setFinalizeLoading] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleStartDate, setScheduleStartDate] = useState('');
    const [scheduleEndDate, setScheduleEndDate] = useState('');
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const response = await fetch(`http://localhost:5000/api/job-descriptions/company/${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                }
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/job/${jobId}`);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
        fetchApplications(job._id);
        setViewMode('applications');
        setSelectedApplication(null);
        setSearchTerm('');
    };

    const handleBackToJobs = () => {
        setViewMode('jobs');
        setSelectedJob(null);
        setApplications([]);
        setSelectedApplication(null);
        setSearchTerm('');
        setSelectedReport(null);
        fetchJobs();
    };

    const handleApplicationClick = (app) => {
        setSelectedApplication(app);
        setSelectedReport(null);
    };

    const fetchReport = async (sessionId) => {
        setReportLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/interviews/report/${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedReport(data);
            } else {
                console.error("Failed to fetch report");
                alert("Failed to fetch AI Report. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            alert("Error fetching AI Report.");
        } finally {
            setReportLoading(false);
        }
    };

    const handleFinalizeHiring = async () => {
        if (!selectedJob || hireCount < 1) return;

        setFinalizeLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/applications/job/${selectedJob._id}/finalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topNHires: parseInt(hireCount) })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Success! ${data.hiredCount} candidates hired and ${data.rejectedCount} candidates rejected.`);
                setShowFinalizeModal(false);
                // Refresh the list to show new statuses
                fetchApplications(selectedJob._id);
            } else {
                const errorData = await response.json();
                alert(`Failed to finalize hiring: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error finalizing hiring:", error);
            alert("An error occurred while finalizing hiring.");
        } finally {
            setFinalizeLoading(false);
        }
    };

    const handleRejectCandidate = async (applicationId) => {
        if (!window.confirm("Are you sure you want to reject this candidate? They will be notified via email.")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/reject`, {
                method: 'POST'
            });

            if (response.ok) {
                alert("Candidate has been rejected.");
                if (selectedJob) fetchApplications(selectedJob._id);
                if (selectedApplication && selectedApplication._id === applicationId) {
                    setSelectedApplication(prev => ({ ...prev, status: 'Rejected' }));
                }
            } else {
                const errorData = await response.json();
                alert(`Failed to reject candidate: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error rejecting candidate:", error);
            alert("An error occurred while rejecting the candidate.");
        }
    };

    const handleShortlistCandidate = async (applicationId) => {
        setActionLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/applications/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationIds: [applicationId] })
            });
            if (response.ok) {
                alert('Candidate shortlisted successfully! They will be notified via email.');
                setSelectedApplication(prev => ({ ...prev, status: 'Shortlisted' }));
                if (selectedJob) fetchApplications(selectedJob._id);
            } else {
                const err = await response.json();
                alert(`Failed to shortlist: ${err.message}`);
            }
        } catch (error) {
            console.error('Shortlist error:', error);
            alert('Error shortlisting candidate.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleScheduleInterview = async () => {
        if (!scheduleStartDate || !scheduleEndDate) {
            alert('Please set both start and end date/time.');
            return;
        }
        if (new Date(scheduleEndDate) <= new Date(scheduleStartDate)) {
            alert('End date/time must be after start date/time.');
            return;
        }
        setScheduleLoading(true);
        try {
            const candidateId = selectedApplication.Fk_candidate_id._id;
            const response = await fetch('http://localhost:5000/api/interviews/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateIds: [candidateId],
                    jobId: selectedJob._id,
                    startedAt: scheduleStartDate,
                    endedAt: scheduleEndDate
                })
            });
            if (response.ok) {
                alert('Interview scheduled successfully! The candidate will be notified via email.');
                setShowScheduleModal(false);
                setScheduleStartDate('');
                setScheduleEndDate('');
                setSelectedApplication(prev => ({ ...prev, status: 'Scheduled' }));
                if (selectedJob) fetchApplications(selectedJob._id);
            } else {
                const err = await response.json();
                alert(`Failed to schedule interview: ${err.message}`);
            }
        } catch (error) {
            console.error('Schedule interview error:', error);
            alert('Error scheduling interview.');
        } finally {
            setScheduleLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        return 'average';
    };

    const getRecommendationVariant = (rec = '') => {
        if (rec.includes('Strongly') || rec.includes('Highly')) return 'success';
        if (rec.includes('Recommended')) return 'info';
        if (rec.includes('Reservations')) return 'warning';
        return 'average';
    };

    const getFilteredItems = () => {
        if (viewMode === 'jobs') {
            return jobs.filter(job =>
                job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            return applications
                .filter(app => {
                    const name = app.Fk_candidate_id?.full_name || '';
                    return name.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .sort((a, b) => {
                    // Push banned candidates to the bottom
                    if (a.status === 'Banned' && b.status !== 'Banned') return 1;
                    if (a.status !== 'Banned' && b.status === 'Banned') return -1;
                    return 0;
                });
        }
    };

    const filteredItems = getFilteredItems();

    const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.job_status === 'Active').length,
        totalApplications: jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0),
        shortlisted: jobs.reduce((sum, j) => sum + (j.shortlisted_count || 0), 0)
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Active': 'status-badge-live',
            'Draft': 'status-badge-paused',
            'Closed': 'status-badge-failed',
            'Applied': 'status-badge-scheduled',
            'Shortlisted': 'status-badge-completed',
            'Scheduled': 'status-badge-live',
            'Interviewing': 'status-badge-live',
            'Interviewed': 'status-badge-completed',
            'Rejected': 'status-badge-failed',
            'Hired': 'status-badge-completed',
            'Banned': 'status-badge-failed'
        };
        return badges[status] || 'status-badge-scheduled';
    };

    if (loading) return <Loader inline />;

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Jobs & Applicants</h1>
                    <p className="text-muted">Monitor your job postings and applicant pipeline</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary me-2" onClick={viewMode === 'jobs' ? fetchJobs : () => fetchApplications(selectedJob._id)}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card stat-card-info">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-briefcase fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Jobs</div>
                            <div className="stat-value">{stats.totalJobs}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-card-success">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-check-circle fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active Jobs</div>
                            <div className="stat-value">{stats.activeJobs}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-card-primary">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-people fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Applicants</div>
                            <div className="stat-value">{stats.totalApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-card-warning">
                        <div className="stat-icon-wrapper">
                            <div className="stat-icon">
                                <i className="bi bi-star fs-3"></i>
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Shortlisted</div>
                            <div className="stat-value">{stats.shortlisted}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-header-custom">
                    <div className="interview-tabs d-flex align-items-center">
                        {viewMode === 'applications' && (
                            <button className="btn btn-sm btn-outline-secondary me-3" onClick={handleBackToJobs}>
                                <i className="bi bi-arrow-left me-2"></i>Back to Jobs
                            </button>
                        )}
                        <h5 className="mb-0 text-light">
                            {viewMode === 'jobs' ? 'Job Listings' : `Applicants for: ${selectedJob?.job_title}`}
                        </h5>
                    </div>
                    <div className="interviews-filters d-flex align-items-center gap-3">
                        {viewMode === 'applications' && filteredItems.length > 0 && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowFinalizeModal(true)}
                            >
                                <i className="bi bi-person-check-fill me-2"></i> Finalize Hiring
                            </button>
                        )}
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control-dark"
                                placeholder={viewMode === 'jobs' ? "Search jobs..." : "Search applicants..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="interviews-content">
                    <div className="interviews-list">
                        {filteredItems.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                <p className="text-muted">
                                    {viewMode === 'jobs' ? 'No jobs found' : 'No applications found'}
                                </p>
                            </div>
                        ) : (
                            filteredItems.map(item => {
                                if (viewMode === 'jobs') {
                                    // Job Card
                                    const job = item;
                                    return (
                                        <div
                                            key={job._id}
                                            className={`interview-card`}
                                            onClick={() => handleJobClick(job)}
                                        >
                                            <div className="interview-card-header">
                                                <div className="candidate-info">
                                                    <div className="candidate-avatar">
                                                        <i className="bi bi-briefcase"></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="candidate-name">{job.job_title}</h5>
                                                        <p className="position-title">{job.department || 'General'}</p>
                                                    </div>
                                                </div>
                                                <div className="interview-badges">
                                                    <span className={`status-badge ${getStatusBadge(job.job_status)}`}>
                                                        {job.job_status === 'Active' && <i className="bi bi-circle-fill pulse-dot"></i>}
                                                        {job.job_status}
                                                    </span>
                                                    <span className="status-badge status-badge-scheduled">
                                                        {job.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="interview-details">
                                                <div className="detail-row">
                                                    <span className="detail-icon"><i className="bi bi-geo-alt"></i></span>
                                                    <span className="detail-text">{job.location || 'Remote'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-icon"><i className="bi bi-people"></i></span>
                                                    <span className="detail-text">{job.applications_count || 0} Total Applicants</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-icon"><i className="bi bi-calendar"></i></span>
                                                    <span className="detail-text">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="interview-actions">
                                                <button className="btn-sm btn-primary">
                                                    <i className="bi bi-people"></i> View Applicants
                                                </button>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // Application Card
                                    const app = item;
                                    const candidate = app.Fk_candidate_id || {};
                                    const hasScore = app.final_trust_score !== undefined && app.final_trust_score !== -1;
                                    const rank = filteredItems.findIndex(a => a._id === app._id) + 1;

                                    return (
                                        <div
                                            key={app._id}
                                            className={`interview-card ${selectedApplication?._id === app._id ? 'selected' : ''}`}
                                            onClick={() => handleApplicationClick(app)}
                                        >
                                            <div className="interview-card-header">
                                                <div className="candidate-info">
                                                    <div className="candidate-avatar">
                                                        {candidate.full_name ? candidate.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'C'}
                                                    </div>
                                                    <div>
                                                        <h5 className="candidate-name d-flex align-items-center">
                                                            {app.status !== 'Banned' && (
                                                                <span className="badge bg-primary rounded-pill me-2 fs-6 px-3 py-2">#{rank}</span>
                                                            )}
                                                            {candidate.full_name || 'Unknown Candidate'}
                                                            {hasScore && app.final_trust_score >= 85 && (
                                                                <i className="bi bi-star-fill text-warning ms-2" title="Top Candidate"></i>
                                                            )}
                                                        </h5>
                                                        <p className="position-title">{candidate.email}</p>
                                                    </div>
                                                </div>
                                                <div className="interview-badges">
                                                    <span className={`status-badge ${getStatusBadge(app.status)}`}>
                                                        {['Interviewing', 'Scheduled'].includes(app.status) && <i className="bi bi-circle-fill pulse-dot"></i>}
                                                        {app.status}
                                                    </span>
                                                    {hasScore && (
                                                        <span className={`status-badge ${app.final_trust_score >= 85 ? 'bg-success bg-opacity-25 text-success' : app.final_trust_score >= 70 ? 'bg-primary bg-opacity-25 text-primary' : 'bg-secondary bg-opacity-25 text-light'}`}>
                                                            AI Score: {app.final_trust_score}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="interview-details">
                                                <div className="detail-row">
                                                    <span className="detail-icon"><i className="bi bi-calendar2-check"></i></span>
                                                    <span className="detail-text">Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {app.interviewDetails && (
                                                    <div className="detail-row text-primary">
                                                        <span className="detail-icon"><i className="bi bi-camera-video"></i></span>
                                                        <span className="detail-text">Interview {app.interviewDetails.session_status === 'completed' ? 'Completed' : 'Scheduled'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        )}
                    </div>

                    {/* Right Panel for Selected Application Details */}
                    {viewMode === 'applications' && selectedApplication && (
                        <div className="interview-details-panel">
                            <div className="panel-header">
                                <h5>Applicant Details</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedApplication(null)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="panel-content">
                                <div className="candidate-profile">
                                    <div className="candidate-avatar-large">
                                        {selectedApplication.Fk_candidate_id?.full_name ? selectedApplication.Fk_candidate_id.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'C'}
                                    </div>
                                    <h4>{selectedApplication.Fk_candidate_id?.full_name || 'Unknown'}</h4>
                                    <p className="text-muted">{selectedApplication.Fk_candidate_id?.email}</p>
                                    <p className="text-muted small">{selectedApplication.Fk_candidate_id?.phone}</p>
                                    <div className="badges-row">
                                        <span className={`status-badge ${getStatusBadge(selectedApplication.status)}`}>
                                            {selectedApplication.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Application Info</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Applied For:</span>
                                        <span className="detail-value">{selectedJob?.job_title}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Date Applied:</span>
                                        <span className="detail-value">{new Date(selectedApplication.appliedAt || selectedApplication.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {selectedApplication.Fk_resume_id && (
                                        <div className="detail-item">
                                            <span className="detail-label">Resume:</span>
                                            <a href={`http://localhost:5000${selectedApplication.Fk_resume_id.resume_path}`} target="_blank" rel="noopener noreferrer" className="detail-value text-primary text-decoration-none">
                                                View Resume <i className="bi bi-box-arrow-up-right ms-1"></i>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {selectedApplication.Fk_candidate_id?.skills && selectedApplication.Fk_candidate_id.skills.length > 0 && (
                                    <div className="detail-section">
                                        <h6>Candidate Skills</h6>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {selectedApplication.Fk_candidate_id.skills.map((skill, idx) => (
                                                <span key={idx} className="badge bg-secondary">
                                                    {typeof skill === 'string' ? skill : (skill.skill_name || skill.name || 'Skill')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedApplication.coverLetter && (
                                    <div className="detail-section">
                                        <h6>Cover Letter</h6>
                                        <p className="text-muted small mt-2">{selectedApplication.coverLetter}</p>
                                    </div>
                                )}

                                <div className="detail-section mt-4">
                                    <h6>Actions</h6>
                                    {selectedApplication.interviewDetails && selectedApplication.interviewDetails.session_status === 'completed' && (
                                        <button
                                            className="btn btn-sm btn-success w-100 mb-2 text-white"
                                            onClick={() => fetchReport(selectedApplication.interviewDetails._id || selectedApplication.interviewDetails.sessionId)}
                                            disabled={reportLoading}
                                        >
                                            <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                            {reportLoading ? 'Loading Report...' : 'View AI Report'}
                                        </button>
                                    )}
                                    {selectedApplication.status === 'Applied' && (
                                        <button
                                            className="btn btn-sm btn-primary w-100 mb-2"
                                            onClick={() => handleShortlistCandidate(selectedApplication._id)}
                                            disabled={actionLoading}
                                        >
                                            <i className="bi bi-check-circle me-2"></i>
                                            {actionLoading ? 'Processing...' : 'Shortlist Candidate'}
                                        </button>
                                    )}
                                    {['Applied', 'Shortlisted'].includes(selectedApplication.status) && (
                                        <button
                                            className="btn btn-sm btn-info w-100 mb-2 text-white"
                                            onClick={() => setShowScheduleModal(true)}
                                        >
                                            <i className="bi bi-calendar me-2"></i>Schedule Interview
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-sm btn-danger w-100 mb-2"
                                        onClick={() => handleRejectCandidate(selectedApplication._id)}
                                        disabled={selectedApplication.status === 'Rejected' || selectedApplication.status === 'Hired'}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        {selectedApplication.status === 'Rejected' ? 'Already Rejected' : 'Reject'}
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => window.location.href = `mailto:${selectedApplication.Fk_candidate_id?.email}`}>
                                        <i className="bi bi-envelope me-2"></i>Send Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ======== Full Report Modal ======== */}
            {selectedReport && (
                <div className="rf-modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="rf-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="rf-modal-header">
                            <div>
                                <h2 className="rf-modal-title">
                                    <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                    Full Interview Report
                                </h2>
                                <p className="rf-modal-subtitle">
                                    {selectedReport.jobTitle} &nbsp;·&nbsp; {selectedReport.candidateName || selectedApplication?.Fk_candidate_id?.full_name}
                                    &nbsp;·&nbsp;{selectedReport.date && new Date(selectedReport.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button className="rf-close-btn" onClick={() => setSelectedReport(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="rf-modal-body">
                            <div className="rf-report-hero">
                                <div className={`rf-report-score-circle ${getScoreColor(selectedReport.overallScore)}`}>
                                    <span className="rf-score-num">{selectedReport.overallScore}</span>
                                    <span className="rf-score-pct">%</span>
                                </div>
                                <div className="rf-report-hero-info">
                                    <div className={`rf-recommendation-pill lg ${getRecommendationVariant(selectedReport.feedback?.recommendation)}`}>
                                        <i className="bi bi-robot me-2"></i>
                                        {selectedReport.feedback?.recommendation || 'Pending Assessment'}
                                    </div>
                                    <div className="rf-report-meta-grid">
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-clock text-primary me-2"></i>
                                            <span>Duration: <strong>{selectedReport.duration > 0 ? `${selectedReport.duration} min` : 'N/A'}</strong></span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className={`bi ${selectedReport.integrityStatus === 'Clean' ? 'bi-shield-check text-success' : 'bi-exclamation-octagon text-warning'} me-2`}></i>
                                            <span>Integrity: <strong>{selectedReport.integrityStatus || 'N/A'}</strong>
                                                {selectedReport.violations > 0 && <span className="text-warning ms-1">({selectedReport.violations} flag{selectedReport.violations > 1 ? 's' : ''})</span>}
                                            </span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-calendar3 text-primary me-2"></i>
                                            <span>Date: <strong>{selectedReport.date ? new Date(selectedReport.date).toLocaleDateString() : 'N/A'}</strong></span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-robot text-primary me-2"></i>
                                            <span>Type: <strong>{selectedReport.type || 'AI Interview'}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedReport.feedback?.aiSummary && (
                                <div className="rf-section">
                                    <h3 className="rf-section-title">
                                        <i className="bi bi-robot"></i> AI Analysis Summary
                                    </h3>
                                    <div className="rf-ai-summary">
                                        <p>{selectedReport.feedback.aiSummary}</p>
                                    </div>
                                </div>
                            )}

                            <div className="rf-section">
                                <h3 className="rf-section-title">
                                    <i className="bi bi-graph-up"></i> Score Breakdown
                                </h3>
                                <div className="rf-perf-grid">
                                    {Object.entries(selectedReport.scores || {}).map(([key, val]) => (
                                        <div key={key} className="rf-perf-row">
                                            <span className="rf-perf-label">{key}</span>
                                            <div className="rf-perf-bar-track">
                                                <div
                                                    className={`rf-perf-bar-fill ${getScoreColor(val)}`}
                                                    style={{ width: `${Math.min(val, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`rf-perf-val ${getScoreColor(val)}`}>{val}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {((selectedReport.feedback?.strengths?.length > 0) || (selectedReport.feedback?.improvements?.length > 0)) && (
                                <div className="rf-section">
                                    <h3 className="rf-section-title">
                                        <i className="bi bi-lightbulb"></i> Key Insights
                                    </h3>
                                    <div className="rf-insight-columns">
                                        <div className="rf-insight-col strengths">
                                            <div className="rf-insight-col-header">
                                                <i className="bi bi-check-circle-fill"></i> Key Strengths
                                            </div>
                                            <ul>
                                                {(selectedReport.feedback.strengths || []).map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rf-insight-col improvements">
                                            <div className="rf-insight-col-header">
                                                <i className="bi bi-arrow-up-circle-fill"></i> Areas to Improve
                                            </div>
                                            <ul>
                                                {(selectedReport.feedback.improvements || []).map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport.questions && selectedReport.questions.length > 0 && (
                                <div className="rf-section">
                                    <h3 className="rf-section-title">
                                        <i className="bi bi-list-check"></i> Question-by-Question Analysis
                                        <span className="rf-q-count">{selectedReport.questions.length} questions</span>
                                    </h3>
                                    <div className="rf-questions-list">
                                        {selectedReport.questions.map((q, idx) => (
                                            <div key={idx} className={`rf-question-block ${getScoreColor(q.score)}`}>
                                                <div className="rf-question-top">
                                                    <div className="rf-question-meta">
                                                        <span className="rf-q-num">Q{idx + 1}</span>
                                                        {q.topic && <span className="rf-q-topic">{q.topic}</span>}
                                                    </div>
                                                    <span className={`rf-q-score ${getScoreColor(q.score)}`}>
                                                        {q.score}%
                                                    </span>
                                                </div>
                                                <div className="rf-question-text">{q.question}</div>

                                                <div className="rf-answer-box">
                                                    <div className="rf-answer-label">Candidate Answer</div>
                                                    <div className="rf-answer-text">
                                                        {q.answer && q.answer !== 'No answer recorded'
                                                            ? q.answer
                                                            : <span className="rf-no-answer">No answer was recorded for this question.</span>}
                                                    </div>
                                                </div>

                                                {q.aiComment && q.aiComment !== 'No feedback available' && (
                                                    <div className="rf-ai-comment">
                                                        <i className="bi bi-chat-left-quote-fill"></i>
                                                        <span>{q.aiComment}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ======== Schedule Interview Modal ======== */}
            {showScheduleModal && (
                <div className="rf-modal-overlay" onClick={() => !scheduleLoading && setShowScheduleModal(false)}>
                    <div className="rf-modal-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                        <div className="rf-modal-header">
                            <div>
                                <h2 className="rf-modal-title">
                                    <i className="bi bi-calendar-plus me-2"></i>Schedule Interview
                                </h2>
                                <p className="rf-modal-subtitle mt-1">
                                    For: <strong>{selectedApplication?.Fk_candidate_id?.full_name}</strong>
                                </p>
                            </div>
                            <button className="rf-close-btn" disabled={scheduleLoading} onClick={() => setShowScheduleModal(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="rf-modal-body p-4">
                            <div className="mb-3">
                                <label className="form-label text-light mb-2">Interview Start Date &amp; Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control-dark w-100"
                                    value={scheduleStartDate}
                                    onChange={e => setScheduleStartDate(e.target.value)}
                                    disabled={scheduleLoading}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-light mb-2">Interview End Date &amp; Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control-dark w-100"
                                    value={scheduleEndDate}
                                    onChange={e => setScheduleEndDate(e.target.value)}
                                    disabled={scheduleLoading}
                                    min={scheduleStartDate || new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            <div className="alert alert-info bg-info bg-opacity-10 border-info text-info mt-2">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                The candidate will receive an email and in-app notification with the scheduled time.
                            </div>
                        </div>
                        <div className="rf-modal-footer d-flex justify-content-end p-3 border-top border-secondary border-opacity-25">
                            <button className="btn btn-outline-secondary me-2" disabled={scheduleLoading} onClick={() => setShowScheduleModal(false)}>Cancel</button>
                            <button className="btn btn-info text-white" disabled={scheduleLoading || !scheduleStartDate || !scheduleEndDate} onClick={handleScheduleInterview}>
                                {scheduleLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Scheduling...</> : <><i className="bi bi-calendar-check me-2"></i>Confirm Schedule</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======== Finalize Hiring Modal ======== */}
            {showFinalizeModal && (
                <div className="rf-modal-overlay" onClick={() => !finalizeLoading && setShowFinalizeModal(false)}>
                    <div className="rf-modal-box" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div className="rf-modal-header">
                            <div>
                                <h2 className="rf-modal-title">
                                    <i className="bi bi-person-check-fill me-2"></i>
                                    Finalize Hiring
                                </h2>
                                <p className="rf-modal-subtitle mt-1">
                                    Select the number of top AI-ranked candidates to hire.
                                </p>
                            </div>
                            <button className="rf-close-btn" disabled={finalizeLoading} onClick={() => setShowFinalizeModal(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="rf-modal-body p-4">
                            <label className="form-label text-light mb-2">Number of Top Candidates to Hire</label>
                            <input
                                type="number"
                                className="form-control-dark w-100 mb-3"
                                min="1"
                                max={filteredItems.filter(app => app.status !== 'Hired' && app.status !== 'Rejected' && app.status !== 'Banned').length || 1}
                                value={hireCount}
                                onChange={(e) => setHireCount(e.target.value)}
                                disabled={finalizeLoading}
                            />
                            <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning mt-3">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <strong>Warning:</strong> The top <strong>{hireCount}</strong> candidate(s) will be marked as <strong>Hired</strong>.
                                ALL OTHER active candidates for this job will be automatically marked as <strong>Rejected</strong>.
                                Banned candidates are excluded from this process.
                                Emails will be sent immediately. This action cannot be undone.
                            </div>
                        </div>
                        <div className="rf-modal-footer d-flex justify-content-end p-3 border-top border-secondary border-opacity-25 mt-3">
                            <button className="btn btn-outline-secondary me-2" disabled={finalizeLoading} onClick={() => setShowFinalizeModal(false)}>Cancel</button>
                            <button className="btn btn-primary" disabled={finalizeLoading || hireCount < 1} onClick={handleFinalizeHiring}>
                                {finalizeLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</> : 'Confirm Finalize'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewMonitoring;

