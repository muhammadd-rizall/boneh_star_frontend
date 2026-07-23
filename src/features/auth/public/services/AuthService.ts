import axios from '@/api/Axios';
import type { 
  LoginFormData, 
  RegisterFormData, 
  AuthResponse, 
  ForgotPasswordFormData, 
  ResetPasswordFormData 
} from '../types/Auth';

const ENDPOINTS = {
  LOGIN: '/auth/login',
  GOOGLE: '/auth/google',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await axios.post(ENDPOINTS.LOGIN, data);
    return response.data;
  },

  googleLogin: async (data: { email: string; name: string; google_id?: string; profile_picture?: string }): Promise<AuthResponse> => {
    const response = await axios.post(ENDPOINTS.GOOGLE, data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await axios.post(ENDPOINTS.REGISTER, data);
    return response.data;
  },

  logout: async () => {
    await axios.post(ENDPOINTS.LOGOUT);
  },

  forgotPassword: async (data: ForgotPasswordFormData): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordFormData): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },
};
