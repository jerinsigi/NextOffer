import React, { useState, useEffect } from 'react';
import '../../common/dashboard/Profile.css';
import Loader from '../../common/Loader';

const CompanyProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile data derived from backend
    const [profileData, setProfileData] = useState({
        username: '',
        companyName: '',
        email: '',
        phone: '',
        industry: '',
        location: '',
        website: '',
        description: '',
        logo: '',
        id: ''
    });

    // Selected logo file for upload
    const [selectedLogoFile, setSelectedLogoFile] = useState(null);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Helper to resolve logo URL
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('data:')) return logoPath; // Base64
        if (logoPath.startsWith('http')) return logoPath; // Absolute URL
        return `http://localhost:5000${logoPath}`; // Relative backend path
    };

    // Fetch Profile on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (!userStr) return;

                const user = JSON.parse(userStr);
                const response = await fetch('http://localhost:5000/api/companies/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        username: data.username || '',
                        companyName: data.company_name,
                        email: data.email,
                        phone: data.phone || '',
                        industry: data.industry,
                        location: data.location,
                        website: data.website || '',
                        description: data.company_desc || '',
                        logo: data.logo || '',
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

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store the actual file for upload
            setSelectedLogoFile(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    logo: reader.result // This is just for preview
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            // Use FormData to send file upload
            const formData = new FormData();
            formData.append('email', profileData.email);
            formData.append('company_name', profileData.companyName);
            formData.append('phone', profileData.phone);
            formData.append('industry', profileData.industry);
            formData.append('location', profileData.location);
            formData.append('website', profileData.website);
            formData.append('company_desc', profileData.description);

            // Only append logo if a new file was selected
            if (selectedLogoFile) {
                formData.append('logo', selectedLogoFile);
            }

            const response = await fetch('http://localhost:5000/api/companies/profile/update', {
                method: 'POST',
                body: formData // No Content-Type header - browser will set it with boundary
            });

            if (response.ok) {
                const data = await response.json();
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                setSelectedLogoFile(null); // Clear the selected file

                // Update the profile data with the returned data
                setProfileData(prev => ({
                    ...prev,
                    companyName: data.company.company_name,
                    phone: data.company.phone || '',
                    industry: data.company.industry,
                    location: data.company.location,
                    website: data.company.website || '',
                    description: data.company.company_desc || '',
                    logo: data.company.logo || ''
                }));

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

    if (loading) return <Loader inline />;

    const logoUrl = getLogoUrl(profileData.logo);

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Company Profile</h1>
                    <p className="text-muted">Manage your company details and account settings</p>
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
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={profileData.companyName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            ) : (
                                profileData.companyName.charAt(0).toUpperCase()
                            )}
                        </div>
                        {isEditing && (
                            <label className="btn-change-avatar" htmlFor="logo-upload">
                                <i className="bi bi-camera"></i>
                                <input
                                    type="file"
                                    id="logo-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleLogoUpload}
                                />
                            </label>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h2>{profileData.companyName}</h2>
                        <p className="profile-role">{profileData.industry}</p>
                        <div className="profile-meta">
                            <span><i className="bi bi-envelope"></i> {profileData.email}</span>
                            <span><i className="bi bi-phone"></i> {profileData.phone || 'N/A'}</span>
                            <span><i className="bi bi-geo-alt"></i> {profileData.location}</span>
                            {profileData.website && <span><i className="bi bi-globe"></i> {profileData.website}</span>}
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
                        <i className="bi bi-building"></i>
                        Company Info
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
                    {/* Company Info Tab */}
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
                                            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.username}
                                                readOnly
                                            />
                                            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Company Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-building"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.companyName}
                                                onChange={(e) => handleProfileChange('companyName', e.target.value)}
                                                disabled={!isEditing}
                                            />
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
                                        <label className="form-label">Industry</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-briefcase"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.industry}
                                                onChange={(e) => handleProfileChange('industry', e.target.value)}
                                                disabled={!isEditing}
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
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Website</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-globe"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.website}
                                                onChange={(e) => handleProfileChange('website', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control form-control-dark"
                                            rows="4"
                                            value={profileData.description}
                                            onChange={(e) => handleProfileChange('description', e.target.value)}
                                            disabled={!isEditing}
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

export default CompanyProfile;
