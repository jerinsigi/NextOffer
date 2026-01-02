const express = require('express');
const router = express.Router();
const jobCategoryController = require('../controllers/jobCategoryController');

// Get all job categories
router.get('/', jobCategoryController.getAllCategories);

// Get category statistics
router.get('/stats', jobCategoryController.getCategoryStats);

// Get a single job category
router.get('/:id', jobCategoryController.getCategoryById);

// Create a new job category
router.post('/', jobCategoryController.createCategory);

// Update a job category
router.put('/:id', jobCategoryController.updateCategory);

// Delete a job category
router.delete('/:id', jobCategoryController.deleteCategory);

module.exports = router;
