import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    
    // Profile data
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 234 567 8900',
        location: 'New York, USA',
        currentRole: 'Senior Software Developer',
        experience: '5 years',
        expectedSalary: '$120,000 - $150,000',
        noticePeriod: '30 days',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        portfolio: 'johndoe.dev',
        bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
        avatar: 'JD'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: true,
        jobAlerts: true,
        interviewReminders: true,
        applicationUpdates: true,
        practiceReminders: false,
        weeklyDigest: true,
        marketingEmails: false
    });

    // Skills
    const [skills, setSkills] = useState([
        { id: 1, name: 'JavaScript', level: 'Expert', years: 5 },
        { id: 2, name: 'React', level: 'Expert', years: 4 },
        { id: 3, name: 'Node.js', level: 'Advanced', years: 4 },
        { id: 4, name: 'Python', level: 'Intermediate', years: 2 },
        { id: 5, name: 'MongoDB', level: 'Advanced', years: 3 },
        { id: 6, name: 'AWS', level: 'Intermediate', years: 2 }
    ]);

    const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', years: 0 });

    // Experience
    const [experience, setExperience] = useState([
        {
            id: 1,
            title: 'Senior Software Developer',
            company: 'TechCorp Inc.',
            location: 'New York, USA',
            startDate: '2021-06',
            endDate: 'Present',
            current: true,
            description: 'Leading development of microservices architecture and mentoring junior developers.'
        },
        {
            id: 2,
            title: 'Software Developer',
            company: 'StartupXYZ',
            location: 'San Francisco, USA',
            startDate: '2019-01',
            endDate: '2021-05',
            current: false,
            description: 'Developed and maintained full-stack web applications using React and Node.js.'
        }
    ]);

    // Education
    const [education, setEducation] = useState([
        {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            location: 'New York, USA',
            startDate: '2015',
            endDate: '2019',
            grade: '3.8 GPA'
        }
    ]);

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

    const handleAddSkill = () => {
        if (newSkill.name.trim()) {
            setSkills([...skills, { id: Date.now(), ...newSkill }]);
            setNewSkill({ name: '', level: 'Beginner', years: 0 });
        }
    };

    const handleRemoveSkill = (id) => {
        setSkills(skills.filter(skill => skill.id !== id));
    };

    return (
        <div className="user-profile-container">
            {/* Profile Header Card */}
            <div className="profile-header-card mb-4">
                <div className="profile-banner"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {profileData.avatar}
                        </div>
                        <button className="btn-change-avatar">
                            <i className="bi bi-camera"></i>
                        </button>
                    </div>
                    <div className="profile-header-info">
                        <h2>{profileData.firstName} {profileData.lastName}</h2>
                        <p className="profile-role">{profileData.currentRole}</p>
                        <div className="profile-meta">
                            <span><i className="bi bi-geo-alt"></i> {profileData.location}</span>
                            <span><i className="bi bi-briefcase"></i> {profileData.experience} experience</span>
                            <span><i className="bi bi-envelope"></i> {profileData.email}</span>
                            <span><i className="bi bi-telephone"></i> {profileData.phone}</span>
                        </div>
                    </div>
                    <div className="profile-header-actions">
                        {!isEditing ? (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                <i className="bi bi-pencil me-2"></i>Edit Profile
                            </button>
                        ) : (
                            <>
                                <button className="btn btn-success" onClick={handleSaveProfile}>
                                    <i className="bi bi-check-lg me-2"></i>Save
                                </button>
                                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                    <i className="bi bi-x-lg me-2"></i>Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Profile Stats */}
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">12</div>
                        <div className="stat-label">Applications</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">5</div>
                        <div className="stat-label">Interviews</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">78%</div>
                        <div className="stat-label">Avg Score</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">24</div>
                        <div className="stat-label">Practice Sessions</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs-container">
                <div className="profile-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="bi bi-person me-2"></i>Personal Info
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resume')}
                    >
                        <i className="bi bi-file-earmark-text me-2"></i>Resume & Skills
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="bi bi-shield-lock me-2"></i>Security
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <i className="bi bi-gear me-2"></i>Preferences
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Personal Info Tab */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.firstName}
                                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.lastName}
                                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={profileData.email}
                                            onChange={(e) => handleProfileChange('email', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={profileData.phone}
                                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.location}
                                            onChange={(e) => handleProfileChange('location', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Current Role</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.currentRole}
                                            onChange={(e) => handleProfileChange('currentRole', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Total Experience</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.experience}
                                            onChange={(e) => handleProfileChange('experience', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Expected Salary</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.expectedSalary}
                                            onChange={(e) => handleProfileChange('expectedSalary', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Notice Period</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.noticePeriod}
                                            onChange={(e) => handleProfileChange('noticePeriod', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>LinkedIn</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.linkedin}
                                            onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>GitHub</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.github}
                                            onChange={(e) => handleProfileChange('github', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Portfolio</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profileData.portfolio}
                                            onChange={(e) => handleProfileChange('portfolio', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Bio</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={profileData.bio}
                                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                                            disabled={!isEditing}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resume & Skills Tab */}
                    {activeTab === 'resume' && (
                        <div className="tab-pane">
                            {/* Resume Upload */}
                            <div className="section-card mb-4">
                                <h5 className="section-title">
                                    <i className="bi bi-file-earmark-arrow-up me-2"></i>Resume
                                </h5>
                                <div className="resume-upload-area">
                                    <i className="bi bi-cloud-upload fs-1 text-primary mb-3"></i>
                                    <p className="mb-2">Current Resume: <strong>John_Doe_Resume.pdf</strong></p>
                                    <p className="text-muted mb-3">Uploaded on Dec 1, 2025</p>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-outline-primary">
                                            <i className="bi bi-download me-2"></i>Download
                                        </button>
                                        <button className="btn btn-primary">
                                            <i className="bi bi-upload me-2"></i>Upload New
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="section-card mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="section-title mb-0">
                                        <i className="bi bi-code-slash me-2"></i>Skills
                                    </h5>
                                </div>
                                
                                {/* Add New Skill */}
                                <div className="add-skill-form mb-4">
                                    <div className="row g-2">
                                        <div className="col-md-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Skill name"
                                                value={newSkill.name}
                                                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={newSkill.level}
                                                onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Years"
                                                min="0"
                                                value={newSkill.years}
                                                onChange={(e) => setNewSkill({...newSkill, years: parseInt(e.target.value) || 0})}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-primary w-100" onClick={handleAddSkill}>
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills List */}
                                <div className="skills-grid">
                                    {skills.map(skill => (
                                        <div key={skill.id} className="skill-card">
                                            <div className="skill-header">
                                                <h6 className="skill-name">{skill.name}</h6>
                                                <button 
                                                    className="btn-remove-skill"
                                                    onClick={() => handleRemoveSkill(skill.id)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                            <div className="skill-details">
                                                <span className={`skill-level level-${skill.level.toLowerCase()}`}>
                                                    {skill.level}
                                                </span>
                                                <span className="skill-years">{skill.years} years</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="section-card mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="section-title mb-0">
                                        <i className="bi bi-briefcase me-2"></i>Work Experience
                                    </h5>
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="bi bi-plus-lg me-2"></i>Add Experience
                                    </button>
                                </div>
                                <div className="timeline">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="timeline-item">
                                            <div className="timeline-marker"></div>
                                            <div className="timeline-content">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-1">{exp.title}</h6>
                                                        <p className="company-name">
                                                            <i className="bi bi-building me-2"></i>{exp.company}
                                                        </p>
                                                    </div>
                                                    {exp.current && (
                                                        <span className="badge bg-success">Current</span>
                                                    )}
                                                </div>
                                                <p className="text-muted mb-2">
                                                    <i className="bi bi-geo-alt me-2"></i>{exp.location}
                                                </p>
                                                <p className="text-muted mb-2">
                                                    <i className="bi bi-calendar me-2"></i>
                                                    {exp.startDate} - {exp.endDate}
                                                </p>
                                                <p className="experience-description">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            <div className="section-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="section-title mb-0">
                                        <i className="bi bi-mortarboard me-2"></i>Education
                                    </h5>
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="bi bi-plus-lg me-2"></i>Add Education
                                    </button>
                                </div>
                                <div className="education-list">
                                    {education.map(edu => (
                                        <div key={edu.id} className="education-item">
                                            <div className="education-icon">
                                                <i className="bi bi-mortarboard-fill"></i>
                                            </div>
                                            <div className="education-details">
                                                <h6 className="mb-1">{edu.degree}</h6>
                                                <p className="institution-name mb-1">
                                                    <i className="bi bi-building me-2"></i>{edu.institution}
                                                </p>
                                                <p className="text-muted mb-1">
                                                    <i className="bi bi-geo-alt me-2"></i>{edu.location}
                                                </p>
                                                <p className="text-muted mb-1">
                                                    <i className="bi bi-calendar me-2"></i>
                                                    {edu.startDate} - {edu.endDate}
                                                </p>
                                                <p className="text-muted">
                                                    <i className="bi bi-award me-2"></i>{edu.grade}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="tab-pane">
                            <div className="section-card mb-4">
                                <h5 className="section-title">
                                    <i className="bi bi-key me-2"></i>Change Password
                                </h5>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary" onClick={handleChangePassword}>
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <h5 className="section-title">
                                    <i className="bi bi-shield-check me-2"></i>Two-Factor Authentication
                                </h5>
                                <p className="text-muted mb-3">
                                    Add an extra layer of security to your account
                                </p>
                                <button className="btn btn-outline-primary">
                                    <i className="bi bi-shield-plus me-2"></i>Enable 2FA
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="tab-pane">
                            <div className="section-card">
                                <h5 className="section-title">
                                    <i className="bi bi-bell me-2"></i>Notification Preferences
                                </h5>
                                <div className="preferences-list">
                                    <div className="preference-item">
                                        <div>
                                            <h6>Email Notifications</h6>
                                            <p className="text-muted">Receive email updates about your account</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>SMS Notifications</h6>
                                            <p className="text-muted">Receive text messages for important updates</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.smsNotifications}
                                                onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Job Alerts</h6>
                                            <p className="text-muted">Get notified about new job opportunities</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.jobAlerts}
                                                onChange={(e) => handlePreferenceChange('jobAlerts', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Interview Reminders</h6>
                                            <p className="text-muted">Reminders before scheduled interviews</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.interviewReminders}
                                                onChange={(e) => handlePreferenceChange('interviewReminders', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Application Updates</h6>
                                            <p className="text-muted">Status updates for your applications</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.applicationUpdates}
                                                onChange={(e) => handlePreferenceChange('applicationUpdates', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Practice Reminders</h6>
                                            <p className="text-muted">Reminders to complete practice interviews</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.practiceReminders}
                                                onChange={(e) => handlePreferenceChange('practiceReminders', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Weekly Digest</h6>
                                            <p className="text-muted">Weekly summary of your activity</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.weeklyDigest}
                                                onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div>
                                            <h6>Marketing Emails</h6>
                                            <p className="text-muted">Promotional content and offers</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={preferences.marketingEmails}
                                                onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                                            />
                                        </div>
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
