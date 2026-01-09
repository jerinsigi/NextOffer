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
    },
    location: {
        type: String
    },
    current_role: {
        type: String
    },
    bio: {
        type: String
    },
    skills: [{
        name: String,
        level: String,
        years: Number
    }],
    social_links: {
        linkedin: String,
        github: String,
        portfolio: String
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);
