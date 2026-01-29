import React, { useState, useEffect, useRef } from 'react';
import './PracticeInterview.css';

const PracticeInterview = () => {
    const [practiceStage, setPracticeStage] = useState('setup'); // setup, active, feedback
    const [selectedSkill, setSelectedSkill] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [sessionScore, setSessionScore] = useState(null);

    // Speech Recognition State
    const [isListening, setIsListening] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [speechError, setSpeechError] = useState(null);
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);

    // Available skills for practice
    const skillCategories = [
        {
            category: 'Programming Languages',
            skills: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go']
        },
        {
            category: 'Web Development',
            skills: ['React', 'Node.js', 'Angular', 'Vue.js', 'HTML/CSS', 'REST APIs']
        },
        {
            category: 'Database',
            skills: ['MongoDB', 'SQL', 'PostgreSQL', 'Redis', 'MySQL']
        },
        {
            category: 'Soft Skills',
            skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management']
        },
        {
            category: 'System Design',
            skills: ['Scalability', 'Microservices', 'Cloud Architecture', 'Load Balancing']
        }
    ];

    // Practice questions based on skill and difficulty
    const practiceQuestions = {
        'JavaScript': {
            easy: [
                { question: 'What is the difference between let, const, and var?', duration: 180 },
                { question: 'Explain what closures are in JavaScript.', duration: 180 },
                { question: 'What is the event loop in JavaScript?', duration: 180 }
            ],
            medium: [
                { question: 'Explain promises and async/await in JavaScript.', duration: 240 },
                { question: 'What are higher-order functions? Give examples.', duration: 240 },
                { question: 'How does prototypal inheritance work?', duration: 240 }
            ],
            hard: [
                { question: 'Implement a debounce function from scratch.', duration: 300 },
                { question: 'Explain event delegation and its benefits.', duration: 300 },
                { question: 'How would you optimize JavaScript performance?', duration: 300 }
            ]
        },
        'React': {
            easy: [
                { question: 'What is JSX and why do we use it?', duration: 180 },
                { question: 'Explain the difference between state and props.', duration: 180 },
                { question: 'What are React hooks?', duration: 180 }
            ],
            medium: [
                { question: 'Explain the useEffect hook and its use cases.', duration: 240 },
                { question: 'What is the virtual DOM and how does it work?', duration: 240 },
                { question: 'How do you handle forms in React?', duration: 240 }
            ],
            hard: [
                { question: 'Explain React performance optimization techniques.', duration: 300 },
                { question: 'How would you implement code splitting in React?', duration: 300 },
                { question: 'Describe the Context API and when to use it.', duration: 300 }
            ]
        },
        'Communication': {
            easy: [
                { question: 'Tell me about yourself and your background.', duration: 180 },
                { question: 'Why are you interested in this field?', duration: 180 },
                { question: 'What are your career goals?', duration: 180 }
            ],
            medium: [
                { question: 'Describe a challenging project you worked on.', duration: 240 },
                { question: 'How do you handle conflicts in a team?', duration: 240 },
                { question: 'Tell me about a time you failed and what you learned.', duration: 240 }
            ],
            hard: [
                { question: 'How would you explain a complex technical concept to a non-technical person?', duration: 300 },
                { question: 'Describe a situation where you had to persuade others.', duration: 300 },
                { question: 'How do you prioritize tasks under tight deadlines?', duration: 300 }
            ]
        }
    };

    // Get questions for selected skill
    const getQuestions = () => {
        const defaultQuestions = [
            { question: 'Explain your experience with this skill.', duration: 240 },
            { question: 'What challenges have you faced while working with this?', duration: 240 },
            { question: 'How would you apply this skill in a real project?', duration: 240 }
        ];
        return practiceQuestions[selectedSkill]?.[difficulty] || defaultQuestions;
    };

    const questions = practiceStage === 'active' ? getQuestions() : [];

    // Initialize camera and speech recognition
    useEffect(() => {
        if (practiceStage === 'active') {
            initializeCamera();
            startSpeechRecognition();
        } else {
            stopSpeechRecognition();
        }

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            stopSpeechRecognition();
        };
    }, [practiceStage, currentQuestion]); // Restart recognition when question changes

    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const startSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSpeechError('Speech recognition is not supported in this browser.');
            return;
        }

        // Stop existing recognition if any
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setSpeechError(null);
        };

        recognition.onresult = (event) => {
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

            // Append final transcript to current answer, preserve existing edits
            if (finalTranscript) {
                setCurrentAnswer(prev => prev + finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                setSpeechError('Microphone access denied.');
            } else if (event.error === 'network') {
                setSpeechError('Network error. Speech recognition unavailable.');
            } else if (event.error !== 'no-speech') {
                setSpeechError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto restart if still in active stage and not manually stopped
            if (practiceStage === 'active' && !speechError) {
                // startSpeechRecognition(); 
                // Note: Infinite restart loops can be tricky, relying on useEffect deps to restart on question change is safer
                // but for continuous listening within a question:
            }
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (e) {
            console.error(e);
        }
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    };

    const startPractice = () => {
        if (!selectedSkill) {
            alert('Please select a skill to practice');
            return;
        }
        setPracticeStage('active');
        setCurrentQuestion(0);
        setAnswers([]);
        setCurrentAnswer('');
        setSpeechError(null);
    };

    const nextQuestion = () => {
        stopSpeechRecognition();

        // Save current answer
        const answerData = {
            questionIndex: currentQuestion,
            question: questions[currentQuestion].question,
            answer: currentAnswer,
            timestamp: new Date().toISOString(),
            duration: 0 // Could calculate actual duration
        };
        setAnswers([...answers, answerData]);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setCurrentAnswer(''); // Reset for next valid question
            // Speech recog will restart via useEffect
        } else {
            endPractice();
        }
    };

    const endPractice = () => {
        stopSpeechRecognition();

        // Generate mock feedback based on real interaction length/content
        const wordCount = answers.reduce((acc, ans) => acc + (ans.answer ? ans.answer.split(' ').length : 0), 0) + (currentAnswer ? currentAnswer.split(' ').length : 0);
        const randomBase = 70;

        const score = {
            overall: Math.min(100, Math.floor(randomBase + (wordCount > 50 ? 20 : 0) + Math.random() * 10)),
            clarity: Math.floor(Math.random() * 20) + 80,
            confidence: Math.floor(Math.random() * 20) + 80,
            technical: Math.floor(Math.random() * 20) + 80,
            timeManagement: Math.floor(Math.random() * 20) + 80
        };
        setSessionScore(score);
        setPracticeStage('feedback');
    };

    const restartPractice = () => {
        setPracticeStage('setup');
        setSelectedSkill('');
        setCurrentQuestion(0);
        setAnswers([]);
        setCurrentAnswer('');
        setSessionScore(null);
        setSpeechError(null);
    };

    return (
        <div className="practice-interview-container">
            {/* Setup Stage */}
            {practiceStage === 'setup' && (
                <div className="practice-setup">
                    {/* ... (Existing setup UI code) ... */}
                    <div className="setup-header">
                        <h1>
                            <i className="bi bi-trophy me-2"></i>
                            Practice Interview
                        </h1>
                        <p className="text-muted">
                            Improve your interview skills with AI-powered practice sessions
                        </p>
                    </div>

                    <div className="setup-content">
                        <div className="info-cards">
                            <div className="info-card">
                                <i className="bi bi-mic"></i>
                                <h4>Speech to Text</h4>
                                <p>Answers are transcribed automatically using browser speech recognition.</p>
                            </div>
                            <div className="info-card">
                                <i className="bi bi-graph-up"></i>
                                <h4>Instant Feedback</h4>
                                <p>Get AI-powered analysis of your answers immediately.</p>
                            </div>
                            <div className="info-card">
                                <i className="bi bi-arrow-repeat"></i>
                                <h4>Unlimited Attempts</h4>
                                <p>Practice as many times as you want, anytime.</p>
                            </div>
                        </div>

                        <div className="practice-config">
                            <h3>Configure Your Practice Session</h3>

                            {/* Skill Selection */}
                            <div className="config-section">
                                <label className="config-label">
                                    <i className="bi bi-bookmark-star me-2"></i>
                                    Select Skill to Practice
                                </label>
                                <div className="skills-grid">
                                    {skillCategories.map((category, idx) => (
                                        <div key={idx} className="skill-category">
                                            <h5 className="category-title">{category.category}</h5>
                                            <div className="skills-list">
                                                {category.skills.map((skill, skillIdx) => (
                                                    <button
                                                        key={skillIdx}
                                                        className={`skill-btn ${selectedSkill === skill ? 'active' : ''}`}
                                                        onClick={() => setSelectedSkill(skill)}
                                                    >
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
                                    Select Difficulty Level
                                </label>
                                <div className="difficulty-options">
                                    <button
                                        className={`difficulty-btn easy ${difficulty === 'easy' ? 'active' : ''}`}
                                        onClick={() => setDifficulty('easy')}
                                    >
                                        <i className="bi bi-circle-fill"></i>
                                        <span>Easy</span>
                                        <small>Basic concepts</small>
                                    </button>
                                    <button
                                        className={`difficulty-btn medium ${difficulty === 'medium' ? 'active' : ''}`}
                                        onClick={() => setDifficulty('medium')}
                                    >
                                        <i className="bi bi-circle-fill"></i>
                                        <i className="bi bi-circle-fill"></i>
                                        <span>Medium</span>
                                        <small>Intermediate level</small>
                                    </button>
                                    <button
                                        className={`difficulty-btn hard ${difficulty === 'hard' ? 'active' : ''}`}
                                        onClick={() => setDifficulty('hard')}
                                    >
                                        <i className="bi bi-circle-fill"></i>
                                        <i className="bi bi-circle-fill"></i>
                                        <i className="bi bi-circle-fill"></i>
                                        <span>Hard</span>
                                        <small>Advanced concepts</small>
                                    </button>
                                </div>
                            </div>

                            {/* Session Info */}
                            {selectedSkill && (
                                <div className="session-info">
                                    <div className="info-row">
                                        <i className="bi bi-patch-check"></i>
                                        <span>Skill: <strong>{selectedSkill}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-speedometer"></i>
                                        <span>Difficulty: <strong>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-list-check"></i>
                                        <span>Questions: <strong>{getQuestions().length}</strong></span>
                                    </div>
                                    <div className="info-row">
                                        <i className="bi bi-clock"></i>
                                        <span>Estimated Duration: <strong>{Math.ceil(getQuestions().reduce((acc, q) => acc + q.duration, 0) / 60)} minutes</strong></span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-lg w-100"
                                onClick={startPractice}
                                disabled={!selectedSkill}
                            >
                                <i className="bi bi-play-circle me-2"></i>
                                Start Practice Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Practice Stage */}
            {practiceStage === 'active' && questions.length > 0 && (
                <div className="practice-active">
                    <div className="practice-topbar">
                        <div className="practice-info">
                            <span className="practice-badge">
                                <i className="bi bi-trophy me-1"></i>
                                Practice Mode
                            </span>
                            <span className="question-counter">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                        </div>
                        <div className="progress-indicator">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="practice-content">
                        <div className="video-panel">
                            <video ref={videoRef} autoPlay muted className="practice-video"></video>
                            <div className="video-overlay">
                                <span className="video-label">
                                    {isListening ? (
                                        <span className="text-danger">
                                            <i className="bi bi-record-circle-fill me-1 blink"></i>
                                            Listening...
                                        </span>
                                    ) : (
                                        <span>Preview</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="question-panel">
                            <div className="skill-badge">
                                <i className="bi bi-bookmark me-2"></i>
                                {selectedSkill} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </div>

                            <div className="question-display">
                                <h3>
                                    <i className="bi bi-chat-quote me-2"></i>
                                    {questions[currentQuestion].question}
                                </h3>
                                <div className="time-indicator">
                                    <i className="bi bi-hourglass-split me-2"></i>
                                    Suggested time: {Math.floor(questions[currentQuestion].duration / 60)} minutes
                                </div>
                            </div>

                            <div className="answer-section">
                                <div className="recording-status mb-2">
                                    {speechError && (
                                        <div className="alert alert-warning py-2 mb-2">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            {speechError}
                                        </div>
                                    )}
                                    <h5 className="text-muted mb-2">Your Answer:</h5>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Speak to see your answer transcribed here, or type manually..."
                                    ></textarea>
                                </div>

                                <div className="tips-box mt-3">
                                    <h5>
                                        <i className="bi bi-lightbulb me-2"></i>
                                        Quick Tips
                                    </h5>
                                    <ul>
                                        <li>Speak clearly and at a comfortable pace</li>
                                        <li>Use examples to support your answer</li>
                                        <li>Feel free to edit the text if transcription is inaccurate</li>
                                    </ul>
                                </div>

                                <div className="action-buttons mt-3">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            stopSpeechRecognition();
                                            startSpeechRecognition();
                                        }}
                                    >
                                        <i className="bi bi-mic-mute me-2"></i>
                                        Restart Mic
                                    </button>
                                    <button className="btn btn-primary" onClick={nextQuestion}>
                                        {currentQuestion < questions.length - 1 ? (
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
            )}

            {/* Feedback Stage */}
            {practiceStage === 'feedback' && sessionScore && (
                <div className="practice-feedback">
                    <div className="feedback-header">
                        <div className="success-icon">
                            <i className="bi bi-trophy-fill"></i>
                        </div>
                        <h2>Practice Session Complete! 🎉</h2>
                        <p className="text-muted">Here's your AI-powered performance analysis</p>
                    </div>

                    <div className="score-overview">
                        <div className="overall-score">
                            <div className="score-circle">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        strokeDasharray={`${sessionScore.overall * 2.827} 282.7`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="score-text">
                                    <span className="score-number">{sessionScore.overall}</span>
                                    <span className="score-label">Overall</span>
                                </div>
                            </div>
                        </div>

                        <div className="score-breakdown">
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Clarity</span>
                                    <span>{sessionScore.clarity}%</span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-bar-fill" style={{ width: `${sessionScore.clarity}%` }}></div>
                                </div>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Confidence</span>
                                    <span>{sessionScore.confidence}%</span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-bar-fill" style={{ width: `${sessionScore.confidence}%` }}></div>
                                </div>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Technical Accuracy</span>
                                    <span>{sessionScore.technical}%</span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-bar-fill" style={{ width: `${sessionScore.technical}%` }}></div>
                                </div>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Time Management</span>
                                    <span>{sessionScore.timeManagement}%</span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-bar-fill" style={{ width: `${sessionScore.timeManagement}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="feedback-sections">
                        <div className="feedback-card strengths">
                            <h4>
                                <i className="bi bi-check-circle me-2"></i>
                                Strengths
                            </h4>
                            <ul>
                                <li>Clear and structured responses</li>
                                <li>Good use of technical terminology</li>
                                <li>Confident delivery</li>
                            </ul>
                        </div>

                        <div className="feedback-card improvements">
                            <h4>
                                <i className="bi bi-lightbulb me-2"></i>
                                Areas to Improve
                            </h4>
                            <ul>
                                <li>Provide more specific examples</li>
                                <li>Reduce filler words ("um", "like")</li>
                                <li>Elaborate on complex concepts</li>
                            </ul>
                        </div>
                    </div>

                    <div className="feedback-actions">
                        <button className="btn btn-outline-primary" onClick={restartPractice}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Practice Another Skill
                        </button>
                        <button className="btn btn-primary">
                            <i className="bi bi-download me-2"></i>
                            Download Report
                        </button>
                        <button className="btn btn-success" onClick={startPractice}>
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Practice Same Skill Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticeInterview;
