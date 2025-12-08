import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Account Settings
    const [accountSettings, setAccountSettings] = useState({
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        twoFactorAuth: true
    });

    // Privacy Settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showResume: true,
        searchableProfile: true,
        allowMessages: true,
        dataSharing: false
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        interviewReminders: true,
        applicationUpdates: true,
        jobRecommendations: true,
        courseUpdates: false,
        weeklyDigest: true,
        marketingEmails: false
    });

    // Appearance Settings
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'dark',
        compactMode: false,
        fontSize: 'medium',
        animations: true,
        soundEffects: false
    });

    // Integration Settings
    const [integrations, setIntegrations] = useState([
        { name: 'LinkedIn', connected: true, icon: 'fa-linkedin', color: '#0077b5' },
        { name: 'GitHub', connected: true, icon: 'fa-github', color: '#333' },
        { name: 'Google Calendar', connected: false, icon: 'fa-google', color: '#4285f4' },
        { name: 'Slack', connected: false, icon: 'fa-slack', color: '#4a154b' }
    ]);

    const tabs = [
        { key: 'account', label: 'Account', icon: 'fa-user-circle' },
        { key: 'privacy', label: 'Privacy & Security', icon: 'fa-shield-alt' },
        { key: 'notifications', label: 'Notifications', icon: 'fa-bell' },
        { key: 'appearance', label: 'Appearance', icon: 'fa-palette' },
        { key: 'integrations', label: 'Integrations', icon: 'fa-plug' },
        { key: 'subscription', label: 'Subscription', icon: 'fa-credit-card' }
    ];

    const updateAccountSetting = (key, value) => {
        setAccountSettings({ ...accountSettings, [key]: value });
    };

    const updatePrivacySetting = (key, value) => {
        setPrivacySettings({ ...privacySettings, [key]: value });
    };

    const updateNotificationSetting = (key, value) => {
        setNotificationSettings({ ...notificationSettings, [key]: value });
    };

    const updateAppearanceSetting = (key, value) => {
        setAppearanceSettings({ ...appearanceSettings, [key]: value });
    };

    const toggleIntegration = (name) => {
        setIntegrations(integrations.map(int => 
            int.name === name ? { ...int, connected: !int.connected } : int
        ));
    };

    const handleSaveSettings = () => {
        console.log('Settings saved:', {
            account: accountSettings,
            privacy: privacySettings,
            notifications: notificationSettings,
            appearance: appearanceSettings
        });
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <i className="fas fa-cog me-2"></i>
                        Settings
                    </h2>
                    <p className="text-muted">Manage your account preferences and settings</p>
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                    <i className="fas fa-save me-1"></i> Save Changes
                </button>
            </div>

            <div className="settings-content">
                {/* Sidebar Navigation */}
                <div className="settings-sidebar">
                    <div className="settings-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <i className={`fas ${tab.icon}`}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Settings Panel */}
                <div className="settings-main">
                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h3>Account Settings</h3>
                            <p className="section-description">Update your account information and preferences</p>

                            <div className="settings-card">
                                <h4>Personal Information</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={accountSettings.email}
                                            onChange={(e) => updateAccountSetting('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={accountSettings.phone}
                                            onChange={(e) => updateAccountSetting('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h4>Regional Settings</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Language</label>
                                        <select
                                            value={accountSettings.language}
                                            onChange={(e) => updateAccountSetting('language', e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Timezone</label>
                                        <select
                                            value={accountSettings.timezone}
                                            onChange={(e) => updateAccountSetting('timezone', e.target.value)}
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date Format</label>
                                        <select
                                            value={accountSettings.dateFormat}
                                            onChange={(e) => updateAccountSetting('dateFormat', e.target.value)}
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h4>Security</h4>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <div className="setting-label">Two-Factor Authentication</div>
                                        <div className="setting-description">Add an extra layer of security to your account</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={accountSettings.twoFactorAuth}
                                            onChange={(e) => updateAccountSetting('twoFactorAuth', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="action-buttons">
                                    <button className="btn btn-outline-primary" onClick={() => setShowPasswordModal(true)}>
                                        <i className="fas fa-key me-1"></i> Change Password
                                    </button>
                                </div>
                            </div>

                            <div className="settings-card danger-zone">
                                <h4>Danger Zone</h4>
                                <p>Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                                    <i className="fas fa-trash me-1"></i> Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h3>Privacy & Security</h3>
                            <p className="section-description">Control who can see your information</p>

                            <div className="settings-card">
                                <h4>Profile Visibility</h4>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="public"
                                            checked={privacySettings.profileVisibility === 'public'}
                                            onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                                        />
                                        <div className="radio-content">
                                            <div className="radio-label">Public</div>
                                            <div className="radio-description">Anyone can view your profile</div>
                                        </div>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="recruiters"
                                            checked={privacySettings.profileVisibility === 'recruiters'}
                                            onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                                        />
                                        <div className="radio-content">
                                            <div className="radio-label">Recruiters Only</div>
                                            <div className="radio-description">Only verified recruiters can view</div>
                                        </div>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="private"
                                            checked={privacySettings.profileVisibility === 'private'}
                                            onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                                        />
                                        <div className="radio-content">
                                            <div className="radio-label">Private</div>
                                            <div className="radio-description">Hidden from everyone</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h4>Information Display</h4>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Show Email Address</div>
                                            <div className="setting-description">Display email on your profile</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.showEmail}
                                                onChange={(e) => updatePrivacySetting('showEmail', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Show Phone Number</div>
                                            <div className="setting-description">Display phone on your profile</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.showPhone}
                                                onChange={(e) => updatePrivacySetting('showPhone', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Show Resume</div>
                                            <div className="setting-description">Allow recruiters to view your resume</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.showResume}
                                                onChange={(e) => updatePrivacySetting('showResume', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Searchable Profile</div>
                                            <div className="setting-description">Appear in recruiter searches</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.searchableProfile}
                                                onChange={(e) => updatePrivacySetting('searchableProfile', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Allow Messages</div>
                                            <div className="setting-description">Receive messages from recruiters</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.allowMessages}
                                                onChange={(e) => updatePrivacySetting('allowMessages', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Data Sharing</div>
                                            <div className="setting-description">Share data with partner companies</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.dataSharing}
                                                onChange={(e) => updatePrivacySetting('dataSharing', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>
                            <p className="section-description">Choose how you want to be notified</p>

                            <div className="settings-card">
                                <h4>Notification Channels</h4>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Email Notifications</div>
                                            <div className="setting-description">Receive updates via email</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.emailNotifications}
                                                onChange={(e) => updateNotificationSetting('emailNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Push Notifications</div>
                                            <div className="setting-description">Browser push notifications</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.pushNotifications}
                                                onChange={(e) => updateNotificationSetting('pushNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">SMS Notifications</div>
                                            <div className="setting-description">Text message alerts</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.smsNotifications}
                                                onChange={(e) => updateNotificationSetting('smsNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h4>Notification Types</h4>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Interview Reminders</div>
                                            <div className="setting-description">24 hours before scheduled interviews</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.interviewReminders}
                                                onChange={(e) => updateNotificationSetting('interviewReminders', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Application Updates</div>
                                            <div className="setting-description">Status changes on your applications</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.applicationUpdates}
                                                onChange={(e) => updateNotificationSetting('applicationUpdates', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Job Recommendations</div>
                                            <div className="setting-description">Personalized job suggestions</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.jobRecommendations}
                                                onChange={(e) => updateNotificationSetting('jobRecommendations', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Course Updates</div>
                                            <div className="setting-description">New courses and learning content</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.courseUpdates}
                                                onChange={(e) => updateNotificationSetting('courseUpdates', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Weekly Digest</div>
                                            <div className="setting-description">Summary of your activity every Monday</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.weeklyDigest}
                                                onChange={(e) => updateNotificationSetting('weeklyDigest', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Marketing Emails</div>
                                            <div className="setting-description">Promotional content and offers</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings.marketingEmails}
                                                onChange={(e) => updateNotificationSetting('marketingEmails', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="settings-section">
                            <h3>Appearance</h3>
                            <p className="section-description">Customize how NextOffer looks for you</p>

                            <div className="settings-card">
                                <h4>Theme</h4>
                                <div className="theme-options">
                                    <div
                                        className={`theme-card ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
                                        onClick={() => updateAppearanceSetting('theme', 'light')}
                                    >
                                        <div className="theme-preview light-theme">
                                            <div className="theme-header"></div>
                                            <div className="theme-sidebar"></div>
                                            <div className="theme-content"></div>
                                        </div>
                                        <div className="theme-name">Light</div>
                                    </div>
                                    <div
                                        className={`theme-card ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => updateAppearanceSetting('theme', 'dark')}
                                    >
                                        <div className="theme-preview dark-theme">
                                            <div className="theme-header"></div>
                                            <div className="theme-sidebar"></div>
                                            <div className="theme-content"></div>
                                        </div>
                                        <div className="theme-name">Dark</div>
                                    </div>
                                    <div
                                        className={`theme-card ${appearanceSettings.theme === 'auto' ? 'active' : ''}`}
                                        onClick={() => updateAppearanceSetting('theme', 'auto')}
                                    >
                                        <div className="theme-preview auto-theme">
                                            <div className="theme-header"></div>
                                            <div className="theme-sidebar"></div>
                                            <div className="theme-content"></div>
                                        </div>
                                        <div className="theme-name">Auto</div>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h4>Display Options</h4>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Compact Mode</div>
                                            <div className="setting-description">Reduce spacing for denser layout</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={appearanceSettings.compactMode}
                                                onChange={(e) => updateAppearanceSetting('compactMode', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Animations</div>
                                            <div className="setting-description">Enable UI animations and transitions</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={appearanceSettings.animations}
                                                onChange={(e) => updateAppearanceSetting('animations', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Sound Effects</div>
                                            <div className="setting-description">Play sounds for actions</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={appearanceSettings.soundEffects}
                                                onChange={(e) => updateAppearanceSetting('soundEffects', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Font Size</label>
                                    <select
                                        value={appearanceSettings.fontSize}
                                        onChange={(e) => updateAppearanceSetting('fontSize', e.target.value)}
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations */}
                    {activeTab === 'integrations' && (
                        <div className="settings-section">
                            <h3>Integrations</h3>
                            <p className="section-description">Connect your favorite tools and services</p>

                            <div className="integrations-grid">
                                {integrations.map((integration, index) => (
                                    <div key={index} className="integration-card">
                                        <div className="integration-header">
                                            <div className="integration-icon" style={{ color: integration.color }}>
                                                <i className={`fab ${integration.icon}`}></i>
                                            </div>
                                            <div className="integration-info">
                                                <h4>{integration.name}</h4>
                                                <span className={`status ${integration.connected ? 'connected' : 'disconnected'}`}>
                                                    {integration.connected ? 'Connected' : 'Not Connected'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className={`btn ${integration.connected ? 'btn-outline-danger' : 'btn-primary'}`}
                                            onClick={() => toggleIntegration(integration.name)}
                                        >
                                            {integration.connected ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subscription */}
                    {activeTab === 'subscription' && (
                        <div className="settings-section">
                            <h3>Subscription & Billing</h3>
                            <p className="section-description">Manage your subscription plan</p>

                            <div className="current-plan-card">
                                <div className="plan-badge">Current Plan</div>
                                <h2>Free Plan</h2>
                                <div className="plan-price">$0<span>/month</span></div>
                                <ul className="plan-features">
                                    <li><i className="fas fa-check"></i> 5 job applications per month</li>
                                    <li><i className="fas fa-check"></i> Basic interview practice</li>
                                    <li><i className="fas fa-check"></i> Standard support</li>
                                    <li><i className="fas fa-times"></i> Priority job listings</li>
                                    <li><i className="fas fa-times"></i> Advanced analytics</li>
                                </ul>
                                <button className="btn btn-primary btn-lg">
                                    Upgrade to Premium
                                </button>
                            </div>

                            <div className="pricing-grid">
                                <div className="pricing-card">
                                    <h3>Pro</h3>
                                    <div className="price">$19<span>/month</span></div>
                                    <ul className="features">
                                        <li><i className="fas fa-check"></i> Unlimited applications</li>
                                        <li><i className="fas fa-check"></i> Advanced practice</li>
                                        <li><i className="fas fa-check"></i> Priority support</li>
                                        <li><i className="fas fa-check"></i> Interview analytics</li>
                                    </ul>
                                    <button className="btn btn-outline-primary">Select Plan</button>
                                </div>
                                <div className="pricing-card featured">
                                    <div className="popular-badge">Most Popular</div>
                                    <h3>Premium</h3>
                                    <div className="price">$39<span>/month</span></div>
                                    <ul className="features">
                                        <li><i className="fas fa-check"></i> Everything in Pro</li>
                                        <li><i className="fas fa-check"></i> Resume building</li>
                                        <li><i className="fas fa-check"></i> 1-on-1 coaching</li>
                                        <li><i className="fas fa-check"></i> Career roadmap</li>
                                    </ul>
                                    <button className="btn btn-primary">Select Plan</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Change Password</h3>
                            <button className="close-btn" onClick={() => setShowPasswordModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" placeholder="Enter current password" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="Confirm new password" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header danger">
                            <h3>Delete Account</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="warning-box">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                            </div>
                            <div className="form-group">
                                <label>Type "DELETE" to confirm</label>
                                <input type="text" placeholder="DELETE" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger">
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
