import React, { useState, useEffect } from 'react';
import '../../common/dashboard/Settings.css';
import axios from 'axios';
import Loader from '../../common/Loader';

const Settings = () => {
    const [settings, setSettings] = useState({
        // General Settings
        maintenanceMode: false,
    });

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : null;

            if (!token) return;

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/settings', config);

            if (data.success && data.data) {
                setSettings({
                    maintenanceMode: data.data.maintenanceMode ?? false,
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : null;

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put('http://localhost:5000/api/settings', settings, config);

            if (res.data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordMessage({ type: '', text: '' }), 5000);
            } else {
                setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordMessage({ type: 'error', text: 'Server error changing password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">System Settings</h1>
                    <p className="text-muted">Configure platform core settings</p>
                </div>
                <div className="header-actions">
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

            {/* General Settings */}
            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Access Configuration</h5>
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
                        </div>
                    </div>
                </div>

                {/* Security Section (Change Password) */}
                <div className="col-lg-12">
                    <div className="dashboard-card mb-4">
                        <div className="card-header-custom">
                            <h5 className="card-title mb-0">Security Settings</h5>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handlePasswordChange}>
                                {passwordMessage.text && (
                                    <div className={`alert alert-${passwordMessage.type === 'success' ? 'success' : 'danger'} mb-4`}>
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <div className="form-group mb-3">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-dark"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 form-group mb-3">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-dark"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group mb-3">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-dark"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                    <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
