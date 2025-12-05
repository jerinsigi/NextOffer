const mongoose = require('mongoose');

const interviewResponseSchema = new mongoose.Schema({
    Fk_question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview_Question',
        required: true
    },
    candidate_answer: {
        type: String
    },
    ai_score: {
        type: Number
    },
    confidence_score: {
        type: Number
    },
    submitted_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview_Response', interviewResponseSchema);
