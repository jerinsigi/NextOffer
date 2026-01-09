const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    icon: {
        type: String, // Class name for icon (e.g., 'bi bi-code-slash')
        default: 'bi bi-stars'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
