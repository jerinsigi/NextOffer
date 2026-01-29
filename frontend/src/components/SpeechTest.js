import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechTest = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Microphone: <span style={{ color: listening ? 'green' : 'red' }}>
                        {listening ? 'ON' : 'OFF'}
                    </span>
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => SpeechRecognition.startListening({ continuous: true, interimResults: true })}>
                    Start
                </button>
                <button onClick={SpeechRecognition.stopListening} style={{ marginLeft: '10px' }}>
                    Stop
                </button>
                <button onClick={resetTranscript} style={{ marginLeft: '10px' }}>
                    Reset
                </button>
            </div>

            <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '5px',
                padding: '15px',
                minHeight: '200px',
                color: 'black',
                fontSize: '16px'
            }}>
                <strong>Transcript:</strong>
                <p style={{ marginTop: '10px', color: 'black' }}>
                    {transcript || '(Transcript will appear here...)'}
                </p>
            </div>
        </div>
    );
};
export default SpeechTest;