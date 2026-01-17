const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const upload = require('../middleware/upload');

// Register a new company (public)
router.post('/register', companyController.registerCompany);
router.post('/verify-email', companyController.verifyCompanyEmail);
router.post('/resend-otp', companyController.resendCompanyOTP);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get a single company
router.get('/:id', companyController.getCompanyById);

// Create a new company
router.post('/', companyController.createCompany);

// Update a company
router.put('/:id', companyController.updateCompany);

// Approve a company (Admin only)
router.put('/:id/approve', companyController.approveCompany);

// Get company profile by email
router.post('/profile', companyController.getCompanyByEmail);

// Update company profile with file upload
router.post('/profile/update', upload.single('logo'), companyController.updateCompanyProfile);

// Delete a company
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
