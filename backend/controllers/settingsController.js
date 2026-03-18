const System_Settings = require('../models/System_Settings');

// Initialize settings if they don't exist
const initializeSettings = async () => {
    try {
        const count = await System_Settings.countDocuments();
        if (count === 0) {
            await System_Settings.create({});
        }
    } catch (error) {
        console.error('Error initializing system settings:', error);
    }
};

// @desc    Get system settings (Admin only)
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        let settings = await System_Settings.findOne();

        // If no settings exist yet, create defaults
        if (!settings) {
            settings = await System_Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching system settings:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch settings'
        });
    }
};

// @desc    Get public system settings (For frontend pre-login checks)
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = async (req, res) => {
    try {
        let settings = await System_Settings.findOne();

        if (!settings) {
            settings = await System_Settings.create({});
        }

        // Only return settings safe for public viewing
        const publicSettings = {
            maintenanceMode: settings.maintenanceMode
        };

        res.status(200).json({
            success: true,
            data: publicSettings
        });
    } catch (error) {
        console.error('Error fetching public system settings:', error);
        // Fallback safe values if db fails
        res.status(200).json({
            success: true,
            data: {
                maintenanceMode: false
            }
        });
    }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { maintenanceMode } = req.body;

        let settings = await System_Settings.findOne();

        if (!settings) {
            settings = new System_Settings();
        }

        // Update fields
        if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;

        await settings.save();

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Error updating system settings:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not update settings'
        });
    }
};

module.exports = {
    initializeSettings,
    getSettings,
    getPublicSettings,
    updateSettings
};
