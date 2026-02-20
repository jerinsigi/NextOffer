const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    // General Settings
    maintenanceMode: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('System_Settings', systemSettingsSchema);
