const Resume = require('../models/Resume');
const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

// Upload a resume to the user's library
exports.uploadResume = async (req, res) => {
    try {
        const { candidateEmail, tag_name } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        if (!tag_name || !tag_name.trim()) {
            // Clean up the uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Tag name is required.' });
        }

        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Candidate profile not found.' });
        }

        const resume = new Resume({
            Fk_candidate_id: candidate._id,
            tag_name: tag_name.trim(),
            original_filename: req.file.originalname,
            resume_path: '/uploads/resumes/' + req.file.filename
        });

        await resume.save();
        res.status(201).json({ message: 'Resume uploaded successfully.', resume });
    } catch (err) {
        console.error('Upload resume error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get all resumes in the user's library
exports.getUserResumes = async (req, res) => {
    try {
        const { email } = req.params;

        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.json([]); // No profile yet — return empty
        }

        const resumes = await Resume.find({
            Fk_candidate_id: candidate._id,
            Fk_job_id: { $exists: false } // Only library resumes (not job-specific)
        }).sort({ uploaded_at: -1 });

        res.json(resumes);
    } catch (err) {
        console.error('Get user resumes error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Rename (retag) a resume in the user's library
exports.renameResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { candidateEmail, tag_name } = req.body;

        if (!tag_name || !tag_name.trim()) {
            return res.status(400).json({ message: 'Tag name cannot be empty.' });
        }

        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        const resume = await Resume.findOneAndUpdate(
            { _id: resumeId, Fk_candidate_id: candidate._id },
            { tag_name: tag_name.trim() },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        res.json({ message: 'Tag updated successfully.', resume });
    } catch (err) {
        console.error('Rename resume error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a resume from the user's library
exports.deleteResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { candidateEmail } = req.body;

        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        const resume = await Resume.findOne({
            _id: resumeId,
            Fk_candidate_id: candidate._id
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        // Delete the physical file from disk
        if (resume.resume_path) {
            // resume_path is like '/uploads/resumes/filename.pdf'
            // The actual file is at 'upload/resumes/filename.pdf' relative to backend root
            const filePath = path.join(__dirname, '..', 'upload', 'resumes', path.basename(resume.resume_path));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Resume.findByIdAndDelete(resumeId);
        res.json({ message: 'Resume deleted successfully.' });
    } catch (err) {
        console.error('Delete resume error:', err);
        res.status(500).json({ message: err.message });
    }
};
