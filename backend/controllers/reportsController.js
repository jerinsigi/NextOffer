const Candidate = require('../models/Candidate');
const InterviewSession = require('../models/Interview_Session');
const Company = require('../models/Company');
const Application = require('../models/Application');
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

        const dateQuery = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        const interviewDateQuery = Object.keys(dateFilter).length > 0 ? { started_at: dateFilter } : {};

        // --- 1. Overview Metrics ---
        // Fetch core totals
        const [
            totalCandidates,
            totalCompanies,
            totalJobs,
            interviewsConducted
        ] = await Promise.all([
            Candidate.countDocuments(dateQuery),
            Company.countDocuments(dateQuery),
            JobDescription.countDocuments(dateQuery),
            InterviewSession.countDocuments({ ...interviewDateQuery, session_status: 'completed' })
        ]);

        // --- 2. Application Status Overview ---
        const applicationStats = await Application.aggregate([
            { $match: dateQuery },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const appStatusMap = {
            'Applied': 0, 'Shortlisted': 0, 'Interviewing': 0, 'Hired': 0, 'Rejected': 0
        };
        applicationStats.forEach(s => {
            if (s._id in appStatusMap) {
                appStatusMap[s._id] = s.count;
            } else if (!s._id) {
                appStatusMap['Applied'] += s.count; // Default if unassigned
            }
        });

        const applicationStatus = Object.keys(appStatusMap).map(status => ({
            status,
            count: appStatusMap[status]
        }));

        // --- 3. Interview Trends (Last 7 Days generally) ---
        const daysToLookBack = dateRange === 'last30days' ? 30 : 7;
        const trendStartDate = new Date();
        trendStartDate.setDate(trendStartDate.getDate() - daysToLookBack);

        const interviewTrends = await InterviewSession.aggregate([
            { $match: { started_at: { $gte: trendStartDate } } },
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

        // --- 4. Company Performance ---
        // Get recent/top 15 companies
        const companies = await Company.find().sort({ createdAt: -1 }).limit(15);

        const enrichedCompanies = await Promise.all(companies.map(async (comp) => {
            const jobsCount = await JobDescription.countDocuments({ Fk_company_id: comp._id });
            const jobs = await JobDescription.find({ Fk_company_id: comp._id }).select('_id');
            const jobIds = jobs.map(j => j._id);
            const interviewCount = await InterviewSession.countDocuments({ fk_job_id: { $in: jobIds } });
            const applicationCount = await Application.countDocuments({ Fk_job_id: { $in: jobIds } });

            return {
                name: comp.company_name,
                totalJobs: jobsCount,
                interviews: interviewCount,
                candidates: applicationCount
            };
        }));

        // Sort by most active (jobs + interviews)
        enrichedCompanies.sort((a, b) => (b.totalJobs + b.interviews) - (a.totalJobs + a.interviews));

        // --- 5. Skills Analysis ---
        const skillsAnalysis = await JobDescription.aggregate([
            { $match: dateQuery },
            { $unwind: "$skills" },
            { $group: { _id: "$skills", demand: { $sum: 1 } } },
            { $sort: { demand: -1 } },
            { $limit: 10 }
        ]);

        const enrichedSkills = skillsAnalysis.map(r => ({
            skill: r._id,
            demand: r.demand
        }));

        res.status(200).json({
            overview: {
                totalCandidates,
                totalCompanies,
                totalJobs,
                interviewsConducted
            },
            applicationStatus,
            interviewTrends,
            companiesData: enrichedCompanies,
            skillsAnalysis: enrichedSkills
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
    }
};
