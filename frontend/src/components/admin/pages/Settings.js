import React, { useState, useEffect } from 'react';
import '../../common/dashboard/Settings.css';
import axios from 'axios';

const Settings = () => {
    const [settings, setSettings] = useState({
        // General Settings
        maintenanceMode: false,
    });

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
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
            </div>
        </div>
    );
};

export default Settings;
