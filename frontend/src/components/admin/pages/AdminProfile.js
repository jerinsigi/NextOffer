import React, { useState } from 'react';
import './AdminProfile.css';

const AdminProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    
    // Profile data
    const [profileData, setProfileData] = useState({
        firstName: 'Vivek',
        lastName: 'Kumar',
        email: 'vivek.kumar@nextoffer.com',
        phone: '+91 98765 43210',
        role: 'Super Admin',
        department: 'System Administration',
        employeeId: 'ADM-2024-001',
        joinDate: '2024-01-15',
        timezone: 'Asia/Kolkata',
        language: 'English (US)',
        avatar: 'VK'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        violationAlerts: true,
        weeklyReports: true,
        systemUpdates: true,
        darkMode: true,
        compactView: false,
        autoRefresh: true,
        refreshInterval: '30'
    });

    // Activity logs
    const activityLogs = [
        {
            id: 1,
            action: 'Updated compliance rule settings',
            timestamp: '2024-12-06 10:30 AM',
            details: 'Modified tab switching threshold',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            id: 2,
            action: 'Reviewed integrity violation',
            timestamp: '2024-12-06 09:15 AM',
            details: 'Dismissed violation ID #003',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            id: 3,
            action: 'Added new user',
            timestamp: '2024-12-05 04:20 PM',
            details: 'Created account for John Doe',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            id: 4,
            action: 'Generated analytics report',
            timestamp: '2024-12-05 02:10 PM',
            details: 'Exported interview data for November',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            id: 5,
            action: 'Updated job posting',
            timestamp: '2024-12-05 11:30 AM',
            details: 'Modified Senior Developer position',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            id: 6,
            action: 'Login successful',
            timestamp: '2024-12-05 08:00 AM',
            details: 'Logged in from office network',
            ipAddress: '192.168.1.100',
            device: 'Chrome on Windows'
        }
    ];

    // Sessions
    const activeSessions = [
        {
            id: 1,
            device: 'Chrome on Windows',
            location: 'New York, USA',
            ipAddress: '192.168.1.100',
            lastActive: '2024-12-06 10:45 AM',
            current: true
        },
        {
            id: 2,
            device: 'Safari on iPhone',
            location: 'New York, USA',
            ipAddress: '192.168.1.105',
            lastActive: '2024-12-05 08:30 PM',
            current: false
        }
    ];

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePreferenceChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProfile = () => {
        console.log('Saving profile:', profileData);
        setIsEditing(false);
        alert('Profile updated successfully');
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        console.log('Changing password');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        alert('Password changed successfully');
    };

    const handleSavePreferences = () => {
        console.log('Saving preferences:', preferences);
        alert('Preferences saved successfully');
    };

    const handleRevokeSession = (sessionId) => {
        console.log('Revoking session:', sessionId);
        alert('Session revoked successfully');
    };

    const handleDownloadData = () => {
        console.log('Downloading account data');
        alert('Account data download started. You will receive an email when ready.');
    };

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Admin Profile</h1>
                    <p className="text-muted">Manage your account settings and preferences</p>
                </div>
                <div className="header-actions">
                    {activeTab === 'profile' && (
                        isEditing ? (
                            <>
                                <button className="btn btn-outline-secondary me-2" onClick={() => setIsEditing(false)}>
                                    <i className="bi bi-x-circle me-2"></i>Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveProfile}>
                                    <i className="bi bi-check-circle me-2"></i>Save Changes
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                <i className="bi bi-pencil me-2"></i>Edit Profile
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="profile-header-card mb-4">
                <div className="profile-banner"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">{profileData.avatar}</div>
                        <button className="btn-change-avatar">
                            <i className="bi bi-camera"></i>
                        </button>
                    </div>
                    <div className="profile-header-info">
                        <h2>{profileData.firstName} {profileData.lastName}</h2>
                        <p className="profile-role">{profileData.role}</p>
                        <div className="profile-meta">
                            <span><i className="bi bi-envelope"></i> {profileData.email}</span>
                            <span><i className="bi bi-telephone"></i> {profileData.phone}</span>
                            <span><i className="bi bi-calendar"></i> Joined {profileData.joinDate}</span>
                        </div>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <div className="stat-value">156</div>
                            <div className="stat-label">Actions Today</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">1,247</div>
                            <div className="stat-label">Total Actions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-card">
                <div className="profile-tabs">
                    <button 
                        className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="bi bi-person"></i>
                        Personal Info
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="bi bi-shield-lock"></i>
                        Security
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <i className="bi bi-sliders"></i>
                        Preferences
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        <i className="bi bi-clock-history"></i>
                        Activity Log
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'sessions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <i className="bi bi-pc-display"></i>
                        Sessions
                    </button>
                </div>

                <div className="profile-tab-content">
                    {/* Personal Info Tab */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane">
                            <div className="profile-form">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.firstName}
                                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.lastName}
                                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control-dark"
                                            value={profileData.email}
                                            onChange={(e) => handleProfileChange('email', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control-dark"
                                            value={profileData.phone}
                                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Role</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.role}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Department</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.department}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Employee ID</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.employeeId}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Join Date</label>
                                        <input
                                            type="text"
                                            className="form-control-dark"
                                            value={profileData.joinDate}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Timezone</label>
                                        <select
                                            className="form-select-dark"
                                            value={profileData.timezone}
                                            onChange={(e) => handleProfileChange('timezone', e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Language</label>
                                        <select
                                            className="form-select-dark"
                                            value={profileData.language}
                                            onChange={(e) => handleProfileChange('language', e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="English (US)">English (US)</option>
                                            <option value="English (UK)">English (UK)</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="tab-pane">
                            <div className="security-section">
                                <h5>Change Password</h5>
                                <div className="row g-4">
                                    <div className="col-md-12">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control-dark"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control-dark"
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control-dark"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <button className="btn btn-primary" onClick={handleChangePassword}>
                                            <i className="bi bi-key me-2"></i>Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="security-section">
                                <h5>Two-Factor Authentication</h5>
                                <div className="tfa-card">
                                    <div className="tfa-info">
                                        <i className="bi bi-shield-check text-success"></i>
                                        <div>
                                            <h6>Two-Factor Authentication Enabled</h6>
                                            <p>Your account is protected with 2FA via authenticator app</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-danger">
                                        Disable 2FA
                                    </button>
                                </div>
                            </div>

                            <div className="security-section">
                                <h5>Account Security</h5>
                                <div className="security-options">
                                    <div className="security-option">
                                        <div>
                                            <h6>Download Account Data</h6>
                                            <p>Export all your account data and activity</p>
                                        </div>
                                        <button className="btn btn-outline-primary" onClick={handleDownloadData}>
                                            <i className="bi bi-download me-2"></i>Download
                                        </button>
                                    </div>
                                    <div className="security-option">
                                        <div>
                                            <h6>Delete Account</h6>
                                            <p>Permanently delete your account and all data</p>
                                        </div>
                                        <button className="btn btn-outline-danger">
                                            <i className="bi bi-trash me-2"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="tab-pane">
                            <div className="preferences-section">
                                <h5>Notification Preferences</h5>
                                <div className="preferences-list">
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Email Notifications</h6>
                                            <p>Receive email updates about system activities</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>SMS Notifications</h6>
                                            <p>Get critical alerts via text message</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.smsNotifications}
                                                onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Violation Alerts</h6>
                                            <p>Get notified of new integrity violations</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.violationAlerts}
                                                onChange={(e) => handlePreferenceChange('violationAlerts', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Weekly Reports</h6>
                                            <p>Receive weekly summary reports</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.weeklyReports}
                                                onChange={(e) => handlePreferenceChange('weeklyReports', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>System Updates</h6>
                                            <p>Get notified about platform updates</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.systemUpdates}
                                                onChange={(e) => handlePreferenceChange('systemUpdates', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="preferences-section">
                                <h5>Display Preferences</h5>
                                <div className="preferences-list">
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Dark Mode</h6>
                                            <p>Use dark theme for the interface</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.darkMode}
                                                onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Compact View</h6>
                                            <p>Show more information in less space</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.compactView}
                                                onChange={(e) => handlePreferenceChange('compactView', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info">
                                            <h6>Auto Refresh</h6>
                                            <p>Automatically refresh data on dashboard</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={preferences.autoRefresh}
                                                onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    {preferences.autoRefresh && (
                                        <div className="preference-item">
                                            <div className="preference-info">
                                                <h6>Refresh Interval</h6>
                                                <p>How often to refresh data (seconds)</p>
                                            </div>
                                            <select
                                                className="form-select-dark"
                                                value={preferences.refreshInterval}
                                                onChange={(e) => handlePreferenceChange('refreshInterval', e.target.value)}
                                                style={{ width: '150px' }}
                                            >
                                                <option value="15">15 seconds</option>
                                                <option value="30">30 seconds</option>
                                                <option value="60">1 minute</option>
                                                <option value="300">5 minutes</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="preferences-section">
                                <button className="btn btn-primary" onClick={handleSavePreferences}>
                                    <i className="bi bi-check-circle me-2"></i>Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity' && (
                        <div className="tab-pane">
                            <div className="activity-log">
                                {activityLogs.map(log => (
                                    <div key={log.id} className="activity-item">
                                        <div className="activity-icon">
                                            <i className="bi bi-circle-fill"></i>
                                        </div>
                                        <div className="activity-content">
                                            <h6>{log.action}</h6>
                                            <p>{log.details}</p>
                                            <div className="activity-meta">
                                                <span><i className="bi bi-clock"></i> {log.timestamp}</span>
                                                <span><i className="bi bi-geo-alt"></i> {log.ipAddress}</span>
                                                <span><i className="bi bi-pc-display"></i> {log.device}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sessions Tab */}
                    {activeTab === 'sessions' && (
                        <div className="tab-pane">
                            <div className="sessions-list">
                                {activeSessions.map(session => (
                                    <div key={session.id} className="session-card">
                                        <div className="session-icon">
                                            <i className="bi bi-pc-display fs-2"></i>
                                        </div>
                                        <div className="session-info">
                                            <h6>{session.device}</h6>
                                            <p className="session-location">
                                                <i className="bi bi-geo-alt"></i> {session.location}
                                            </p>
                                            <div className="session-meta">
                                                <span>IP: {session.ipAddress}</span>
                                                <span>Last active: {session.lastActive}</span>
                                            </div>
                                            {session.current && (
                                                <span className="current-session-badge">Current Session</span>
                                            )}
                                        </div>
                                        {!session.current && (
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleRevokeSession(session.id)}
                                            >
                                                <i className="bi bi-x-circle me-2"></i>Revoke
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
