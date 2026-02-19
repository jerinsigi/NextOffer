const mongoose = require('mongoose');

const PracticeSessionSchema = new mongoose.Schema({
    candidateEmail: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    questionCount: {
        type: Number,
        default: 5
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    overallScore: {
        type: Number,
        default: null
    },
    aiFeedbackSummary: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Practice_Session', PracticeSessionSchema);
