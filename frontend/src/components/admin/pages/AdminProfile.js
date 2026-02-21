import React, { useState, useEffect } from 'react';
import '../../common/dashboard/Profile.css';
import Loader from '../../common/Loader';

const AdminProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [initialUsername, setInitialUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    // Profile data
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        usertype: '',
        status: '',
    });

    // Fetch Profile on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) {
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                // Use the new generic auth profile endpoint
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        username: data.username,
                        email: data.email,
                        usertype: data.usertype,
                        status: data.status,
                        id: data._id
                    });
                    setInitialUsername(data.username || '');
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileChange = (field, value) => {
        if (field === 'username') {
            const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
            setProfileData(prev => ({ ...prev, [field]: sanitized }));
            return;
        }

        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Debounced Username Check
    useEffect(() => {
        const checkUsername = async () => {
            if (!profileData.username || profileData.username === initialUsername) {
                if (!profileData.username) setUsernameError('Username is required');
                else if (profileData.username.length < 3) {
                    setUsernameError('Username must be at least 3 characters');
                    setUsernameAvailable(false);
                } else {
                    setUsernameError('');
                    setUsernameAvailable(true); // Current username is valid
                }
                setIsCheckingUsername(false);
                return;
            }

            if (profileData.username.length < 3) {
                setUsernameError('Username must be at least 3 characters');
                setUsernameAvailable(false);
                setIsCheckingUsername(false);
                return;
            }

            setIsCheckingUsername(true);
            setUsernameAvailable(null); // Reset while checking

            try {
                const response = await fetch('http://localhost:5000/api/auth/check-username', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: profileData.username })
                });
                const data = await response.json();
                if (data.available) {
                    setUsernameError('');
                    setUsernameAvailable(true);
                } else {
                    setUsernameError(data.message || 'Username is taken');
                    setUsernameAvailable(false);
                }
            } catch (error) {
                console.error('Username check error:', error);
                setUsernameError('Error checking username');
                setUsernameAvailable(false);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (profileData.username) {
                if (profileData.username !== initialUsername) setIsCheckingUsername(true);
                checkUsername();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [profileData.username, initialUsername]);

    const handleSaveProfile = async () => {
        if (usernameError) {
            setMessage({ type: 'error', text: 'Please resolve the username error.' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: profileData.id,
                    username: profileData.username,
                    email: profileData.email
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);

                // Update local storage if email/username changed to keep session consistent
                const currentUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...responseData.user };
                    if (localStorage.getItem('user')) {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }

                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.message || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'Server error updating profile' });
        }
    };

    if (loading) return <Loader />;

    // Helper to get initials for avatar
    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'AD';
    };

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Admin Profile</h1>
                    <p className="text-muted">Manage your admin account settings</p>
                </div>
                <div className="header-actions">
                    {isEditing ? (
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
                    )}
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="profile-header-card mb-4">
                <div className="profile-header-content pt-5">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {getInitials(profileData.username)}
                        </div>
                    </div>
                    <div className="profile-header-info">
                        <h2>{profileData.username}</h2>
                        <p className="profile-role">{profileData.usertype ? profileData.usertype.toUpperCase() : 'ADMIN'}</p>
                        <div className="profile-meta">
                            <span><i className="bi bi-envelope"></i> {profileData.email}</span>
                            <span><i className="bi bi-shield-check"></i> Status: <span className="text-success">{profileData.status}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card p-4">
                <h5 className="mb-4">Account Information</h5>
                {/* Alert Messages */}
                {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                        {message.text}
                    </div>
                )}
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label">Username</label>
                        <div className={`input-group ${usernameError ? 'is-invalid' : (usernameAvailable && profileData.username !== initialUsername ? 'is-valid' : '')}`}>
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input
                                type="text"
                                className={`form-control form-control-dark ${usernameError ? 'is-invalid' : (usernameAvailable && profileData.username !== initialUsername ? 'is-valid' : '')}`}
                                value={profileData.username}
                                onChange={(e) => {
                                    handleProfileChange('username', e.target.value);
                                    setIsCheckingUsername(true);
                                }}
                                disabled={!isEditing}
                            />
                        </div>
                        {isCheckingUsername && (
                            <div className="text-secondary mt-1 small">
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Checking availability...
                            </div>
                        )}
                        {usernameAvailable && !usernameError && profileData.username !== initialUsername && !isCheckingUsername && (
                            <div className="valid-feedback d-block text-success mt-1">
                                <i className="bi bi-check-circle me-1"></i> Username is available
                            </div>
                        )}
                        {usernameError && (
                            <div className="invalid-feedback d-block">
                                {usernameError}
                            </div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input
                                type="email"
                                className="form-control form-control-dark"
                                value={profileData.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
