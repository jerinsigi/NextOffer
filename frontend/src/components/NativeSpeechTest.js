import React, { useState, useRef, useEffect } from 'react';

const NativeSpeechTest = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [browserSupport, setBrowserSupport] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            setBrowserSupport(true);

            // Create recognition instance
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            // Event handlers
            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPiece + ' ';
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }

                setTranscript(prev => prev + finalTranscript + interimTranscript);
            };

            recognition.onerror = (event) => {
                console.error('❌ Speech recognition error:', event.error, event);
                setError(`Error: ${event.error}`);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.error('❌ Browser does not support Speech Recognition');
            setBrowserSupport(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Error starting recognition:', err);
                setError(err.message);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const resetTranscript = () => {
        setTranscript('');
    };

    if (!browserSupport) {
        return (
            <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>❌ Browser Not Supported</h1>
                <p>Your browser doesn't support the Web Speech API.</p>
                <p>Please use Chrome, Edge, or Safari.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Native Web Speech API Test</h1>

            <div style={{ marginBottom: '20px' }}>
                <p>Microphone: <strong>{isListening ? '🔴 ON' : '⚫ OFF'}</strong></p>
                {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={startListening}
                    disabled={isListening}
                    style={{ marginRight: '10px', padding: '10px 20px', cursor: isListening ? 'not-allowed' : 'pointer' }}
                >
                    Start
                </button>
                <button
                    onClick={stopListening}
                    disabled={!isListening}
                    style={{ marginRight: '10px', padding: '10px 20px', cursor: !isListening ? 'not-allowed' : 'pointer' }}
                >
                    Stop
                </button>
                <button
                    onClick={resetTranscript}
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Reset
                </button>
            </div>

            <div style={{
                padding: '20px',
                border: '2px solid #ccc',
                borderRadius: '8px',
                minHeight: '150px',
                backgroundColor: '#f9f9f9'
            }}>
                <h3>Transcript:</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    {transcript || 'Nothing heard yet... Click Start and speak.'}
                </p>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <p><strong>Instructions:</strong></p>
                <ol>
                    <li>Click "Start" button</li>
                    <li>Allow microphone permission when prompted</li>
                    <li>Speak clearly into your microphone</li>
                    <li>Watch the transcript appear above</li>
                    <li>Check browser console (F12) for detailed logs</li>
                </ol>
            </div>
        </div>
    );
};

export default NativeSpeechTest;
