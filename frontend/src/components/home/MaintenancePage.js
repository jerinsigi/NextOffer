import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MaintenancePage.css';

const MaintenancePage = () => {
    return (
        <div className="maintenance-container d-flex align-items-center justify-content-center min-vh-100 bg-slate-900">
            <div className="text-center bg-slate-800 p-5 rounded-4 shadow-lg border border-slate-700" style={{ maxWidth: '600px', width: '90%' }}>
                <div className="mb-4">
                    <i className="bi bi-tools text-primary" style={{ fontSize: '4rem' }}></i>
                </div>
                <h1 className="text-light fw-bold mb-3">System Under Maintenance</h1>
                <p className="text-muted fs-5 mb-4">
                    We're currently performing some scheduled updates to improve your experience. NextOffer will be back online shortly.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link to="/login" className="btn btn-outline-primary px-4 py-2 rounded-3 text-decoration-none">
                        Login as Admin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
