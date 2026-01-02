const Company = require('../models/Company');

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
