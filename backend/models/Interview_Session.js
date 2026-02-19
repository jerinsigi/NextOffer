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
    },
    actual_started_at: {
        type: Date   // set when candidate opens the interview
    },
    actual_completed_at: {
        type: Date   // set when candidate submits / completes
    }
});

module.exports = mongoose.model('Interview_Session', interviewSessionSchema);
