
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    // Check both storages as Login.js might use either based on 'Remember Me'
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!userStr) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);

        // If roles are specified, check if user has permission
        if (allowedRoles.length > 0) {
            const userRole = user.usertype || 'candidate'; // Default to candidate if missing

            // Normalize for comparison if needed, but assuming lowercase based on code analysis
            if (!allowedRoles.includes(userRole)) {
                // User is logged in but unauthorized for this route
                // Redirect to their appropriate dashboard to avoid infinite loops or confusion
                if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
                if (userRole === 'company') return <Navigate to="/company/dashboard" replace />;
                return <Navigate to="/user/dashboard" replace />;
            }
        }

        // Authorized
        return <Outlet />;
    } catch (error) {
        console.error("Error parsing user data", error);
        // malicious or corrupted data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
