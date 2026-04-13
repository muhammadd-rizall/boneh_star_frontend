import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Sesuaikan URL Laravel Anda
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Interceptor untuk menempelkan token otomatis dari Zustand Store
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor untuk menangani response error (seperti 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika token tidak valid atau expired (401)
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default api;
