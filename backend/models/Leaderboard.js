const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    Fk_job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_Description',
        required: true
    },
    Fk_candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    final_score: {
        type: Number
    },
    rank: {
        type: Number
    },
    generated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
