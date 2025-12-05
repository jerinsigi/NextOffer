const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    fk_candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    fk_job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_Description',
        required: true
    },
    session_status: {
        type: String,
        enum: ['pending', 'ongoing', 'completed'],
        default: 'pending'
    },
    started_at: {
        type: Date
    },
    ended_at: {
        type: Date
    }
});

module.exports = mongoose.model('Interview_Session', interviewSessionSchema);
