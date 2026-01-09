const Skill = require('../models/Skill');

// Create a new skill
exports.createSkill = async (req, res) => {
    try {
        const { name } = req.body;
        const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (existingSkill) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        const newSkill = new Skill(req.body);
        await newSkill.save();
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all skills
exports.getAllSkills = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skills = await Skill.find(query).sort({ name: 1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a skill
exports.updateSkill = async (req, res) => {
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(updatedSkill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
