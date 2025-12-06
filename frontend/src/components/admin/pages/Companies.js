import React, { useState } from 'react';

const Companies = () => {
    const [companies] = useState([
        { id: 1, name: 'TechCorp Inc.', email: 'contact@techcorp.com', users: 15, jobs: 23, status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'StartupXYZ', email: 'info@startupxyz.com', users: 8, jobs: 12, status: 'Active', joined: '2024-02-20' },
        { id: 3, name: 'DataCo', email: 'hello@dataco.com', users: 22, jobs: 45, status: 'Active', joined: '2023-11-10' },
        { id: 4, name: 'CloudTech', email: 'support@cloudtech.com', users: 12, jobs: 18, status: 'Pending', joined: '2024-03-05' },
    ]);

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Company Management</h1>
                    <p className="text-muted">Manage all registered companies and their subscriptions</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>Add New Company
                    </button>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-header-custom">
                    <div className="d-flex gap-3 flex-wrap">
                        <input type="text" className="form-control form-control-dark" placeholder="Search companies..." style={{ maxWidth: '300px' }} />
                        <select className="form-select form-select-dark" style={{ maxWidth: '200px' }}>
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Contact Email</th>
                                <th>Users</th>
                                <th>Active Jobs</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                {company.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="fw-bold">{company.name}</span>
                                        </div>
                                    </td>
                                    <td>{company.email}</td>
                                    <td>{company.users}</td>
                                    <td>{company.jobs}</td>
                                    <td>
                                        <span className={`badge ${company.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                                            {company.status}
                                        </span>
                                    </td>
                                    <td>{company.joined}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-warning">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Companies;
