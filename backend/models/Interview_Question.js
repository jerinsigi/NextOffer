const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    Fk_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview_Session',
        required: true
    },
    question_text: {
        type: String,
        required: true
    },
    topic: {
        type: String
    },
    difficulty_level: {
        type: String
    },
    generated_by: {
        type: String,
        default: 'AI'
    }
});

module.exports = mongoose.model('Interview_Question', interviewQuestionSchema);
