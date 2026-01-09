const Application = require('../models/Application');
const Job_Description = require('../models/Job_Description');
const Candidate = require('../models/Candidate');

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { candidateId, jobId, resumeUrl, coverLetter } = req.body;

        // Check if already applied
        const existingApplication = await Application.findOne({
            Fk_candidate_id: candidateId,
            Fk_job_id: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            Fk_candidate_id: candidateId,
            Fk_job_id: jobId,
            resumeUrl,
            coverLetter,
            status: 'Applied'
        });

        await newApplication.save();

        // Increment application count in Job Description
        await Job_Description.findByIdAndUpdate(jobId, { $inc: { applications_count: 1 } });

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get applications by candidate (User)
exports.getUserApplications = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const applications = await Application.find({ Fk_candidate_id: candidateId })
            .populate({
                path: 'Fk_job_id',
                populate: { path: 'Fk_company_id', select: 'companyName logoUrl' }
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get applications by job (Company)
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ Fk_job_id: jobId })
            .populate('Fk_candidate_id', 'full_name email phone resumeUrl')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
