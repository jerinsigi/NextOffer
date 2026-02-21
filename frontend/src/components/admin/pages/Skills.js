import React, { useState, useEffect } from 'react';
import './Users.css'; const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedSkill, setSelectedSkill] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        status: 'Active',
        icon: 'bi bi-stars'
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/skills');
            if (response.ok) {
                const data = await response.json();
                setSkills(data);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedSkill(null);
        setFormData({ name: '', status: 'Active', icon: 'bi bi-stars' });
        setShowModal(true);
    };

    const handleEditClick = (skill) => {
        setModalMode('edit');
        setSelectedSkill(skill);
        setFormData({
            name: skill.name,
            status: skill.status,
            icon: skill.icon || 'bi bi-stars'
        });
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/skills/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchSkills();
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = modalMode === 'edit'
                ? `http://localhost:5000/api/skills/${selectedSkill._id}`
                : 'http://localhost:5000/api/skills';

            const method = modalMode === 'edit' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchSkills();
                setShowModal(false);
            } else {
                const data = await response.json();
                alert(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            {loading ? (
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="page-header mb-4">
                        <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                            <div>
                                <h1 className="page-title">Skills Management</h1>
                                <p className="text-muted">Manage skills database for job postings and user profiles</p>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddClick}>
                                <i className="bi bi-plus-circle me-2"></i>Add New Skill
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap w-100">
                                <input
                                    type="text"
                                    className="form-control form-control-dark"
                                    placeholder="Search skills..."
                                    style={{ maxWidth: '400px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Skill Name</th>
                                        <th>Status</th>
                                        <th>Last Updated</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSkills.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-5">
                                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                                <p className="mt-3 text-muted">No skills found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSkills.map(skill => (
                                            <tr key={skill._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="company-avatar rounded-circle d-flex align-items-center justify-content-center me-2" style={{ overflow: 'hidden' }}>
                                                            <i className={skill.icon || 'bi bi-stars'}></i>
                                                        </div>
                                                        <span className="fw-bold">{skill.name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${skill.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                                        {skill.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(skill.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditClick(skill)} title="Edit Skill">
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(skill._id)} title="Delete Skill">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-white">
                                    <div className="modal-header border-secondary">
                                        <h5 className="modal-title">{modalMode === 'add' ? 'Add New Skill' : 'Edit Skill'}</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Skill Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-dark"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
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
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                            <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Create Skill' : 'Save Changes'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Skills;
