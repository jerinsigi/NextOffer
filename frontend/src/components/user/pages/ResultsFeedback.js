import React, { useState, useEffect } from 'react';
import './ResultsFeedback.css';

const ResultsFeedback = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedResult, setSelectedResult] = useState(null);
    const [interviewResults, setInterviewResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    const userId = user?.id || user?._id;

    useEffect(() => {
        if (!userId) { setLoading(false); return; }
        const fetchResults = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/interviews/user-results/${userId}`);
                if (!res.ok) throw new Error('Failed to fetch results');
                const data = await res.json();
                setInterviewResults(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [userId]);

    const getScoreColor = (score) => {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        return 'average';
    };

    const getScoreLabel = (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Good';
        return 'Needs Work';
    };

    const getRecommendationVariant = (rec = '') => {
        if (rec.includes('Strongly') || rec.includes('Highly')) return 'success';
        if (rec.includes('Recommended')) return 'info';
        if (rec.includes('Reservations')) return 'warning';
        return 'average';
    };

    const filteredResults = activeTab === 'all'
        ? interviewResults
        : interviewResults.filter(r => {
            if (activeTab === 'excellent') return r.overallScore >= 85;
            if (activeTab === 'good') return r.overallScore >= 70 && r.overallScore < 85;
            if (activeTab === 'needs-improvement') return r.overallScore < 70;
            return true;
        });

    // Stats for overview cards
    const avgScore = interviewResults.length
        ? Math.round(interviewResults.reduce((a, r) => a + r.overallScore, 0) / interviewResults.length)
        : 0;
    const totalInterviews = interviewResults.length;
    const excellentCount = interviewResults.filter(r => r.overallScore >= 85).length;
    const cleanIntegrity = interviewResults.filter(r => r.integrityStatus === 'Clean').length;

    return (
        <div className="results-feedback-container">
            {/* Header */}
            <div className="rf-page-header">
                <div>
                    <h1 className="rf-page-title">
                        <i className="bi bi-graph-up-arrow me-2"></i>
                        Results & Feedback
                    </h1>
                    <p className="rf-page-subtitle">Review your interview performance and AI-generated insights</p>
                </div>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="rf-center-state">
                    <div className="rf-spinner"></div>
                    <p>Loading your results…</p>
                </div>
            )}

            {!loading && error && (
                <div className="rf-error-state">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <p>{error}</p>
                </div>
            )}

            {/* Overview Stats */}
            {!loading && !error && interviewResults.length > 0 && (
                <div className="rf-overview-grid">
                    <div className="rf-stat-card">
                        <div className="rf-stat-icon accent-gold">
                            <i className="bi bi-trophy-fill"></i>
                        </div>
                        <div>
                            <div className="rf-stat-value">{avgScore}%</div>
                            <div className="rf-stat-label">Average Score</div>
                        </div>
                    </div>
                    <div className="rf-stat-card">
                        <div className="rf-stat-icon accent-blue">
                            <i className="bi bi-camera-video-fill"></i>
                        </div>
                        <div>
                            <div className="rf-stat-value">{totalInterviews}</div>
                            <div className="rf-stat-label">Total Interviews</div>
                        </div>
                    </div>
                    <div className="rf-stat-card">
                        <div className="rf-stat-icon accent-green">
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <div>
                            <div className="rf-stat-value">{excellentCount}</div>
                            <div className="rf-stat-label">Excellent Results</div>
                        </div>
                    </div>
                    <div className="rf-stat-card">
                        <div className="rf-stat-icon accent-teal">
                            <i className="bi bi-shield-check"></i>
                        </div>
                        <div>
                            <div className="rf-stat-value">{cleanIntegrity}</div>
                            <div className="rf-stat-label">Clean Integrity</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            {!loading && !error && (
                <div className="rf-tab-bar">
                    {[
                        { key: 'all', label: `All (${interviewResults.length})` },
                        { key: 'excellent', label: '⭐ Excellent 85%+' },
                        { key: 'good', label: '✓ Good 70–84%' },
                        { key: 'needs-improvement', label: '⚠ Needs Work <70%' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`rf-tab-btn${activeTab === tab.key ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredResults.length === 0 && (
                <div className="rf-empty-state">
                    <i className="bi bi-inbox"></i>
                    <h5>{interviewResults.length === 0 ? 'No interviews completed yet' : 'No results in this category'}</h5>
                    <p>{interviewResults.length === 0
                        ? 'Complete an interview to see your results and AI feedback here.'
                        : 'Try a different filter tab to see other results.'}</p>
                </div>
            )}

            {/* Results List */}
            <div className="rf-results-list">
                {filteredResults.map(result => (
                    <div key={result._id || result.id} className={`rf-result-card ${getScoreColor(result.overallScore)}`}>
                        {/* Card Header */}
                        <div className="rf-card-header">
                            <div className="rf-company-block">
                                <div className="rf-company-logo">
                                    {result.companyLogo && result.companyLogo.includes('/') ? (
                                        <img src={`http://localhost:5000${result.companyLogo}`} alt={result.company} />
                                    ) : (
                                        (result.company || 'C').substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h4 className="rf-job-title">{result.jobTitle || 'Unknown Role'}</h4>
                                    <div className="rf-company-name">
                                        <i className="bi bi-building me-1"></i>{result.company || 'Unknown Company'}
                                    </div>
                                    <div className="rf-meta-row">
                                        <span><i className="bi bi-calendar3 me-1"></i>
                                            {result.date ? new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '–'}
                                        </span>
                                        <span className="rf-dot">•</span>
                                        <span><i className="bi bi-clock me-1"></i>{result.duration > 0 ? `${result.duration} min` : 'Duration N/A'}</span>
                                        <span className="rf-dot">•</span>
                                        <span><i className="bi bi-robot me-1"></i>{result.type || 'AI Interview'}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Score Badge */}
                            <div className="rf-score-badge-block">
                                <div className={`rf-score-circle ${getScoreColor(result.overallScore)}`}>
                                    <span className="rf-score-num">{result.overallScore}</span>
                                    <span className="rf-score-pct">%</span>
                                </div>
                                <div className="rf-score-label-text">{getScoreLabel(result.overallScore)}</div>
                            </div>
                        </div>

                        {/* Score Bars */}
                        <div className="rf-score-bars">
                            {Object.entries(result.scores || {}).map(([key, val]) => (
                                <div key={key} className="rf-score-bar-item">
                                    <div className="rf-score-bar-label">
                                        <span>{key}</span>
                                        <span className="rf-score-bar-val">{val}%</span>
                                    </div>
                                    <div className="rf-bar-track">
                                        <div
                                            className={`rf-bar-fill ${getScoreColor(val)}`}
                                            style={{ width: `${Math.min(val, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommendation + footer */}
                        <div className="rf-card-footer">
                            <div className={`rf-recommendation-pill ${getRecommendationVariant(result.feedback?.recommendation)}`}>
                                <i className="bi bi-robot me-2"></i>
                                {result.feedback?.recommendation || 'Pending'}
                            </div>
                            <div className="rf-footer-right">
                                <span className={`rf-integrity-badge ${result.integrityStatus === 'Clean' ? 'clean' : 'flagged'}`}>
                                    <i className={`bi ${result.integrityStatus === 'Clean' ? 'bi-shield-check' : 'bi-exclamation-octagon'} me-1`}></i>
                                    {result.integrityStatus || 'N/A'}
                                    {result.violations > 0 && ` (${result.violations} flag${result.violations > 1 ? 's' : ''})`}
                                </span>
                                <button className="rf-view-btn" onClick={() => setSelectedResult(result)}>
                                    <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                    View Full Report
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ======== Full Report Modal ======== */}
            {selectedResult && (
                <div className="rf-modal-overlay" onClick={() => setSelectedResult(null)}>
                    <div className="rf-modal-box" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="rf-modal-header">
                            <div>
                                <h2 className="rf-modal-title">
                                    <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                    Full Interview Report
                                </h2>
                                <p className="rf-modal-subtitle">
                                    {selectedResult.jobTitle} &nbsp;·&nbsp; {selectedResult.company}
                                    &nbsp;·&nbsp;{selectedResult.date && new Date(selectedResult.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button className="rf-close-btn" onClick={() => setSelectedResult(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="rf-modal-body">
                            {/* Overall score header row */}
                            <div className="rf-report-hero">
                                <div className={`rf-report-score-circle ${getScoreColor(selectedResult.overallScore)}`}>
                                    <span className="rf-score-num">{selectedResult.overallScore}</span>
                                    <span className="rf-score-pct">%</span>
                                </div>
                                <div className="rf-report-hero-info">
                                    <div className={`rf-recommendation-pill lg ${getRecommendationVariant(selectedResult.feedback?.recommendation)}`}>
                                        <i className="bi bi-robot me-2"></i>
                                        {selectedResult.feedback?.recommendation || 'Pending Assessment'}
                                    </div>
                                    <div className="rf-report-meta-grid">
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-clock text-primary me-2"></i>
                                            <span>Duration: <strong>{selectedResult.duration > 0 ? `${selectedResult.duration} min` : 'N/A'}</strong></span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className={`bi ${selectedResult.integrityStatus === 'Clean' ? 'bi-shield-check text-success' : 'bi-exclamation-octagon text-warning'} me-2`}></i>
                                            <span>Integrity: <strong>{selectedResult.integrityStatus || 'N/A'}</strong>
                                                {selectedResult.violations > 0 && <span className="text-warning ms-1">({selectedResult.violations} flag{selectedResult.violations > 1 ? 's' : ''})</span>}
                                            </span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-calendar3 text-primary me-2"></i>
                                            <span>Date: <strong>{selectedResult.date ? new Date(selectedResult.date).toLocaleDateString() : 'N/A'}</strong></span>
                                        </div>
                                        <div className="rf-report-meta-item">
                                            <i className="bi bi-robot text-primary me-2"></i>
                                            <span>Type: <strong>{selectedResult.type || 'AI Interview'}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary */}
                            {selectedResult.feedback?.aiSummary && (
                                <div className="rf-section">
                                    <h3 className="rf-section-title">
                                        <i className="bi bi-robot"></i> AI Analysis Summary
                                    </h3>
                                    <div className="rf-ai-summary">
                                        <p>{selectedResult.feedback.aiSummary}</p>
                                    </div>
                                </div>
                            )}

                            {/* Score Breakdown */}
                            <div className="rf-section">
                                <h3 className="rf-section-title">
                                    <i className="bi bi-graph-up"></i> Score Breakdown
                                </h3>
                                <div className="rf-perf-grid">
                                    {Object.entries(selectedResult.scores || {}).map(([key, val]) => (
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

                            {/* Strengths & Improvements */}
                            {((selectedResult.feedback?.strengths?.length > 0) || (selectedResult.feedback?.improvements?.length > 0)) && (
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
                                                {(selectedResult.feedback.strengths || []).map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rf-insight-col improvements">
                                            <div className="rf-insight-col-header">
                                                <i className="bi bi-arrow-up-circle-fill"></i> Areas to Improve
                                            </div>
                                            <ul>
                                                {(selectedResult.feedback.improvements || []).map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Question-by-Question */}
                            {selectedResult.questions && selectedResult.questions.length > 0 && (
                                <div className="rf-section">
                                    <h3 className="rf-section-title">
                                        <i className="bi bi-list-check"></i> Question-by-Question Analysis
                                        <span className="rf-q-count">{selectedResult.questions.length} questions</span>
                                    </h3>
                                    <div className="rf-questions-list">
                                        {selectedResult.questions.map((q, idx) => (
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
                                                    <div className="rf-answer-label">Your Answer</div>
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
        </div>
    );
};

export default ResultsFeedback;
