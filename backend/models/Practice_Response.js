const mongoose = require('mongoose');

const PracticeResponseSchema = new mongoose.Schema({
    practiceQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Practice_Question',
        required: true
    },
    practiceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Practice_Session',
        required: true
    },
    candidate_answer: {
        type: String,
        default: ''
    },
    ai_score: {
        type: Number,
        default: null
    },
    confidence_score: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: null
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Practice_Response', PracticeResponseSchema);
