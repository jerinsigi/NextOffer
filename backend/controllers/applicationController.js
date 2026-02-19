const Application = require('../models/Application');
const Job_Description = require('../models/Job_Description');
const Candidate = require('../models/Candidate');
const Resume = require('../models/Resume');

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { candidateEmail, jobId, coverLetter, resumeId } = req.body;
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

        let resumeRecord = null;

        if (resumeId) {
            // User selected an existing resume from their library
            resumeRecord = await Resume.findOne({ _id: resumeId, Fk_candidate_id: candidate._id });
            if (!resumeRecord) {
                return res.status(400).json({ message: 'Selected resume not found in your library.' });
            }
        } else if (resume_path) {
            // User uploaded a new file — create a Resume record
            resumeRecord = new Resume({
                Fk_candidate_id: candidate._id,
                Fk_job_id: jobId,
                tag_name: 'Uploaded for application',
                original_filename: req.file.originalname,
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


const InterviewSession = require('../models/Interview_Session');

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
            .lean() // Use lean() to allow adding properties
            .sort({ createdAt: -1 });

        // Attach interview details if status is Interviewing or Scheduled
        for (let app of applications) {
            if (['Interviewing', 'Scheduled'].includes(app.status)) {
                const interview = await InterviewSession.findOne({
                    fk_candidate_id: candidate._id,
                    fk_job_id: app.Fk_job_id._id,
                    session_status: { $in: ['pending', 'active'] } // Find valid session
                }).sort({ started_at: -1 }); // Get latest

                if (interview) {
                    app.interviewDetails = {
                        _id: interview._id,
                        started_at: interview.started_at,
                        ended_at: interview.ended_at
                    };
                }
            }
        }

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
            .populate('Fk_candidate_id', 'full_name email phone image_url skills education experience_years location current_role bio social_links')
            .populate('Fk_resume_id')
            .lean() // Convert to plain object to attach properties
            .sort({ createdAt: -1 });

        // Populate interview details for scheduled/interviewing applications
        for (let app of applications) {
            if (['Scheduled', 'Interviewing'].includes(app.status)) {
                // Find latest active session
                const session = await InterviewSession.findOne({
                    fk_candidate_id: app.Fk_candidate_id._id,
                    fk_job_id: jobId,
                    session_status: { $in: ['pending', 'ongoing', 'completed'] }
                }).sort({ started_at: -1 });

                if (session) {
                    app.interviewDetails = {
                        started_at: session.started_at,
                        ended_at: session.ended_at,
                        session_status: session.session_status
                    };
                }
            }
        }

        res.json(applications);
    } catch (err) {
        console.error('Get job applications error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Shortlist candidates (bulk or individual)
exports.shortlistCandidates = async (req, res) => {
    try {
        const { applicationIds } = req.body;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ message: 'Please provide application IDs to shortlist' });
        }

        const { sendShortlistEmail } = require('../utils/emailService');
        const emailResults = [];
        const updatedApplications = [];
        let jobId = null;

        // Process each application
        for (const appId of applicationIds) {
            const application = await Application.findById(appId)
                .populate('Fk_candidate_id', 'full_name email')
                .populate('Fk_job_id', 'job_title Fk_company_id');

            if (!application) {
                console.warn(`Application ${appId} not found, skipping...`);
                continue;
            }

            // Skip if already shortlisted
            if (application.status === 'Shortlisted') {
                console.log(`Application ${appId} already shortlisted, skipping...`);
                continue;
            }

            // Update status
            application.status = 'Shortlisted';
            await application.save();
            updatedApplications.push(application);

            // Store job ID for updating count
            if (!jobId) {
                jobId = application.Fk_job_id._id;
            }

            // Get company name
            const Company = require('../models/Company');
            const company = await Company.findById(application.Fk_job_id.Fk_company_id);
            const companyName = company ? company.company_name : 'Our Company';

            // Send email notification
            const emailSent = await sendShortlistEmail(
                application.Fk_candidate_id.email,
                application.Fk_candidate_id.full_name,
                application.Fk_job_id.job_title,
                companyName
            );

            emailResults.push({
                candidateEmail: application.Fk_candidate_id.email,
                emailSent
            });
        }

        // Update shortlisted count in job description
        if (jobId && updatedApplications.length > 0) {
            await Job_Description.findByIdAndUpdate(
                jobId,
                { $inc: { shortlisted_count: updatedApplications.length } }
            );
        }

        res.status(200).json({
            message: `Successfully shortlisted ${updatedApplications.length} candidate(s)`,
            shortlistedCount: updatedApplications.length,
            emailResults
        });
    } catch (err) {
        console.error('Shortlist candidates error:', err);
        res.status(500).json({ message: err.message });
    }
};
