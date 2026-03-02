const Candidate = require('../models/Candidate');
const InterviewSession = require('../models/Interview_Session');
const Company = require('../models/Company');
const Application = require('../models/Application');
const JobDescription = require('../models/Job_Description');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const { dateRange } = req.query;

        // Date Filtering Logic
        let dateFilter = {};
        const now = new Date();
        if (dateRange === 'last7days') {
            dateFilter = { $gte: new Date(new Date().setDate(now.getDate() - 7)) };
        } else if (dateRange === 'last30days') {
            dateFilter = { $gte: new Date(new Date().setDate(now.getDate() - 30)) };
        } else if (dateRange === 'last90days') {
            dateFilter = { $gte: new Date(new Date().setDate(now.getDate() - 90)) };
        } else if (dateRange === 'today') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            dateFilter = { $gte: startOfDay };
        }
        // 'alltime' => no filter

        const dateQuery = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        const interviewDateQuery = Object.keys(dateFilter).length > 0 ? { started_at: dateFilter } : {};

        const companyDateQuery = Object.keys(dateFilter).length > 0 ? { created_at: dateFilter } : {};

        // --- 1. Overview Metrics ---
        const [
            totalCandidates,
            totalCompanies,
            totalJobs,
            interviewsConducted,
            totalApplications,
            hiredCount
        ] = await Promise.all([
            Candidate.countDocuments(), // Candidate model has no timestamps
            Company.countDocuments(companyDateQuery),
            JobDescription.countDocuments(dateQuery),
            InterviewSession.countDocuments({ ...interviewDateQuery, session_status: 'completed' }),
            Application.countDocuments(dateQuery),
            Application.countDocuments({ ...dateQuery, status: 'Hired' })
        ]);

        const hiringRate = totalApplications > 0 ? ((hiredCount / totalApplications) * 100).toFixed(1) : 0;
        const interviewCompletionRate = interviewsConducted > 0 ? interviewsConducted : 0;

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
                appStatusMap['Applied'] += s.count;
            }
        });

        const applicationStatus = Object.keys(appStatusMap).map(status => ({
            status,
            count: appStatusMap[status]
        }));

        // --- 3. Interview Trends ---
        const daysToLookBack = dateRange === 'last90days' ? 90 : dateRange === 'last30days' ? 30 : dateRange === 'alltime' ? 60 : 7;
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

        // --- 4. Application Trends (aligned with interview trends timeframe) ---
        const applicationTrends = await Application.aggregate([
            { $match: { createdAt: { $gte: trendStartDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    applications: { $sum: 1 },
                    hired: {
                        $sum: { $cond: [{ $eq: ["$status", "Hired"] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // --- 5. Company Performance ---
        const companies = await Company.find().sort({ createdAt: -1 }).limit(15);

        const enrichedCompanies = await Promise.all(companies.map(async (comp) => {
            const jobsCount = await JobDescription.countDocuments({ Fk_company_id: comp._id });
            const jobs = await JobDescription.find({ Fk_company_id: comp._id }).select('_id');
            const jobIds = jobs.map(j => j._id);
            const interviewCount = await InterviewSession.countDocuments({ fk_job_id: { $in: jobIds } });
            const applicationCount = await Application.countDocuments({ Fk_job_id: { $in: jobIds } });
            const hiredForCompany = await Application.countDocuments({ Fk_job_id: { $in: jobIds }, status: 'Hired' });

            return {
                name: comp.company_name,
                totalJobs: jobsCount,
                interviews: interviewCount,
                candidates: applicationCount,
                hired: hiredForCompany,
                successRate: applicationCount > 0 ? Math.round((hiredForCompany / applicationCount) * 100) : 0
            };
        }));

        enrichedCompanies.sort((a, b) => (b.totalJobs + b.interviews) - (a.totalJobs + a.interviews));

        // --- 6. Skills Analysis ---
        const skillsAnalysis = await JobDescription.aggregate([
            { $match: dateQuery },
            { $unwind: "$skills" },
            { $group: { _id: "$skills", demand: { $sum: 1 } } },
            { $sort: { demand: -1 } },
            { $limit: 12 }
        ]);

        const enrichedSkills = skillsAnalysis.map(r => ({
            skill: r._id,
            demand: r.demand
        }));

        // --- 7. Job Category Distribution ---
        const jobCategoryDist = await JobDescription.aggregate([
            { $match: dateQuery },
            { $lookup: { from: 'jobcategories', localField: 'Fk_category_id', foreignField: '_id', as: 'category' } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            { $group: { _id: { $ifNull: ['$category.name', 'Uncategorized'] }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // --- 8. Platform Growth (monthly registrations for last 6 months) ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Candidates model has no creation date field, so we can't do true historical growth.
        // We'll mock a smooth growth curve ending at totalCandidates or omit it.
        // For a more authentic dashboard, we'll try to use _id timestamp logic for Candidates since Mongo ObjectIDs contain creation time
        // The first 4 bytes of an ObjectId represent the seconds since the Unix epoch.
        const candidateGrowth = await Candidate.aggregate([
            {
                $addFields: {
                    createdAtTime: { $toDate: "$_id" }
                }
            },
            { $match: { createdAtTime: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAtTime" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const companyGrowth = await Company.aggregate([
            { $match: { created_at: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            overview: {
                totalCandidates,
                totalCompanies,
                totalJobs,
                interviewsConducted,
                totalApplications,
                hiredCount,
                hiringRate: parseFloat(hiringRate)
            },
            applicationStatus,
            interviewTrends,
            applicationTrends,
            companiesData: enrichedCompanies,
            skillsAnalysis: enrichedSkills,
            jobCategoryDist,
            platformGrowth: { candidateGrowth, companyGrowth }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
    }
};
