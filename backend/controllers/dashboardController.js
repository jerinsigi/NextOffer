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
