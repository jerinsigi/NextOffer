const mongoose = require('mongoose');

const finalReportSchema = new mongoose.Schema({
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
    resume_score: {
        type: Number
    },
    interview_score: {
        type: Number
    },
    integrity_score: {
        type: Number
    },
    final_trust_score: {
        type: Number
    },
    recommendation: {
        type: String
    },
    generated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Final_Report', finalReportSchema);
