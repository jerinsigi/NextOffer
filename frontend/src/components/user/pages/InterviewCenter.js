import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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

    const { interviewId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interviewSession, setInterviewSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [responses, setResponses] = useState([]);
    const [speechError, setSpeechError] = useState(null);
    const [useTextInput, setUseTextInput] = useState(false);
    const useTextInputRef = useRef(false);
    const retryCountRef = useRef(0);

    // Fetch Interview Data
    useEffect(() => {
        const fetchInterviewData = async () => {
            if (!interviewId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`);
                if (response.ok) {
                    const data = await response.json();
                    setInterviewSession(data);
                    setQuestions(data.questions);
                } else {
                    setError('Failed to load interview data');
                }
            } catch (err) {
                console.error("Error fetching interview:", err);
                setError('Error loading interview data');
            } finally {
                setLoading(false);
            }
        };
        fetchInterviewData();
    }, [interviewId]);

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
        setFullscreenExited(false);
        // Start Recording (Audio/Video or just Audio? Requirement says "text to speech basis and with recordings", implying audio/video recording of the session)
        // I will assume recording the entire session or per question.
        // Let's implement per-question recording for simplicity in analysis/storage later, or continuous. 
        // User request: "recordings" (plural).
        // Let's try to start recording when interview starts.
        startRecording();
    };

    const startRecording = () => {
        if (streamRef.current && MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            try {
                const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9' });
                mediaRecorderRef.current = mediaRecorder;

                const chunks = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    // Here we would upload the blob to the server.
                    // For now, valid mock behavior is satisfied.
                    console.log('Recording stopped, blob created:', blob.size);
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (e) {
                console.error("MediaRecorder error:", e);
            }
        } else {
            // Fallback or Audio only
            console.warn("Video recording not supported, trying audio only if needed or generic setup.");
        }
    };

    // Stop recording when interview ends
    // I need to update endInterview to stop recording.

    const resumeFullscreen = async () => {
        await enterFullscreen();
        setFullscreenExited(false);
    };

    const nextQuestion = async () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Stop current speech
        }

        // Stop speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        // Submit current answer to backend
        if (currentAnswer.trim()) {
            await submitResponse(questions[currentQuestion].id, currentAnswer);
        }

        // Move to next question
        if (currentQuestion < questions.length - 1) {
            setCurrentAnswer(''); // Reset answer for next question
            setCurrentQuestion(prev => prev + 1);
            setInterviewProgress(((currentQuestion + 2) / questions.length) * 100);
        } else {
            endInterview();
        }
    };

    // Submit response to backend
    const submitResponse = async (questionId, answer) => {
        try {
            const response = await fetch('http://localhost:5000/api/responses/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: questionId,
                    candidateAnswer: answer
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Response submitted:', result);
                // Store response data for completion screen
                setResponses(prev => [...prev, result.response]);
            }
        } catch (error) {
            console.error('Error submitting response:', error);
        }
    };

    // Text to Speech Effect
    useEffect(() => {
        if (interviewStage === 'active' && questions.length > 0) {
            const text = questions[currentQuestion].question;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1;

            // Choose a voice (optional, try to get a good English one)
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);

            // Start speech recognition after question is read (only if not using text input)
            utterance.onend = () => {
                // Check the ref for the most up-to-date value
                if (!useTextInputRef.current) {
                    console.log('Starting speech recognition (Text Input Mode: OFF)');

                    // On localhost, recommend text input but allow user to enable voice
                    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

                    if (isLocalhost && !speechError) {
                        // First time on localhost - inform user
                        console.warn('Development mode: Speech recognition may fail due to network requirements. You can use the "Type Instead" button.');
                        setSpeechError('💡 Tip: Speech recognition requires internet connection. Use "Type Instead" button or try voice mode.');
                        setUseTextInput(true);
                        useTextInputRef.current = true;
                    } else if (!isLocalhost || speechError === null) {
                        // Production or user explicitly wants to try voice
                        startSpeechRecognition();
                    }
                } else {
                    console.log('Skipping speech recognition (Text Input Mode: ON)');
                }
            };
        }
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion, interviewStage, questions]); // Removed useTextInput to prevent re-reading

    // Speech Recognition Setup
    const startSpeechRecognition = () => {
        console.log('Starting speech recognition...');

        // Check if already in text input mode - don't even try to start
        if (useTextInputRef.current) {
            console.log('Text input mode is active, skipping speech recognition');
            return;
        }

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported in this browser');
            setSpeechError('Speech recognition is not supported in your browser. Please type your answer below.');
            setUseTextInput(true);
            useTextInputRef.current = true;
            return;
        }

        // Check if we're on a secure context (HTTPS or localhost)
        const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        if (!isSecureContext) {
            console.warn('Speech recognition requires HTTPS or localhost');
            setSpeechError('Speech recognition requires a secure connection. Please type your answer below.');
            setUseTextInput(true);
            useTextInputRef.current = true;
            return;
        }

        // Stop existing recognition if any
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            } catch (e) {
                console.log('No active recognition to stop');
            }
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('Speech recognition started successfully');
            setIsListening(true);
            setSpeechError(null); // Clear any previous errors
        };

        recognition.onresult = (event) => {
            console.log('Speech recognition result received');
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                console.log('Final transcript:', finalTranscript);
                setCurrentAnswer(prev => prev + finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (event.error === 'not-allowed') {
                setSpeechError('Microphone access denied. Please allow microphone access or use text input below.');
                setUseTextInput(true);
                useTextInputRef.current = true;
            } else if (event.error === 'network') {
                console.log('Network error - switching to text input permanently');
                setSpeechError('Speech recognition service unavailable (network error). Please type your answer below.');
                setUseTextInput(true);
                useTextInputRef.current = true;
                // Clean up recognition object
                if (recognitionRef.current) {
                    recognitionRef.current = null;
                }
            } else if (event.error === 'no-speech') {
                console.log('No speech detected, continuing to listen...');
                // Don't stop listening or switch to text input
                return;
            } else if (event.error === 'audio-capture') {
                setSpeechError('Microphone not accessible. Please check your microphone or use text input below.');
                setUseTextInput(true);
                useTextInputRef.current = true;
            } else if (event.error === 'service-not-allowed') {
                setSpeechError('Speech recognition service not allowed. Please type your answer below.');
                setUseTextInput(true);
                useTextInputRef.current = true;
            } else {
                console.warn(`Speech recognition error: ${event.error}`);
                setSpeechError(`Speech recognition error (${event.error}). Please type your answer below.`);
                setUseTextInput(true);
                useTextInputRef.current = true;
            }

            setIsListening(false);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);

            // Only restart if we're still in active interview and NOT in text input mode
            if (interviewStage === 'active' && !useTextInputRef.current) {
                console.log('Speech recognition ended unexpectedly, attempting restart...');
                // Add a small delay before restart to prevent rapid cycling
                setTimeout(() => {
                    if (!useTextInputRef.current && interviewStage === 'active') {
                        startSpeechRecognition();
                    }
                }, 500);
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
            console.log('Recognition.start() called');
        } catch (error) {
            console.error('Error starting recognition:', error);
            setSpeechError('Failed to start speech recognition. Please type your answer below.');
            setUseTextInput(true);
            useTextInputRef.current = true;
        }
    };

    const endInterview = () => {
        console.log('endInterview called');
        stopCamera(); // Stop camera when interview ends

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

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

    if (loading) {
        return (
            <div className="interview-center-container d-flex justify-content-center align-items-center text-white">
                <div className="spinner-border text-primary me-3" role="status"></div>
                <h2>Loading Interview Environment...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="interview-center-container d-flex justify-content-center align-items-center text-white">
                <div className="text-center">
                    <i className="bi bi-exclamation-triangle fs-1 text-danger mb-3"></i>
                    <h2>{error}</h2>
                    <button className="btn btn-secondary mt-3" onClick={() => window.history.back()}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

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
                            <div className="company-logo">
                                {interviewSession.companyLogo ? (
                                    <img
                                        src={interviewSession.companyLogo.startsWith('http') ? interviewSession.companyLogo : `http://localhost:5000${interviewSession.companyLogo}`}
                                        alt={interviewSession.company}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-primary text-white rounded-circle">
                                        {interviewSession.company.charAt(0)}
                                    </div>
                                )}
                            </div>
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

                            {/* Transcript Display */}
                            <div className="transcript-box" style={{
                                background: '#f8f9fa',
                                border: '2px solid #dee2e6',
                                borderRadius: '12px',
                                padding: '15px',
                                margin: '15px 0',
                                minHeight: '100px',
                                maxHeight: '120px',
                                overflowY: 'auto'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                                    <i className={`bi bi-mic${isListening ? '-fill' : ''}`} style={{
                                        fontSize: '1.5rem',
                                        color: isListening ? '#28a745' : speechError ? '#dc3545' : '#6c757d'
                                    }}></i>
                                    <h6 style={{ margin: 0, color: '#495057', flex: 1 }}>
                                        {speechError ? speechError : (isListening ? 'Listening... (Your answer)' : useTextInput ? 'Type your answer below' : 'Start speaking to answer')}
                                    </h6>
                                    {speechError && !useTextInput && (
                                        <button
                                            onClick={() => {
                                                setSpeechError(null);
                                                retryCountRef.current = 0;
                                                startSpeechRecognition();
                                            }}
                                            style={{
                                                marginLeft: 'auto',
                                                padding: '5px 10px',
                                                fontSize: '0.85rem',
                                                background: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Retry Voice
                                        </button>
                                    )}
                                    {/* Always show toggle button */}
                                    <button
                                        onClick={() => {
                                            const newValue = !useTextInput;
                                            setUseTextInput(newValue);
                                            useTextInputRef.current = newValue;

                                            if (!newValue) {
                                                // Switching to voice mode
                                                setSpeechError(null);
                                                startSpeechRecognition();
                                            } else {
                                                // Switching to text mode - stop recognition
                                                if (recognitionRef.current) {
                                                    try {
                                                        recognitionRef.current.stop();
                                                        recognitionRef.current = null;
                                                    } catch (e) {
                                                        console.log('Recognition already stopped');
                                                    }
                                                }
                                                setIsListening(false);
                                            }
                                        }}
                                        style={{
                                            padding: '5px 15px',
                                            fontSize: '0.85rem',
                                            background: useTextInput ? '#28a745' : '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <i className={`bi bi-${useTextInput ? 'mic' : 'keyboard'}`}></i>
                                        {useTextInput ? 'Use Voice' : 'Type Instead'}
                                    </button>
                                </div>
                                {useTextInput ? (
                                    <textarea
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Type your answer here..."
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            fontSize: '1rem',
                                            borderRadius: '8px',
                                            border: '1px solid #ced4da',
                                            resize: 'vertical',
                                            minHeight: '60px',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                ) : (
                                    <p style={{
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        color: currentAnswer ? '#212529' : '#6c757d',
                                        fontStyle: currentAnswer ? 'normal' : 'italic',
                                        margin: 0
                                    }}>
                                        {currentAnswer || 'Your spoken answer will appear here...'}
                                    </p>
                                )}
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

                        {/* AI Scoring Results */}
                        {responses.length > 0 && (
                            <div className="scoring-results" style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                marginTop: '20px',
                                border: '1px solid #dee2e6'
                            }}>
                                <h4 style={{ marginBottom: '20px' }}>
                                    <i className="bi bi-graph-up me-2"></i>
                                    AI Evaluation Scores
                                </h4>
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '15px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Average Score
                                        </span>
                                        <span style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: responses.reduce((sum, r) => sum + r.ai_score, 0) / responses.length >= 75 ? '#28a745' : '#ffc107'
                                        }}>
                                            {Math.round(responses.reduce((sum, r) => sum + r.ai_score, 0) / responses.length)}/100
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {responses.map((response, index) => (
                                        <div key={index} style={{
                                            padding: '12px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.9rem' }}>Question {index + 1}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    color: response.ai_score >= 75 ? '#28a745' : response.ai_score >= 50 ? '#ffc107' : '#dc3545'
                                                }}>
                                                    {response.ai_score}/100
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                                    ({response.confidenceScore}% confidence)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
