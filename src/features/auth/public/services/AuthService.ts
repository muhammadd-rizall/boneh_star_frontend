import axios from '@/api/Axios';
import type { LoginFormData, RegisterFormData, AuthResponse } from '../types/Auth';

const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
};

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await axios.post(ENDPOINTS.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await axios.post(ENDPOINTS.REGISTER, data);
    return response.data;
  },

  logout: async () => {
    await axios.post(ENDPOINTS.LOGOUT);
  },
};
