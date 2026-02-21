import React, { useState, useEffect } from 'react';
import './JobCategories.css';
import Loader from '../../common/Loader';

const JobCategories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalJobs: 0
    });

    const API_URL = 'http://localhost:5000/api/job-categories';

    // Fetch categories from backend
    useEffect(() => {
        fetchCategories();
        fetchStats();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            setCategoriesData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/stats`);
            const statsData = await response.json();
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const filteredCategories = categoriesData.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        return status === 'Active' ? 'status-badge-active' : 'status-badge-inactive';
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                await fetch(`${API_URL}/${categoryId}`, {
                    method: 'DELETE',
                });
                fetchCategories();
                fetchStats();
                setSelectedCategory(null);
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            status: category.status
        });
        setShowEditModal(true);
    };

    const handleAddCategory = () => {
        setFormData({
            name: '',
            description: '',
            status: 'Active'
        });
        setSelectedCategory(null);
        setShowAddModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = showEditModal ? `${API_URL}/${selectedCategory._id}` : API_URL;
            const method = showEditModal ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowAddModal(false);
                setShowEditModal(false);
                fetchCategories();
                fetchStats();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (err) {
            console.error('Error saving category:', err);
            alert('Failed to save category. Please check if the backend server is running and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Job Categories</h1>
                    <p className="text-muted">Manage job categories and descriptions for companies</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleAddCategory}>
                        <i className="bi bi-plus-circle me-2"></i>Add New Category
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}



            {/* Categories Table */}
            <div className="dashboard-card">
                <div className="card-header-custom">
                    <h5 className="card-title mb-0">All Categories</h5>
                    <div className="categories-filters">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control-dark"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select-dark"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="categories-content">
                    <div className="categories-table-wrapper">
                        <table className="categories-table">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Job Count</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(category => (
                                    <tr
                                        key={category._id}
                                        onClick={() => handleCategoryClick(category)}
                                        className={selectedCategory?._id === category._id ? 'selected' : ''}
                                    >
                                        <td>
                                            <div className="category-info">
                                                <div className="category-icon">
                                                    <i className="bi bi-folder"></i>
                                                </div>
                                                <span className="category-name">{category.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-description">{category.description}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(category.status)}`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="job-count">{category.jobCount} jobs</span>
                                        </td>
                                        <td>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditCategory(category);
                                                    }}
                                                    title="Edit Category"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn-icon danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCategory(category._id);
                                                    }}
                                                    title="Delete Category"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Category Details Panel */}
                    {selectedCategory && (
                        <div className="category-details-panel">
                            <div className="panel-header">
                                <h5>Category Details</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="panel-content">
                                <div className="category-profile">
                                    <div className="category-icon-large">
                                        <i className="bi bi-folder"></i>
                                    </div>
                                    <h4>{selectedCategory.name}</h4>
                                    <p className="text-muted">{selectedCategory.description}</p>
                                    <span className={`status-badge ${getStatusBadge(selectedCategory.status)}`}>
                                        {selectedCategory.status}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <h6>Category Information</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Category ID:</span>
                                        <span className="detail-value">{selectedCategory._id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total Jobs:</span>
                                        <span className="detail-value">{selectedCategory.jobCount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created Date:</span>
                                        <span className="detail-value">{selectedCategory.createdAt ? new Date(selectedCategory.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className={`status-badge ${getStatusBadge(selectedCategory.status)}`}>
                                            {selectedCategory.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleEditCategory(selectedCategory)}>
                                        <i className="bi bi-pencil me-2"></i>Edit Category
                                    </button>
                                    <button className="btn btn-sm btn-danger w-100" onClick={() => handleDeleteCategory(selectedCategory._id)}>
                                        <i className="bi bi-trash me-2"></i>Delete Category
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{showEditModal ? 'Edit Category' : 'Add New Category'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="e.g., Software Development"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control form-control-dark"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Brief description of this category..."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select form-select-dark"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Category')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobCategories;
