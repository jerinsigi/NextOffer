const Candidate = require('../models/Candidate');
const InterviewSession = require('../models/Interview_Session');
const Company = require('../models/Company');
const Application = require('../models/Application');
const IntegrityLog = require('../models/Integrity_Log');
const JobDescription = require('../models/Job_Description');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const { dateRange } = req.query; // 'last7days', 'last30days', etc.

        // Date Filtering Logic
        let dateFilter = {};
        const now = new Date();
        if (dateRange === 'last7days') {
            dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        } else if (dateRange === 'last30days') {
            dateFilter = { $gte: new Date(now.setDate(now.getDate() - 30)) };
        } else if (dateRange === 'today') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            dateFilter = { $gte: startOfDay };
        }
        // Default to all time if no range or custom logic is needed

        // --- 1. Overview Metrics ---
        // Parallel Usage promises for performance
        const [
            totalCandidates,
            interviewsConducted,
            totalApplications,
            hiredApplications,
            shortlistedApplications,
            integrityLogs
        ] = await Promise.all([
            Candidate.countDocuments(),
            InterviewSession.countDocuments({ session_status: 'completed' }),
            Application.countDocuments(),
            Application.countDocuments({ status: 'Hired' }),
            Application.countDocuments({ status: 'Shortlisted' }),
            IntegrityLog.find() // Retrieve all for summing (or aggregate if large)
        ]);

        const totalSuccessful = hiredApplications + shortlistedApplications;
        const avgSuccessRate = totalApplications > 0 ? ((totalSuccessful / totalApplications) * 100).toFixed(1) : 0;

        const totalIntegrityViolations = integrityLogs.reduce((acc, log) => {
            return acc + (log.tab_switch_count || 0) + (log.gaze_away_count || 0) + (log.face_absent_count || 0);
        }, 0);

        // --- 2. Interview Trends (Last 7 Days generally) ---
        // Using Aggregation for daily trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const interviewTrends = await InterviewSession.aggregate([
            { $match: { started_at: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$started_at" } },
                    interviews: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$session_status", "completed"] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map trend data to frontend format, filling in missing days if needed or just sending as is
        // For simpler implementation, sending gathered data. 

        // --- 3. Company Performance ---
        // Limit to top 5-10 for performance if list is long
        const companiesData = await Company.aggregate([
            {
                $lookup: {
                    from: 'job_descriptions', // Collection name matches model export usually lowercase plural
                    localField: '_id',
                    foreignField: 'Fk_company_id',
                    as: 'jobs'
                }
            },
            {
                $project: {
                    name: '$company_name',
                    jobIds: '$jobs._id'
                }
            }
        ]);

        // Further detailed aggregation for companies might be heavy in one go. 
        // We iterate or improve query. Let's try to attach metrics.
        // Simplified approach: For each company, get count of interviews and applications via Job IDs
        const enrichedCompanies = await Promise.all(companiesData.map(async (comp) => {
            const jobIds = comp.jobIds;
            const interviewCount = await InterviewSession.countDocuments({ fk_job_id: { $in: jobIds } });
            const applicationCount = await Application.countDocuments({ Fk_job_id: { $in: jobIds } });
            // Violations linked via InterviewSession
            // Find sessions for these jobs, then count logs
            const sessions = await InterviewSession.find({ fk_job_id: { $in: jobIds } }).select('_id');
            const sessionIds = sessions.map(s => s._id);
            const violations = await IntegrityLog.aggregate([
                { $match: { Fk_session_id: { $in: sessionIds } } },
                { $group: { _id: null, total: { $sum: { $add: ["$tab_switch_count", "$gaze_away_count", "$face_absent_count"] } } } }
            ]);

            return {
                name: comp.name,
                interviews: interviewCount,
                candidates: applicationCount, // or candidates applied
                avgScore: Math.floor(Math.random() * (95 - 75 + 1) + 75), // Placeholder as score logic is complex/missing
                violations: violations[0]?.total || 0
            };
        }));


        // --- 4. Skills Analysis ---
        const skillsAnalysis = await JobDescription.aggregate([
            { $unwind: "$skills" },
            { $group: { _id: "$skills", demand: { $sum: 1 } } },
            { $sort: { demand: -1 } },
            { $limit: 7 }
        ]).then(results => results.map(r => ({
            skill: r._id,
            demand: r.demand,
            avgScore: Math.floor(Math.random() * (90 - 70 + 1) + 70), // Placeholder
            passRate: Math.floor(Math.random() * (80 - 60 + 1) + 60)  // Placeholder
        })));

        // --- 5. Hiring Funnel ---
        const funnelStats = await Application.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Map to specific stages required by frontend
        const totalApps = funnelStats.reduce((acc, curr) => acc + curr.count, 0);
        const funnelMap = {
            'Applied': 0, 'Shortlisted': 0, 'Interviewing': 0, 'Hired': 0, 'Rejected': 0
        };
        funnelStats.forEach(s => funnelMap[s._id] = s.count);

        // Construct funnel array
        const hiringFunnel = [
            { stage: 'Total Applications', count: totalApps, percentage: 100 },
            { stage: 'Resume Screened', count: totalApps - (funnelMap['Rejected'] || 0), percentage: totalApps ? Math.round(((totalApps - (funnelMap['Rejected'] || 0)) / totalApps) * 100) : 0 },
            { stage: 'Interview Completed', count: interviewsConducted, percentage: totalApps ? Math.round((interviewsConducted / totalApps) * 100) : 0 },
            { stage: 'Passed Integrity', count: interviewsConducted - (Math.round(totalIntegrityViolations / 5)), percentage: totalApps ? Math.round(((interviewsConducted - (totalIntegrityViolations / 5)) / totalApps) * 100) : 0 }, // Rough estimate
            { stage: 'Shortlisted', count: funnelMap['Shortlisted'], percentage: totalApps ? Math.round((funnelMap['Shortlisted'] / totalApps) * 100) : 0 }
        ];


        // --- 6. Integrity Metrics Breakdown ---
        const integrityBreakdown = await IntegrityLog.aggregate([
            {
                $group: {
                    _id: null,
                    tabSwitch: { $sum: "$tab_switch_count" },
                    gazeAway: { $sum: "$gaze_away_count" },
                    faceAbsent: { $sum: "$face_absent_count" },
                    total: { $sum: { $add: ["$tab_switch_count", "$gaze_away_count", "$face_absent_count"] } }
                }
            }
        ]);

        const iMetrics = integrityBreakdown[0] || { tabSwitch: 0, gazeAway: 0, faceAbsent: 0, total: 1 };
        const integrityMetrics = [
            { type: 'Tab Switching', count: iMetrics.tabSwitch, percentage: ((iMetrics.tabSwitch / (iMetrics.total || 1)) * 100).toFixed(1) },
            { type: 'Gaze Aversion', count: iMetrics.gazeAway, percentage: ((iMetrics.gazeAway / (iMetrics.total || 1)) * 100).toFixed(1) },
            { type: 'Presence Anomaly', count: iMetrics.faceAbsent, percentage: ((iMetrics.faceAbsent / (iMetrics.total || 1)) * 100).toFixed(1) }
        ];

        res.status(200).json({
            overview: {
                totalCandidates,
                interviewsConducted,
                avgSuccessRate: `${avgSuccessRate}%`,
                integrityViolations: totalIntegrityViolations
            },
            interviewTrends,
            companiesData: enrichedCompanies,
            skillsAnalysis,
            hiringFunnel,
            integrityMetrics
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
    }
};
