const mongoose = require('mongoose');

const integrityLogSchema = new mongoose.Schema({
    Fk_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview_Session',
        required: true
    },
    tab_switch_count: {
        type: Number,
        default: 0
    },
    gaze_away_count: {
        type: Number,
        default: 0
    },
    face_absent_count: {
        type: Number,
        default: 0
    },
    integrity_score: {
        type: Number
    },
    logged_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Integrity_Log', integrityLogSchema);
