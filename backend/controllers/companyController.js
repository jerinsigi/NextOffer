const Company = require('../models/Company');
const Login = require('../models/Login');
const Job_Description = require('../models/Job_Description');
const Application = require('../models/Application');
const Interview_Session = require('../models/Interview_Session');
const Integrity_Log = require('../models/Integrity_Log');
const bcrypt = require('bcrypt');
const { sendOTP } = require('../utils/emailService');
const { createNotification } = require('./notificationController');

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

        // Notify Admins
        try {
            const admins = await Login.find({ usertype: 'admin' });
            for (const admin of admins) {
                await createNotification(
                    admin.email,
                    'company',
                    'New Company Registration',
                    `${companyName} has registered and is pending your approval.`,
                    '/admin/companies'
                );
            }
        } catch (notifErr) {
            console.error('Admin notification error (registerCompany):', notifErr.message);
        }

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
        const companies = await Company.find().sort({ created_at: -1 }).lean();

        // Fetch all related logins in one go to get usernames
        const emails = companies.map(c => c.email);
        const logins = await Login.find({ email: { $in: emails } }).select('email username').lean();

        // Create a map for quick lookup
        const loginMap = {};
        logins.forEach(l => {
            loginMap[l.email] = l.username;
        });

        // Attach username to each company
        const companiesWithUsernames = companies.map(company => ({
            ...company,
            username: loginMap[company.email] || 'N/A'
        }));

        res.json(companiesWithUsernames);
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

// Update company profile with file upload support
exports.updateCompanyProfile = async (req, res) => {
    try {
        const { email, company_name, phone, industry, location, website, company_desc } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find company to verify it exists
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Prepare update data
        const updateData = {};

        if (company_name) updateData.company_name = company_name;
        if (phone) updateData.phone = phone;
        if (industry) updateData.industry = industry;
        if (location) updateData.location = location;
        if (website) updateData.website = website;
        if (company_desc) updateData.company_desc = company_desc;

        // Handle File Upload for logo
        if (req.file) {
            updateData.logo = '/upload/' + req.file.filename;
        }

        // Update company
        const updatedCompany = await Company.findOneAndUpdate(
            { email: email },
            { $set: updateData },
            { new: true }
        );

        res.json({
            message: 'Company profile updated successfully',
            company: updatedCompany
        });

    } catch (err) {
        console.error('Update company profile error:', err);
        res.status(500).json({ message: 'Server error updating profile', error: err.message });
    }
};

// Get Company Dashboard Stats
exports.getCompanyDashboardStats = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // 1. Get all jobs for this company
        const jobs = await Job_Description.find({ Fk_company_id: company._id });
        const jobIds = jobs.map(job => job._id);

        // 2. Count Active Candidates (Unique applicants for company's jobs)
        const applicationsCount = await Application.countDocuments({
            Fk_job_id: { $in: jobIds }
        });

        // 3. Count Interviews Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const interviewsTodayCount = await Interview_Session.countDocuments({
            fk_job_id: { $in: jobIds },
            session_status: { $in: ['pending', 'ongoing', 'completed'] },
            started_at: { $gte: startOfDay, $lte: endOfDay }
        });

        // 4. Integrity Violations (for company's interviews)
        const companySessions = await Interview_Session.find({ fk_job_id: { $in: jobIds } }, '_id');
        const sessionIds = companySessions.map(s => s._id);

        const integrityLogs = await Integrity_Log.find({
            Fk_session_id: { $in: sessionIds },
            $or: [
                { tab_switch_count: { $gt: 0 } },
                { gaze_away_count: { $gt: 0 } },
                { face_absent_count: { $gt: 0 } }
            ]
        });
        const violationsCount = integrityLogs.length;

        // 5. Recent Interview Sessions (Limit 5)
        const recentInterviews = await Interview_Session.find({ fk_job_id: { $in: jobIds } })
            .sort({ started_at: -1 })
            .limit(5)
            .populate('fk_candidate_id', 'full_name email')
            .populate('fk_job_id', 'job_title');

        // Format recent interviews for frontend
        const formedRecentInterviews = [];
        for (const session of recentInterviews) {
            let score = '--';
            let integrityStatus = 'Clean';

            // Check Integrity Log for this session
            const log = await Integrity_Log.findOne({ Fk_session_id: session._id });
            if (log && log.integrity_score !== undefined) {
                score = `${log.integrity_score}%`;
                if (log.integrity_score < 70) integrityStatus = 'Flagged';
            }

            formedRecentInterviews.push({
                _id: session._id,
                candidate: session.fk_candidate_id ? session.fk_candidate_id.full_name : 'Unknown',
                candidateInitials: session.fk_candidate_id && session.fk_candidate_id.full_name ?
                    session.fk_candidate_id.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??',
                company: company.company_name,
                position: session.fk_job_id ? session.fk_job_id.job_title : 'Unknown',
                status: session.session_status,
                time: session.started_at,
                score: score,
                integrity_status: integrityStatus
            });
        }

        res.json({
            totalJobs: jobs.length,
            activeCandidates: applicationsCount,
            interviewsToday: interviewsTodayCount,
            integrityViolations: violationsCount,
            recentInterviews: formedRecentInterviews
        });

    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ message: 'Server error fetching dashboard stats', error: err.message });
    }
};

