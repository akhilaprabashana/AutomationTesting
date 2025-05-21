import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute = ({ children, requiredRole = 'any' }) => {
    const { isAuthenticated, user, loading, hasRole } = useAuth();
    const location = useLocation();

    // Show loading indicator while checking authentication
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (!hasRole(requiredRole)) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography variant="h5" color="error">
                    Access Denied
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    You don't have the necessary permissions to access this page.
                </Typography>
            </Box>
        );
    }

    // User is authenticated and has required role, render the protected component
    return children;
};

export default PrivateRoute; 