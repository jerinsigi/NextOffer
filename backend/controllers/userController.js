const Candidate = require('../models/Candidate');
const Login = require('../models/Login');

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

        // Handle File Uploads
        if (req.files) {
            // Handle profile image
            if (req.files.profileImage) {
                updateData.image_url = '/uploads/' + req.files.profileImage[0].filename;
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
