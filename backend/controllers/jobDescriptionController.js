const Job_Description = require('../models/Job_Description');
const Company = require('../models/Company');

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const { companyEmail, ...jobData } = req.body;

        const company = await Company.findOne({ email: companyEmail });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const newJob = new Job_Description({
            ...jobData,
            Fk_company_id: company._id
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Application = require('../models/Application');

// Get all jobs for a specific company
exports.getJobsByCompany = async (req, res) => {
    try {
        const { email } = req.params;
        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        let jobs = await Job_Description.find({ Fk_company_id: company._id }).sort({ createdAt: -1 }).lean();

        // Calculate real-time counts for each job
        jobs = await Promise.all(jobs.map(async (job) => {
            const appsCount = await Application.countDocuments({ Fk_job_id: job._id });
            const shortlistedCount = await Application.countDocuments({ Fk_job_id: job._id, status: 'Shortlisted' });
            const scheduledCount = await Application.countDocuments({ Fk_job_id: job._id, status: { $in: ['Scheduled', 'Interviewing'] } });

            return {
                ...job,
                applications_count: appsCount,
                shortlisted_count: shortlistedCount,
                scheduled_count: scheduledCount
            };
        }));

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job_Description.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await Job_Description.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job_Description.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all active jobs (for users)
exports.getAllActiveJobs = async (req, res) => {
    try {
        const { search, category, type } = req.query;
        let query = {
            job_status: 'Active',
            $and: [
                {
                    $or: [
                        { end_date: { $gte: new Date() } },
                        { end_date: { $exists: false } },
                        { end_date: null }
                    ]
                }
            ]
        };

        if (search) {
            query.$and.push({
                $or: [
                    { job_title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } } // Assuming company name might be populated or redundant
                ]
            });
        }

        if (category) {
            query.job_title = category; // Assuming job_title serves as category based on dropdown
        }

        if (type) {
            query.type = type;
        }

        const jobs = await Job_Description.find(query)
            .sort({ createdAt: -1 })
            .populate('Fk_company_id', 'company_name email logo'); // Populate company details if link exists

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all jobs for admin (with company details and application stats)
exports.getAllJobsForAdmin = async (req, res) => {
    try {
        let jobs = await Job_Description.find()
            .populate('Fk_company_id', 'company_name email logo')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate real-time counts for each job
        jobs = await Promise.all(jobs.map(async (job) => {
            const appsCount = await Application.countDocuments({ Fk_job_id: job._id });
            const shortlistedCount = await Application.countDocuments({ Fk_job_id: job._id, status: 'Shortlisted' });
            const interviewedCount = await Application.countDocuments({ Fk_job_id: job._id, status: { $in: ['Interviewed', 'Completed'] } });
            const scheduledCount = await Application.countDocuments({ Fk_job_id: job._id, status: { $in: ['Scheduled', 'Interviewing'] } });
            const hiredCount = await Application.countDocuments({ Fk_job_id: job._id, status: 'Hired' });

            return {
                ...job,
                applications_count: appsCount,
                shortlisted_count: shortlistedCount,
                interviewed_count: interviewedCount,
                scheduled_count: scheduledCount,
                hired_count: hiredCount
            };
        }));

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
