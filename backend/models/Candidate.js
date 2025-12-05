const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    education: {
        type: String
    },
    experience_years: {
        type: Number
    },
    image_url: {
        type: String
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);
