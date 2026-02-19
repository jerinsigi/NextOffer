import React, { useState, useEffect } from 'react';
import './ResultsFeedback.css';

const ResultsFeedback = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedResult, setSelectedResult] = useState(null);

    const [interviewResults, setInterviewResults] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null); // unused

    // Fetch user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchResults = async () => {
            if (!user || (!user.id && !user._id)) {
                setLoading(false);
                return;
            }

            try {
                // Support both id and _id formats
                const userId = user.id || user._id;
                const response = await fetch(`http://localhost:5000/api/interviews/user-results/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                setInterviewResults(data);
            } catch (err) {
                console.error("Error loading results:", err);
                // setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [user]);

    const getScoreColor = (score) => {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        return 'average';
    };

    const getRecommendationColor = (recommendation) => {
        if (recommendation.includes('Strongly') || recommendation.includes('Fast Track')) return 'success';
        if (recommendation.includes('Highly')) return 'success';
        if (recommendation.includes('Reservations')) return 'warning';
        return 'info';
    };

    const filteredResults = activeTab === 'all'
        ? interviewResults
        : interviewResults.filter(r => {
            if (activeTab === 'excellent') return r.overallScore >= 85;
            if (activeTab === 'good') return r.overallScore >= 70 && r.overallScore < 85;
            if (activeTab === 'needs-improvement') return r.overallScore < 70;
            return true;
        });

    return (
        <div className="results-feedback-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <i className="bi bi-graph-up me-2"></i>
                        Results & Feedback
                    </h1>
                    <p className="text-muted">Review your interview performance and AI-generated insights</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-download me-2"></i>
                        Export All Reports
                    </button>
                </div>
            </div>

            {/* Performance Overview (Hidden if Loading) */}
            {!loading && interviewResults.length > 0 && (
                <div className="performance-overview">
                    <div className="overview-card">
                        <div className="overview-icon excellent">
                            <i className="bi bi-trophy-fill"></i>
                        </div>
                        <div className="overview-info">
                            <div className="overview-value">
                                {Math.round(interviewResults.reduce((acc, r) => acc + r.overallScore, 0) / interviewResults.length)}%
                            </div>
                            <div className="overview-label">Average Score</div>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="overview-icon good">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="overview-info">
                            <div className="overview-value">{interviewResults.length}</div>
                            <div className="overview-label">Total Interviews</div>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="overview-icon success">
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="overview-info">
                            <div className="overview-value">
                                {interviewResults.filter(r => r.overallScore >= 85).length}
                            </div>
                            <div className="overview-label">Excellent Results</div>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="overview-icon clean">
                            <i className="bi bi-shield-check"></i>
                        </div>
                        <div className="overview-info">
                            <div className="overview-value">100%</div>
                            <div className="overview-label">Clean Integrity</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your results...</p>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Results ({interviewResults.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'excellent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('excellent')}
                >
                    <i className="bi bi-star me-1"></i>
                    Excellent (85%+)
                </button>
                <button
                    className={`tab-btn ${activeTab === 'good' ? 'active' : ''}`}
                    onClick={() => setActiveTab('good')}
                >
                    <i className="bi bi-check-circle me-1"></i>
                    Good (70-84%)
                </button>
                <button
                    className={`tab-btn ${activeTab === 'needs-improvement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('needs-improvement')}
                >
                    <i className="bi bi-exclamation-circle me-1"></i>
                    Needs Improvement (&lt;70%)
                </button>
            </div>

            {/* Results List */}
            <div className="results-list">
                {filteredResults.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-inbox fs-1 mb-3"></i>
                        <h5>No Results Found</h5>
                        <p className="text-muted">Try adjusting your filters or complete more interviews.</p>
                    </div>
                ) : (
                    filteredResults.map((result) => (
                        <div key={result.id} className={`result-card ${getScoreColor(result.overallScore)}`}>
                            <div className="result-header">
                                <div className="result-main-info">
                                    <div className="company-info">
                                        <div className="company-logo">
                                            {result.companyLogo && result.companyLogo.includes('/') ? (
                                                <img src={`http://localhost:5000${result.companyLogo}`} alt={result.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                result.company.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4>{result.jobTitle}</h4>
                                            <p className="company-name">
                                                <i className="bi bi-building me-2"></i>
                                                {result.company}
                                            </p>
                                            <p className="interview-meta">
                                                <i className="bi bi-calendar3 me-2"></i>
                                                {new Date(result.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                                <span className="mx-2">•</span>
                                                <i className="bi bi-robot me-2"></i>
                                                {result.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="result-score">
                                        <div className={`score-badge ${getScoreColor(result.overallScore)}`}>
                                            <span className="score-number">{result.overallScore}</span>
                                            <span className="score-percent">%</span>
                                        </div>
                                        <div className="score-label">Overall Score</div>
                                    </div>
                                </div>
                            </div>

                            <div className="result-body">
                                <div className="scores-grid">
                                    {Object.entries(result.scores).map(([key, value]) => (
                                        <div key={key} className="score-item">
                                            <div className="score-item-header">
                                                <span className="score-item-label">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className="score-item-value">{value}%</span>
                                            </div>
                                            <div className="score-item-bar">
                                                <div
                                                    className="score-item-fill"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="recommendation-banner">
                                    <i className={`bi bi-${getRecommendationColor(result.feedback.recommendation) === 'success' ? 'check-circle' : 'info-circle'} me-2`}></i>
                                    <strong>AI Recommendation:</strong>
                                    <span className={`recommendation-text ${getRecommendationColor(result.feedback.recommendation)}`}>
                                        {result.feedback.recommendation}
                                    </span>
                                </div>
                            </div>

                            <div className="result-footer">
                                <div className="result-stats">
                                    <span className="stat-item">
                                        <i className="bi bi-clock me-1"></i>
                                        {result.duration} min
                                    </span>
                                    <span className="stat-item">
                                        <i className="bi bi-shield-check me-1"></i>
                                        {result.integrityStatus}
                                    </span>
                                    <span className="stat-item">
                                        <i className="bi bi-exclamation-triangle me-1"></i>
                                        {result.violations} violations
                                    </span>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setSelectedResult(result)}
                                >
                                    <i className="bi bi-file-text me-2"></i>
                                    View Detailed Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detailed Report Modal */}
            {selectedResult && (
                <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
                    <div className="detailed-report" onClick={(e) => e.stopPropagation()}>
                        <div className="report-header">
                            <div>
                                <h2>
                                    <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                    Detailed Interview Report
                                </h2>
                                <p className="text-muted">
                                    {selectedResult.jobTitle} at {selectedResult.company}
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedResult(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="report-content">
                            {/* AI Summary */}
                            <div className="report-section">
                                <h3>
                                    <i className="bi bi-robot me-2"></i>
                                    AI Analysis Summary
                                </h3>
                                <div className="ai-summary">
                                    <p>{selectedResult.feedback.aiSummary}</p>
                                    <div className={`recommendation-badge ${getRecommendationColor(selectedResult.feedback.recommendation)}`}>
                                        {selectedResult.feedback.recommendation}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Breakdown */}
                            <div className="report-section">
                                <h3>
                                    <i className="bi bi-graph-up me-2"></i>
                                    Performance Breakdown
                                </h3>
                                <div className="performance-grid">
                                    {Object.entries(selectedResult.scores).map(([key, value]) => (
                                        <div key={key} className="performance-item">
                                            <div className="performance-label">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                            <div className="performance-score-bar">
                                                <div
                                                    className={`performance-fill ${getScoreColor(value)}`}
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                            <div className="performance-value">{value}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Question-by-Question Analysis */}
                            <div className="report-section">
                                <h3>
                                    <i className="bi bi-list-check me-2"></i>
                                    Question-by-Question Analysis
                                </h3>
                                <div className="questions-analysis">
                                    {selectedResult.questions.map((q, idx) => (
                                        <div key={idx} className="question-item">
                                            <div className="question-header">
                                                <span className="question-number">Q{idx + 1}</span>
                                                <span className={`question-score ${getScoreColor(q.score)}`}>
                                                    {q.score}%
                                                </span>
                                            </div>
                                            <div className="question-text">{q.question}</div>
                                            <div className="answer-summary">
                                                <strong>Your Answer:</strong> {q.answer}
                                            </div>
                                            <div className="ai-comment">
                                                <i className="bi bi-chat-left-quote me-2"></i>
                                                <span>{q.aiComment}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strengths & Improvements */}
                            <div className="report-section">
                                <div className="feedback-columns">
                                    <div className="feedback-column strengths">
                                        <h4>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Key Strengths
                                        </h4>
                                        <ul>
                                            {selectedResult.feedback.strengths.map((strength, idx) => (
                                                <li key={idx}>{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="feedback-column improvements">
                                        <h4>
                                            <i className="bi bi-lightbulb me-2"></i>
                                            Areas for Improvement
                                        </h4>
                                        <ul>
                                            {selectedResult.feedback.improvements.map((improvement, idx) => (
                                                <li key={idx}>{improvement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="report-actions">
                                <button className="btn btn-outline-primary">
                                    <i className="bi bi-play-circle me-2"></i>
                                    Watch Recording
                                </button>
                                <button className="btn btn-outline-primary">
                                    <i className="bi bi-file-text me-2"></i>
                                    View Transcript
                                </button>
                                <button className="btn btn-primary">
                                    <i className="bi bi-download me-2"></i>
                                    Download PDF Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsFeedback;
