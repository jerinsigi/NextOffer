const InterviewSession = require('../models/Interview_Session');
const { sendInterviewEmail } = require('../utils/emailService');
const Candidate = require('../models/Candidate');
const JobDescription = require('../models/Job_Description');
const Application = require('../models/Application');

// Schedule an interview (Bulk or Single)
exports.scheduleInterview = async (req, res) => {
    try {
        const { candidateIds, jobId, startedAt, endedAt } = req.body;

        if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0 || !jobId || !startedAt || !endedAt) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Populate company details
        const job = await JobDescription.findById(jobId).populate('Fk_company_id');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Get company name safely
        const companyName = job.Fk_company_id ? job.Fk_company_id.company_name : (job.company_name || "The Company");

        let successCount = 0;
        let failCount = 0;

        for (const candidateId of candidateIds) {
            try {
                // Validate Candidate
                const candidate = await Candidate.findById(candidateId);
                if (!candidate) {
                    failCount++;
                    continue;
                }

                // Update Application Status to 'Scheduled'
                const application = await Application.findOne({
                    Fk_candidate_id: candidateId,
                    Fk_job_id: jobId
                });

                if (application) {
                    application.status = 'Scheduled';
                    await application.save();
                }

                // Create Interview Session
                const newSession = new InterviewSession({
                    fk_candidate_id: candidateId,
                    fk_job_id: jobId,
                    started_at: startedAt,
                    ended_at: endedAt,
                    session_status: 'pending'
                });

                await newSession.save();

                // Send Email
                await sendInterviewEmail(
                    candidate.email,
                    candidate.full_name,
                    job.job_title,
                    companyName,
                    startedAt,
                    endedAt // Pass endedAt
                );

                successCount++;
            } catch (err) {
                console.error(`Error scheduling for candidate ${candidateId}:`, err);
                failCount++;
            }
        }

        // Update Job Counts
        if (successCount > 0) {
            job.scheduled_count = (job.scheduled_count || 0) + successCount;
            // Assuming they were shortlisted before, we decrement shortlisted_count
            job.shortlisted_count = Math.max(0, (job.shortlisted_count || 0) - successCount);
            await job.save();
        }

        res.status(201).json({
            message: 'Interview scheduling processed',
            successCount,
            failCount
        });

    } catch (error) {
        console.error('Error scheduling interview:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an interview schedule
exports.updateSchedule = async (req, res) => {
    try {
        const { candidateId, jobId, startedAt, endedAt } = req.body;

        if (!candidateId || !jobId || !startedAt || !endedAt) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the active interview session
        const session = await InterviewSession.findOne({
            fk_candidate_id: candidateId,
            fk_job_id: jobId,
            session_status: { $in: ['pending', 'ongoing'] }
        });

        if (!session) {
            return res.status(404).json({ message: 'Interview session not found or already completed' });
        }

        // Update session
        session.started_at = startedAt;
        session.ended_at = endedAt;
        await session.save();

        // Send Email Notification
        const candidate = await Candidate.findById(candidateId);
        const job = await JobDescription.findById(jobId).populate('Fk_company_id');
        const companyName = job.Fk_company_id ? job.Fk_company_id.company_name : (job.company_name || "The Company");

        await sendInterviewEmail(
            candidate.email,
            candidate.full_name,
            job.job_title,
            companyName,
            startedAt,
            endedAt,
            true // isReschedule flag
        );

        res.status(200).json({ message: 'Interview rescheduled successfully' });

    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
