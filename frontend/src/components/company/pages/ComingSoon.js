import React from 'react';

const ComingSoon = ({ title, subtitle, icon }) => {
    return (
        <div className="dashboard-container">
            <div className="page-header mb-4">
                <div>
                    <h1 className="page-title">{title}</h1>
                    <p className="text-muted">{subtitle}</p>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="p-5 text-center" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <i className={`bi ${icon} fs-1 text-primary mb-4 d-block`} style={{ fontSize: '4rem' }}></i>
                    <h3 className="text-light mb-3">Coming Soon</h3>
                    <p className="text-muted">{title} interface is under development</p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
