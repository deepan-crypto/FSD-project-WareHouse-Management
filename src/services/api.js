import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status } = error.response;

            if (status === 401) {
                // Unauthorized - clear auth data and redirect to login
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                window.location.href = '/login';
            }

            // Return formatted error
            return Promise.reject({
                message: error.response.data?.error?.message || 'An error occurred',
                code: error.response.data?.error?.code,
                details: error.response.data?.error?.details,
                status: status
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'No response from server. Please check your connection.',
                code: 'NETWORK_ERROR'
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR'
            });
        }
    }
);

export default api;
