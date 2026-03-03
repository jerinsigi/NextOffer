import React, { useState, useEffect } from 'react';
import './Users.css';
import Loader from '../../common/Loader';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Candidate',
        company: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    const usersData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@techcorp.com',
            role: 'Candidate',
            company: 'TechCorp Inc.',
            status: 'Active',
            lastLogin: '2024-12-06 10:30 AM',
            joinDate: '2024-01-15',
            interviews: 5,
            violationCount: 0,
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@innovate.com',
            role: 'HR Manager',
            company: 'Innovate Solutions',
            status: 'Active',
            lastLogin: '2024-12-06 09:15 AM',
            joinDate: '2023-11-20',
            interviews: 23,
            violationCount: 1,
            avatar: 'SJ'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'mchen@startupx.io',
            role: 'Candidate',
            company: 'StartupX',
            status: 'Suspended',
            lastLogin: '2024-12-05 03:20 PM',
            joinDate: '2024-03-08',
            interviews: 2,
            violationCount: 3,
            avatar: 'MC'
        },
        {
            id: 4,
            name: 'Emily Rodriguez',
            email: 'emily.r@megacorp.com',
            role: 'Recruiter',
            company: 'MegaCorp Ltd.',
            status: 'Active',
            lastLogin: '2024-12-06 11:45 AM',
            joinDate: '2024-02-12',
            interviews: 45,
            violationCount: 0,
            avatar: 'ER'
        },
        {
            id: 5,
            name: 'David Kim',
            email: 'david.kim@techvision.com',
            role: 'Candidate',
            company: 'TechVision',
            status: 'Active',
            lastLogin: '2024-12-05 08:30 PM',
            joinDate: '2024-04-22',
            interviews: 8,
            violationCount: 0,
            avatar: 'DK'
        },
        {
            id: 6,
            name: 'Lisa Anderson',
            email: 'l.anderson@global.com',
            role: 'Company Company',
            company: 'Global Industries',
            status: 'Active',
            lastLogin: '2024-12-06 07:00 AM',
            joinDate: '2023-09-05',
            interviews: 67,
            violationCount: 0,
            avatar: 'LA'
        },
        {
            id: 7,
            name: 'Robert Taylor',
            email: 'rtaylor@future.io',
            role: 'Candidate',
            company: 'Future Tech',
            status: 'Inactive',
            lastLogin: '2024-11-28 02:15 PM',
            joinDate: '2024-05-10',
            interviews: 1,
            violationCount: 0,
            avatar: 'RT'
        },
        {
            id: 8,
            name: 'Jennifer Lee',
            email: 'jlee@enterprise.com',
            role: 'HR Manager',
            company: 'Enterprise Corp',
            status: 'Active',
            lastLogin: '2024-12-06 10:00 AM',
            joinDate: '2023-12-01',
            interviews: 34,
            violationCount: 0,
            avatar: 'JL'
        },
        {
            id: 9,
            name: 'Alex Martinez',
            email: 'alex.m@nexgen.com',
            role: 'Candidate',
            company: 'NexGen Systems',
            status: 'Active',
            lastLogin: '2024-12-06 09:45 AM',
            joinDate: '2024-06-18',
            interviews: 12,
            violationCount: 2,
            avatar: 'AM'
        },
        {
            id: 10,
            name: 'Maria Garcia',
            email: 'mgarcia@innovate.com',
            role: 'Recruiter',
            company: 'Innovate Solutions',
            status: 'Active',
            lastLogin: '2024-12-06 11:20 AM',
            joinDate: '2024-01-25',
            interviews: 28,
            violationCount: 0,
            avatar: 'MG'
        }
    ];

    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.company.toLowerCase().includes(searchTerm.toLowerCase());
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
            'Company Company': 'role-badge-company'
        };
        return badges[role] || 'role-badge-candidate';
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleSuspendUser = (userId) => {
        console.log('Suspending user:', userId);
        // Add suspend logic
    };

    const handleActivateUser = (userId) => {
        console.log('Activating user:', userId);
        // Add activate logic
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            console.log('Deleting user:', userId);
            // Add delete logic
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

    const handleResetPassword = (userId) => {
        console.log('Sending password reset email to user:', userId);
        alert('Password reset email sent successfully');
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


    if (loading) return <Loader inline />;

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="text-muted">Manage all users, roles, and permissions</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleAddUser}>
                        <i className="bi bi-plus-circle me-2"></i>Add New User
                    </button>
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
                            <div className="stat-value">12,789</div>
                            <div className="stat-trend text-success">
                                <i className="bi bi-arrow-up"></i> 8.2% from last month
                            </div>
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
                            <div className="stat-value">11,234</div>
                            <div className="stat-trend text-success">
                                <i className="bi bi-arrow-up"></i> 87.8% active rate
                            </div>
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
                            <div className="stat-value">156</div>
                            <div className="stat-trend text-danger">
                                <i className="bi bi-arrow-up"></i> 12 new this week
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon bg-info bg-opacity-20 text-info">
                            <i className="bi bi-person-plus fs-3"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">New This Month</div>
                            <div className="stat-value">1,047</div>
                            <div className="stat-trend text-success">
                                <i className="bi bi-arrow-up"></i> 15% growth
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Table */}
            <div className="dashboard-card">
                <div className="card-header-custom">
                    <h5 className="card-title mb-0">All Users</h5>
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
                            <option value="HR Manager">HR Manager</option>
                            <option value="Recruiter">Recruiter</option>
                            <option value="Company Company">Company Company</option>
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
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Company</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Interviews</th>
                                    <th>Violations</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        onClick={() => handleUserClick(user)}
                                        className={selectedUser?.id === user.id ? 'selected' : ''}
                                    >
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">{user.avatar}</div>
                                                <span className="user-name">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.company}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>{user.lastLogin}</td>
                                        <td>
                                            <span className="interview-count">{user.interviews}</span>
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
                                                <button
                                                    className="btn-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResetPassword(user.id);
                                                    }}
                                                    title="Reset Password"
                                                >
                                                    <i className="bi bi-key"></i>
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
                                ))}
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
                                    <div className="user-avatar-large">{selectedUser.avatar}</div>
                                    <h4>{selectedUser.name}</h4>
                                    <p className="text-muted">{selectedUser.email}</p>
                                    <span className={`status-badge ${getStatusBadge(selectedUser.status)}`}>
                                        {selectedUser.status}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <h6>Account Information</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">User ID:</span>
                                        <span className="detail-value">#{selectedUser.id.toString().padStart(5, '0')}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Role:</span>
                                        <span className={`role-badge ${getRoleBadge(selectedUser.role)}`}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Company:</span>
                                        <span className="detail-value">{selectedUser.company}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Join Date:</span>
                                        <span className="detail-value">{selectedUser.joinDate}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Last Login:</span>
                                        <span className="detail-value">{selectedUser.lastLogin}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Activity Summary</h6>
                                    <div className="detail-item">
                                        <span className="detail-label">Total Interviews:</span>
                                        <span className="detail-value">{selectedUser.interviews}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Violations:</span>
                                        <span className={selectedUser.violationCount > 0 ? "detail-value text-danger" : "detail-value text-success"}>
                                            {selectedUser.violationCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6>Actions</h6>
                                    <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => handleEditUser(selectedUser)}>
                                        <i className="bi bi-pencil me-2"></i>Edit User
                                    </button>
                                    <button className="btn btn-sm btn-secondary w-100 mb-2" onClick={() => handleResetPassword(selectedUser.id)}>
                                        <i className="bi bi-key me-2"></i>Reset Password
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
                                            <option value="HR Manager">HR Manager</option>
                                            <option value="Recruiter">Recruiter</option>
                                            <option value="Company Company">Company Company</option>
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
        </div>
    );
};

export default Users;
