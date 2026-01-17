import React, { useState, useEffect, useRef } from 'react';
import './InterviewCenter.css';

const InterviewCenter = () => {
    const [interviewStage, setInterviewStage] = useState('pre-check'); // pre-check, ready, active, completed
    const [systemChecks, setSystemChecks] = useState({
        camera: { status: 'checking', message: 'Checking camera...' },
        microphone: { status: 'checking', message: 'Checking microphone...' },
        internet: { status: 'checking', message: 'Checking connection...' },
        browser: { status: 'checking', message: 'Checking browser compatibility...' }
    });
    const [integrityStatus, setIntegrityStatus] = useState({
        faceDetected: false,
        multipleFaces: false,
        tabSwitched: false,
        violations: []
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewProgress, setInterviewProgress] = useState(0);
    const [fullscreenExited, setFullscreenExited] = useState(false);
    const [exitWarningCount, setExitWarningCount] = useState(0);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const containerRef = useRef(null);
    const streamRef = useRef(null);

    // Sample interview session data
    const interviewSession = {
        jobTitle: 'Senior Software Developer',
        company: 'TechCorp Inc.',
        companyLogo: 'TC',
        duration: 45,
        questionsCount: 8,
        aiInterviewer: 'NextOffer AI',
        candidateName: 'John Doe',
        resumeScore: 85
    };

    // AI-generated questions based on resume
    const questions = [
        {
            id: 1,
            type: 'technical',
            question: 'Based on your resume, you have 3 years of React experience. Can you explain the difference between useMemo and useCallback hooks and when to use each?',
            duration: 300,
            skillTested: 'React.js'
        },
        {
            id: 2,
            type: 'experience',
            question: 'You mentioned leading a team of 5 developers in your previous role. Describe a challenging situation you faced and how you resolved it.',
            duration: 300,
            skillTested: 'Leadership'
        },
        {
            id: 3,
            type: 'technical',
            question: 'Your resume shows proficiency in Node.js. How would you handle authentication and authorization in a REST API?',
            duration: 300,
            skillTested: 'Node.js'
        },
        {
            id: 4,
            type: 'problem-solving',
            question: 'You worked on an e-commerce platform. How would you optimize database queries for a product search with millions of records?',
            duration: 300,
            skillTested: 'Database Optimization'
        },
        {
            id: 5,
            type: 'technical',
            question: 'Explain your approach to state management in large-scale React applications.',
            duration: 300,
            skillTested: 'State Management'
        },
        {
            id: 6,
            type: 'behavioral',
            question: 'Tell me about a time when you had to learn a new technology quickly to meet a project deadline.',
            duration: 300,
            skillTested: 'Adaptability'
        },
        {
            id: 7,
            type: 'technical',
            question: 'Based on your experience with MongoDB, how do you design schemas for optimal performance?',
            duration: 300,
            skillTested: 'MongoDB'
        },
        {
            id: 8,
            type: 'scenario',
            question: 'If you joined our team tomorrow, how would you approach understanding our existing codebase and contributing effectively?',
            duration: 300,
            skillTested: 'Onboarding Strategy'
        }
    ];

    // System check - perform real camera/microphone checks
    useEffect(() => {
        if (interviewStage === 'pre-check') {
            // Check camera
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    stream.getTracks().forEach(track => track.stop());
                    setSystemChecks(prev => ({
                        ...prev,
                        camera: { status: 'success', message: 'Camera is working' }
                    }));
                })
                .catch(error => {
                    let errorMessage = 'Camera access denied';
                    if (error.name === 'NotAllowedError') {
                        errorMessage = 'Please allow camera access';
                    } else if (error.name === 'NotFoundError') {
                        errorMessage = 'No camera found';
                    }
                    setSystemChecks(prev => ({
                        ...prev,
                        camera: { status: 'error', message: errorMessage }
                    }));
                });

            // Check microphone
            setTimeout(() => {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        stream.getTracks().forEach(track => track.stop());
                        setSystemChecks(prev => ({
                            ...prev,
                            microphone: { status: 'success', message: 'Microphone is working' }
                        }));
                    })
                    .catch(error => {
                        setSystemChecks(prev => ({
                            ...prev,
                            microphone: { status: 'error', message: 'Microphone access denied' }
                        }));
                    });
            }, 500);

            // Check internet connection
            setTimeout(() => {
                if (navigator.onLine) {
                    setSystemChecks(prev => ({
                        ...prev,
                        internet: { status: 'success', message: 'Connection is stable' }
                    }));
                } else {
                    setSystemChecks(prev => ({
                        ...prev,
                        internet: { status: 'error', message: 'No internet connection' }
                    }));
                }
            }, 1000);

            // Check browser compatibility
            setTimeout(() => {
                const isCompatible = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
                setSystemChecks(prev => ({
                    ...prev,
                    browser: {
                        status: isCompatible ? 'success' : 'error',
                        message: isCompatible ? 'Browser is compatible' : 'Browser not supported'
                    }
                }));
            }, 1500);
        }
    }, [interviewStage]);

    // Initialize camera
    useEffect(() => {
        if (interviewStage === 'ready' || interviewStage === 'active') {
            initializeCamera();
        }

        // Cleanup function when component unmounts or stage changes
        return () => {
            stopCamera(); // Use robust stopCamera function for cleanup
        };
    }, [interviewStage]);

    // Cleanup on unmount (extra safety)
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Monitor fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (interviewStage === 'active' && !document.fullscreenElement) {
                setFullscreenExited(true);
                setExitWarningCount(prev => prev + 1);
                setIntegrityStatus(prev => ({
                    ...prev,
                    violations: [...prev.violations, {
                        type: 'fullscreen_exit',
                        timestamp: new Date().toISOString(),
                        message: 'Exited fullscreen mode'
                    }]
                }));
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [interviewStage]);

    const initializeCamera = async () => {
        try {
            // Stop any existing stream first
            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream; // Store in ref for cleanup

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Ensure video plays
                videoRef.current.play().catch(e => console.error('Video play error:', e));
            }
            setIntegrityStatus(prev => ({ ...prev, faceDetected: true }));
            // Update system check to success
            setSystemChecks(prev => ({
                ...prev,
                camera: { status: 'success', message: 'Camera is working' }
            }));
        } catch (error) {
            console.error('Error accessing camera:', error);
            // Update system check to error with helpful message
            let errorMessage = 'Camera access denied';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Please allow camera access in your browser settings';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera device found';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera is being used by another application';
            }
            setSystemChecks(prev => ({
                ...prev,
                camera: { status: 'error', message: errorMessage }
            }));
        }
    };

    const allChecksPass = Object.values(systemChecks).every(check => check.status === 'success');

    const stopCamera = () => {
        console.log('stopCamera called');
        try {
            // Stop tracks from streamRef (source of truth)
            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                console.log(`Stopping ${tracks.length} media tracks from streamRef`);
                tracks.forEach(track => {
                    track.stop();
                    console.log(`Track stopped: ${track.kind}`);
                });
                streamRef.current = null;
            }

            // Also clean up video element if it exists
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            console.log('Camera stopped successfully');
        } catch (error) {
            console.error('Error stopping camera:', error);
        }
    };

    const enterFullscreen = async () => {
        try {
            if (containerRef.current) {
                await containerRef.current.requestFullscreen();
            }
        } catch (error) {
            console.error('Error entering fullscreen:', error);
        }
    };

    const startInterview = async () => {
        await enterFullscreen();
        setInterviewStage('active');
        setIsRecording(true);
        setCurrentQuestion(0);
        setFullscreenExited(false);
    };

    const resumeFullscreen = async () => {
        await enterFullscreen();
        setFullscreenExited(false);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setInterviewProgress(((currentQuestion + 2) / questions.length) * 100);
        } else {
            endInterview();
        }
    };

    const endInterview = () => {
        console.log('endInterview called');
        stopCamera(); // Stop camera when interview ends
        setInterviewStage('completed');
        setIsRecording(false);
        setInterviewProgress(100);
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
        }
        console.log('Interview ended, camera should be stopped');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'checking':
                return <i className="bi bi-hourglass-split spin"></i>;
            case 'success':
                return <i className="bi bi-check-circle-fill text-success"></i>;
            case 'error':
                return <i className="bi bi-x-circle-fill text-danger"></i>;
            default:
                return <i className="bi bi-question-circle"></i>;
        }
    };

    return (
        <div className="interview-center-container" ref={containerRef}>
            {/* Fullscreen Exit Warning */}
            {fullscreenExited && interviewStage === 'active' && (
                <div className="fullscreen-exit-warning">
                    <div className="warning-content">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <h3>⚠️ Fullscreen Mode Exited</h3>
                        <p>You have exited fullscreen mode. This action has been recorded as an integrity violation.</p>
                        <p className="violation-count">
                            Total Violations: <strong>{exitWarningCount}</strong>
                        </p>
                        <div className="warning-message">
                            <i className="bi bi-info-circle me-2"></i>
                            Repeated violations may result in interview termination and disqualification.
                        </div>
                        <button className="btn btn-warning btn-lg" onClick={resumeFullscreen}>
                            <i className="bi bi-arrows-fullscreen me-2"></i>
                            Return to Fullscreen & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Pre-Check Stage */}
            {interviewStage === 'pre-check' && (
                <div className="pre-check-stage">
                    <div className="interview-header-info">
                        <div className="company-badge">
                            <div className="company-logo">{interviewSession.companyLogo}</div>
                            <div>
                                <h2>{interviewSession.jobTitle}</h2>
                                <p className="text-muted">{interviewSession.company}</p>
                            </div>
                        </div>
                    </div>

                    <div className="system-check-container">
                        <h3 className="text-center mb-4">
                            <i className="bi bi-shield-check me-2"></i>
                            System Compatibility Check
                        </h3>
                        <p className="text-center text-muted mb-4">
                            Please ensure all checks pass before starting your interview
                        </p>

                        <div className="checks-grid">
                            <div className={`check-item ${systemChecks.camera.status}`}>
                                <div className="check-icon">{getStatusIcon(systemChecks.camera.status)}</div>
                                <div className="check-info">
                                    <h5>Camera</h5>
                                    <p>{systemChecks.camera.message}</p>
                                </div>
                            </div>

                            <div className={`check-item ${systemChecks.microphone.status}`}>
                                <div className="check-icon">{getStatusIcon(systemChecks.microphone.status)}</div>
                                <div className="check-info">
                                    <h5>Microphone</h5>
                                    <p>{systemChecks.microphone.message}</p>
                                </div>
                            </div>

                            <div className={`check-item ${systemChecks.internet.status}`}>
                                <div className="check-icon">{getStatusIcon(systemChecks.internet.status)}</div>
                                <div className="check-info">
                                    <h5>Internet Connection</h5>
                                    <p>{systemChecks.internet.message}</p>
                                </div>
                            </div>

                            <div className={`check-item ${systemChecks.browser.status}`}>
                                <div className="check-icon">{getStatusIcon(systemChecks.browser.status)}</div>
                                <div className="check-info">
                                    <h5>Browser</h5>
                                    <p>{systemChecks.browser.message}</p>
                                </div>
                            </div>
                        </div>

                        <div className="integrity-notice">
                            <i className="bi bi-info-circle me-2"></i>
                            <div>
                                <strong>Integrity Monitoring Active</strong>
                                <p>This interview uses AI-powered integrity monitoring. Please ensure:</p>
                                <ul>
                                    <li>You are alone in the room</li>
                                    <li>Your face is clearly visible</li>
                                    <li>No tab switching during the interview</li>
                                    <li>No external assistance or resources</li>
                                </ul>
                            </div>
                        </div>

                        {allChecksPass && (
                            <button
                                className="btn btn-primary btn-lg w-100 mt-4"
                                onClick={() => setInterviewStage('ready')}
                            >
                                <i className="bi bi-play-circle me-2"></i>
                                Proceed to Interview
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Ready Stage */}
            {interviewStage === 'ready' && (
                <div className="ready-stage">
                    <div className="ready-content">
                        <div className="camera-preview">
                            <video ref={videoRef} autoPlay muted className="video-feed"></video>
                            <div className="camera-overlay">
                                <i className="bi bi-camera-video-fill"></i>
                                <p>Position yourself in the frame</p>
                            </div>
                        </div>

                        <div className="ready-info">
                            <h2>
                                <i className="bi bi-robot me-2"></i>
                                AI Interview Ready
                            </h2>
                            <div className="interview-details">
                                <div className="detail-row">
                                    <i className="bi bi-building"></i>
                                    <span>{interviewSession.company} - {interviewSession.jobTitle}</span>
                                </div>
                                <div className="detail-row">
                                    <i className="bi bi-clock"></i>
                                    <span>Duration: {interviewSession.duration} minutes</span>
                                </div>
                                <div className="detail-row">
                                    <i className="bi bi-list-check"></i>
                                    <span>{interviewSession.questionsCount} AI-generated questions</span>
                                </div>
                                <div className="detail-row">
                                    <i className="bi bi-file-earmark-text"></i>
                                    <span>Based on your resume (Match: {interviewSession.resumeScore}%)</span>
                                </div>
                            </div>

                            <div className="instructions-box">
                                <h4>
                                    <i className="bi bi-lightbulb me-2"></i>
                                    Interview Instructions
                                </h4>
                                <ul>
                                    <li>Answer each question clearly and concisely</li>
                                    <li>You'll have 5 minutes per question</li>
                                    <li>AI will analyze your technical knowledge and communication</li>
                                    <li>Speak naturally - this is a conversation, not an interrogation</li>
                                    <li>You can skip a question, but it will be marked as incomplete</li>
                                </ul>
                            </div>

                            <button
                                className="btn btn-success btn-lg w-100"
                                onClick={startInterview}
                            >
                                <i className="bi bi-play-fill me-2"></i>
                                Start AI Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Interview Stage */}
            {interviewStage === 'active' && (
                <div className="active-interview">
                    {/* Top Bar */}
                    <div className="interview-topbar">
                        <div className="interview-progress-info">
                            <span className="question-counter">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${interviewProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="recording-indicator">
                            <span className="rec-dot"></span>
                            Recording
                        </div>
                    </div>

                    <div className="interview-content">
                        {/* Video Section */}
                        <div className="video-section">
                            <div className="candidate-video">
                                <video ref={videoRef} autoPlay muted className="video-feed"></video>
                                <div className="video-label">You</div>
                            </div>

                            {/* Integrity Monitor */}
                            <div className="integrity-monitor">
                                <h5>
                                    <i className="bi bi-shield-check me-2"></i>
                                    Integrity Status
                                </h5>
                                <div className="integrity-indicators">
                                    <div className={`indicator ${integrityStatus.faceDetected ? 'active' : ''}`}>
                                        <i className="bi bi-person-check"></i>
                                        <span>Face Detected</span>
                                    </div>
                                    <div className={`indicator ${!integrityStatus.multipleFaces ? 'active' : 'warning'}`}>
                                        <i className="bi bi-people"></i>
                                        <span>Single Person</span>
                                    </div>
                                    <div className={`indicator ${!integrityStatus.tabSwitched ? 'active' : 'warning'}`}>
                                        <i className="bi bi-window"></i>
                                        <span>No Tab Switch</span>
                                    </div>
                                </div>
                                {integrityStatus.violations.length > 0 && (
                                    <div className="violations-alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {integrityStatus.violations.length} violation(s) detected
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Question Section */}
                        <div className="question-section">
                            <div className="ai-interviewer">
                                <div className="ai-avatar">
                                    <i className="bi bi-robot"></i>
                                </div>
                                <div className="ai-info">
                                    <h4>NextOffer AI Interviewer</h4>
                                    <span className="ai-status">
                                        <span className="status-dot"></span>
                                        Listening...
                                    </span>
                                </div>
                            </div>

                            <div className="question-card">
                                <div className="question-type-badge">
                                    <i className="bi bi-tag-fill me-1"></i>
                                    {questions[currentQuestion].type}
                                </div>
                                <div className="question-text">
                                    <i className="bi bi-chat-quote me-2"></i>
                                    {questions[currentQuestion].question}
                                </div>
                                <div className="question-meta">
                                    <span className="skill-tag">
                                        <i className="bi bi-bookmark me-1"></i>
                                        {questions[currentQuestion].skillTested}
                                    </span>
                                    <span className="time-limit">
                                        <i className="bi bi-hourglass-split me-1"></i>
                                        5 min
                                    </span>
                                </div>
                            </div>

                            <div className="answer-controls">
                                <div className="audio-wave">
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                </div>
                                <p className="text-center text-muted mb-3">
                                    <i className="bi bi-mic-fill me-2"></i>
                                    Speak your answer clearly
                                </p>
                                <div className="control-buttons">
                                    <button className="btn btn-outline-secondary">
                                        <i className="bi bi-skip-forward me-2"></i>
                                        Skip Question
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={nextQuestion}
                                    >
                                        {currentQuestion < questions.length - 1 ? (
                                            <>
                                                <i className="bi bi-arrow-right me-2"></i>
                                                Next Question
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Complete Interview
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Completed Stage */}
            {interviewStage === 'completed' && (
                <div className="completed-stage">
                    <div className="completion-card">
                        <div className="success-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h2>Interview Completed Successfully! 🎉</h2>
                        <p className="text-muted">
                            Your responses are being analyzed by our AI system
                        </p>

                        <div className="completion-stats">
                            <div className="stat-item">
                                <i className="bi bi-list-check"></i>
                                <div>
                                    <div className="stat-value">{questions.length}</div>
                                    <div className="stat-label">Questions Answered</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <i className="bi bi-clock-history"></i>
                                <div>
                                    <div className="stat-value">{interviewSession.duration}</div>
                                    <div className="stat-label">Minutes</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <i className="bi bi-shield-check"></i>
                                <div>
                                    <div className="stat-value">Clean</div>
                                    <div className="stat-label">Integrity Status</div>
                                </div>
                            </div>
                        </div>

                        <div className="next-steps">
                            <h4>What's Next?</h4>
                            <ul>
                                <li>
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    AI will evaluate your technical responses
                                </li>
                                <li>
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Communication skills assessment will be generated
                                </li>
                                <li>
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Resume-answer alignment analysis
                                </li>
                                <li>
                                    <i className="bi bi-hourglass-split text-warning me-2"></i>
                                    Results will be available in 10-15 minutes
                                </li>
                            </ul>
                        </div>

                        <div className="completion-actions">
                            <button className="btn btn-outline-primary">
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Dashboard
                            </button>
                            <button className="btn btn-primary">
                                <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                View Results (Available Soon)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewCenter;
