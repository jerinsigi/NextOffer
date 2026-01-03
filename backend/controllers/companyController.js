const Company = require('../models/Company');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');

// Register a new company (public endpoint)
exports.registerCompany = async (req, res) => {
    try {
        const { username, email, password, companyName, industry, location, website, description, logo } = req.body;

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
            status: 'inactive' // Pending admin approval
        });

        const savedLogin = await login.save();

        // Create Company entry
        const company = new Company({
            company_name: companyName,
            email,
            industry,
            location,
            website: website || '',
            company_desc: description || '',
            logo: logo || '',
            status: 'Pending' // Pending admin approval
        });

        const savedCompany = await company.save();

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
        res.status(500).json({ message: 'Server error during registration', error: err.message });
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
        res.status(500).json({ message: 'Server error during approval', error: err.message });
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
