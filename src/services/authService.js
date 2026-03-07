import api from './api';

// Mock data for development (remove when backend is ready)
const MOCK_USER = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'admin@warehouse.com',
    name: 'Admin User',
    role: 'admin',
    isActive: true
};

const MOCK_TOKEN = 'mock_jwt_token_12345';

// Use mock data flag (set to false to use the backend at http://localhost:5000/api)
const USE_MOCK_DATA = false;

// Authentication Service
const authService = {
    // Login
    login: async (email, password) => {
        if (USE_MOCK_DATA) {
            // Mock login - accept any credentials
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            data: {
                                token: MOCK_TOKEN,
                                user: MOCK_USER
                            }
                        }
                    });
                }, 800);
            });
        }

        return api.post('/auth/login', { email, password });
    },

    // Register
    register: async (userData) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            data: {
                                id: Date.now().toString(),
                                ...userData,
                                password: undefined,
                                isActive: true,
                                createdAt: new Date().toISOString()
                            }
                        }
                    });
                }, 800);
            });
        }

        return api.post('/auth/register', userData);
    },

    // Get current user
    getCurrentUser: async () => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            data: MOCK_USER
                        }
                    });
                }, 300);
            });
        }

        return api.get('/auth/me');
    },

    // Logout
    logout: async () => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            message: 'Logged out successfully'
                        }
                    });
                }, 300);
            });
        }

        return api.post('/auth/logout');
    },

    // Refresh token
    refreshToken: async () => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            data: {
                                token: MOCK_TOKEN
                            }
                        }
                    });
                }, 300);
            });
        }

        return api.post('/auth/refresh');
    },

    // Forgot password
    forgotPassword: async (email) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            message: 'Password reset email sent'
                        }
                    });
                }, 800);
            });
        }

        return api.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            message: 'Password reset successful'
                        }
                    });
                }, 800);
            });
        }

        return api.post('/auth/reset-password', { token, newPassword });
    }
};

export default authService;
