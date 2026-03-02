const Company = require('../models/Company');
const Candidate = require('../models/Candidate');
const JobDescription = require('../models/Job_Description');
const Application = require('../models/Application');

exports.getPlatformActivity = async (req, res) => {
    try {
        const activities = [];

        // 1. Fetch recent candidates
        const candidates = await Candidate.find().sort({ createdAt: -1 }).limit(10);
        candidates.forEach(c => {
            activities.push({
                id: `CAND-${c._id.toString().substring(0, 6)}`,
                timestamp: c.createdAt || new Date('2025-01-01'),
                user: c.full_name || 'Unknown Candidate',
                userEmail: c.email || 'N/A',
                action: 'Candidate Registered',
                target: 'Platform',
                category: 'User Registration',
                severity: 'Info',
                details: `New candidate registered: ${c.full_name}`,
                ipAddress: 'System',
                changes: null
            });
        });

        // 2. Fetch recent companies
        const companies = await Company.find().sort({ createdAt: -1 }).limit(10);
        companies.forEach(c => {
            activities.push({
                id: `COMP-${c._id.toString().substring(0, 6)}`,
                timestamp: c.createdAt || new Date('2025-01-01'),
                user: c.company_name,
                userEmail: c.email,
                action: 'Company Registered',
                target: 'Platform',
                category: 'Company Registration',
                severity: c.status === 'Approved' ? 'Info' : 'Warning',
                details: `New company registered (Status: ${c.status})`,
                ipAddress: 'System',
                changes: null
            });
        });

        // 3. Fetch recent jobs
        const jobs = await JobDescription.find().populate('Fk_company_id').sort({ createdAt: -1 }).limit(10);
        jobs.forEach(j => {
            const companyName = j.Fk_company_id ? j.Fk_company_id.company_name : 'Unknown Company';
            activities.push({
                id: `JOB-${j._id.toString().substring(0, 6)}`,
                timestamp: j.createdAt || j.posted_date || new Date('2025-01-01'),
                user: companyName,
                userEmail: 'System', 
                action: 'New Job Posted',
                target: j.job_title,
                category: 'Content',
                severity: 'Info',
                details: `${companyName} posted a new job: ${j.job_title}`,
                ipAddress: 'System',
                changes: null
            });
        });

        // 4. Fetch recent applications
        const apps = await Application.find().populate('Fk_candidate_id').populate('Fk_job_id').sort({ createdAt: -1 }).limit(10);
        apps.forEach(a => {
            const candidateName = a.Fk_candidate_id ? a.Fk_candidate_id.full_name : 'Unknown Candidate';
            const jobTitle = a.Fk_job_id ? a.Fk_job_id.job_title : 'Unknown Job';
            activities.push({
                id: `APP-${a._id.toString().substring(0, 6)}`,
                timestamp: a.createdAt || a.applied_date || new Date('2025-01-01'),
                user: candidateName,
                userEmail: 'System',
                action: 'Application Submitted',
                target: jobTitle,
                category: 'Application',
                severity: 'Info',
                details: `${candidateName} applied to ${jobTitle}`,
                ipAddress: 'System',
                changes: null
            });
        });

        // Sort all aggregated activities by timestamp descending
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Return the top 30 combined activities
        res.status(200).json(activities.slice(0, 30));

    } catch (error) {
        console.error('Error fetching platform activity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
