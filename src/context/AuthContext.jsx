import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Helper: normalize the roles array from backend (e.g. ["ROLE_ADMIN"]) into
    // a single lowercase role string the frontend expects (e.g. "admin").
    const normalizeRole = (roles) => {
        if (!roles || roles.length === 0) return 'staff';
        // Backend sends roles like "ROLE_ADMIN" or "ROLE_STAFF"
        const raw = roles[0]; // take the first role
        return raw.replace(/^ROLE_/i, '').toLowerCase();
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            // Backend returns JwtResponse directly: { token, type, id, name, email, roles }
            const data = response.data;

            const token = data.token;
            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: normalizeRole(data.roles),
            };

            // Store token and user data
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed. Please try again.'
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            // Backend returns MessageResponse directly: { message, success }
            const response = await authService.register(userData);
            const data = response.data;
            return { success: data.success !== false, data };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message || 'Registration failed. Please try again.'
            };
        }
    };

    // Logout function
    const logout = async () => {
        // Clear local storage (no backend logout endpoint)
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);

        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user data
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    };

    // Check if user has specific role
    const hasRole = (role) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    };

    // Check if user is admin
    const isAdmin = () => hasRole('admin');

    // Check if user is supervisor or admin
    const isSupervisorOrAdmin = () => hasRole(['supervisor', 'admin']);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        isAdmin,
        isSupervisorOrAdmin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
    }

    if (roles && !hasRole(roles)) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>
            </div>
        );
    }

    return children;
};

export default AuthContext;
