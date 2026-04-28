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
};

export default authService;
