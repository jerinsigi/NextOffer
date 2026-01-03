const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        enum: ['candidate', 'recruiter', 'admin', 'company'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
});

module.exports = mongoose.model('Login', loginSchema);
