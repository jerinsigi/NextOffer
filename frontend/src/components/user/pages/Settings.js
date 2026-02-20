import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../common/dashboard/Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
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
            } else {
                setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordMessage({ type: 'error', text: 'Server error changing password' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Clear local storage and redirect to login/home
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                navigate('/login');
            } else {
                alert('Failed to delete account. Please try again.');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            alert('Server error deleting account');
        }
    };

    return (
        <div className="settings-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <i className="bi bi-gear-fill me-2"></i>
                        Settings
                    </h2>
                    <p className="text-muted">Manage your account security and preferences</p>
                </div>
            </div>

            <div className="settings-content-single">
                {/* Security Section */}
                <div className="settings-section">
                    <h3>Security</h3>
                    <p className="section-description">Update your password to keep your account secure</p>

                    <div className="settings-card">
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
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section mt-5">
                    <h3 className="text-danger">Danger Zone</h3>
                    <p className="section-description">Irreversible account actions</p>

                    <div className="settings-card danger-zone">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4>Delete Account</h4>
                                <p className="mb-0 text-muted">Thinking of leaving? This will permanently delete your account and all data.</p>
                            </div>
                            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header danger">
                            <h3>Delete Account</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="warning-box">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <p>This action cannot be undone. This will permanently delete your account, applications, and interview data.</p>
                            </div>
                            <p>To confirm, please type <strong>DELETE</strong> below:</p>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-dark"
                                    placeholder="DELETE"
                                    id="delete-confirmation"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    const input = document.getElementById('delete-confirmation');
                                    if (input.value === 'DELETE') {
                                        handleDeleteAccount();
                                    } else {
                                        alert('Please type DELETE to confirm.');
                                    }
                                }}
                            >
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
