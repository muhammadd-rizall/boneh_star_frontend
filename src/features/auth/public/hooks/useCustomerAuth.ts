import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/AuthService';
import type { Customer } from '@/features/customer/profile/types/Profile';
import type { LoginFormData, RegisterFormData } from '../types/Auth';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useCustomerAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (data: LoginFormData) => {
        const response = await authService.login(data);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
        });
      },

      register: async (data: RegisterFormData) => {
        const response = await authService.register(data);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'customer-auth-storage',
    }
  )
);
