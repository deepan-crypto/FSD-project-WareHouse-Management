import api from './api';

// Authentication Service
const authService = {
    // Login
    login: async (email, password) => {
        return api.post('/auth/login', { email, password });
    },

    // Register
    register: async (userData) => {
        return api.post('/auth/register', userData);
    },

    // Get current user
    getCurrentUser: async () => {
        return api.get('/auth/me');
    },

    // Logout
    logout: async () => {
        return api.post('/auth/logout');
    },

    // Refresh token
    refreshToken: async () => {
        return api.post('/auth/refresh');
    },

    // Forgot password
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        return api.post('/auth/reset-password', { token, newPassword });
    }
};

export default authService;
