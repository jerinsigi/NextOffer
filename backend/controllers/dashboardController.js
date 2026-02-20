const Company = require('../models/Company');
const Candidate = require('../models/Candidate');
const InterviewSession = require('../models/Interview_Session');
const IntegrityLog = require('../models/Integrity_Log');
const JobDescription = require('../models/Job_Description'); // Added for populate

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total Companies
        const totalCompanies = await Company.countDocuments();

        // 2. Active Candidates
        const totalCandidates = await Candidate.countDocuments();

        // 3. Interviews Today
        // Using started_at based on schema inspection
        const interviewsToday = await InterviewSession.countDocuments({
            started_at: { $gte: today }
        });

        // 4. Integrity Violations (Total)
        const integrityLogs = await IntegrityLog.find();
        const totalViolations = integrityLogs.reduce((acc, log) => {
            return acc + (log.tab_switch_count || 0) + (log.gaze_away_count || 0) + (log.face_absent_count || 0);
        }, 0);

        // 5. Recent Interview Sessions (Top 5)
        // Schema uses fk_candidate_id, fk_job_id
        const recentInterviews = await InterviewSession.find()
            .sort({ started_at: -1 })
            .limit(5)
            .populate('fk_candidate_id', 'full_name image_url')
            .populate({
                path: 'fk_job_id',
                select: 'job_title Fk_company_id',
                populate: {
                    path: 'Fk_company_id',
                    select: 'company_name'
                }
            });

        // Map recentInterviews to a cleaner format
        const recentInterviewsFormatted = recentInterviews.map(session => {
            // Safe navigation for populated fields
            const candidateName = session.fk_candidate_id?.full_name || 'Unknown Candidate';
            const candidateInitials = candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return {
                id: session._id,
                candidate: candidateName,
                candidateInitials: candidateInitials,
                company: session.fk_job_id?.Fk_company_id?.company_name || 'Unknown Company',
                position: session.fk_job_id?.job_title || 'Unknown Position',
                status: session.session_status,
                // Score is not in the schema I viewed, assume calculated or placeholder for now if missing
                // Actually I didn't see a score in Interview_Session schema. 
                // There is a 'Final_Report.js' maybe? Or 'Interview_Response.js'. 
                // For now, I'll return a placeholder strictly if not in session, but let's check schema again.
                // Schema had: fk_candidate_id, fk_job_id, session_status, started_at, ended_at.
                // It did NOT have total_score.
                // I will use a placeholder or 0 for now to avoid errors.
                score: 0,
                time: session.started_at
            };
        });

        res.status(200).json({
            stats: {
                totalCompanies,
                totalCandidates,
                interviewsToday,
                totalViolations
            },
            recentInterviews: recentInterviewsFormatted
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};

// Get user dashboard statistics
exports.getUserDashboardStats = async (req, res) => {
    try {
        const { candidateEmail } = req.params;
        const Application = require('../models/Application'); // Ensure Application model is loaded
        const PracticeSession = require('../models/Practice_Session'); // Import PracticeSession

        if (!candidateEmail) {
            return res.status(400).json({ message: 'Candidate email is required' });
        }

        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' }); // Return 404 for candidate not found
        }

        // 1. Stats
        const totalApplications = await Application.countDocuments({ Fk_candidate_id: candidate._id });

        const interviews = await InterviewSession.countDocuments({
            fk_candidate_id: candidate._id
        });

        // Calculate average score from Final Reports
        // Note: We might need to import FinalReport model if not already imported
        const FinalReport = require('../models/Final_Report');
        // Handle case where FinalReport model might not exist or empty
        let averageScore = 0;
        try {
            const reports = await FinalReport.find({ Fk_candidate_id: candidate._id });
            const totalScore = reports.reduce((acc, report) => acc + (report.final_trust_score || 0), 0);
            averageScore = reports.length > 0 ? Math.round(totalScore / reports.length) : 0;
        } catch (e) {
            console.log("No Final Report model or error fetching reports", e);
            averageScore = 0;
        }


        // Practice Sessions (Count completed sessions)
        const practiceSessions = await PracticeSession.countDocuments({
            candidateEmail: candidateEmail,
            status: 'completed'
        });

        // 2. Upcoming Interviews (Pending/Scheduled and in future)
        // Using session_status 'pending' or 'active' roughly translates to scheduled/ongoing
        const upcomingInterviews = await InterviewSession.find({
            fk_candidate_id: candidate._id,
            session_status: { $in: ['pending', 'active'] },
            started_at: { $gte: new Date() }
        })
            .sort({ started_at: 1 })
            .limit(3)
            .populate({
                path: 'fk_job_id',
                select: 'job_title Fk_company_id',
                populate: { path: 'Fk_company_id', select: 'company_name logo' }
            });

        const formattedUpcoming = upcomingInterviews.map(session => ({
            id: session._id,
            jobTitle: session.fk_job_id?.job_title || 'Unknown Role',
            company: session.fk_job_id?.Fk_company_id?.company_name || 'Unknown Company',
            date: session.started_at,
            type: 'Technical Interview' // Hardcoded for now
        }));

        // 3. Recent Applications
        const recentApplications = await Application.find({ Fk_candidate_id: candidate._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: 'Fk_job_id',
                select: 'job_title Fk_company_id',
                populate: { path: 'Fk_company_id', select: 'company_name' }
            });

        const formattedRecentApps = recentApplications.map(app => ({
            id: app._id,
            position: app.Fk_job_id?.job_title || 'Unknown Position',
            company: app.Fk_job_id?.Fk_company_id?.company_name || 'Unknown Company',
            date: app.appliedAt || app.createdAt,
            status: app.status,
            match: 85 // Placeholder or calculate if possible
        }));

        // 4. Recommended Jobs (Placeholder logic: fetch active jobs)
        // Ideally we match skills
        const recommendedJobs = await JobDescription.find({ status: 'Active' })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('Fk_company_id', 'company_name logo');

        const formattedRecommended = recommendedJobs.map(job => ({
            id: job._id,
            title: job.job_title,
            company: job.Fk_company_id?.company_name || 'Unknown Company',
            location: job.location,
            match: 90 // Placeholder
        }));


        // 5. Calculate Profile Strength
        let strength = 0;
        if (candidate.phone || candidate.location) strength += 10;
        if (candidate.current_role) strength += 10;
        if (candidate.experience_years) strength += 10;
        if (candidate.education) strength += 10;
        if (candidate.bio) strength += 10;
        if (candidate.skills && candidate.skills.length > 0) strength += 20;
        if (candidate.social_links && (candidate.social_links.linkedin || candidate.social_links.github || candidate.social_links.portfolio)) strength += 10;

        // Check for any resume content
        const Resume = require('../models/Resume');
        const hasResume = await Resume.exists({ Fk_candidate_id: candidate._id });
        if (hasResume) strength += 20;

        // Cap at 100
        const profileStrength = Math.min(100, strength);

        res.json({
            stats: {
                totalApplications,
                interviews,
                averageScore,
                practiceSessions
            },
            upcomingInterviews: formattedUpcoming,
            recentApplications: formattedRecentApps,
            recommendedJobs: formattedRecommended,
            profileStrength
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
