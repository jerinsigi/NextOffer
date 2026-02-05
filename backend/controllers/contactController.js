const ContactSubmission = require('../models/ContactSubmission');

// Submit a new contact form
exports.submitContactForm = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;

        const newSubmission = new ContactSubmission({
            fullName,
            email,
            subject,
            message
        });

        await newSubmission.save();

        res.status(201).json({ message: 'Message sent successfully!', submission: newSubmission });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all submissions (for admin)
exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update submission status
exports.updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedSubmission = await ContactSubmission.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.status(200).json(updatedSubmission);
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
