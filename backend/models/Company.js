const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    industry: {
        type: String
    },
    location: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String
    },
    company_desc: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Suspended'],
        default: 'Pending'
    },
    logo: {
        type: String
    }
});

module.exports = mongoose.model('Company', companySchema);
