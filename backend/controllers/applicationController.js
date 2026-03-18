const Application = require('../models/Application');
const Job_Description = require('../models/Job_Description');
const Candidate = require('../models/Candidate');
const Resume = require('../models/Resume');
const Final_Report = require('../models/Final_Report');
const { createNotification } = require('./notificationController');
const { extractTextFromPDF, evaluateResumeMatch } = require('../utils/aiService');

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { candidateEmail, jobId, coverLetter, resumeId } = req.body;
        const resume_path = req.file ? '/upload/resumes/' + req.file.filename : null;

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

        // Handle Resume Selection/Upload
        let finalResumeId = null;

        if (resumeId) {
            // Case 1: User selected an existing resume from library
            const existingResume = await Resume.findById(resumeId);
            if (!existingResume) {
                return res.status(404).json({ message: 'Selected resume not found' });
            }
            finalResumeId = existingResume._id;
        } else if (resume_path) {
            // Case 2: User uploaded a new resume file
            const newResume = new Resume({
                Fk_candidate_id: candidate._id,
                Fk_job_id: jobId, // Optional: link to job context
                tag_name: "Application Resume", // Default tag
                original_filename: req.file.originalname,
                resume_path: resume_path
            });
            await newResume.save();
            finalResumeId = newResume._id;
        } else {
            // Case 3: No resume provided (Validation Error)
            return res.status(400).json({ message: 'A resume is required to apply for this job.' });
        }

        // Create Application
        const newApplication = new Application({
            Fk_candidate_id: candidate._id,
            Fk_job_id: jobId,
            Fk_resume_id: finalResumeId,
            coverLetter,
            status: 'Applied'
        });

        await newApplication.save();

        // Increment application count in Job Description
        await Job_Description.findByIdAndUpdate(jobId, { $inc: { applications_count: 1 } });

        // Trigger AI Resume Evaluation Asynchronously
        (async () => {
            try {
                // Fetch Job Description to pass to Gemini
                const job = await Job_Description.findById(jobId);
                if (!job) return;

                let actualResumePath = null;
                if (resumeId) {
                    const existingR = await Resume.findById(resumeId);
                    if (existingR) actualResumePath = existingR.resume_path;
                } else {
                    actualResumePath = resume_path;
                }

                if (actualResumePath) {
                    const resumeText = await extractTextFromPDF(actualResumePath);
                    if (resumeText) {
                        const evalResult = await evaluateResumeMatch(resumeText, job.description || job.job_title, job.skills);
                        
                        // Save to Final Report
                        const report = new Final_Report({
                            Fk_candidate_id: candidate._id,
                            Fk_job_id: jobId,
                            resume_score: evalResult.resume_score,
                            recommendation: evalResult.recommendation
                        });
                        await report.save();
                    }
                }
            } catch (evalError) {
                console.error("AI Resume Evaluation failed during application:", evalError);
            }
        })();

        // Send notification to candidate
        try {
            const job = await Job_Description.findById(jobId).populate('Fk_company_id');
            const companyName = job?.Fk_company_id?.company_name || 'the company';
            await createNotification(
                candidateEmail,
                'application',
                'Application Submitted',
                `Your application for ${job?.job_title || 'a job'} at ${companyName} has been submitted successfully.`,
                '/user/applications'
            );

            // Send notification to company
            if (job?.Fk_company_id?.email) {
                await createNotification(
                    job.Fk_company_id.email,
                    'job',
                    'New Job Application',
                    `${candidate.full_name} has applied for ${job.job_title}.`,
                    `/company/applications/${jobId}`
                );
            }
        } catch (notifErr) {
            console.error('Notification error (applyForJob):', notifErr.message);
        }

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
        const FinalReport = require('../models/Final_Report');

        for (let app of applications) {
            if (['Scheduled', 'Interviewing', 'Interviewed'].includes(app.status)) {
                // Find latest active session
                const session = await InterviewSession.findOne({
                    fk_candidate_id: app.Fk_candidate_id._id,
                    fk_job_id: jobId,
                    session_status: { $in: ['pending', 'ongoing', 'completed'] }
                }).sort({ started_at: -1 });

                if (session) {
                    app.interviewDetails = {
                        _id: session._id,
                        started_at: session.started_at,
                        ended_at: session.ended_at,
                        session_status: session.session_status
                    };
                }
            }

            // Fetch Final Report score if available
            const finalReport = await FinalReport.findOne({
                Fk_candidate_id: app.Fk_candidate_id._id,
                Fk_job_id: jobId
            });

            if (finalReport) {
                app.final_trust_score = finalReport.final_trust_score;
            } else {
                app.final_trust_score = -1; // -1 indicates no score yet
            }
        }

        // Sort applications: Those with a score first (descending), then those without a score (by newest applied)
        applications.sort((a, b) => {
            if (a.final_trust_score !== -1 && b.final_trust_score !== -1) {
                return b.final_trust_score - a.final_trust_score; // Higher score first
            }
            if (a.final_trust_score !== -1) return -1; // 'a' has score, 'b' doesn't, so 'a' comes first
            if (b.final_trust_score !== -1) return 1;  // 'b' has score, 'a' doesn't, so 'b' comes first

            // Neither has a score, fallback to standard date sorting (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

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
                continue;
            }

            // Skip if already shortlisted
            if (application.status === 'Shortlisted') {
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

            // In-app notification
            try {
                await createNotification(
                    application.Fk_candidate_id.email,
                    'application',
                    'Application Shortlisted! 🎉',
                    `Congratulations! Your application for ${application.Fk_job_id.job_title} at ${companyName} has been shortlisted.`,
                    '/user/applications'
                );
            } catch (notifErr) {
                console.error('Notification error (shortlist):', notifErr.message);
            }
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

// Individually Reject a candidate
exports.rejectCandidate = async (req, res) => {
    try {
        const { applicationId } = req.params;

        if (!applicationId) {
            return res.status(400).json({ message: 'Application ID is required' });
        }

        const application = await Application.findById(applicationId)
            .populate('Fk_candidate_id', 'full_name email')
            .populate('Fk_job_id', 'job_title Fk_company_id');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status === 'Rejected') {
            return res.status(400).json({ message: 'Application is already rejected' });
        }

        application.status = 'Rejected';
        await application.save();

        const { sendRejectEmail } = require('../utils/emailService');
        const Company = require('../models/Company');

        const company = await Company.findById(application.Fk_job_id.Fk_company_id);
        const companyName = company ? company.company_name : 'Our Company';

        const emailSent = await sendRejectEmail(
            application.Fk_candidate_id.email,
            application.Fk_candidate_id.full_name,
            application.Fk_job_id.job_title,
            companyName
        );

        try {
            await createNotification(
                application.Fk_candidate_id.email,
                'application',
                'Application Update',
                `Your application for ${application.Fk_job_id.job_title} at ${companyName} has been declined.`,
                '/user/applications'
            );
        } catch (e) { }

        res.status(200).json({
            message: 'Candidate rejected successfully',
            emailSent
        });
    } catch (err) {
        console.error('Reject candidate error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Finalize Hiring (Bulk Hire top N, Reject rest by Final Score)
exports.finalizeHiring = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { topNHires } = req.body;

        if (!topNHires || isNaN(topNHires) || topNHires < 1) {
            return res.status(400).json({ message: 'Please provide a valid number of top candidates to hire.' });
        }

        // 1. Fetch all applications for the job
        const applications = await Application.find({ Fk_job_id: jobId })
            .populate('Fk_candidate_id', 'full_name email')
            .populate('Fk_job_id', 'job_title Fk_company_id');

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: 'No applications found for this job.' });
        }

        // 2. Fetch Final Reports and attach scores to sort them (identical to frontend sorting logic)
        const FinalReport = require('../models/Final_Report');

        for (let app of applications) {
            const finalReport = await FinalReport.findOne({
                Fk_candidate_id: app.Fk_candidate_id._id,
                Fk_job_id: jobId
            });

            if (finalReport) {
                app.temp_final_score = finalReport.final_trust_score;
            } else {
                app.temp_final_score = -1;
            }
        }

        // Sort applications: Those with a score first (descending), then fallback to creation date
        applications.sort((a, b) => {
            if (a.temp_final_score !== -1 && b.temp_final_score !== -1) {
                return b.temp_final_score - a.temp_final_score; // Higher score first
            }
            if (a.temp_final_score !== -1) return -1;
            if (b.temp_final_score !== -1) return 1;

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const { sendHireEmail, sendRejectEmail } = require('../utils/emailService');
        const Company = require('../models/Company');

        let hiredCount = 0;
        let rejectedCount = 0;
        const emailResults = [];

        // 3. Process each application (Hire top N, Reject the rest)
        for (let i = 0; i < applications.length; i++) {
            const application = applications[i];

            // Skip already finalized applications so we don't double email them
            if (application.status === 'Hired' || application.status === 'Rejected') {
                continue;
            }

            const company = await Company.findById(application.Fk_job_id.Fk_company_id);
            const companyName = company ? company.company_name : 'Our Company';

            if (i < topNHires) {
                // HIRE this candidate (Rank 1 to topNHires)
                application.status = 'Hired';
                await application.save();
                hiredCount++;

                const emailSent = await sendHireEmail(
                    application.Fk_candidate_id.email,
                    application.Fk_candidate_id.full_name,
                    application.Fk_job_id.job_title,
                    companyName
                );
                emailResults.push({ email: application.Fk_candidate_id.email, status: 'Hired Email', success: emailSent });

                try {
                    await createNotification(
                        application.Fk_candidate_id.email,
                        'application',
                        'Job Offer Received! 🌟',
                        `You have been offered the position for ${application.Fk_job_id.job_title} at ${companyName}!`,
                        '/user/applications'
                    );
                } catch (e) { }

            } else {
                // REJECT this candidate (Rank > topNHires)
                application.status = 'Rejected';
                await application.save();
                rejectedCount++;

                const emailSent = await sendRejectEmail(
                    application.Fk_candidate_id.email,
                    application.Fk_candidate_id.full_name,
                    application.Fk_job_id.job_title,
                    companyName
                );
                emailResults.push({ email: application.Fk_candidate_id.email, status: 'Reject Email', success: emailSent });

                try {
                    await createNotification(
                        application.Fk_candidate_id.email,
                        'application',
                        'Application Update',
                        `Your application for ${application.Fk_job_id.job_title} at ${companyName} has been declined.`,
                        '/user/applications'
                    );
                } catch (e) { }
            }
        }

        res.status(200).json({
            message: `Successfully finalized hiring. Hired: ${hiredCount}, Rejected: ${rejectedCount}.`,
            hiredCount,
            rejectedCount,
            emailResults
        });

    } catch (err) {
        console.error('Finalize hiring error:', err);
        res.status(500).json({ message: err.message });
    }
};
