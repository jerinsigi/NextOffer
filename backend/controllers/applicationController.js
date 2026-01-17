const Application = require('../models/Application');
const Job_Description = require('../models/Job_Description');
const Candidate = require('../models/Candidate');
const Resume = require('../models/Resume');

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { candidateEmail, jobId, coverLetter } = req.body;
        const resume_path = req.file ? '/uploads/resumes/' + req.file.filename : null;

        // Find candidate by email
        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found. Please complete your profile first.' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            Fk_candidate_id: candidate._id,
            Fk_job_id: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create Resume record if resume was uploaded
        let resumeRecord = null;
        if (resume_path) {
            resumeRecord = new Resume({
                Fk_candidate_id: candidate._id,
                Fk_job_id: jobId,
                resume_path: resume_path
            });
            await resumeRecord.save();
        }

        // Create Application
        const newApplication = new Application({
            Fk_candidate_id: candidate._id,
            Fk_job_id: jobId,
            Fk_resume_id: resumeRecord ? resumeRecord._id : null,
            coverLetter,
            status: 'Applied'
        });

        await newApplication.save();

        // Increment application count in Job Description
        await Job_Description.findByIdAndUpdate(jobId, { $inc: { applications_count: 1 } });

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (err) {
        console.error('Apply for job error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get applications by candidate (User)
exports.getUserApplications = async (req, res) => {
    try {
        const { candidateEmail } = req.params;

        // Find candidate by email
        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.json([]); // Return empty array if no candidate profile exists
        }

        const applications = await Application.find({ Fk_candidate_id: candidate._id })
            .populate({
                path: 'Fk_job_id',
                populate: { path: 'Fk_company_id', select: 'company_name logo' }
            })
            .populate('Fk_resume_id')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error('Get user applications error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get applications by job (Company)
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ Fk_job_id: jobId })
            .populate('Fk_candidate_id', 'full_name email phone image_url')
            .populate('Fk_resume_id')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error('Get job applications error:', err);
        res.status(500).json({ message: err.message });
    }
};
