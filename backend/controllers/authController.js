const Login = require('../models/Login');
const Candidate = require('../models/Candidate');
const bcrypt = require('bcrypt');
const { sendOTP } = require('../utils/emailService');

// Login authentication
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('=== LOGIN ATTEMPT ===');
        console.log('Username/Email provided:', username);

        // Validate input
        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Find user by username or email
        const user = await Login.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', {
            username: user.username,
            email: user.email,
            usertype: user.usertype,
            status: user.status
        });

        // Check if account is active
        if (user.status === 'inactive') {
            console.log('Account is inactive - blocking login');
            return res.status(403).json({
                message: 'Your account is pending admin approval. Please wait for activation.',
                status: 'inactive'
            });
        }

        console.log('Account status check passed');

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful!');

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
        const { username, email, password, usertype, phone, education, experience_years } = req.body;
        let image_url = '';

        if (req.file) {
            image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Basic validation
        if (!username || !email || !password || !usertype) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists (by email OR username)
        const existingUser = await Login.findOne({
            $or: [{ email }, { username }]
        });

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
                        full_name: username,
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
                full_name: username,
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
