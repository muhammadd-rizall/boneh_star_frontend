import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useCustomerAuthStore } from '../features/auth/public';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Interceptor untuk memilih token yang tepat
api.interceptors.request.use((config) => {
    // Cek apakah request ditujukan untuk admin
    const isAdminRequest = config.url?.startsWith('/admin');
    
    // Pilih store berdasarkan request
    const adminToken = useAuthStore.getState().token;
    const customerToken = useCustomerAuthStore.getState().token;
    
    const token = isAdminRequest ? adminToken : customerToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// Interceptor untuk menangani response error (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAdminRequest = error.config.url?.startsWith('/admin');
            const currentPath = window.location.pathname;

            if (isAdminRequest) {
                useAuthStore.setState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                if (currentPath !== '/admin/login') {
                    window.location.href = '/admin/login';
                }
            } else {
                useCustomerAuthStore.setState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                if (currentPath !== '/auth/login') {
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
