import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useCustomerAuthStore } from '../features/auth/public';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    // Batas waktu 15 detik — request yang gantung tidak akan membuat
    // browser tab spinner berputar selamanya
    timeout: 15_000,
});

// Interceptor untuk memilih token yang tepat
api.interceptors.request.use((config) => {
    const isAdminRequest = config.url?.startsWith('/admin');
    const adminToken = useAuthStore.getState().token;
    const customerToken = useCustomerAuthStore.getState().token;
    const token = isAdminRequest ? adminToken : customerToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor untuk menangani response error (401, timeout, network error)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Tangani timeout — hentikan spinner, jangan gantung selamanya
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.warn('[API] Request timeout:', error.config?.url);
            return Promise.reject(new Error('Koneksi timeout. Silakan coba lagi.'));
        }

        if (error.response?.status === 401) {
            const isAdminRequest = error.config.url?.startsWith('/admin');
            const currentPath = window.location.pathname;

            if (isAdminRequest) {
                useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
                if (currentPath !== '/admin/login') {
                    window.location.href = '/admin/login';
                }
            } else {
                useCustomerAuthStore.setState({ user: null, token: null, isAuthenticated: false });
                if (currentPath !== '/auth/login') {
                    window.location.href = '/auth/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
