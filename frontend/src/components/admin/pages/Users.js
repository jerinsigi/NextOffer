import React, { useState, useEffect } from 'react';
import './Users.css';
import Loader from '../../common/Loader';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Candidate',
        company: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/admin/users');
            const data = await response.json();

            if (response.ok) {
                setUsersData(data.users);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-success';
            case 'Suspended': return 'bg-danger';
            case 'Inactive': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    };

    const handleViewClick = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/users/admin/users/${userId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('User deleted successfully');
                    setSelectedUser(null);
                    setShowViewModal(false);
                    fetchUsers();
                } else {
                    const data = await response.json();
                    alert(`Failed to delete user: ${data.message}`);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company || '',
            status: user.status
        });
        setShowEditModal(true);
    };

    const handleAddUser = () => {
        setFormData({
            name: '',
            email: '',
            role: 'Candidate',
            company: '',
            status: 'Active'
        });
        setSelectedUser(null);
        setShowAddModal(true);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleSubmitAddEdit = async (e) => {
        e.preventDefault();

        try {
            if (showEditModal) {
                // Determine the correct endpoint based on status
                let endpoint = '';
                if (formData.status === 'suspended') {
                    endpoint = `/api/users/admin/users/${selectedUser.id}/suspend`;
                } else if (formData.status === 'active') {
                    endpoint = `/api/users/admin/users/${selectedUser.id}/activate`;
                } else {
                    alert('Currently only Active and Suspended status changes are supported via this modal directly');
                    return;
                }

                if (endpoint) {
                    const response = await fetch(endpoint, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        alert('User status updated successfully!');
                        fetchUsers();
                        setShowEditModal(false);
                    } else {
                        const data = await response.json();
                        alert(`Failed to update user status: ${data.message || 'Unknown error'}`);
                    }
                }
            } else {
                // Add new Admin user
                const response = await fetch('/api/users/admin/users/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formData.name,
                        email: formData.email
                    })
                });

                if (response.ok) {
                    alert('Admin user added successfully!');
                    fetchUsers();
                    setShowAddModal(false);
                } else {
                    const data = await response.json();
                    alert(`Failed to add admin user: ${data.message || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while saving.');
        }
    };

    return (
        <div className="dashboard-container">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="page-header mb-4">
                        <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                            <div>
                                <h1 className="page-title">User Management</h1>
                                <p className="text-muted">Manage all users, roles, and permissions</p>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddUser}>
                                <i className="bi bi-plus-circle me-2"></i>Add New Admin
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap w-100">
                                <input
                                    type="text"
                                    className="form-control form-control-dark"
                                    placeholder="Search users..."
                                    style={{ maxWidth: '400px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    <select
                                        className="form-select form-select-dark"
                                        style={{ maxWidth: '200px' }}
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="All Roles">All Roles</option>
                                        <option value="Candidate">Candidate</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <select
                                        className="form-select form-select-dark"
                                        style={{ maxWidth: '200px' }}
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="All Status">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-5">
                                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                                <p className="mt-3 text-muted">No users found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="company-avatar rounded-circle d-flex align-items-center justify-content-center me-2" style={{ overflow: 'hidden' }}>
                                                            {user.image_url ? (
                                                                <img src={`http://localhost:5000${user.image_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                getInitials(user.name)
                                                            )}
                                                        </div>
                                                        <span className="fw-bold">{user.name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.company || '-'}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-info" onClick={() => handleViewClick(user)} title="View Details">
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditUser(user)} title="Edit User">
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)} title="Delete User">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* View Modal */}
                    {showViewModal && selectedUser && (
                        <div className="modal fade show d-block modal-extra-wide" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content bg-dark text-white">
                                    <div className="modal-header border-secondary">
                                        <h5 className="modal-title">User Details</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-4 text-center mb-4 mb-md-0">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div className="company-avatar-large rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '120px', height: '120px', fontSize: '2.5rem', overflow: 'hidden' }}>
                                                        {selectedUser.image_url ? (
                                                            <img src={`http://localhost:5000${selectedUser.image_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            getInitials(selectedUser.name)
                                                        )}
                                                    </div>
                                                    <h4 className="mb-1">{selectedUser.name || 'N/A'}</h4>
                                                    <span className={`badge ${getStatusBadge(selectedUser.status)}`}>
                                                        {selectedUser.status}
                                                    </span>

                                                    <div className="mt-4 pt-4 border-top border-secondary w-100">
                                                        <div className="d-flex justify-content-around">
                                                            <div>
                                                                <h4 className="mb-0 text-primary">{selectedUser.interviews || 0}</h4>
                                                                <small className="text-muted">Interviews</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h5 className="border-bottom border-secondary pb-2 mb-3">Basic Information</h5>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-sm-6">
                                                        <small className="text-muted d-block">Username</small>
                                                        <span>{selectedUser.username || 'N/A'}</span>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <small className="text-muted d-block">Email</small>
                                                        <span>{selectedUser.email}</span>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <small className="text-muted d-block">Role</small>
                                                        <span>{selectedUser.role}</span>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <small className="text-muted d-block">Company</small>
                                                        <span>{selectedUser.company || 'N/A'}</span>
                                                    </div>
                                                    {selectedUser.phone && (
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">Phone</small>
                                                            <span>+{selectedUser.phone}</span>
                                                        </div>
                                                    )}
                                                    {selectedUser.location && (
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">Location</small>
                                                            <span>{selectedUser.location}</span>
                                                        </div>
                                                    )}
                                                    {selectedUser.education && (
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">Education</small>
                                                            <span>{selectedUser.education}</span>
                                                        </div>
                                                    )}
                                                    {selectedUser.experience_years !== undefined && selectedUser.experience_years !== null && (
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">Experience</small>
                                                            <span>{selectedUser.experience_years} Years</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {selectedUser.skills && selectedUser.skills.length > 0 && (
                                                    <>
                                                        <h5 className="border-bottom border-secondary pb-2 mb-3 mt-4">Skills</h5>
                                                        <div className="d-flex flex-wrap gap-2 mb-4">
                                                            {selectedUser.skills.map((skill, index) => (
                                                                <div key={index} className="badge bg-secondary d-flex align-items-center" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                                                                    <span>{skill.name}</span>
                                                                    {skill.years && <span className="ms-2 opacity-75 fw-normal">({skill.years} yrs)</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {selectedUser.bio && (
                                                    <>
                                                        <h5 className="border-bottom border-secondary pb-2 mb-3 mt-4">Bio</h5>
                                                        <p className="text-light mb-4 text-justify" style={{ whiteSpace: 'pre-line' }}>{selectedUser.bio}</p>
                                                    </>
                                                )}

                                                {selectedUser.social_links && (selectedUser.social_links.linkedin || selectedUser.social_links.github || selectedUser.social_links.portfolio) && (
                                                    <>
                                                        <h5 className="border-bottom border-secondary pb-2 mb-3 mt-4">Social Links</h5>
                                                        <div className="d-flex gap-3 mb-4 flex-wrap">
                                                            {selectedUser.social_links.linkedin && (
                                                                <a href={selectedUser.social_links.linkedin.startsWith('http') ? selectedUser.social_links.linkedin : `https://${selectedUser.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
                                                                    <i className="bi bi-linkedin"></i> LinkedIn
                                                                </a>
                                                            )}
                                                            {selectedUser.social_links.github && (
                                                                <a href={selectedUser.social_links.github.startsWith('http') ? selectedUser.social_links.github : `https://${selectedUser.social_links.github}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-light d-flex align-items-center gap-2">
                                                                    <i className="bi bi-github"></i> GitHub
                                                                </a>
                                                            )}
                                                            {selectedUser.social_links.portfolio && (
                                                                <a href={selectedUser.social_links.portfolio.startsWith('http') ? selectedUser.social_links.portfolio : `https://${selectedUser.social_links.portfolio}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info d-flex align-items-center gap-2">
                                                                    <i className="bi bi-person-badge"></i> Portfolio
                                                                </a>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-secondary">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                                        <button type="button" className="btn btn-outline-warning" onClick={() => { setShowViewModal(false); handleEditUser(selectedUser); }}>
                                            <i className="bi bi-pencil me-2"></i>Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit/Add Modal */}
                    {(showAddModal || showEditModal) && (
                        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-white">
                                    <div className="modal-header border-secondary">
                                        <h5 className="modal-title">{showEditModal ? 'Edit User Status' : 'Add New Admin'}</h5>
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setShowEditModal(false);
                                            }}
                                        ></button>
                                    </div>
                                    <form onSubmit={handleSubmitAddEdit}>
                                        <div className="modal-body">
                                            {showEditModal ? (
                                                <>
                                                    <div className="mb-3">
                                                        <label className="form-label">Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-dark"
                                                            value={formData.name}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control form-control-dark"
                                                            value={formData.email}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <select
                                                            className="form-select form-select-dark"
                                                            value={formData.status}
                                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                            <option value="suspended">Suspended</option>
                                                            <option value="pending">Pending</option>
                                                        </select>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mb-3">
                                                        <label className="form-label">Admin Username</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-dark"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                                            placeholder="lowercase, numbers, underscores only"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Admin Email Address</label>
                                                        <input
                                                            type="email"
                                                            className="form-control form-control-dark"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3" style={{ display: 'none' }}>
                                                        <label className="form-label">Role</label>
                                                        <select
                                                            className="form-select form-select-dark"
                                                            value={formData.role}
                                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                        >
                                                            <option value="Admin">Admin</option>
                                                        </select>
                                                    </div>
                                                </>
                                            )}
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
                                            <button type="submit" className="btn btn-primary">
                                                {showEditModal ? 'Save Changes' : 'Add Admin'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }
        </div >
    );
};

export default Users;
