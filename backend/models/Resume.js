const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    Fk_candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    // Optional — only set when resume is linked to a specific application
    Fk_job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_Description'
    },
    tag_name: {
        type: String,
        required: true,
        trim: true
    },
    original_filename: {
        type: String
    },
    resume_path: {
        type: String
    },
    extracted_skills: {
        type: [String]
    },
    resume_match_score: {
        type: Number
    },
    skill_gaps: {
        type: [String]
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
