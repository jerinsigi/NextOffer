import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        suspended: 0,
        newThisMonth: 0
    });
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
                setStatistics(data.statistics);
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
            user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const badges = {
            'Active': 'status-badge-active',
            'Inactive': 'status-badge-inactive',
            'Suspended': 'status-badge-suspended'
        };
        return badges[status] || 'status-badge-inactive';
    };

    const getRoleBadge = (role) => {
        const badges = {
            'Candidate': 'role-badge-candidate',
            'HR Manager': 'role-badge-hr',
            'Recruiter': 'role-badge-recruiter',
            'Company Admin': 'role-badge-admin'
        };
        return badges[role] || 'role-badge-candidate';
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleSuspendUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/admin/users/${userId}/suspend`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('User suspended successfully');
                fetchUsers();
            } else {
                const data = await response.json();
                alert(`Failed to suspend user: ${data.message}`);
            }
        } catch (error) {
            console.error('Error suspending user:', error);
            alert('Failed to suspend user');
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/admin/users/${userId}/activate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('User activated successfully');
                fetchUsers();
            } else {
                const data = await response.json();
                alert(`Failed to activate user: ${data.message}`);
            }
        } catch (error) {
            console.error('Error activating user:', error);
            alert('Failed to activate user');
        }
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
            company: user.company,
            status: user.status
        });
        setShowEditModal(true);
    };



    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };



    return (
        <div className="dashboard-container">
            {loading ? (
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="page-header mb-4">
                        <div>
                            <h1 className="page-title">User Management</h1>
                            <p className="text-muted">Manage all users, roles, and permissions</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-primary bg-opacity-20 text-primary">
                                    <i className="bi bi-people fs-3"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Users</div>
                                    <div className="stat-value">{statistics.total.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-success bg-opacity-20 text-success">
                                    <i className="bi bi-person-check fs-3"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">Active Users</div>
                                    <div className="stat-value">{statistics.active.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                                    <i className="bi bi-person-x fs-3"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">Suspended Users</div>
                                    <div className="stat-value">{statistics.suspended.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-secondary bg-opacity-20 text-secondary">
                                    <i className="bi bi-person-dash fs-3"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">Inactive Users</div>
                                    <div className="stat-value">{(statistics.total - statistics.active).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="dashboard-card">
                        <div className="card-header-custom">
                            <div className="users-filters">
                                <div className="search-box">
                                    <i className="bi bi-search"></i>
                                    <input
                                        type="text"
                                        className="form-control-dark"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="form-select-dark"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="Candidate">Candidate</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <select
                                    className="form-select-dark"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="users-content">
                            <div className="users-table-wrapper">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Name & Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Interviews</th>
                                            <th>Violations</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <i className="bi bi-inbox" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
                                                    <p className="mt-3 text-muted">No users found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => handleUserClick(user)}
                                                    className={selectedUser?.id === user.id ? 'selected' : ''}
                                                >
                                                    <td>
                                                        <div className="user-info">
                                                            {user.image_url ? (
                                                                <img
                                                                    src={user.image_url}
                                                                    alt={user.name}
                                                                    className="user-avatar-img"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextElementSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className="user-avatar" style={{ display: user.image_url ? 'none' : 'flex' }}>
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div className="user-name-container">
                                                                <span className="user-name">{user.name || 'N/A'}</span>
                                                                <span className="user-username">@{user.username || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`role-badge ${getRoleBadge(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${getStatusBadge(user.status)}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="interview-count">{user.interviews || 0}</span>
                                                    </td>
                                                    <td>
                                                        {user.violationCount > 0 ? (
                                                            <span className="violation-count danger">
                                                                {user.violationCount}
                                                            </span>
                                                        ) : (
                                                            <span className="violation-count safe">0</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditUser(user);
                                                                }}
                                                                title="Edit User"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            {user.status === 'Active' ? (
                                                                <button
                                                                    className="btn-icon danger"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSuspendUser(user.id);
                                                                    }}
                                                                    title="Suspend User"
                                                                >
                                                                    <i className="bi bi-ban"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn-icon success"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleActivateUser(user.id);
                                                                    }}
                                                                    title="Activate User"
                                                                >
                                                                    <i className="bi bi-check-circle"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                            </div>

                            {/* User Details Panel */}
                            {selectedUser && (
                                <div className="user-details-panel">
                                    <div className="panel-header">
                                        <h5>User Details</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setSelectedUser(null)}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="panel-content">
                                        <div className="user-profile">
                                            {selectedUser.image_url ? (
                                                <img 
                                                    src={selectedUser.image_url} 
                                                    alt={selectedUser.name} 
                                                    className="user-avatar-large-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="user-avatar-large" style={{ display: selectedUser.image_url ? 'none' : 'flex' }}>
                                                {getInitials(selectedUser.name)}
                                            </div>
                                            <h4>{selectedUser.name || 'N/A'}</h4>
                                            <p className="text-muted">@{selectedUser.username || 'N/A'}</p>
                                            <span className={`status-badge ${getStatusBadge(selectedUser.status)}`}>
                                                {selectedUser.status}
                                            </span>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Account Information</h6>
                                            <div className="detail-item">
                                                <span className="detail-label">User ID:</span>
                                                <span className="detail-value">{selectedUser.id}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Role:</span>
                                                <span className={`role-badge ${getRoleBadge(selectedUser.role)}`}>
                                                    {selectedUser.role}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Join Date:</span>
                                                <span className="detail-value">{formatDate(selectedUser.joinDate)}</span>
                                            </div>
                                            {selectedUser.phone && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Phone:</span>
                                                    <span className="detail-value">{selectedUser.phone}</span>
                                                </div>
                                            )}
                                            {selectedUser.location && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Location:</span>
                                                    <span className="detail-value">{selectedUser.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="detail-section">
                                            <h6>Activity Summary</h6>
                                            <div className="detail-item">
                                                <span className="detail-label">Total Interviews:</span>
                                                <span className="detail-value">{selectedUser.interviews || 0}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Violations:</span>
                                                <span className={selectedUser.violationCount > 0 ? "detail-value text-danger" : "detail-value text-success"}>
                                                    {selectedUser.violationCount || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h6>Actions</h6>
                                            <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleEditUser(selectedUser)}>
                                                <i className="bi bi-pencil me-2"></i>Edit User
                                            </button>
                                            {selectedUser.status === 'Active' ? (
                                                <button className="btn btn-sm btn-warning w-100 mb-2" onClick={() => handleSuspendUser(selectedUser.id)}>
                                                    <i className="bi bi-ban me-2"></i>Suspend User
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-success w-100 mb-2" onClick={() => handleActivateUser(selectedUser.id)}>
                                                    <i className="bi bi-check-circle me-2"></i>Activate User
                                                </button>
                                            )}
                                            <button className="btn btn-sm btn-danger w-100" onClick={() => handleDeleteUser(selectedUser.id)}>
                                                <i className="bi bi-trash me-2"></i>Delete User
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
                                        <h5 className="modal-title">{showEditModal ? 'Edit User' : 'Add New User'}</h5>
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setShowEditModal(false);
                                            }}
                                        ></button>
                                    </div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        // Handle form submission here
                                        console.log('Form submitted:', formData);
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                    }}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-dark"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-dark"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Role</label>
                                                <select
                                                    className="form-select form-select-dark"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                >
                                                    <option value="Candidate">Candidate</option>
                                                    <option value="Company Admin">Company</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Company</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-dark"
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                                    <option value="Suspended">Suspended</option>
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
                                            <button type="submit" className="btn btn-primary">
                                                {showEditModal ? 'Save Changes' : 'Add User'}
                                            </button>
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

export default Users;
