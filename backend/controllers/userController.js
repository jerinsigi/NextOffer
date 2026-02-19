const Candidate = require('../models/Candidate');
const Login = require('../models/Login');
const Interview_Session = require('../models/Interview_Session');
const Integrity_Log = require('../models/Integrity_Log');
const Company = require('../models/Company');

// Get all users for admin
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch only candidates and admin users (exclude company and recruiter)
        const logins = await Login.find({ 
            usertype: { $in: ['candidate', 'admin'] } 
        }).select('-password -otp -otpExpires');
        
        // Fetch all candidates
        const candidates = await Candidate.find();
        
        // Create a map for quick lookup
        const candidateMap = {};
        candidates.forEach(candidate => {
            candidateMap[candidate.email] = candidate;
        });
        
        // Process each user
        const usersData = await Promise.all(logins.map(async (login) => {
            const candidate = candidateMap[login.email];
            
            // Initialize user data object
            let userData = {
                id: login._id,
                email: login.email,
                lastLogin: login.updatedAt,
                joinDate: login.createdAt,
                interviews: 0,
                violationCount: 0
            };
            
            // Determine role display
            let roleDisplay = login.usertype === 'admin' ? 'Admin' : 'Candidate';
            
            // Determine status display
            let statusDisplay = 'Active';
            if (login.status === 'inactive') statusDisplay = 'Inactive';
            else if (login.status === 'pending') statusDisplay = 'Pending';
            else if (login.status === 'suspended') statusDisplay = 'Suspended';
            
            userData.role = roleDisplay;
            userData.status = statusDisplay;
            
            // Populate data based on user type
            if (login.usertype === 'candidate' && candidate) {
                // For candidates, show candidate details
                userData.name = candidate.full_name || login.username;
                userData.company = candidate.current_role || 'N/A';
                userData.phone = candidate.phone || null;
                userData.location = candidate.location || null;
                
                // Get interview count for candidates
                userData.interviews = await Interview_Session.countDocuments({ 
                    fk_candidate_id: candidate._id 
                });
                
                // Get violation count for candidates
                const sessions = await Interview_Session.find({ 
                    fk_candidate_id: candidate._id 
                });
                
                for (const session of sessions) {
                    const integrityLog = await Integrity_Log.findOne({ 
                        Fk_session_id: session._id 
                    });
                    
                    if (integrityLog) {
                        userData.violationCount += (
                            (integrityLog.tab_switch_count || 0) +
                            (integrityLog.gaze_away_count || 0) +
                            (integrityLog.face_absent_count || 0)
                        );
                    }
                }
            } else if ((login.usertype === 'company' || login.usertype === 'recruiter') && company) {
                // For companies/recruiters, show company details
                userData.name = company.company_name || login.username;
                userData.company = company.company_name || 'N/A';
                userData.phone = company.phone || null;
                userData.location = company.location || null;
            } else {
                // For users without associated candidate/company record (like admin)
                userData.name = login.username;
                userData.company = 'N/A';
                userData.phone = null;
                userData.location = null;
            }
            
            return userData;
        }));
        
        // Calculate statistics
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const statistics = {
            total: logins.length,
            active: logins.filter(l => l.status === 'active').length,
            suspended: logins.filter(l => l.status === 'suspended' || l.status === 'inactive').length,
            newThisMonth: logins.filter(l => new Date(l.createdAt) >= startOfMonth).length
        };
        
        res.json({
            users: usersData,
            statistics: statistics
        });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ message: 'Server error fetching users', error: err.message });
    }
};

// Suspend user
exports.suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const login = await Login.findByIdAndUpdate(
            userId,
            { status: 'suspended' },
            { new: true }
        );
        
        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User suspended successfully', user: login });
    } catch (err) {
        console.error('Suspend user error:', err);
        res.status(500).json({ message: 'Server error suspending user', error: err.message });
    }
};

// Activate user
exports.activateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const login = await Login.findByIdAndUpdate(
            userId,
            { status: 'active' },
            { new: true }
        );
        
        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User activated successfully', user: login });
    } catch (err) {
        console.error('Activate user error:', err);
        res.status(500).json({ message: 'Server error activating user', error: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const login = await Login.findById(userId);
        
        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete related candidate data if exists
        await Candidate.findOneAndDelete({ email: login.email });
        
        // Delete the login
        await Login.findByIdAndDelete(userId);
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Server error deleting user', error: err.message });
    }
};

// Reset password (send reset email)
exports.resetUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const login = await Login.findById(userId);
        
        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // TODO: Implement email sending logic here
        // For now, just return success
        
        res.json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error resetting password', error: err.message });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find login info
        const login = await Login.findOne({ email }).select('-password -otp -otpExpires');
        if (!login) {
            return res.status(404).json({ message: 'User account not found' });
        }

        // Find candidate details
        let candidate = await Candidate.findOne({ email });

        // If candidate record doesn't exist but login does (rare inconsistencies), treat as new/empty profile
        if (!candidate) {
            candidate = {};
        }

        // Merge data
        const profileData = {
            ...candidate._doc,
            username: login.username,
            usertype: login.usertype,
            status: login.status
        };

        res.json(profileData);
    } catch (err) {
        console.error('Get user profile error:', err);
        res.status(500).json({ message: 'Server error retrieving profile', error: err.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { email, full_name, username, phone, education, experience_years, location, currentRole, bio, skills, social_links } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find login to verify user exists
        const login = await Login.findOne({ email });
        if (!login) {
            return res.status(404).json({ message: 'User account not found' });
        }

        // Update Login username if provided
        if (username && login.username !== username) {
            login.username = username;
            await login.save();
        } else if (full_name && !username && login.username !== full_name) {
            // Fallback: if no username provided, sync with full_name (optional, keeping for backward compatibility)
            login.username = full_name;
            await login.save();
        }

        // Prepare update data
        const updateData = {
            full_name: full_name || login.username,
            email: email,
        };

        // Helper to parse JSON strings from FormData if valid JSON
        const safeParse = (str) => {
            try { return JSON.parse(str); } catch (e) { return str; }
        };

        if (phone) updateData.phone = phone;
        if (education) updateData.education = education;
        if (experience_years) updateData.experience_years = experience_years;
        if (location) updateData.location = location;
        if (currentRole) updateData.current_role = currentRole;
        if (bio) updateData.bio = bio;

        // Handle skills and social_links if passed as JSON strings via FormData
        if (skills) updateData.skills = typeof skills === 'string' ? safeParse(skills) : skills;
        if (social_links) updateData.social_links = typeof social_links === 'string' ? safeParse(social_links) : social_links;

        // Handle File Upload
        if (req.files) {
            // Handle profile image
            if (req.files.profileImage) {
                updateData.image_url = '/upload/' + req.files.profileImage[0].filename;
            }
        }

        // Use findOneAndUpdate with upsert
        const updatedCandidate = await Candidate.findOneAndUpdate(
            { email: email },
            { $set: updateData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({
            message: 'Profile updated successfully',
            profile: {
                ...updatedCandidate._doc,
                username: login.username
            }
        });

    } catch (err) {
        console.error('Update user profile error:', err);
        res.status(500).json({ message: 'Server error updating profile', error: err.message });
    }
};
