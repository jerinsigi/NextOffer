const Login = require('../models/Login');
const bcrypt = require('bcrypt');

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
