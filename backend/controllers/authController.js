const Login = require('../models/Login');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const bcrypt = require('bcrypt');
const { sendOTP } = require('../utils/emailService');
const { auth: firebaseAuth } = require('../config/firebase');

// Login authentication
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Find user by username or email
        const user = await Login.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Your account is pending admin approval. Please wait for activation.',
                status: 'inactive'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Successful login - return user info (excluding password)
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usertype: user.usertype,
                status: user.status
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        // Find user
        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Register
exports.register = async (req, res) => {
    try {
        const { username, full_name, email, password, usertype, phone, education, experience_years } = req.body;
        let image_url = '';

        if (req.file) {
            image_url = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`;
        }

        // Basic validation
        if (!username || !email || !password || !usertype) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists (by email OR username)
        const existingUser = await Login.findOne({
            $or: [{ email }, { username }]
        });

        // Check if email exists in Company
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Email already registered as a company' });
        }

        if (existingUser) {
            // If user is already active, return error
            if (existingUser.status === 'active') {
                return res.status(400).json({ message: 'User already exists' });
            }

            // If user is pending, update their details and resend OTP
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Generate valid OTP
            const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
            const otpExpires = Date.now() + 10 * 60 * 1000;

            // Update Login record
            existingUser.username = username;
            existingUser.email = email;
            existingUser.password = hashedPassword;
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            existingUser.usertype = usertype; // Ensure usertype is updated if changed

            await existingUser.save();

            // Update Candidate record if applicable
            if (usertype === 'candidate') {
                await Candidate.findOneAndUpdate(
                    { email: email }, // Find by email
                    {
                        full_name: full_name || username, // Use full_name if provided, else fallback to username
                        email: email, // ensure email is consistent
                        phone,
                        education,
                        experience_years,
                        image_url
                    },
                    { upsert: true, new: true } // Create if doesn't exist
                );
            }

            // Send OTP via email
            await sendOTP(email, otp);

            return res.status(200).json({
                message: 'Registration successful. OTP sent to your email.',
                requireOtp: true,
                email: email
            });
        }

        // --- NEW USER CREATION (If not found) ---

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.random().toString(36).substring(2, 8).toUpperCase(); // Alphanumeric 6 chars
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create Login record with pending status and OTP
        const newLogin = new Login({
            username,
            email,
            password: hashedPassword,
            usertype,
            status: 'pending',
            otp,
            otpExpires
        });

        await newLogin.save();

        // Create specific user record based on type
        if (usertype === 'candidate') {
            const newCandidate = new Candidate({
                full_name: full_name || username, // Use full_name if provided, else fallback to username
                email,
                phone,
                education,
                experience_years,
                image_url
            });
            await newCandidate.save();
        }

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(201).json({
            message: 'Registration successful. OTP sent to your email.',
            requireOtp: true,
            email: email
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Missing email or OTP' });
        }

        const user = await Login.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status === 'active') {
            return res.status(200).json({ message: 'Account already active' });
        }

        if (user.otp.trim() !== otp.trim()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Activate user
        user.status = 'active';
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully! You can now login.' });

    } catch (err) {
        console.error('OTP Verification error:', err);
        res.status(500).json({ message: 'Server error during verification', error: err.message });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Login.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status === 'active') {
            return res.status(400).json({ message: 'Account already active' });
        }

        // Generate new OTP
        const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendOTP(email, otp);

        res.json({ message: 'New OTP sent to your email' });

    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide your email' });
        }

        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendOTP(email, otp, 'password-reset');

        res.json({ message: 'OTP sent to your email for password reset' });

    } catch (err) {
        console.error('Forgot Password error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Verify Reset OTP (step 1 of reset)
exports.verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches
        if (user.otp.trim() !== otp.trim()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check expiry
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.json({ message: 'OTP verified successfully' });

    } catch (err) {
        console.error('Verify Reset OTP error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reset Password - Verify OTP and Update Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
        }

        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp.trim() !== otp.trim()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successfully. You can now login.' });

    } catch (err) {
        console.error('Reset Password error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { idToken, email, displayName, photoURL } = req.body;

        if (!idToken || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify Firebase ID token
        let decodedToken;
        try {
            decodedToken = await firebaseAuth.verifyIdToken(idToken);
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            return res.status(401).json({ message: 'Invalid authentication token' });
        }

        // Check if user exists
        const user = await Login.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Account not found. Please register first.',
                requiresRegistration: true
            });
        }

        // Check if account is active
        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Your account is pending admin approval.',
                status: 'inactive'
            });
        }

        // Successful login
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usertype: user.usertype,
                status: user.status
            }
        });

    } catch (err) {
        console.error('Google login error:', err);
        res.status(500).json({ message: 'Server error during Google login', error: err.message });
    }
};

// Google Register
exports.googleRegister = async (req, res) => {
    try {
        const { idToken, email, displayName, photoURL, usertype } = req.body;

        if (!idToken || !email || !displayName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify Firebase ID token
        let decodedToken;
        try {
            decodedToken = await firebaseAuth.verifyIdToken(idToken);
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            return res.status(401).json({ message: 'Invalid authentication token' });
        }

        // Check if user already exists
        const existingUser = await Login.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Account already exists. Please login instead.'
            });
        }

        // Check if email exists in Company
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Email already registered as a company' });
        }

        // Generate a random password (won't be used for Google auth)
        const randomPassword = Math.random().toString(36).substring(2, 15);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Create username from display name or email
        let username = displayName || email.split('@')[0];

        // Check if username exists, if so append random number
        const existingUsername = await Login.findOne({ username });
        if (existingUsername) {
            username = `${username}_${Math.floor(Math.random() * 10000)}`;
        }

        // Create Login record (automatically active for Google users)
        const newLogin = new Login({
            username,
            email,
            password: hashedPassword,
            usertype: usertype || 'candidate',
            status: 'active' // Google users are automatically verified
        });

        await newLogin.save();

        // Create specific user record based on type
        if (usertype === 'candidate') {
            const newCandidate = new Candidate({
                full_name: displayName,
                email,
                phone: '', // Optional for Google sign-up
                education: '',
                experience_years: 0,
                image_url: photoURL || ''
            });
            await newCandidate.save();
        }

        res.status(201).json({
            message: 'Registration successful with Google!',
            user: {
                id: newLogin._id,
                username: newLogin.username,
                email: newLogin.email,
                usertype: newLogin.usertype,
                status: newLogin.status
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error during Google registration', error: err.message });
    }
};

// Get User Profile (Generic)
exports.getProfile = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Login.findOne({ email }).select('-password -otp -otpExpires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error retrieving profile', error: err.message });
    }
};

// Update User Profile (Generic - mostly for Admin/Basic info)
exports.updateProfile = async (req, res) => {
    try {
        const { id, username, email } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await Login.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        // Note: Changing email might require re-verification in a real app, but for now we'll allow it or skip it if strictly Admin.
        // If email is changed, check uniqueness
        if (email && email !== user.email) {
            const exists = await Login.findOne({ email });
            if (exists) {
                return res.status(400).json({ message: 'Email already currently in use' });
            }
            user.email = email;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usertype: user.usertype,
                status: user.status
            }
        });

    } catch (err) {

        console.error('Update profile error:', err);

        res.status(500).json({ message: 'Server error updating profile', error: err.message });

    }

};



// Check Username Availability

exports.checkUsernameAvailability = async (req, res) => {

    try {

        const { username } = req.body;



        if (!username) {

            return res.status(400).json({ message: 'Username is required' });

        }



        const user = await Login.findOne({ username });



        if (user) {

            return res.json({ available: false, message: 'Username is taken' });

        }



        res.json({ available: true, message: 'Username is available' });



    } catch (err) {

        console.error('Check username error:', err);

        res.status(500).json({ message: 'Server error checking username', error: err.message });

    }

};
