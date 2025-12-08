import React, { useState } from 'react';
import './MyApplications.css';

const MyApplications = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');

    // Sample applications data
    const [applications] = useState([
        {
            id: 1,
            jobTitle: 'Senior Software Developer',
            company: 'TechCorp Inc.',
            companyLogo: 'TC',
            location: 'New York, USA',
            appliedDate: '2025-12-05',
            status: 'interview_scheduled',
            matchScore: 92,
            salary: '$120,000 - $150,000',
            type: 'Full-time',
            interviewDate: '2025-12-10',
            interviewTime: '10:00 AM',
            resumeScore: 88,
            skillsMatched: ['JavaScript', 'React', 'Node.js'],
            skillsGap: ['AWS'],
            notes: 'Great opportunity with excellent team culture'
        },
        {
            id: 2,
            jobTitle: 'Full Stack Developer',
            company: 'StartupXYZ',
            companyLogo: 'SX',
            location: 'San Francisco, USA',
            appliedDate: '2025-12-04',
            status: 'under_review',
            matchScore: 85,
            salary: '$100,000 - $130,000',
            type: 'Full-time',
            resumeScore: 82,
            skillsMatched: ['React', 'Node.js', 'MongoDB'],
            skillsGap: ['Docker', 'Kubernetes'],
            notes: 'Exciting startup with rapid growth'
        },
        {
            id: 3,
            jobTitle: 'Backend Engineer',
            company: 'CloudTech',
            companyLogo: 'CT',
            location: 'Remote',
            appliedDate: '2025-12-03',
            status: 'screening_completed',
            matchScore: 78,
            salary: '$110,000 - $140,000',
            type: 'Remote',
            resumeScore: 75,
            skillsMatched: ['Node.js', 'Python'],
            skillsGap: ['Go', 'Redis'],
            notes: 'Remote-first company'
        },
        {
            id: 4,
            jobTitle: 'DevOps Specialist',
            company: 'DataCo',
            companyLogo: 'DC',
            location: 'Boston, USA',
            appliedDate: '2025-12-01',
            status: 'completed',
            matchScore: 88,
            salary: '$115,000 - $145,000',
            type: 'Hybrid',
            resumeScore: 90,
            skillsMatched: ['AWS', 'Docker', 'Kubernetes'],
            skillsGap: [],
            notes: 'Interview went well, waiting for decision'
        },
        {
            id: 5,
            jobTitle: 'Frontend Developer',
            company: 'DesignHub',
            companyLogo: 'DH',
            location: 'Los Angeles, USA',
            appliedDate: '2025-11-28',
            status: 'rejected',
            matchScore: 70,
            salary: '$90,000 - $120,000',
            type: 'Full-time',
            resumeScore: 68,
            skillsMatched: ['React', 'CSS'],
            skillsGap: ['Vue.js', 'TypeScript'],
            notes: 'Position filled internally'
        },
        {
            id: 6,
            jobTitle: 'React Developer',
            company: 'Innovation Labs',
            companyLogo: 'IL',
            location: 'Seattle, USA',
            appliedDate: '2025-11-25',
            status: 'withdrawn',
            matchScore: 95,
            salary: '$125,000 - $155,000',
            type: 'Full-time',
            resumeScore: 93,
            skillsMatched: ['React', 'JavaScript', 'Node.js', 'AWS'],
            skillsGap: [],
            notes: 'Withdrew due to location preference'
        }
    ]);

    const statusConfig = {
        interview_scheduled: { label: 'Interview Scheduled', color: 'warning', icon: 'bi-calendar-check' },
        under_review: { label: 'Under Review', color: 'info', icon: 'bi-hourglass-split' },
        screening_completed: { label: 'Screening Completed', color: 'primary', icon: 'bi-clipboard-check' },
        completed: { label: 'Completed', color: 'success', icon: 'bi-check-circle' },
        rejected: { label: 'Rejected', color: 'danger', icon: 'bi-x-circle' },
        withdrawn: { label: 'Withdrawn', color: 'secondary', icon: 'bi-dash-circle' }
    };

    const getFilteredApplications = () => {
        let filtered = applications;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(app => app.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.company.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.appliedDate) - new Date(a.appliedDate);
            } else if (sortBy === 'match') {
                return b.matchScore - a.matchScore;
            } else if (sortBy === 'company') {
                return a.company.localeCompare(b.company);
            }
            return 0;
        });

        return filtered;
    };

    const filteredApplications = getFilteredApplications();

    const stats = {
        total: applications.length,
        pending: applications.filter(a => ['under_review', 'screening_completed'].includes(a.status)).length,
        scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
        completed: applications.filter(a => a.status === 'completed').length
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="applications-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">My Applications</h1>
                    <p className="text-muted">Track and manage your job applications</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">
                            <i className="bi bi-briefcase-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Applications</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-info">
                        <div className="stat-icon">
                            <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Review</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-warning">
                        <div className="stat-icon">
                            <i className="bi bi-calendar-check-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.scheduled}</div>
                            <div className="stat-label">Interviews Scheduled</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card stat-success">
                        <div className="stat-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="filters-section mb-4">
                <div className="filters-bar">
                    <div className="filter-group">
                        <label className="filter-label">Status:</label>
                        <div className="status-filters">
                            <button
                                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'interview_scheduled' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('interview_scheduled')}
                            >
                                Scheduled
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'under_review' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('under_review')}
                            >
                                Review
                            </button>
                            <button
                                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    <div className="search-sort-group">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="match">Sort by Match Score</option>
                            <option value="company">Sort by Company</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="applications-list">
                {filteredApplications.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-inbox fs-1 mb-3"></i>
                        <h5>No applications found</h5>
                        <p className="text-muted">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    filteredApplications.map(app => (
                        <div key={app.id} className="application-card">
                            <div className="application-header">
                                <div className="company-info">
                                    <div className="company-logo">
                                        {app.companyLogo}
                                    </div>
                                    <div>
                                        <h5 className="job-title">{app.jobTitle}</h5>
                                        <p className="company-name">
                                            <i className="bi bi-building me-2"></i>
                                            {app.company}
                                        </p>
                                    </div>
                                </div>
                                <span className={`status-badge status-${statusConfig[app.status].color}`}>
                                    <i className={`bi ${statusConfig[app.status].icon} me-2`}></i>
                                    {statusConfig[app.status].label}
                                </span>
                            </div>

                            <div className="application-body">
                                <div className="application-meta">
                                    <div className="meta-item">
                                        <i className="bi bi-geo-alt"></i>
                                        <span>{app.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-clock"></i>
                                        <span>{app.type}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-currency-dollar"></i>
                                        <span>{app.salary}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="bi bi-calendar"></i>
                                        <span>Applied: {formatDate(app.appliedDate)}</span>
                                    </div>
                                </div>

                                {app.status === 'interview_scheduled' && (
                                    <div className="interview-alert">
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        <strong>Interview Scheduled:</strong> {formatDate(app.interviewDate)} at {app.interviewTime}
                                    </div>
                                )}

                                <div className="application-scores">
                                    <div className="score-item">
                                        <div className="score-label">Match Score</div>
                                        <div className="score-bar">
                                            <div 
                                                className="score-fill" 
                                                style={{ width: `${app.matchScore}%` }}
                                            ></div>
                                        </div>
                                        <div className="score-value">{app.matchScore}%</div>
                                    </div>
                                    <div className="score-item">
                                        <div className="score-label">Resume Score</div>
                                        <div className="score-bar">
                                            <div 
                                                className="score-fill secondary" 
                                                style={{ width: `${app.resumeScore}%` }}
                                            ></div>
                                        </div>
                                        <div className="score-value">{app.resumeScore}%</div>
                                    </div>
                                </div>

                                <div className="skills-section">
                                    <div className="skills-matched">
                                        <strong>Matched Skills:</strong>
                                        <div className="skills-tags">
                                            {app.skillsMatched.map((skill, idx) => (
                                                <span key={idx} className="skill-tag matched">
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {app.skillsGap.length > 0 && (
                                        <div className="skills-gap">
                                            <strong>Skills to Improve:</strong>
                                            <div className="skills-tags">
                                                {app.skillsGap.map((skill, idx) => (
                                                    <span key={idx} className="skill-tag gap">
                                                        <i className="bi bi-exclamation-circle me-1"></i>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {app.notes && (
                                    <div className="application-notes">
                                        <i className="bi bi-sticky me-2"></i>
                                        <span>{app.notes}</span>
                                    </div>
                                )}
                            </div>

                            <div className="application-footer">
                                <div className="action-buttons">
                                    <button className="btn btn-outline-primary">
                                        <i className="bi bi-eye me-2"></i>View Details
                                    </button>
                                    {app.status === 'interview_scheduled' && (
                                        <button className="btn btn-primary">
                                            <i className="bi bi-camera-video me-2"></i>Join Interview
                                        </button>
                                    )}
                                    <button className="btn btn-outline-secondary">
                                        <i className="bi bi-chat-dots me-2"></i>Messages
                                    </button>
                                </div>
                                <button className="btn-more">
                                    <i className="bi bi-three-dots-vertical"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyApplications;
