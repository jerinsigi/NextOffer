const Company = require('../models/Company');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');
const { sendOTP } = require('../utils/emailService');

// Register a new company (public endpoint)
exports.registerCompany = async (req, res) => {
    let savedLogin = null;
    try {
        const { username, email, password, companyName, industry, location, website, description, logo, phone } = req.body;

        // Validate required fields
        if (!username || !email || !password || !companyName || !industry || !location) {
            return res.status(400).json({
                message: 'Please provide all required fields: username, email, password, company name, industry, and location'
            });
        }

        // Check if username already exists
        const existingUsername = await Login.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists in Login
        const existingLoginEmail = await Login.findOne({ email });
        if (existingLoginEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check if email already exists in Company
        const existingCompanyEmail = await Company.findOne({ email });
        if (existingCompanyEmail) {
            return res.status(400).json({ message: 'Company with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create Login entry
        const login = new Login({
            username,
            email,
            password: hashedPassword,
            usertype: 'company',
            status: 'pending', // Pending email verification
            otp: Math.random().toString(36).substring(2, 8).toUpperCase(),
            otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        savedLogin = await login.save();

        // Create Company entry
        const company = new Company({
            company_name: companyName,
            email,
            phone,
            industry,
            location,
            website: website || '',
            company_desc: description || '',
            logo: logo || '',
            status: 'Pending' // Pending admin approval
        });

        const savedCompany = await company.save();

        // Send OTP via email
        await sendOTP(email, login.otp);

        res.status(201).json({
            message: 'Company registration successful! Your account is pending admin approval.',
            company: {
                id: savedCompany._id,
                company_name: savedCompany.company_name,
                email: savedCompany.email,
                status: savedCompany.status
            }
        });

    } catch (err) {
        console.error('Registration error:', err);

        // Cleanup: Delete the created login if company creation fails
        if (savedLogin && savedLogin._id) {
            console.log('Rolling back Login creation due to error...');
            await Login.findByIdAndDelete(savedLogin._id);
        }

        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

// Verify Company Email OTP
exports.verifyCompanyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Missing email or OTP' });
        }

        const login = await Login.findOne({ email });

        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (login.status !== 'pending') {
            return res.status(400).json({ message: 'Account is not in pending state' });
        }

        if (login.otp.trim() !== otp.trim()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (login.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update status to 'inactive' (Email verified, checks out for Admin Approval)
        login.status = 'inactive';
        login.otp = undefined;
        login.otpExpires = undefined;
        await login.save();

        res.json({ message: 'Email verified! Account is now pending Admin Approval.' });

    } catch (err) {
        console.error('Company Verification error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Resend Company OTP
exports.resendCompanyOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const login = await Login.findOne({ email });

        if (!login) return res.status(404).json({ message: 'User not found' });
        if (login.status !== 'pending') return res.status(400).json({ message: 'Account not pending' });

        const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
        login.otp = otp;
        login.otpExpires = Date.now() + 10 * 60 * 1000;
        await login.save();

        await sendOTP(email, otp);
        res.json({ message: 'New OTP sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ created_at: -1 });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single company
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new company
exports.createCompany = async (req, res) => {
    const company = new Company({
        company_name: req.body.company_name,
        email: req.body.email,
        industry: req.body.industry,
        location: req.body.location,
        website: req.body.website,
        company_desc: req.body.company_desc,
        status: req.body.status,
        logo: req.body.logo
    });

    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a company
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        if (req.body.company_name != null) company.company_name = req.body.company_name;
        if (req.body.email != null) company.email = req.body.email;
        if (req.body.phone != null) company.phone = req.body.phone;
        if (req.body.industry != null) company.industry = req.body.industry;
        if (req.body.location != null) company.location = req.body.location;
        if (req.body.website != null) company.website = req.body.website;
        if (req.body.company_desc != null) company.company_desc = req.body.company_desc;
        if (req.body.status != null) company.status = req.body.status;
        if (req.body.logo != null) company.logo = req.body.logo;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        await company.deleteOne();
        res.json({ message: 'Company deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve a company (Admin only)
exports.approveCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        console.log(`Approving company with ID: ${companyId}`);

        // Find the company
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update Company status to Active
        company.status = 'Active';
        await company.save();

        // Update Login status to active using the company email
        const login = await Login.findOne({ email: company.email });
        if (login) {
            login.status = 'active';
            await login.save();
            console.log(`Approved company: ${company.company_name}, Login status updated to active`);
        } else {
            console.warn(`Login not found for company email: ${company.email}`);
        }

        res.json({
            message: 'Company approved successfully',
            company: {
                id: company._id,
                company_name: company.company_name,
                email: company.email,
                status: company.status
            }
        });

    } catch (err) {
        console.error('Approval error:', err);
        res.status(500).json({ message: err.message || 'Server error during approval' });
    }
};

// Get company by Email (for dashboard profile)
exports.getCompanyByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Fetch login details to get username
        const login = await Login.findOne({ email });

        const companyData = company.toObject();
        if (login) {
            companyData.username = login.username;
        }

        res.json(companyData);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error retrieving profile', error: err.message });
    }
};