// Get Company Integrity Dashboard specific Stats
exports.getCompanyIntegrityStats = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // 1. Get all jobs for this company
        const jobs = await Job_Description.find({ Fk_company_id: company._id });
        const jobIds = jobs.map(job => job._id);

        // 2. Fetch Sessions
        const sessions = await Interview_Session.find({ fk_job_id: { $in: jobIds } })
            .populate('fk_candidate_id', 'full_name email')
            .populate('fk_job_id', 'job_title');
            
        const sessionIds = sessions.map(s => s._id);

        // 3. Fetch Integrity Logs
        const integrityLogs = await Integrity_Log.find({
            Fk_session_id: { $in: sessionIds }
        });

        const violationsData = [];

        for (const log of integrityLogs) {
            const session = sessions.find(s => s._id.toString() === log.Fk_session_id.toString());
            if (!session || !session.fk_candidate_id) continue;

            const candidateName = session.fk_candidate_id.full_name;
            const candidateEmail = session.fk_candidate_id.email;
            const position = session.fk_job_id ? session.fk_job_id.job_title : 'Unknown';
            
            // Format time properly (e.g. 2024-12-05 03:25:18 PM)
            const timestamp = log.logged_at ? new Date(log.logged_at).toLocaleString('en-US') : new Date().toLocaleString('en-US');

            // Map standard log counts to "violationsData" schema
            if (log.tab_switch_count > 0) {
                violationsData.push({
                    id: `${log._id}_tab`,
                    candidateName,
                    candidateEmail,
                    position,
                    company: company.company_name,
                    interviewId: session._id,
                    violationType: 'Tab Switching',
                    severity: log.tab_switch_count > 2 ? 'Critical' : 'Moderate',
                    timestamp,
                    duration: '--',
                    occurrences: log.tab_switch_count,
                    description: 'Candidate switched browser tabs multiple times during the session',
                    evidence: 'Browser tab focus lost repeatedly',
                    action: 'Flagged for Review',
                    status: 'Under Review',
                    reviewedBy: 'Pending',
                    integrityScore: log.integrity_score
                });
            }

            if (log.gaze_away_count > 0) {
                violationsData.push({
                    id: `${log._id}_gaze`,
                    candidateName,
                    candidateEmail,
                    position,
                    company: company.company_name,
                    interviewId: session._id,
                    violationType: 'Gaze Aversion',
                    severity: log.gaze_away_count > 2 ? 'Moderate' : 'Minor',
                    timestamp,
                    duration: '--',
                    occurrences: log.gaze_away_count,
                    description: 'Extended periods of looking away from screen',
                    evidence: 'Eye tracking shows candidate looking away',
                    action: 'Flagged for Review',
                    status: 'Under Review',
                    reviewedBy: 'Pending',
                    integrityScore: log.integrity_score
                });
            }

            if (log.face_absent_count > 0) {
                violationsData.push({
                    id: `${log._id}_face`,
                    candidateName,
                    candidateEmail,
                    position,
                    company: company.company_name,
                    interviewId: session._id,
                    violationType: 'Presence Anomaly',
                    severity: log.face_absent_count > 1 ? 'Critical' : 'Moderate',
                    timestamp,
                    duration: '--',
                    occurrences: log.face_absent_count,
                    description: 'No face or multiple faces detected in frame',
                    evidence: 'AI detected face tracking anomaly',
                    action: 'Flagged for Review',
                    status: 'Under Review',
                    reviewedBy: 'Pending',
                    integrityScore: log.integrity_score
                });
            }
        }

        // Generate aggregate stats for frontend component
        const critical = violationsData.filter(v => v.severity === 'Critical').length;
        const moderate = violationsData.filter(v => v.severity === 'Moderate').length;
        const minor = violationsData.filter(v => v.severity === 'Minor').length;
        const tabSwitching = violationsData.filter(v => v.violationType === 'Tab Switching').length;
        const gazeAversion = violationsData.filter(v => v.violationType === 'Gaze Aversion').length;
        const presenceAnomaly = violationsData.filter(v => v.violationType === 'Presence Anomaly').length;

        const stats = {
            total: violationsData.length,
            critical,
            moderate,
            minor,
            tabSwitching,
            gazeAversion,
            presenceAnomaly,
            underReview: violationsData.filter(v => v.status === 'Under Review').length
        };

        // Static compliance rules based on previous dummy data context
        const complianceRules = [
            { id: 1, name: 'Tab Switching Detection', category: 'Browser Monitoring', enabled: true, sensitivity: 'High', threshold: '2 occurrences', action: 'Auto-terminate after 3 violations', lastUpdated: '2026-03-03' },
            { id: 2, name: 'Gaze Tracking', category: 'Eye Monitoring', enabled: true, sensitivity: 'Medium', threshold: '30 seconds total', action: 'Flag for review after 25 seconds', lastUpdated: '2026-03-03' },
            { id: 3, name: 'Presence Detection', category: 'Face Recognition', enabled: true, sensitivity: 'High', threshold: 'Multiple faces', action: 'Immediate termination', lastUpdated: '2026-03-03' }
        ];

        res.json({
            stats,
            violationsData,
            complianceRules
        });

    } catch (err) {
        console.error('Integrity Stats Error:', err);
        res.status(500).json({ message: 'Server error fetching integrity stats', error: err.message });
    }
};
