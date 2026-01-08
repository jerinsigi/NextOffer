import React, { useState } from 'react';
import './InterviewMonitoring.css';

const InterviewMonitoring = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [activeTab, setActiveTab] = useState('live');

    // Sample interview data
    const interviewsData = [
        {
            id: 1,
            candidateName: 'John Doe',
            candidateEmail: 'john.doe@email.com',
            position: 'Senior Full Stack Developer',
            company: 'TechCorp Inc.',
            interviewer: 'Sarah Johnson',
            status: 'Live',
            startTime: '2024-12-06 10:00 AM',
            duration: '00:23:45',
            progress: 65,
            integrityScore: 98,
            violations: [],
            questionsAnswered: 8,
            totalQuestions: 12,
            currentQuestion: 'Explain the concept of closures in JavaScript',
            videoQuality: 'HD',
            audioQuality: 'Good',
            connectionStatus: 'Stable',
            flags: []
        },
        {
            id: 2,
            candidateName: 'Emily Chen',
            candidateEmail: 'emily.chen@email.com',
            position: 'Product Manager',
            company: 'Innovate Solutions',
            interviewer: 'Michael Rodriguez',
            status: 'Live',
            startTime: '2024-12-06 09:30 AM',
            duration: '00:45:12',
            progress: 80,
            integrityScore: 95,
            violations: ['Gaze Aversion - 2 times'],
            questionsAnswered: 10,
            totalQuestions: 12,
            currentQuestion: 'Describe your approach to stakeholder management',
            videoQuality: 'HD',
            audioQuality: 'Excellent',
            connectionStatus: 'Stable',
            flags: ['Minor integrity alert']
        },
        {
            id: 3,
            candidateName: 'Alex Martinez',
            candidateEmail: 'alex.m@email.com',
            position: 'DevOps Engineer',
            company: 'StartupX',
            interviewer: 'Jennifer Lee',
            status: 'Completed',
            startTime: '2024-12-06 08:00 AM',
            endTime: '2024-12-06 08:45 AM',
            duration: '00:45:00',
            progress: 100,
            integrityScore: 100,
            violations: [],
            questionsAnswered: 15,
            totalQuestions: 15,
            overallRating: 4.5,
            videoQuality: 'HD',
            audioQuality: 'Excellent',
            connectionStatus: 'Completed',
            flags: [],
            recordingUrl: '/recordings/interview_003.mp4'
        },
        {
            id: 4,
            candidateName: 'Sarah Williams',
            candidateEmail: 'swilliams@email.com',
            position: 'UX/UI Designer',
            company: 'MegaCorp Ltd.',
            interviewer: 'David Kim',
            status: 'Completed',
            startTime: '2024-12-05 03:00 PM',
            endTime: '2024-12-05 03:42 PM',
            duration: '00:42:00',
            progress: 100,
            integrityScore: 92,
            violations: ['Tab Switch - 1 time'],
            questionsAnswered: 12,
            totalQuestions: 12,
            overallRating: 4.0,
            videoQuality: 'HD',
            audioQuality: 'Good',
            connectionStatus: 'Completed',
            flags: ['Minor violation recorded'],
            recordingUrl: '/recordings/interview_004.mp4'
        },
        {
            id: 5,
            candidateName: 'Robert Taylor',
            candidateEmail: 'rtaylor@email.com',
            position: 'Data Scientist',
            company: 'TechVision',
            interviewer: 'Lisa Anderson',
            status: 'Scheduled',
            startTime: '2024-12-06 02:00 PM',
            duration: '00:00:00',
            progress: 0,
            integrityScore: null,
            violations: [],
            questionsAnswered: 0,
            totalQuestions: 15,
            videoQuality: 'N/A',
            audioQuality: 'N/A',
            connectionStatus: 'Not Started',
            flags: []
        },
        {
            id: 6,
            candidateName: 'Maria Garcia',
            candidateEmail: 'mgarcia@email.com',
            position: 'Backend Engineer',
            company: 'Future Tech',
            interviewer: 'John Smith',
            status: 'Paused',
            startTime: '2024-12-06 11:00 AM',
            duration: '00:15:30',
            progress: 30,
            integrityScore: 97,
            violations: [],
            questionsAnswered: 4,
            totalQuestions: 14,
            currentQuestion: 'Explain database normalization',
            videoQuality: 'SD',
            audioQuality: 'Fair',
            connectionStatus: 'Reconnecting',
            flags: ['Connection issue']
        },
        {
            id: 7,
            candidateName: 'James Wilson',
            candidateEmail: 'jwilson@email.com',
            position: 'Mobile App Developer',
            company: 'Global Industries',
            interviewer: 'Emma Johnson',
            status: 'Failed',
            startTime: '2024-12-05 10:00 AM',
            endTime: '2024-12-05 10:05 AM',
            duration: '00:05:00',
            progress: 10,
            integrityScore: 45,
            violations: ['Multiple Tab Switches', 'Presence Anomaly', 'Gaze Aversion'],
            questionsAnswered: 1,
            totalQuestions: 12,
            overallRating: 1.0,
            videoQuality: 'SD',
            audioQuality: 'Poor',
            connectionStatus: 'Terminated',
            flags: ['Critical integrity violation', 'Auto-terminated'],
            recordingUrl: '/recordings/interview_007.mp4'
        },
        {
            id: 8,
            candidateName: 'Linda Brown',
            candidateEmail: 'lbrown@email.com',
            position: 'Marketing Manager',
            company: 'Enterprise Corp',
            interviewer: 'Richard Davis',
            status: 'Completed',
            startTime: '2024-12-04 01:00 PM',
            endTime: '2024-12-04 01:38 PM',
            duration: '00:38:00',
            progress: 100,
            integrityScore: 100,
            violations: [],
            questionsAnswered: 10,
            totalQuestions: 10,
            overallRating: 4.8,
            videoQuality: 'HD',
            audioQuality: 'Excellent',
            connectionStatus: 'Completed',
            flags: [],
            recordingUrl: '/recordings/interview_008.mp4'
        }
    ];

    const companies = ['All Companies', ...new Set(interviewsData.map(i => i.company))];

    const getFilteredInterviews = () => {
        let filtered = interviewsData.filter(interview => {
            const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                interview.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
            const matchesCompany = companyFilter === 'all' || interview.company === companyFilter;
            return matchesSearch && matchesStatus && matchesCompany;
        });

        // Filter by tab
        if (activeTab === 'live') {
            filtered = filtered.filter(i => i.status === 'Live');
        } else if (activeTab === 'scheduled') {
            filtered = filtered.filter(i => i.status === 'Scheduled');
        } else if (activeTab === 'completed') {
            filtered = filtered.filter(i => i.status === 'Completed');
        } else if (activeTab === 'flagged') {
            filtered = filtered.filter(i => i.flags.length > 0 || i.violations.length > 0);
        }

        return filtered;
    };

    const filteredInterviews = getFilteredInterviews();

    const getStatusBadge = (status) => {
        const badges = {
            'Live': 'status-badge-live',
            'Completed': 'status-badge-completed',
            'Scheduled': 'status-badge-scheduled',
            'Paused': 'status-badge-paused',
            'Failed': 'status-badge-failed'
        };
        return badges[status] || 'status-badge-scheduled';
    };

    const getIntegrityBadge = (score) => {
        if (score === null) return 'integrity-badge-na';
        if (score >= 95) return 'integrity-badge-excellent';
        if (score >= 80) return 'integrity-badge-good';
        if (score >= 60) return 'integrity-badge-fair';
        return 'integrity-badge-poor';
    };

    const getIntegrityLabel = (score) => {
        if (score === null) return 'N/A';
        if (score >= 95) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 60) return 'Fair';
        return 'Poor';
    };

    const handleInterviewClick = (interview) => {
        setSelectedInterview(interview);
    };

    const handleTerminateInterview = (id) => {
        if (window.confirm('Are you sure you want to terminate this interview?')) {
            console.log('Terminating interview:', id);
        }
    };

    const handleViewRecording = (url) => {
        console.log('Playing recording:', url);
    };

    const handleDownloadRecording = (url) => {
        console.log('Downloading recording:', url);
    };

    const handleSendMessage = (id) => {
        console.log('Sending message to interview:', id);
    };

    // Stats
    const stats = {
        live: interviewsData.filter(i => i.status === 'Live').length,
        scheduled: interviewsData.filter(i => i.status === 'Scheduled').length,
        completed: interviewsData.filter(i => i.status === 'Completed').length,
        flagged: interviewsData.filter(i => i.flags.length > 0 || i.violations.length > 0).length
    };

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Interview Monitoring</h1>
                    <p className="text-muted">Monitor live interviews and review completed sessions</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary me-2">
                        <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                    </button>
                    <button className="btn btn-primary">
                        <i className="bi bi-calendar-plus me-2"></i>Schedule Interview
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-danger bg-opacity-20 text-danger">
                            <i className="bi bi-record-circle fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Live Interviews</div>
                            <div className="stat-value">{stats.live}</div>
                            <div className="stat-trend text-danger">
                                <i className="bi bi-broadcast"></i> In Progress
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-calendar-check fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Scheduled Today</div>
                            <div className="stat-value">{stats.scheduled}</div>
                            <div className="stat-trend text-muted">
                                Upcoming sessions
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
                            <div className="stat-label">Completed</div>
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-trend text-muted">
                                Last 24 hours
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                            <i className="bi bi-flag fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Flagged</div>
                            <div className="stat-value">{stats.flagged}</div>
                            <div className="stat-trend text-warning">
                                <i className="bi bi-exclamation-triangle"></i> Needs review
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Tabs */}
            <div className="dashboard-card">
                <div className="card-header-custom">
                    <div className="interview-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                            onClick={() => setActiveTab('live')}
                        >
                            <i className="bi bi-broadcast"></i>
                            Live ({stats.live})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('scheduled')}
                        >
                            <i className="bi bi-calendar"></i>
                            Scheduled ({stats.scheduled})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            <i className="bi bi-check-circle"></i>
                            Completed ({stats.completed})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'flagged' ? 'active' : ''}`}
                            onClick={() => setActiveTab('flagged')}
                        >
                            <i className="bi bi-flag"></i>
                            Flagged ({stats.flagged})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <i className="bi bi-list"></i>
                            All
                        </button>
                    </div>
                    <div className="interviews-filters">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control-dark"
                                placeholder="Search interviews..."
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
                    </div>
                </div>

                <div className="interviews-content">
                    <div className="interviews-list">
                        {filteredInterviews.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                <p className="text-muted">No interviews found</p>
                            </div>
                        ) : (
                            filteredInterviews.map(interview => (
                                <div 
                                    key={interview.id}
                                    className={`interview-card ${selectedInterview?.id === interview.id ? 'selected' : ''}`}
                                    onClick={() => handleInterviewClick(interview)}
                                >
                                    <div className="interview-card-header">
                                        <div className="candidate-info">
                                            <div className="candidate-avatar">
                                                {interview.candidateName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h5 className="candidate-name">{interview.candidateName}</h5>
                                                <p className="position-title">{interview.position}</p>
                                            </div>
                                        </div>
                                        <div className="interview-badges">
                                            <span className={`status-badge ${getStatusBadge(interview.status)}`}>
                                                {interview.status === 'Live' && <i className="bi bi-circle-fill pulse-dot"></i>}
                                                {interview.status}
                                            </span>
                                            {interview.integrityScore !== null && (
                                                <span className={`integrity-badge ${getIntegrityBadge(interview.integrityScore)}`}>
                                                    {getIntegrityLabel(interview.integrityScore)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="interview-details">
                                        <div className="detail-row">
                                            <span className="detail-icon"><i className="bi bi-building"></i></span>
                                            <span className="detail-text">{interview.company}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-icon"><i className="bi bi-person"></i></span>
                                            <span className="detail-text">Interviewer: {interview.interviewer}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-icon"><i className="bi bi-clock"></i></span>
                                            <span className="detail-text">{interview.startTime} • {interview.duration}</span>
                                        </div>
                                    </div>

                                    {interview.status === 'Live' && (
                                        <div className="progress-section">
                                            <div className="progress-header">
                                                <span>Progress: {interview.questionsAnswered}/{interview.totalQuestions} questions</span>
                                                <span>{interview.progress}%</span>
                                            </div>
                                            <div className="progress-bar-custom">
                                                <div 
                                                    className="progress-fill"
                                                    style={{ width: `${interview.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {interview.violations.length > 0 && (
                                        <div className="violations-section">
                                            <i className="bi bi-exclamation-triangle text-warning"></i>
                                            <span>{interview.violations.join(', ')}</span>
                                        </div>
                                    )}

                                    {interview.flags.length > 0 && (
                                        <div className="flags-section">
                                            {interview.flags.map((flag, idx) => (
                                                <span key={idx} className="flag-tag">
                                                    <i className="bi bi-flag-fill"></i>
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="interview-actions">
                                        {interview.status === 'Live' && (
                                            <>
                                                <button 
                                                    className="btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Viewing live:', interview.id);
                                                    }}
                                                >
                                                    <i className="bi bi-eye"></i> Watch Live
                                                </button>
                                                <button 
                                                    className="btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTerminateInterview(interview.id);
                                                    }}
                                                >
                                                    <i className="bi bi-stop-circle"></i> Terminate
                                                </button>
                                            </>
                                        )}
                                        {interview.status === 'Completed' && (
                                            <>
                                                <button 
                                                    className="btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewRecording(interview.recordingUrl);
                                                    }}
                                                >
                                                    <i className="bi bi-play-circle"></i> View Recording
                                                </button>
                                                <button 
                                                    className="btn-sm btn-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadRecording(interview.recordingUrl);
                                                    }}
                                                >
                                                    <i className="bi bi-download"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Interview Details Panel */}
                    {selectedInterview && (
                        <div className="interview-details-panel">
                            <div className="panel-header">
                                <h5>Interview Details</h5>
                                <button 
                                    className="btn-close"
                                    onClick={() => setSelectedInterview(null)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="panel-content">
                                <div className="candidate-profile">
                                    <div className="candidate-avatar-large">
                                        {selectedInterview.candidateName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h4>{selectedInterview.candidateName}</h4>
                                    <p className="text-muted">{selectedInterview.candidateEmail}</p>
                                    <div className="badges-row">
                                        <span className={`status-badge ${getStatusBadge(selectedInterview.status)}`}>
                                            {selectedInterview.status === 'Live' && <i className="bi bi-circle-fill pulse-dot"></i>}
                                            {selectedInterview.status}
                                        </span>
                                        {selectedInterview.integrityScore !== null && (
                                            <span className={`integrity-badge ${getIntegrityBadge(selectedInterview.integrityScore)}`}>
                                                Score: {selectedInterview.integrityScore}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Position Information</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Position:</span>
                                        <span className="detail-value">{selectedInterview.position}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Company:</span>
                                        <span className="detail-value">{selectedInterview.company}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Interviewer:</span>
                                        <span className="detail-value">{selectedInterview.interviewer}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Session Timeline</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Start Time:</span>
                                        <span className="detail-value">{selectedInterview.startTime}</span>
                                    </div>
                                    {selectedInterview.endTime && (
                                        <div className="detail-item">
                                            <span className="detail-label">End Time:</span>
                                            <span className="detail-value">{selectedInterview.endTime}</span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="detail-label">Duration:</span>
                                        <span className="detail-value">{selectedInterview.duration}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Progress</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Questions:</span>
                                        <span className="detail-value">
                                            {selectedInterview.questionsAnswered}/{selectedInterview.totalQuestions}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Completion:</span>
                                        <span className="detail-value">{selectedInterview.progress}%</span>
                                    </div>
                                    {selectedInterview.currentQuestion && (
                                        <div className="current-question">
                                            <p className="text-muted mb-1">Current Question:</p>
                                            <p className="question-text">{selectedInterview.currentQuestion}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section">
                                    <h6>Technical Quality</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Video Quality:</span>
                                        <span className="detail-value">{selectedInterview.videoQuality}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Audio Quality:</span>
                                        <span className="detail-value">{selectedInterview.audioQuality}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Connection:</span>
                                        <span className="detail-value">{selectedInterview.connectionStatus}</span>
                                    </div>
                                </div>

                                {selectedInterview.violations.length > 0 && (
                                    <div className="detail-section">
                                        <h6>Integrity Violations</h6>
                                        <div className="violations-list">
                                            {selectedInterview.violations.map((violation, idx) => (
                                                <div key={idx} className="violation-item">
                                                    <i className="bi bi-exclamation-triangle text-warning"></i>
                                                    <span>{violation}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.flags.length > 0 && (
                                    <div className="detail-section">
                                        <h6>Flags</h6>
                                        <div className="flags-list">
                                            {selectedInterview.flags.map((flag, idx) => (
                                                <div key={idx} className="flag-item">
                                                    <i className="bi bi-flag-fill text-danger"></i>
                                                    <span>{flag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.overallRating && (
                                    <div className="detail-section">
                                        <h6>Overall Rating</h6>
                                        <div className="rating-display">
                                            <span className="rating-value">{selectedInterview.overallRating}</span>
                                            <span className="rating-stars">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <i 
                                                        key={star}
                                                        className={`bi bi-star${star <= selectedInterview.overallRating ? '-fill' : ''}`}
                                                    ></i>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    {selectedInterview.status === 'Live' && (
                                        <>
                                            <button className="btn btn-sm btn-primary w-100 mb-2">
                                                <i className="bi bi-eye me-2"></i>Watch Live Interview
                                            </button>
                                            <button className="btn btn-sm btn-secondary w-100 mb-2" onClick={() => handleSendMessage(selectedInterview.id)}>
                                                <i className="bi bi-chat me-2"></i>Send Message
                                            </button>
                                            <button className="btn btn-sm btn-danger w-100" onClick={() => handleTerminateInterview(selectedInterview.id)}>
                                                <i className="bi bi-stop-circle me-2"></i>Terminate Interview
                                            </button>
                                        </>
                                    )}
                                    {selectedInterview.status === 'Completed' && selectedInterview.recordingUrl && (
                                        <>
                                            <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleViewRecording(selectedInterview.recordingUrl)}>
                                                <i className="bi bi-play-circle me-2"></i>View Recording
                                            </button>
                                            <button className="btn btn-sm btn-secondary w-100 mb-2" onClick={() => handleDownloadRecording(selectedInterview.recordingUrl)}>
                                                <i className="bi bi-download me-2"></i>Download Recording
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary w-100">
                                                <i className="bi bi-file-text me-2"></i>View Full Report
                                            </button>
                                        </>
                                    )}
                                    {selectedInterview.status === 'Scheduled' && (
                                        <>
                                            <button className="btn btn-sm btn-primary w-100 mb-2">
                                                <i className="bi bi-pencil me-2"></i>Edit Schedule
                                            </button>
                                            <button className="btn btn-sm btn-danger w-100">
                                                <i className="bi bi-x-circle me-2"></i>Cancel Interview
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewMonitoring;
