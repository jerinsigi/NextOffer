import React, { useState, useEffect } from 'react';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Form State
    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        industry: '',
        location: '',
        website: '',
        status: 'Active'
    });

    const API_URL = 'http://localhost:5000/api/companies';

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setIsEdit(false);
        setCurrentCompany(null);
        setFormData({
            company_name: '',
            email: '',
            industry: '',
            location: '',
            website: '',
            status: 'Active'
        });
        setShowModal(true);
    };

    const handleEditClick = (company) => {
        setIsEdit(true);
        setCurrentCompany(company);
        setFormData({
            company_name: company.company_name,
            email: company.email,
            industry: company.industry || '',
            location: company.location || '',
            website: company.website || '',
            status: company.status
        });
        setShowModal(true);
    };

    const handleApproveClick = async (company) => {
        try {
            // Use the approval endpoint which updates both Company and Login status
            const response = await fetch(`${API_URL}/${company._id}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message || 'Company approved successfully! They can now login.');
                fetchCompanies();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to approve company');
            }
        } catch (error) {
            console.error('Error approving company:', error);
            alert('Failed to approve company.');
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                fetchCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `${API_URL}/${currentCompany._id}` : API_URL;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowModal(false);
                fetchCompanies();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error saving company:', error);
            alert('Failed to save company. Please check if the backend server is running and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter companies based on search term and status
    const filteredCompanies = companies.filter(company => {
        const matchesSearch =
            company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'All Status' || company.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">Company Management</h1>
                    <p className="text-muted">Manage all registered companies and their subscriptions</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleAddClick}>
                        <i className="bi bi-plus-circle me-2"></i>Add New Company
                    </button>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-header-custom">
                    <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap w-100">
                        <input
                            type="text"
                            className="form-control form-control-dark"
                            placeholder="Search companies..."
                            style={{ maxWidth: '300px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="form-select form-select-dark"
                            style={{ maxWidth: '200px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
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
                                <th>Industry</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map(company => (
                                <tr key={company._id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                {company.company_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="fw-bold">{company.company_name}</span>
                                        </div>
                                    </td>
                                    <td>{company.email}</td>
                                    <td>{company.industry || '-'}</td>
                                    <td>{company.location || '-'}</td>
                                    <td>
                                        <span className={`badge ${company.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                                            {company.status}
                                        </span>
                                    </td>
                                    <td>{new Date(company.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {company.status === 'Pending' && (
                                                <button className="btn btn-sm btn-outline-success" onClick={() => handleApproveClick(company)} title="Approve Company">
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                            )}
                                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditClick(company)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(company._id)}>
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

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{isEdit ? 'Edit Company' : 'Add New Company'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-dark"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Industry</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select form-select-dark"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
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

export default Companies;
