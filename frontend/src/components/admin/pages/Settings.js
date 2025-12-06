import React, { useState } from 'react';
import '../../../styles/Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        // General Settings
        platformName: 'NextOffer',
        platformEmail: 'contact@nextoffer.com',
        supportEmail: 'support@nextoffer.com',
        maintenanceMode: false,
        allowRegistrations: true,
        emailVerificationRequired: true,
        
        // AI Settings
        resumeScreeningModel: 'gpt-4',
        interviewDifficulty: 'medium',
        interviewDuration: 30,
        questionsPerSession: 10,
        aiTemperature: 0.7,
        enableAdaptiveQuestioning: true,
        
        // Integrity Settings
        integrityThreshold: 80,
        enableGazeTracking: true,
        enableTabSwitchDetection: true,
        enablePresenceDetection: true,
        maxTabSwitches: 3,
        maxGazeAversions: 5,
        autoFlagViolations: true,
        
        // Interview Settings
        enableVideoRecording: true,
        enableAudioRecording: true,
        recordingQuality: 'high',
        autoSaveInterval: 5,
        allowInterviewPause: false,
        showCandidateTimer: true,
        
        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notifyOnNewRegistration: true,
        notifyOnIntegrityViolation: true,
        notifyOnInterviewCompletion: false,
        
        // Security Settings
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireStrongPassword: true,
        enable2FA: false,
        maxLoginAttempts: 5,
        ipWhitelisting: false,
        
        // Performance Settings
        cacheEnabled: true,
        cacheDuration: 3600,
        compressionEnabled: true,
        cdnEnabled: true,
        maxConcurrentInterviews: 100,
        apiRateLimit: 1000
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Simulate save
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">System Settings</h1>
                    <p className="text-muted">Configure platform settings, AI parameters, and system behavior</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-counterclockwise me-2"></i>Reset to Defaults
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className="bi bi-save me-2"></i>Save Changes
                    </button>
                </div>
            </div>

            {/* Save Success Alert */}
            {saved && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>Settings saved successfully!</div>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="settings-tabs mb-4">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            <i className="bi bi-gear me-2"></i>General
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            <i className="bi bi-cpu me-2"></i>AI Settings
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'integrity' ? 'active' : ''}`}
                            onClick={() => setActiveTab('integrity')}
                        >
                            <i className="bi bi-shield-check me-2"></i>Integrity
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'interview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('interview')}
                        >
                            <i className="bi bi-camera-video me-2"></i>Interview
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <i className="bi bi-bell me-2"></i>Notifications
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <i className="bi bi-lock me-2"></i>Security
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('performance')}
                        >
                            <i className="bi bi-speedometer2 me-2"></i>Performance
                        </button>
                    </li>
                </ul>
            </div>

            {/* General Settings Tab */}
            {activeTab === 'general' && (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="dashboard-card mb-4">
                            <div className="card-header-custom">
                                <h5 className="card-title mb-0">Platform Configuration</h5>
                            </div>
                            <div className="p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-light">Platform Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            value={settings.platformName}
                                            onChange={(e) => handleChange('platformName', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-light">Platform Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark"
                                            value={settings.platformEmail}
                                            onChange={(e) => handleChange('platformEmail', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-light">Support Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark"
                                            value={settings.supportEmail}
                                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header-custom">
                                <h5 className="card-title mb-0">Registration & Access</h5>
                            </div>
                            <div className="p-4">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Maintenance Mode</h6>
                                            <p className="text-muted small mb-0">Temporarily disable platform access for maintenance</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.maintenanceMode}
                                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-secondary opacity-25" />
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Allow New Registrations</h6>
                                            <p className="text-muted small mb-0">Enable or disable new company registrations</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.allowRegistrations}
                                                onChange={(e) => handleChange('allowRegistrations', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-secondary opacity-25" />
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Email Verification Required</h6>
                                            <p className="text-muted small mb-0">Require users to verify their email address</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.emailVerificationRequired}
                                                onChange={(e) => handleChange('emailVerificationRequired', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="dashboard-card">
                            <div className="card-header-custom">
                                <h5 className="card-title mb-0">Quick Info</h5>
                            </div>
                            <div className="p-4">
                                <div className="info-box mb-3">
                                    <i className="bi bi-server text-primary fs-4 mb-2"></i>
                                    <h6 className="text-light">Server Status</h6>
                                    <span className="badge bg-success">Online</span>
                                </div>
                                <div className="info-box mb-3">
                                    <i className="bi bi-hdd text-info fs-4 mb-2"></i>
                                    <h6 className="text-light">Database</h6>
                                    <p className="text-muted small mb-0">Connected</p>
                                </div>
                                <div className="info-box">
                                    <i className="bi bi-cloud text-success fs-4 mb-2"></i>
                                    <h6 className="text-light">Last Backup</h6>
                                    <p className="text-muted small mb-0">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Settings Tab */}
            {activeTab === 'ai' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">AI Model Configuration</h5>
                        <span className="badge bg-primary">Advanced Settings</span>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-light">Resume Screening Model</label>
                                <select
                                    className="form-select form-select-dark"
                                    value={settings.resumeScreeningModel}
                                    onChange={(e) => handleChange('resumeScreeningModel', e.target.value)}
                                >
                                    <option value="gpt-4">GPT-4 (Recommended)</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                                    <option value="claude-3">Claude 3</option>
                                </select>
                                <small className="text-muted">AI model used for resume analysis and gap detection</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Interview Difficulty Level</label>
                                <select
                                    className="form-select form-select-dark"
                                    value={settings.interviewDifficulty}
                                    onChange={(e) => handleChange('interviewDifficulty', e.target.value)}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                    <option value="expert">Expert</option>
                                </select>
                                <small className="text-muted">Default difficulty for AI-generated interview questions</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Interview Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.interviewDuration}
                                    onChange={(e) => handleChange('interviewDuration', parseInt(e.target.value))}
                                    min="15"
                                    max="120"
                                />
                                <small className="text-muted">Maximum duration for each interview session</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Questions Per Session</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.questionsPerSession}
                                    onChange={(e) => handleChange('questionsPerSession', parseInt(e.target.value))}
                                    min="5"
                                    max="30"
                                />
                                <small className="text-muted">Number of questions in each interview</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">AI Temperature (0-1)</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={settings.aiTemperature}
                                    onChange={(e) => handleChange('aiTemperature', parseFloat(e.target.value))}
                                />
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">Focused (0)</small>
                                    <small className="text-primary">{settings.aiTemperature}</small>
                                    <small className="text-muted">Creative (1)</small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Adaptive Questioning</h6>
                                            <p className="text-muted small mb-0">AI adjusts questions based on candidate responses</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enableAdaptiveQuestioning}
                                                onChange={(e) => handleChange('enableAdaptiveQuestioning', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Integrity Settings Tab */}
            {activeTab === 'integrity' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Integrity Monitoring Configuration</h5>
                        <span className="badge bg-danger">Security Critical</span>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-light">Integrity Threshold (%)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.integrityThreshold}
                                    onChange={(e) => handleChange('integrityThreshold', parseInt(e.target.value))}
                                    min="0"
                                    max="100"
                                />
                                <small className="text-muted">Minimum integrity score to pass (0-100)</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Max Tab Switches Allowed</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.maxTabSwitches}
                                    onChange={(e) => handleChange('maxTabSwitches', parseInt(e.target.value))}
                                    min="0"
                                    max="10"
                                />
                                <small className="text-muted">Maximum allowed tab switches before flagging</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Max Gaze Aversions Allowed</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.maxGazeAversions}
                                    onChange={(e) => handleChange('maxGazeAversions', parseInt(e.target.value))}
                                    min="0"
                                    max="20"
                                />
                                <small className="text-muted">Maximum allowed gaze aversions before flagging</small>
                            </div>
                            <div className="col-12">
                                <hr className="border-secondary opacity-25" />
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Gaze Tracking</h6>
                                            <p className="text-muted small mb-0">Monitor candidate eye movement using MediaPipe</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enableGazeTracking}
                                                onChange={(e) => handleChange('enableGazeTracking', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Tab Switch Detection</h6>
                                            <p className="text-muted small mb-0">Detect when candidate switches browser tabs</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enableTabSwitchDetection}
                                                onChange={(e) => handleChange('enableTabSwitchDetection', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Presence Detection</h6>
                                            <p className="text-muted small mb-0">Verify candidate presence throughout interview</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enablePresenceDetection}
                                                onChange={(e) => handleChange('enablePresenceDetection', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Auto-Flag Violations</h6>
                                            <p className="text-muted small mb-0">Automatically flag candidates exceeding thresholds</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.autoFlagViolations}
                                                onChange={(e) => handleChange('autoFlagViolations', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Settings Tab */}
            {activeTab === 'interview' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Interview Session Configuration</h5>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-light">Recording Quality</label>
                                <select
                                    className="form-select form-select-dark"
                                    value={settings.recordingQuality}
                                    onChange={(e) => handleChange('recordingQuality', e.target.value)}
                                >
                                    <option value="low">Low (720p)</option>
                                    <option value="medium">Medium (1080p)</option>
                                    <option value="high">High (1440p)</option>
                                </select>
                                <small className="text-muted">Video recording quality setting</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Auto-Save Interval (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.autoSaveInterval}
                                    onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value))}
                                    min="1"
                                    max="30"
                                />
                                <small className="text-muted">Frequency of automatic session saves</small>
                            </div>
                            <div className="col-12">
                                <hr className="border-secondary opacity-25" />
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Enable Video Recording</h6>
                                            <p className="text-muted small mb-0">Record video during interview sessions</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enableVideoRecording}
                                                onChange={(e) => handleChange('enableVideoRecording', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Enable Audio Recording</h6>
                                            <p className="text-muted small mb-0">Record audio during interview sessions</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enableAudioRecording}
                                                onChange={(e) => handleChange('enableAudioRecording', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Allow Interview Pause</h6>
                                            <p className="text-muted small mb-0">Let candidates pause the interview</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.allowInterviewPause}
                                                onChange={(e) => handleChange('allowInterviewPause', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Show Candidate Timer</h6>
                                            <p className="text-muted small mb-0">Display countdown timer to candidates</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.showCandidateTimer}
                                                onChange={(e) => handleChange('showCandidateTimer', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Notification Preferences</h5>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <h6 className="text-light mb-3">Notification Channels</h6>
                            </div>
                            <div className="col-md-4">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Email Notifications</h6>
                                            <p className="text-muted small mb-0">Send notifications via email</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.emailNotifications}
                                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">SMS Notifications</h6>
                                            <p className="text-muted small mb-0">Send notifications via SMS</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.smsNotifications}
                                                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Push Notifications</h6>
                                            <p className="text-muted small mb-0">Browser push notifications</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.pushNotifications}
                                                onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <hr className="border-secondary opacity-25" />
                                <h6 className="text-light mb-3">Event Notifications</h6>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">New Company Registration</h6>
                                            <p className="text-muted small mb-0">Notify on new company sign-ups</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifyOnNewRegistration}
                                                onChange={(e) => handleChange('notifyOnNewRegistration', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Integrity Violations</h6>
                                            <p className="text-muted small mb-0">Notify on integrity violations</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifyOnIntegrityViolation}
                                                onChange={(e) => handleChange('notifyOnIntegrityViolation', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Interview Completion</h6>
                                            <p className="text-muted small mb-0">Notify on completed interviews</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifyOnInterviewCompletion}
                                                onChange={(e) => handleChange('notifyOnInterviewCompletion', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Security Configuration</h5>
                        <span className="badge bg-danger">Critical Settings</span>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-light">Session Timeout (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                    min="5"
                                    max="480"
                                />
                                <small className="text-muted">Auto logout after inactivity</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Password Min Length</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.passwordMinLength}
                                    onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
                                    min="6"
                                    max="32"
                                />
                                <small className="text-muted">Minimum password length requirement</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Max Login Attempts</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.maxLoginAttempts}
                                    onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                                    min="3"
                                    max="10"
                                />
                                <small className="text-muted">Lock account after failed attempts</small>
                            </div>
                            <div className="col-12">
                                <hr className="border-secondary opacity-25" />
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Require Strong Passwords</h6>
                                            <p className="text-muted small mb-0">Enforce uppercase, numbers, and symbols</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.requireStrongPassword}
                                                onChange={(e) => handleChange('requireStrongPassword', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Two-Factor Authentication</h6>
                                            <p className="text-muted small mb-0">Require 2FA for all admin accounts</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.enable2FA}
                                                onChange={(e) => handleChange('enable2FA', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">IP Whitelisting</h6>
                                            <p className="text-muted small mb-0">Restrict admin access to specific IPs</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.ipWhitelisting}
                                                onChange={(e) => handleChange('ipWhitelisting', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
                <div className="dashboard-card">
                    <div className="card-header-custom">
                        <h5 className="card-title mb-0">Performance Optimization</h5>
                    </div>
                    <div className="p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-light">Cache Duration (seconds)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.cacheDuration}
                                    onChange={(e) => handleChange('cacheDuration', parseInt(e.target.value))}
                                    min="300"
                                    max="86400"
                                />
                                <small className="text-muted">How long to cache static resources</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">Max Concurrent Interviews</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.maxConcurrentInterviews}
                                    onChange={(e) => handleChange('maxConcurrentInterviews', parseInt(e.target.value))}
                                    min="10"
                                    max="1000"
                                />
                                <small className="text-muted">Maximum simultaneous interview sessions</small>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-light">API Rate Limit (req/min)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-dark"
                                    value={settings.apiRateLimit}
                                    onChange={(e) => handleChange('apiRateLimit', parseInt(e.target.value))}
                                    min="100"
                                    max="10000"
                                />
                                <small className="text-muted">Requests per minute per IP address</small>
                            </div>
                            <div className="col-12">
                                <hr className="border-secondary opacity-25" />
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Enable Caching</h6>
                                            <p className="text-muted small mb-0">Cache static resources for faster loading</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.cacheEnabled}
                                                onChange={(e) => handleChange('cacheEnabled', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">Enable Compression</h6>
                                            <p className="text-muted small mb-0">Compress API responses (Gzip)</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.compressionEnabled}
                                                onChange={(e) => handleChange('compressionEnabled', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="setting-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-light mb-1">CDN Enabled</h6>
                                            <p className="text-muted small mb-0">Use CDN for static asset delivery</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.cdnEnabled}
                                                onChange={(e) => handleChange('cdnEnabled', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
