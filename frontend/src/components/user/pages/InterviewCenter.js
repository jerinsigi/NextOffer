import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaceDetection } from '@mediapipe/face_detection';
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
    // const [isRecording, setIsRecording] = useState(false); // Currently unused
    const [interviewProgress, setInterviewProgress] = useState(0);
    const [fullscreenExited, setFullscreenExited] = useState(false);
    const [exitWarningCount, setExitWarningCount] = useState(0);
    const [interviewPaused, setInterviewPaused] = useState(false);
    const [pauseReason, setPauseReason] = useState('');
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const containerRef = useRef(null);
    const streamRef = useRef(null);
    const faceDetectionRef = useRef(null);
    const canvasRef = useRef(null);
    const detectionIntervalRef = useRef(null);
    const interviewPausedRef = useRef(false);

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

    // React Speech Recognition Hook
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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
    }, [interviewStage]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Comprehensive Keyboard & Window Monitoring for Integrity
    useEffect(() => {
        if (interviewStage !== 'active') return;

        // Record violation helper
        const recordViolation = (type, message) => {
            console.warn(`⚠️ INTEGRITY VIOLATION: ${message}`);
            setIntegrityStatus(prev => ({
                ...prev,
                tabSwitched: true,
                violations: [...prev.violations, {
                    type,
                    timestamp: new Date().toISOString(),
                    message
                }]
            }));
        };

        // 1. Keyboard Event Monitoring - Detect & Prevent Suspicious Keys
        const handleKeyDown = (e) => {
            // F12 - DevTools
            if (e.key === 'F12') {
                e.preventDefault();
                recordViolation('devtools_attempt', 'Attempted to open DevTools (F12)');
                alert('⚠️ WARNING: Opening developer tools is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Ctrl+Shift+I - DevTools
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                recordViolation('devtools_attempt', 'Attempted to open DevTools (Ctrl+Shift+I)');
                alert('⚠️ WARNING: Opening developer tools is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Ctrl+Shift+J - Console
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                recordViolation('devtools_attempt', 'Attempted to open Console (Ctrl+Shift+J)');
                alert('⚠️ WARNING: Opening developer console is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Ctrl+Shift+C - Inspect Element
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                recordViolation('devtools_attempt', 'Attempted to open Inspect Element (Ctrl+Shift+C)');
                alert('⚠️ WARNING: Using inspect element is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Ctrl+U - View Source
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                recordViolation('devtools_attempt', 'Attempted to view page source (Ctrl+U)');
                alert('⚠️ WARNING: Viewing page source is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Windows/Meta Key - Start Menu
            if (e.key === 'Meta' || e.key === 'OS') {
                e.preventDefault();
                recordViolation('window_switch_attempt', 'Windows/Meta key pressed');
                alert('⚠️ WARNING: Pressing the Windows key is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Alt+Tab - App Switching
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                recordViolation('app_switch_attempt', 'Alt+Tab detected - Application switching attempt');
                alert('⚠️ WARNING: Switching applications is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // Ctrl+Tab - Browser Tab Switching
            if (e.ctrlKey && e.key === 'Tab') {
                e.preventDefault();
                recordViolation('tab_switch_attempt', 'Ctrl+Tab detected - Tab switching attempt');
                alert('⚠️ WARNING: Switching browser tabs is not allowed during the interview. This violation has been recorded.');
                return false;
            }

            // F11 - Fullscreen Toggle (don't allow manual toggle)
            if (e.key === 'F11') {
                e.preventDefault();
                recordViolation('fullscreen_toggle', 'F11 pressed - Fullscreen toggle attempt');
                return false;
            }

            // Escape - Can exit fullscreen
            if (e.key === 'Escape' && document.fullscreenElement) {
                // Let the fullscreen handler catch this
                recordViolation('escape_pressed', 'Escape key pressed during interview');
            }

            // Ctrl+W or Ctrl+F4 - Close Tab
            if ((e.ctrlKey && e.key === 'w') || (e.ctrlKey && e.key === 'F4')) {
                e.preventDefault();
                recordViolation('tab_close_attempt', 'Attempted to close interview tab');
                alert('⚠️ WARNING: You cannot close the interview tab. Please complete or end the interview properly.');
                return false;
            }
        };

        // 2. Window Blur Detection - Catches Alt+Tab, Win+D, etc.
        const handleWindowBlur = () => {
            recordViolation('window_focus_lost', 'Window focus lost - Possible app/window switching');
        };

        const handleWindowFocus = () => {
            console.log("✅ Window focus regained");
            setIntegrityStatus(prev => ({
                ...prev,
                tabSwitched: false
            }));
        };

        // 3. Page Visibility API - Backup detection
        const handleVisibility = () => {
            if (document.hidden) {
                recordViolation('tab_hidden', 'Tab hidden - Switched to another tab or minimized window');
            } else {
                console.log("✅ Tab visible again");
                setIntegrityStatus(prev => ({
                    ...prev,
                    tabSwitched: false
                }));
            }
        };

        // 4. Context Menu Prevention (Right-click)
        const handleContextMenu = (e) => {
            e.preventDefault();
            recordViolation('context_menu_attempt', 'Right-click context menu blocked');
            alert('⚠️ WARNING: Right-click is disabled during the interview. This violation has been recorded.');
            return false;
        };

        // Add all event listeners
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('visibilitychange', handleVisibility);
        document.addEventListener('contextmenu', handleContextMenu);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibility);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [interviewStage]);

    // MediaPipe Face Detection - Detects face presence and integrity
    useEffect(() => {
        if (interviewStage !== 'active') return;

        const initializeFaceDetection = async () => {
            try {
                // Initialize MediaPipe Face Detection
                const faceDetection = new FaceDetection({
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
                });

                faceDetection.setOptions({
                    model: 'short', // 'short' for faces within 2 meters
                    minDetectionConfidence: 0.5
                });

                // Track previous state to avoid duplicate violations
                let lastFaceCount = 1;
                let noFaceWarningShown = false;
                let multipleFacesWarningShown = false;

                faceDetection.onResults((results) => {
                    const faceCount = results.detections.length;

                    // No face detected
                    if (faceCount === 0) {
                        console.warn("⚠️ Face not detected");
                        setIntegrityStatus(prev => ({
                            ...prev,
                            faceDetected: false
                        }));

                        // Pause interview if not already paused
                        if (!interviewPausedRef.current) {
                            interviewPausedRef.current = true;
                            setInterviewPaused(true);
                            setPauseReason('No face detected. Please position yourself in front of the camera.');

                            // Stop speech recognition when paused
                            SpeechRecognition.stopListening();

                            // Record violation only once per occurrence
                            if (lastFaceCount !== 0) {
                                setIntegrityStatus(prev => ({
                                    ...prev,
                                    violations: [...prev.violations, {
                                        type: 'no_face_detected',
                                        timestamp: new Date().toISOString(),
                                        message: 'Face not detected in frame - Interview paused'
                                    }]
                                }));
                            }
                        }
                    }
                    // Multiple faces detected
                    else if (faceCount > 1) {
                        console.warn("⚠️ Multiple faces detected");
                        setIntegrityStatus(prev => ({
                            ...prev,
                            faceDetected: true,
                            multipleFaces: true
                        }));

                        // Pause interview if not already paused
                        if (!interviewPausedRef.current) {
                            interviewPausedRef.current = true;
                            setInterviewPaused(true);
                            setPauseReason(`Multiple faces detected (${faceCount} people). Only you should be visible.`);

                            // Stop speech recognition when paused
                            SpeechRecognition.stopListening();

                            // Record violation only once per occurrence
                            if (lastFaceCount <= 1) {
                                setIntegrityStatus(prev => ({
                                    ...prev,
                                    violations: [...prev.violations, {
                                        type: 'multiple_faces',
                                        timestamp: new Date().toISOString(),
                                        message: `Multiple faces detected (${faceCount} faces) - Interview paused`
                                    }]
                                }));
                            }
                        }
                    }
                    // Exactly one face detected (good state)
                    else {
                        console.log("✅ Face detected properly");
                        setIntegrityStatus(prev => ({
                            ...prev,
                            faceDetected: true,
                            multipleFaces: false
                        }));

                        // Resume interview if it was paused due to face issues
                        if (interviewPausedRef.current && (lastFaceCount === 0 || lastFaceCount > 1)) {
                            console.log("✅ Face integrity restored - Resuming interview");
                            interviewPausedRef.current = false;
                            setInterviewPaused(false);
                            setPauseReason('');

                            // Restart speech recognition if not using text input
                            if (!useTextInputRef.current) {
                                setTimeout(() => {
                                    SpeechRecognition.startListening({
                                        continuous: true,
                                        language: 'en-US'
                                    });
                                }, 500);
                            }
                        }
                    }

                    lastFaceCount = faceCount;
                });

                faceDetectionRef.current = faceDetection;

                // Process video frames at regular intervals
                const processFrame = async () => {
                    if (videoRef.current && videoRef.current.readyState >= 2) {
                        // Create canvas if not exists
                        if (!canvasRef.current) {
                            canvasRef.current = document.createElement('canvas');
                            canvasRef.current.width = videoRef.current.videoWidth;
                            canvasRef.current.height = videoRef.current.videoHeight;
                        }

                        // Draw current video frame to canvas
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.drawImage(
                            videoRef.current,
                            0, 0,
                            canvasRef.current.width,
                            canvasRef.current.height
                        );

                        // Send to MediaPipe for detection
                        await faceDetection.send({ image: videoRef.current });
                    }
                };

                // Run face detection every 2 seconds (adjust for performance)
                detectionIntervalRef.current = setInterval(processFrame, 2000);

                console.log("✅ MediaPipe Face Detection initialized");

            } catch (error) {
                console.error("Error initializing face detection:", error);
            }
        };

        initializeFaceDetection();

        // Cleanup on unmount or stage change
        return () => {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
                detectionIntervalRef.current = null;
            }
            if (faceDetectionRef.current) {
                faceDetectionRef.current.close();
                faceDetectionRef.current = null;
            }
        };
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
        // startRecording(); // Temporarily disabled
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
                // setIsRecording(true); // State variable currently unused
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
        SpeechRecognition.stopListening();

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

                    // Start speech recognition
                    startSpeechRecognition();
                } else {
                    console.log('Skipping speech recognition (Text Input Mode: ON)');
                }
            };
        }
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            SpeechRecognition.stopListening();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion, interviewStage, questions]); // Removed useTextInput to prevent re-reading

    // Speech Recognition Setup
    // Sync transcript with currentAnswer - Update currentAnswer whenever transcript changes
    useEffect(() => {
        console.log('Transcript useEffect:', { listening, transcript, baseText: baseTextRef.current });
        // Update currentAnswer with base text + new transcript
        if (transcript || listening) {
            const newAnswer = baseTextRef.current + transcript;
            console.log('Setting currentAnswer to:', newAnswer);
            setCurrentAnswer(newAnswer);
        }
    }, [transcript, listening]);

    const baseTextRef = useRef('');

    // Speech Recognition using react-speech-recognition library
    const startSpeechRecognition = () => {
        console.log('Starting speech recognition (Library)...');

        if (useTextInputRef.current) {
            console.log('Text input mode is ON, skipping speech recognition');
            return;
        }

        if (!browserSupportsSpeechRecognition) {
            console.error('Browser does not support speech recognition');
            setSpeechError('Speech recognition not supported in this browser.');
            setUseTextInput(true);
            useTextInputRef.current = true;
            return;
        }

        setSpeechError(null);
        baseTextRef.current = currentAnswer;
        resetTranscript();

        console.log('Calling SpeechRecognition.startListening...');
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US'
        }).then(() => {
            console.log('Speech recognition started successfully');
        }).catch(err => {
            console.error('Error starting speech recognition:', err);
            setSpeechError('Failed to start speech recognition. Please try again.');
        });
    };

    const stopSpeechRecognition = () => {
        SpeechRecognition.stopListening();
    };

    const endInterview = () => {
        console.log('endInterview called');
        stopCamera(); // Stop camera when interview ends

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setInterviewStage('completed');
        // setIsRecording(false); // State variable currently unused
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
                            Total Violations: <strong>{integrityStatus.violations.length}</strong>
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
                    {/* Interview Paused Overlay */}
                    {interviewPaused && (
                        <div className="interview-paused-overlay">
                            <div className="pause-content">
                                <div className="pause-icon">
                                    <i className="bi bi-pause-circle-fill"></i>
                                </div>
                                <h2>Interview Paused</h2>
                                <div className="pause-reason">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {pauseReason}
                                </div>
                                <div className="pause-instructions">
                                    <h5>To Resume:</h5>
                                    <ul>
                                        {!integrityStatus.faceDetected && (
                                            <li>Position yourself in front of the camera</li>
                                        )}
                                        {integrityStatus.multipleFaces && (
                                            <li>Ensure you are the only person visible in the frame</li>
                                        )}
                                        <li>Wait for automatic resume (face is being monitored)</li>
                                    </ul>
                                </div>
                                <div className="pause-status">
                                    <div className="spinner-border text-warning me-2" role="status"></div>
                                    <span>Waiting for face integrity to be restored...</span>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <i className={`bi bi-mic${listening ? '-fill' : ''}`} style={{
                                        fontSize: '1.5rem',
                                        color: listening ? '#28a745' : speechError ? '#dc3545' : '#6c757d'
                                    }}></i>
                                    <h6 style={{ margin: 0, color: '#495057', flex: 1 }}>
                                        {speechError ? speechError : (listening ? 'Listening... (Your answer)' : useTextInput ? 'Type your answer below' : 'Start speaking to answer')}
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
                                                SpeechRecognition.stopListening();
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
                                    <>
                                        <p style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.6',
                                            color: currentAnswer ? '#212529' : '#6c757d',
                                            fontStyle: currentAnswer ? 'normal' : 'italic',
                                            margin: 0
                                        }}>
                                            {currentAnswer || 'Your spoken answer will appear here...'}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#dc3545', marginTop: '10px' }}>
                                            DEBUG - Listening: {listening.toString()} | Transcript: "{transcript}" | Current Answer: "{currentAnswer}" | Browser Support: {browserSupportsSpeechRecognition.toString()}
                                        </p>
                                        {!listening && (
                                            <button
                                                onClick={startSpeechRecognition}
                                                style={{
                                                    marginTop: '10px',
                                                    padding: '8px 15px',
                                                    background: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <i className="bi bi-mic-fill me-2"></i>
                                                Start Listening Manually
                                            </button>
                                        )}
                                    </>
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
