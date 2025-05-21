import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state on component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                setIsAuthenticated(true);
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login user
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Check if user has required role
    const hasRole = (requiredRole) => {
        if (!user) return false;

        if (requiredRole === 'any') return true;

        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }

        return user.role === requiredRole;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                hasRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 