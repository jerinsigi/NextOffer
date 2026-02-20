import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const MaintenanceGuard = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkSettings = async () => {
            try {
                // Fetch public settings that include maintenance mode status
                const { data } = await axios.get('http://localhost:5000/api/settings/public');

                if (data.success && data.data) {
                    setIsMaintenance(data.data.maintenanceMode);
                }
            } catch (error) {
                console.error('Error checking maintenance mode:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSettings();
    }, [location.pathname]); // Re-check on navigation

    if (loading) {
        // You could return a loading spinner here
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#0f172a' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    // Always allow admin and login routes unconditionally
    const isAllowedRoute = location.pathname.startsWith('/admin') ||
        location.pathname === '/login' ||
        location.pathname === '/maintenance';

    // Check if user is an admin by parsing their token storage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    let isAdmin = false;

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            isAdmin = user.usertype === 'admin';
        } catch (e) {
            console.error('Error parsing user on maintenance guard', e);
        }
    }

    // If we're in maintenance mode AND route is not allowed AND user is not admin
    if (isMaintenance && !isAllowedRoute && !isAdmin) {
        return <Navigate to="/maintenance" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default MaintenanceGuard;
