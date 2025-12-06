import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';

const AuthNavbar = ({ showButtons = false }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent pt-4">
            <div className="container">
                <Link className="navbar-brand fw-bold text-light fs-3 d-flex align-items-center gap-2" to="/">
                    <img src={logo} alt="NextOffer Logo" style={{ height: '40px' }} />
                    NextOffer
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-3" href="/#features">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-3" href="/#about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-3" href="/#contact">Contact</a>
                        </li>
                    </ul>
                    {showButtons && (
                        <div className="d-flex ms-lg-3">
                            <Link to="/login" className="btn btn-outline-light me-3 px-4 rounded-pill">Login</Link>
                            <Link to="/register" className="btn btn-primary px-4 rounded-pill shadow-lg">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AuthNavbar;
