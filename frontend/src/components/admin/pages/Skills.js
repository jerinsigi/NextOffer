import React, { useState, useEffect } from 'react';

const Skills = () => {
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
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-light">Skills Management</h2>
                    <p className="text-muted">Manage skills database for job postings and user profiles</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddClick}>
                    <i className="bi bi-plus-lg me-2"></i>Add New Skill
                </button>
            </div>

            {/* Search and Filter */}
            <div className="card bg-dark border-secondary mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-dark border-secondary text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-dark border-secondary text-light"
                                    placeholder="Search skills..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Table */}
            <div className="card bg-dark border-secondary">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0">
                            <thead className="bg-darker">
                                <tr>
                                    <th className="py-3 ps-4">Skill Name</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Last Updated</th>
                                    <th className="py-3 text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSkills.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No skills found</td>
                                    </tr>
                                ) : (
                                    filteredSkills.map(skill => (
                                        <tr key={skill._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-initial rounded bg-primary bg-opacity-10 text-primary me-3" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className={skill.icon || 'bi bi-stars'}></i>
                                                    </div>
                                                    <span className="fw-medium">{skill.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${skill.status === 'Active' ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${skill.status === 'Active' ? 'success' : 'danger'} border border-${skill.status === 'Active' ? 'success' : 'danger'}`}>
                                                    {skill.status}
                                                </span>
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(skill.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEditClick(skill)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(skill._id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-light">{modalMode === 'add' ? 'Add New Skill' : 'Edit Skill'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Skill Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark border-secondary text-light"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Status</label>
                                        <select
                                            className="form-select bg-dark border-secondary text-light"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer border-secondary px-0 pb-0">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Create Skill' : 'Save Changes'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
