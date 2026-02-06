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
        id: '',
        education: '',
        experienceYears: 0,
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: ''
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Skills state
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({
        name: '',
        level: 'Beginner',
        years: 0
    });
    const [editingSkillIndex, setEditingSkillIndex] = useState(null);
    const [skillSearchTerm, setSkillSearchTerm] = useState('');
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);

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
                        id: data._id,
                        education: data.education || '',
                        experienceYears: data.experience_years || 0,
                        socialLinks: {
                            linkedin: data.social_links?.linkedin || '',
                            github: data.social_links?.github || '',
                            portfolio: data.social_links?.portfolio || ''
                        }
                    });
                    // Load user's skills
                    setSkills(data.skills || []);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Fetch available skills from database for autocomplete
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/skills');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableSkills(data);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        fetchSkills();
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
            if (profileData.education) formData.append('education', profileData.education);
            if (profileData.experienceYears) formData.append('experience_years', profileData.experienceYears);
            if (profileData.socialLinks) {
                formData.append('social_links', JSON.stringify(profileData.socialLinks));
            }

            // Add skills as JSON string
            if (skills && skills.length > 0) {
                formData.append('skills', JSON.stringify(skills));
            }

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

    // Skills Management Handlers
    const handleAddSkill = async () => {
        if (!newSkill.name || !newSkill.level) {
            setMessage({ type: 'error', text: 'Please select a skill and level' });
            return;
        }

        // Check if skill already exists
        if (skills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
            setMessage({ type: 'error', text: 'This skill is already added' });
            return;
        }

        const updatedSkills = [...skills, { ...newSkill }];
        setSkills(updatedSkills);

        // Save to backend immediately
        await saveSkillsToBackend(updatedSkills);

        // Reset form
        setNewSkill({ name: '', level: 'Beginner', years: 0 });
        setSkillSearchTerm('');
        setShowSkillDropdown(false);
        setMessage({ type: 'success', text: 'Skill added successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleEditSkill = (index) => {
        setEditingSkillIndex(index);
        setNewSkill({ ...skills[index] });
    };

    const handleUpdateSkill = async () => {
        if (editingSkillIndex === null) return;

        const updatedSkills = [...skills];
        updatedSkills[editingSkillIndex] = { ...newSkill };
        setSkills(updatedSkills);

        // Save to backend
        await saveSkillsToBackend(updatedSkills);

        // Reset form
        setEditingSkillIndex(null);
        setNewSkill({ name: '', level: 'Beginner', years: 0 });
        setMessage({ type: 'success', text: 'Skill updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDeleteSkill = async (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);

        // Save to backend
        await saveSkillsToBackend(updatedSkills);

        setMessage({ type: 'success', text: 'Skill deleted successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleCancelEdit = () => {
        setEditingSkillIndex(null);
        setNewSkill({ name: '', level: 'Beginner', years: 0 });
    };

    const saveSkillsToBackend = async (skillsToSave) => {
        try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('skills', JSON.stringify(skillsToSave));

            await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                body: formData
            });
        } catch (error) {
            console.error('Error saving skills:', error);
        }
    };

    const handleSkillSearch = (value) => {
        setSkillSearchTerm(value);
        setShowSkillDropdown(value.length > 0);
        setNewSkill({ ...newSkill, name: value });
    };

    const handleSelectSkill = (skillName) => {
        setNewSkill({ ...newSkill, name: skillName });
        setSkillSearchTerm(skillName);
        setShowSkillDropdown(false);
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
        skill.status === 'Active'
    );

    const getSkillLevelBadgeClass = (level) => {
        switch (level) {
            case 'Beginner':
                return 'bg-info';
            case 'Intermediate':
                return 'bg-primary';
            case 'Advanced':
                return 'bg-warning';
            case 'Expert':
                return 'bg-success';
            default:
                return 'bg-secondary';
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
                            {profileData.experienceYears > 0 && (
                                <span><i className="bi bi-briefcase-fill"></i> {profileData.experienceYears} years exp</span>
                            )}
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
                        className={`profile-tab ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        <i className="bi bi-stars"></i>
                        Skills
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
                                    <div className="col-md-6">
                                        <label className="form-label">Education</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-mortarboard"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-dark"
                                                value={profileData.education}
                                                onChange={(e) => handleProfileChange('education', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="e.g. BS Computer Science"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Years of Experience</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                                            <input
                                                type="number"
                                                className="form-control form-control-dark"
                                                value={profileData.experienceYears}
                                                onChange={(e) => handleProfileChange('experienceYears', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                placeholder="Years"
                                                min="0"
                                                max="50"
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
                                    <div className="col-12">
                                        <h6 className="mt-4 mb-3 text-white">Social Links</h6>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">LinkedIn</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-linkedin"></i></span>
                                            <input
                                                type="url"
                                                className="form-control form-control-dark"
                                                value={profileData.socialLinks.linkedin}
                                                onChange={(e) => handleProfileChange('socialLinks', { ...profileData.socialLinks, linkedin: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="LinkedIn profile URL"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">GitHub</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-github"></i></span>
                                            <input
                                                type="url"
                                                className="form-control form-control-dark"
                                                value={profileData.socialLinks.github}
                                                onChange={(e) => handleProfileChange('socialLinks', { ...profileData.socialLinks, github: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="GitHub profile URL"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Portfolio</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-globe"></i></span>
                                            <input
                                                type="url"
                                                className="form-control form-control-dark"
                                                value={profileData.socialLinks.portfolio}
                                                onChange={(e) => handleProfileChange('socialLinks', { ...profileData.socialLinks, portfolio: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="Portfolio website URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="tab-pane">
                            <div className="profile-section-card">
                                <h5 className="mb-4">My Skills</h5>
                                {/* Alert Messages for Skills */}
                                {message.text && activeTab === 'skills' && (
                                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                                        {message.text}
                                    </div>
                                )}

                                {/* Display Existing Skills */}
                                {skills.length > 0 && (
                                    <div className="row g-3 mb-4">
                                        {skills.map((skill, index) => (
                                            <div key={index} className="col-md-6 col-lg-4">
                                                <div className="skill-card">
                                                    <div className="skill-card-header">
                                                        <h6 className="skill-name">
                                                            <i className="bi bi-stars me-2"></i>
                                                            {skill.name}
                                                        </h6>
                                                        <div className="skill-actions">
                                                            <button
                                                                className="btn-skill-action"
                                                                onClick={() => handleEditSkill(index)}
                                                                title="Edit"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn-skill-action text-danger"
                                                                onClick={() => handleDeleteSkill(index)}
                                                                title="Delete"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="skill-card-body">
                                                        <span className={`badge ${getSkillLevelBadgeClass(skill.level)} me-2`}>
                                                            {skill.level}
                                                        </span>
                                                        <span className="skill-years">
                                                            <i className="bi bi-clock-history me-1"></i>
                                                            {skill.years} {skill.years === 1 ? 'year' : 'years'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {skills.length === 0 && (
                                    <div className="text-center text-muted py-4 mb-4">
                                        <i className="bi bi-stars" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                        <p className="mt-2">No skills added yet. Add your first skill below!</p>
                                    </div>
                                )}

                                {/* Add/Edit Skill Form */}
                                <div className="add-skill-form">
                                    <h6 className="mb-3">
                                        {editingSkillIndex !== null ? 'Edit Skill' : 'Add New Skill'}
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Skill Name</label>
                                            <div className="autocomplete-wrapper" style={{ position: 'relative' }}>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-search"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-dark"
                                                        value={skillSearchTerm || newSkill.name}
                                                        onChange={(e) => handleSkillSearch(e.target.value)}
                                                        onFocus={() => setShowSkillDropdown(skillSearchTerm.length > 0)}
                                                        placeholder="Search or type skill name"
                                                        disabled={editingSkillIndex !== null}
                                                    />
                                                </div>
                                                {showSkillDropdown && filteredSkills.length > 0 && (
                                                    <div className="skills-dropdown">
                                                        {filteredSkills.slice(0, 10).map((skill, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="skills-dropdown-item"
                                                                onClick={() => handleSelectSkill(skill.name)}
                                                            >
                                                                <i className={skill.icon || 'bi bi-stars'}></i>
                                                                <span>{skill.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Skill Level</label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-bar-chart"></i>
                                                </span>
                                                <select
                                                    className="form-control form-control-dark"
                                                    value={newSkill.level}
                                                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Years of Experience</label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-calendar"></i>
                                                </span>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-dark"
                                                    value={newSkill.years}
                                                    onChange={(e) => setNewSkill({ ...newSkill, years: parseInt(e.target.value) || 0 })}
                                                    min="0"
                                                    max="50"
                                                    placeholder="Years"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        {editingSkillIndex !== null ? (
                                            <>
                                                <button className="btn btn-primary me-2" onClick={handleUpdateSkill}>
                                                    <i className="bi bi-check-circle me-2"></i>Update Skill
                                                </button>
                                                <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                                                    <i className="bi bi-x-circle me-2"></i>Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-primary" onClick={handleAddSkill}>
                                                <i className="bi bi-plus-circle me-2"></i>Add Skill
                                            </button>
                                        )}
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
