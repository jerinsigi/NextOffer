const JobCategory = require('../models/JobCategory');

// Get all job categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await JobCategory.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single job category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await JobCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new job category
exports.createCategory = async (req, res) => {
    const category = new JobCategory({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status || 'Active'
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// Update a job category
exports.updateCategory = async (req, res) => {
    try {
        const category = await JobCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (req.body.name != null) category.name = req.body.name;
        if (req.body.description != null) category.description = req.body.description;
        if (req.body.status != null) category.status = req.body.status;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// Delete a job category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await JobCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get category statistics
exports.getCategoryStats = async (req, res) => {
    try {
        const total = await JobCategory.countDocuments();
        const active = await JobCategory.countDocuments({ status: 'Active' });
        const inactive = await JobCategory.countDocuments({ status: 'Inactive' });

        const categories = await JobCategory.find();
        const totalJobs = categories.reduce((sum, cat) => sum + cat.jobCount, 0);

        res.json({
            total,
            active,
            inactive,
            totalJobs
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
