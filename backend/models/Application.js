const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    Fk_candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    Fk_job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_Description',
        required: true
    },
    Fk_resume_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Scheduled', 'Interviewing', 'Rejected', 'Hired'],
        default: 'Applied'
    },
    coverLetter: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ Fk_candidate_id: 1, Fk_job_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
