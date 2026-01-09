import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile data derived from backend
    const [profileData, setProfileData] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        location: '',
        currentRole: '',
        bio: '',
        avatar: '',
        id: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Helper to resolve avatar URL (if we add image upload later)
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith('data:')) return avatarPath;
        if (avatarPath.startsWith('http')) return avatarPath;
        return `http://localhost:5000${avatarPath}`;
    };

    // Fetch Profile on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) return;

                const user = JSON.parse(userStr);
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        username: data.username || '',
                        fullName: data.full_name || data.username || '',
                        email: data.email,
                        phone: data.phone || '',
                        location: data.location || '',
                        currentRole: data.current_role || '',
                        bio: data.bio || '',
                        avatar: data.image_url ? (data.image_url.startsWith('http') || data.image_url.startsWith('data') ? data.image_url : `http://localhost:5000${data.image_url}`) : '',
                        id: data._id
                    });
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

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: reader.result,
                    profileImageFile: file // Store the file object for upload
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            // Construct FormData
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('username', profileData.username); // Add username
            formData.append('full_name', profileData.fullName);
            if (profileData.phone) formData.append('phone', profileData.phone);
            if (profileData.location) formData.append('location', profileData.location);
            if (profileData.currentRole) formData.append('currentRole', profileData.currentRole);
            if (profileData.bio) formData.append('bio', profileData.bio);

            // Append file if selected
            if (profileData.profileImageFile) {
                formData.append('profileImage', profileData.profileImageFile);
            }

            // Send request (no Content-Type header, browser sets it with boundary for FormData)
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);

                // Update local storage if name changed
                // Determine new image URL
                // If backend returns a new URL, use it (and prefix if relative)
                // Otherwise fallback to existing avatar
                let newImageUrl = responseData.profile && responseData.profile.image_url
                    ? responseData.profile.image_url
                    : profileData.avatar;

                if (newImageUrl && newImageUrl.startsWith('/uploads')) {
                    newImageUrl = `http://localhost:5000${newImageUrl}`;
                }

                const updatedUser = {
                    ...user,
                    username: profileData.fullName,
                    image_url: newImageUrl
                };

                if (localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify(updatedUser));
                else sessionStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch event to notify other components (like UserLayout) of the update
                window.dispatchEvent(new Event('userProfileUpdated'));

            } else {
                setMessage({ type: 'error', text: 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'Server error updating profile' });
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: profileData.email,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            console.error('Password change error:', error);
            setMessage({ type: 'error', text: 'Server error changing password' });
        }
    };

    if (loading) return <div className="text-center p-5 text-white">Loading profile...</div>;

    const avatarUrl = getAvatarUrl(profileData.avatar);

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="text-muted">Manage your personal details and account settings</p>
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
                <div className="profile-header-content pt-5">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={profileData.fullName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            ) : (
                                (profileData.fullName.charAt(0) || profileData.username.charAt(0) || 'U').toUpperCase()
                            )}
                        </div>
                        {isEditing && (
                            <label className="btn-change-avatar" htmlFor="avatar-upload">
                                <i className="bi bi-camera"></i>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h2>{profileData.fullName}</h2>
                        <p className="profile-role">{profileData.currentRole || 'Candidate'}</p>
                        <div className="profile-meta">
                            <span><i className="bi bi-envelope"></i> {profileData.email}</span>
                            <span><i className="bi bi-phone"></i> {profileData.phone || 'N/A'}</span>
                            <span><i className="bi bi-geo-alt"></i> {profileData.location || 'N/A'}</span>
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
                </div>

                <div className="profile-tab-content">
                    {/* Personal Info Tab */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane">
                            <div className="profile-section-card">
                                <h5 className="mb-4">General Information</h5>
                                {/* Alert Messages for Profile */}
                                {message.text && activeTab === 'profile' && (
                                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                                        {message.text}
                                    </div>
                                )}
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.username}
                                                onChange={(e) => handleProfileChange('username', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.fullName}
                                                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.email}
                                                readOnly
                                                disabled
                                            />
                                            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-phone"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.phone}
                                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Location</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.location}
                                                onChange={(e) => handleProfileChange('location', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Current Role</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-briefcase"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.currentRole}
                                                onChange={(e) => handleProfileChange('currentRole', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            className="form-control form-control-dark"
                                            rows="4"
                                            value={profileData.bio}
                                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Tell us about yourself..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="tab-pane">
                            <div className="profile-section-card">
                                <h5 className="mb-4">Change Password</h5>
                                {/* Alert Messages for Security */}
                                {message.text && activeTab === 'security' && (
                                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                                        {message.text}
                                    </div>
                                )}
                                <div className="row g-4">
                                    <div className="col-md-12">
                                        <label className="form-label">Current Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-key"></i></span>
                                            <input
                                                type="password"
                                                className="form-control form-control-dark"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">New Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                                            <input
                                                type="password"
                                                className="form-control form-control-dark"
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Confirm New Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-shield-lock-fill"></i></span>
                                            <input
                                                type="password"
                                                className="form-control form-control-dark"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <button className="btn btn-primary" onClick={handleChangePassword}>
                                            <i className="bi bi-check-circle me-2"></i>Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
