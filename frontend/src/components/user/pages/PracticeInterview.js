import React, { useState, useEffect, useRef } from 'react';
import './PracticeInterview.css';

const SKILL_CATEGORIES = [
    {
        category: 'Programming Languages',
        skills: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Swift']
    },
    {
        category: 'Web Development',
        skills: ['React', 'Node.js', 'Angular', 'Vue.js', 'HTML/CSS', 'REST APIs', 'GraphQL', 'Next.js']
    },
    {
        category: 'Database',
        skills: ['MongoDB', 'SQL', 'PostgreSQL', 'Redis', 'MySQL', 'Firebase']
    },
    {
        category: 'Cloud & DevOps',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Azure', 'GCP']
    },
    {
        category: 'System Design',
        skills: ['Scalability', 'Microservices', 'Cloud Architecture', 'Load Balancing', 'Caching']
    },
    {
        category: 'Soft Skills',
        skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management']
    }
];

const QUESTION_COUNT_OPTIONS = [5, 10, 15];

const PracticeInterview = () => {
    const [stage, setStage] = useState('setup');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [questionCount, setQuestionCount] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');

    // Session & Questions (from backend)
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]); // [{id, ai_score, feedback}, ...]

    // Answer state
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [useTextInput, setUseTextInput] = useState(false);
    const useTextInputRef = useRef(false);

    // Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState(null);
    const recognitionRef = useRef(null);
    const transcriptAccumulatorRef = useRef('');

    // Camera
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Feedback state
    const [feedbackData, setFeedbackData] = useState(null);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);

    // Error
    const [loadError, setLoadError] = useState(null);

    // Progress
    const interviewProgress = questions.length > 0
        ? ((currentQuestion) / questions.length) * 100
        : 0;

    // ─── Toggle skill selection ──────────────────────────────────────────────
    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    // ─── Camera ─────────────────────────────────────────────────────────────
    const initializeCamera = async () => {
        try {
            stopCamera();
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(e => console.error('Video play error:', e));
            }
        } catch (error) {
            console.error('Camera error:', error);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // ─── Speech Recognition ──────────────────────────────────────────────────
    const startSpeechRecognition = () => {
        if (useTextInputRef.current) return;
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSpeechError('Speech recognition not supported. Please type your answer.');
            setUseTextInput(true);
            useTextInputRef.current = true;
            return;
        }

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
            recognitionRef.current = null;
        }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setSpeechError(null);
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += t + ' ';
                else interim += t;
            }
            if (final) {
                transcriptAccumulatorRef.current += final;
                if (!useTextInputRef.current) {
                    setCurrentAnswer(transcriptAccumulatorRef.current);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech error:', event.error);
            if (event.error === 'not-allowed') {
                setSpeechError('Microphone access denied. Switched to text input.');
                setUseTextInput(true);
                useTextInputRef.current = true;
            } else if (event.error !== 'no-speech') {
                setSpeechError(`Speech error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (e) {
            console.error('Recognition start error:', e);
        }
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
            recognitionRef.current = null;
        }
        setIsListening(false);
    };

    // ─── TTS: Read question aloud ─────────────────────────────────────────────
    const speakQuestion = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
            v.name.includes('Google US English') || v.name.includes('Samantha')
        );
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => {
            if (!useTextInputRef.current) {
                startSpeechRecognition();
            }
        };
        window.speechSynthesis.speak(utterance);
    };

    // ─── Start practice: call backend to create session & generate questions ─
    const startPractice = async () => {
        if (selectedSkills.length === 0) {
            alert('Please select at least one skill to practice.');
            return;
        }

        setLoadError(null);
        setStage('loading');

        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};
            const email = user.email || 'practice@nextoffer.com';

            const res = await fetch('http://localhost:5000/api/practice/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: selectedSkills, questionCount, difficulty, email })
            });

            if (!res.ok) throw new Error('Failed to generate practice questions');

            const data = await res.json();
            setSessionId(data.sessionId);
            setQuestions(data.questions);
            setCurrentQuestion(0);
            setCurrentAnswer('');
            setResponses([]);
            transcriptAccumulatorRef.current = '';
            setStage('active');

        } catch (err) {
            console.error('Error starting practice:', err);
            setLoadError('Failed to generate questions. Please try again.');
            setStage('setup');
        }
    };

    // ─── When Active stage begins: init camera + start reading first question ─
    useEffect(() => {
        if (stage === 'active') {
            initializeCamera();
        }
        return () => {
            if (stage !== 'active') {
                stopCamera();
                stopSpeechRecognition();
                if (window.speechSynthesis) window.speechSynthesis.cancel();
            }
        };
    }, [stage]); // eslint-disable-line

    // ─── Speak question whenever question index changes during active stage ──
    useEffect(() => {
        if (stage === 'active' && questions.length > 0) {
            stopSpeechRecognition();
            transcriptAccumulatorRef.current = '';
            setCurrentAnswer('');
            setSpeechError(null);

            const text = questions[currentQuestion]?.question;
            if (text) {
                setTimeout(() => speakQuestion(text), 300);
            }
        }
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, [currentQuestion, stage, questions]); // eslint-disable-line

    // ─── Submit answer to backend & get AI score ──────────────────────────────
    const submitResponse = async (answer) => {
        if (!sessionId || !questions[currentQuestion]) return null;
        try {
            const res = await fetch('http://localhost:5000/api/practice/response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    practiceQuestionId: questions[currentQuestion].id,
                    practiceSessionId: sessionId,
                    candidateAnswer: answer
                })
            });
            if (res.ok) {
                const data = await res.json();
                return data.response;
            }
        } catch (err) {
            console.error('Error submitting response:', err);
        }
        return null;
    };

    // ─── Next Question ────────────────────────────────────────────────────────
    const nextQuestion = async () => {
        if (submittingAnswer) return;
        setSubmittingAnswer(true);

        // Stop speech
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        stopSpeechRecognition();

        // Determine answer - prefer speech if not in text mode
        const answerToSubmit = useTextInput ? currentAnswer : (transcriptAccumulatorRef.current || currentAnswer);

        // Submit to API
        const result = await submitResponse(answerToSubmit);
        if (result) {
            setResponses(prev => [...prev, { ...result, questionIndex: currentQuestion }]);
        }

        setSubmittingAnswer(false);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // All questions answered — finish
            endPractice();
        }
    };

    // ─── End Practice ─────────────────────────────────────────────────────────
    const endPractice = async () => {
        stopSpeechRecognition();
        stopCamera();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setStage('completing');

        try {
            const res = await fetch('http://localhost:5000/api/practice/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            if (res.ok) {
                const data = await res.json();
                setFeedbackData(data);
            }
        } catch (err) {
            console.error('Error completing session:', err);
        }

        setStage('feedback');
    };

    // ─── Restart ──────────────────────────────────────────────────────────────
    const restartPractice = () => {
        stopCamera();
        stopSpeechRecognition();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setStage('setup');
        setSelectedSkills([]);
        setQuestionCount(5);
        setSessionId(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setCurrentAnswer('');
        setResponses([]);
        setFeedbackData(null);
        setLoadError(null);
        setUseTextInput(false);
        useTextInputRef.current = false;
        transcriptAccumulatorRef.current = '';
    };

    // ─── Cleanup on unmount ───────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            stopCamera();
            stopSpeechRecognition();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []); // eslint-disable-line

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    // ── SETUP STAGE ──
    if (stage === 'setup') {
        return (
            <div className="practice-interview-container">
                <div className="practice-setup">
                    <div className="setup-header">
                        <h1>
                            <i className="bi bi-trophy me-2"></i>
                            Practice Interview
                        </h1>
                        <p className="text-muted">
                            AI-powered practice sessions tailored to your chosen skills
                        </p>
                    </div>

                    <div className="setup-content">
                        <div className="info-cards">
                            <div className="info-card">
                                <i className="bi bi-robot"></i>
                                <h4>AI Questions</h4>
                                <p>Questions generated by Gemini AI tailored to your skills.</p>
                            </div>
                            <div className="info-card">
                                <i className="bi bi-mic"></i>
                                <h4>Speech to Text</h4>
                                <p>Answers transcribed automatically using browser speech recognition.</p>
                            </div>
                            <div className="info-card">
                                <i className="bi bi-graph-up"></i>
                                <h4>Real AI Feedback</h4>
                                <p>Get AI-powered scores and feedback on every answer.</p>
                            </div>
                        </div>

                        <div className="practice-config">
                            <h3>Configure Your Practice Session</h3>

                            {loadError && (
                                <div className="alert alert-danger py-2 mb-3">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {loadError}
                                </div>
                            )}

                            {/* Multi-Skill Selection */}
                            <div className="config-section">
                                <label className="config-label">
                                    <i className="bi bi-bookmark-star me-2"></i>
                                    Select Skills to Practice
                                    <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>
                                        (select multiple)
                                    </span>
                                </label>

                                {selectedSkills.length > 0 && (
                                    <div className="selected-skills-summary mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Selected: {selectedSkills.map(s => (
                                            <span key={s} className="selected-skill-tag">
                                                {s}
                                                <button onClick={() => toggleSkill(s)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="skills-grid">
                                    {SKILL_CATEGORIES.map((cat, idx) => (
                                        <div key={idx} className="skill-category">
                                            <h5 className="category-title">{cat.category}</h5>
                                            <div className="skills-list">
                                                {cat.skills.map((skill, skIdx) => (
                                                    <button
                                                        key={skIdx}
                                                        className={`skill-btn ${selectedSkills.includes(skill) ? 'active' : ''}`}
                                                        onClick={() => toggleSkill(skill)}
                                                    >
                                                        {selectedSkills.includes(skill) && (
                                                            <i className="bi bi-check-circle-fill me-1"></i>
                                                        )}
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Selection */}
                            <div className="config-section">
                                <label className="config-label">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Difficulty Level
                                </label>
                                <div className="difficulty-options">
                                    {['Easy', 'Medium', 'Hard'].map(level => (
                                        <button
                                            key={level}
                                            className={`difficulty-btn difficulty-${level.toLowerCase()} ${difficulty === level ? 'active' : ''}`}
                                            onClick={() => setDifficulty(level)}
                                        >
                                            <i className={`bi bi-${level === 'Easy' ? 'emoji-smile' :
                                                    level === 'Medium' ? 'emoji-neutral' :
                                                        'emoji-dizzy'
                                                } me-2`}></i>
                                            <span className="diff-label">{level}</span>
                                            <small className="diff-desc">
                                                {level === 'Easy' ? 'Foundational concepts' :
                                                    level === 'Medium' ? 'Real-world scenarios' :
                                                        'Advanced & in-depth'}
                                            </small>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question Count Selection */}
                            <div className="config-section">
                                <label className="config-label">
                                    <i className="bi bi-list-check me-2"></i>
                                    Number of Questions
                                </label>
                                <div className="question-count-options">
                                    {QUESTION_COUNT_OPTIONS.map(count => (
                                        <button
                                            key={count}
                                            className={`count-btn ${questionCount === count ? 'active' : ''}`}
                                            onClick={() => setQuestionCount(count)}
                                        >
                                            <span className="count-number">{count}</span>
                                            <span className="count-label">Questions</span>
                                            <span className="count-time">~{Math.ceil(count * 3)} min</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Session Summary */}
                            {selectedSkills.length > 0 && (
                                <div className="session-info">
                                    <div className="info-row">
                                        <i className="bi bi-patch-check"></i>
                                        <span>Skills: <strong>{selectedSkills.join(', ')}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-speedometer2"></i>
                                        <span>Difficulty: <strong>{difficulty}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-list-check"></i>
                                        <span>Questions: <strong>{questionCount}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-clock"></i>
                                        <span>Estimated Duration: <strong>~{Math.ceil(questionCount * 3)} minutes</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-robot"></i>
                                        <span>Questions powered by <strong>Gemini AI</strong></span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-lg w-100 mt-3"
                                onClick={startPractice}
                                disabled={selectedSkills.length === 0}
                            >
                                <i className="bi bi-play-circle me-2"></i>
                                Start Practice Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── LOADING STAGE ──
    if (stage === 'loading') {
        return (
            <div className="practice-interview-container">
                <div className="practice-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                            <i className="bi bi-robot loader-icon"></i>
                        </div>
                        <h2>Generating Your Questions</h2>
                        <p className="text-muted">
                            AI is crafting personalized questions for: <br />
                            <strong>{selectedSkills.join(', ')}</strong>
                        </p>
                        <div className="loading-steps">
                            <div className="loading-step active">
                                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                                Analyzing selected skills
                            </div>
                            <div className="loading-step active">
                                <i className="bi bi-hourglass-split me-2 text-warning"></i>
                                Generating {questionCount} tailored questions...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── ACTIVE STAGE ──
    if (stage === 'active' && questions.length > 0) {
        const q = questions[currentQuestion];
        return (
            <div className="practice-interview-container">
                <div className="practice-active">
                    <div className="practice-topbar">
                        <div className="practice-info">
                            <span className="practice-badge">
                                <i className="bi bi-robot me-1"></i>
                                AI Practice
                            </span>
                            <span className="skill-badges">
                                {selectedSkills.map(s => (
                                    <span key={s} className="skill-mini-badge">{s}</span>
                                ))}
                            </span>
                        </div>
                        <div className="question-counter-display">
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="practice-progress-bar">
                        <div
                            className="practice-progress-fill"
                            style={{ width: `${interviewProgress}%` }}
                        ></div>
                    </div>

                    <div className="practice-content">
                        {/* Left: Camera */}
                        <div className="video-panel">
                            <video ref={videoRef} autoPlay muted className="practice-video"></video>
                            <div className="video-overlay">
                                {isListening ? (
                                    <span className="listening-label">
                                        <i className="bi bi-record-circle-fill me-1 blink text-danger"></i>
                                        Listening...
                                    </span>
                                ) : (
                                    <span className="listening-label">
                                        <i className="bi bi-camera-video me-1"></i>
                                        Preview
                                    </span>
                                )}
                            </div>

                            {/* Input mode toggle */}
                            <div className="input-mode-toggle">
                                <button
                                    className={`mode-btn ${!useTextInput ? 'active' : ''}`}
                                    onClick={() => {
                                        setUseTextInput(false);
                                        useTextInputRef.current = false;
                                        startSpeechRecognition();
                                    }}
                                >
                                    <i className="bi bi-mic me-1"></i>Voice
                                </button>
                                <button
                                    className={`mode-btn ${useTextInput ? 'active' : ''}`}
                                    onClick={() => {
                                        setUseTextInput(true);
                                        useTextInputRef.current = true;
                                        stopSpeechRecognition();
                                    }}
                                >
                                    <i className="bi bi-keyboard me-1"></i>Type
                                </button>
                            </div>
                        </div>

                        {/* Right: Question + Answer */}
                        <div className="question-panel">
                            <div className="skill-badge-display">
                                <i className="bi bi-bookmark me-2"></i>
                                {q.topic} — <span className={`diff-badge diff-${(q.difficulty || 'medium').toLowerCase()}`}>{q.difficulty}</span>
                            </div>

                            <div className="question-display">
                                <h3>
                                    <i className="bi bi-chat-quote me-2"></i>
                                    {q.question}
                                </h3>
                                <div className="time-indicator">
                                    <i className="bi bi-hourglass-split me-2"></i>
                                    Take your time — speak or type your answer below
                                </div>
                            </div>

                            <div className="answer-section">
                                {speechError && (
                                    <div className="alert alert-warning py-2 mb-2">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {speechError}
                                    </div>
                                )}

                                <h5 className="text-muted mb-2">Your Answer:</h5>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={currentAnswer}
                                    onChange={(e) => {
                                        setCurrentAnswer(e.target.value);
                                        if (useTextInput) {
                                            transcriptAccumulatorRef.current = e.target.value;
                                        }
                                    }}
                                    placeholder={useTextInput
                                        ? "Type your answer here..."
                                        : "Speak your answer — it will appear here. Or type to edit..."
                                    }
                                ></textarea>

                                {!useTextInput && (
                                    <div className="mic-controls mt-2">
                                        {isListening ? (
                                            <button className="btn btn-sm btn-danger" onClick={stopSpeechRecognition}>
                                                <i className="bi bi-mic-mute me-1"></i>Stop Mic
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-outline-primary" onClick={startSpeechRecognition}>
                                                <i className="bi bi-mic me-1"></i>Restart Mic
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="tips-box mt-3">
                                    <h5><i className="bi bi-lightbulb me-2"></i>Quick Tips</h5>
                                    <ul>
                                        <li>Speak clearly and at a comfortable pace</li>
                                        <li>Use examples to support your answer</li>
                                        <li>Edit the text if transcription is inaccurate</li>
                                    </ul>
                                </div>

                                <div className="action-buttons mt-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={nextQuestion}
                                        disabled={submittingAnswer}
                                    >
                                        {submittingAnswer ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Scoring...
                                            </>
                                        ) : currentQuestion < questions.length - 1 ? (
                                            <>
                                                <i className="bi bi-arrow-right me-2"></i>
                                                Next Question
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Finish Practice
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── COMPLETING STAGE ──
    if (stage === 'completing') {
        return (
            <div className="practice-interview-container">
                <div className="practice-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                            <i className="bi bi-graph-up loader-icon"></i>
                        </div>
                        <h2>Analyzing Your Performance</h2>
                        <p className="text-muted">AI is reviewing all your answers and generating feedback...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── FEEDBACK STAGE ──
    if (stage === 'feedback') {
        const score = feedbackData?.overallScore ?? 0;
        const circumference = 2 * Math.PI * 45;
        const dashOffset = circumference - (score / 100) * circumference;

        const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

        return (
            <div className="practice-interview-container">
                <div className="practice-feedback">
                    <div className="feedback-header">
                        <div className="success-icon">
                            <i className="bi bi-trophy-fill"></i>
                        </div>
                        <h2>Practice Session Complete! 🎉</h2>
                        <p className="text-muted">
                            Skills practiced: <strong>{selectedSkills.join(', ')}</strong>
                        </p>
                    </div>

                    <div className="score-overview">
                        <div className="overall-score">
                            <div className="score-circle">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke={scoreColor}
                                        strokeWidth="8"
                                        strokeDasharray={`${score * 2.827} 282.7`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="score-text">
                                    <span className="score-number">{score}</span>
                                    <span className="score-label">Overall</span>
                                </div>
                            </div>
                            <div className="score-meta">
                                <p>
                                    <i className="bi bi-list-check me-1"></i>
                                    {feedbackData?.answeredQuestions ?? 0} / {feedbackData?.totalQuestions ?? questions.length} answered
                                </p>
                                <p className={`recommendation-badge ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-work'}`}>
                                    {score >= 80 ? '🌟 Excellent Performance' : score >= 60 ? '👍 Good Effort' : '📚 Keep Practicing'}
                                </p>
                            </div>
                        </div>

                        {/* Per-Question Breakdown */}
                        {feedbackData?.questions && feedbackData.questions.length > 0 && (
                            <div className="questions-breakdown">
                                <h4 className="mb-3">
                                    <i className="bi bi-list-ul me-2"></i>
                                    Question-by-Question Results
                                </h4>
                                <div className="question-results-list">
                                    {feedbackData.questions.map((q, idx) => (
                                        <div key={idx} className={`question-result-item ${q.ai_score >= 80 ? 'good' : q.ai_score >= 60 ? 'average' : 'needs-work'}`}>
                                            <div className="qr-header">
                                                <div className="qr-number">Q{idx + 1}</div>
                                                <div className="qr-question">
                                                    <strong>{q.topic}</strong> — {q.question.substring(0, 70)}{q.question.length > 70 ? '...' : ''}
                                                </div>
                                                <div className="qr-score" style={{ color: q.ai_score >= 80 ? '#22c55e' : q.ai_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                    {q.ai_score ?? '--'}/100
                                                </div>
                                            </div>
                                            {q.feedback && (
                                                <div className="qr-feedback">
                                                    <i className="bi bi-robot me-1"></i>
                                                    {q.feedback}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="feedback-sections">
                        <div className="feedback-card strengths">
                            <h4><i className="bi bi-check-circle me-2"></i>Strengths</h4>
                            <ul>
                                {(feedbackData?.strengths || ['Completed all practice questions.']).map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="feedback-card improvements">
                            <h4><i className="bi bi-lightbulb me-2"></i>Areas to Improve</h4>
                            <ul>
                                {(feedbackData?.improvements || ['Continue practicing regularly.']).map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="feedback-actions">
                        <button className="btn btn-outline-primary" onClick={restartPractice}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Practice Another Skill
                        </button>
                        <button className="btn btn-success" onClick={() => {
                            setCurrentQuestion(0);
                            setCurrentAnswer('');
                            setResponses([]);
                            setFeedbackData(null);
                            setStage('setup');
                            // Keep same skills/count
                            setTimeout(() => startPractice(), 100);
                        }}>
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Practice Same Skills Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default loading fallback
    return (
        <div className="practice-interview-container d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default PracticeInterview;
