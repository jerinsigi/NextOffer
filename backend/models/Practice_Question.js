const mongoose = require('mongoose');

const PracticeQuestionSchema = new mongoose.Schema({
    practiceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Practice_Session',
        required: true
    },
    question_text: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        default: 'General'
    },
    difficulty_level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    generated_by: {
        type: String,
        default: 'AI'
    },
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Practice_Question', PracticeQuestionSchema);
