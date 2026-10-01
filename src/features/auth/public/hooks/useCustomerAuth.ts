import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/AuthService';
import type { Customer } from '@/features/customer/profile/types/Profile';
import type { LoginFormData, RegisterFormData } from '../types/Auth';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  googleLogin: (data: { email: string; name: string; google_id?: string; profile_picture?: string }) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useCustomerAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: async (data: LoginFormData) => {
        const response = await authService.login(data);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: Boolean(response.data.token),
        });
      },

      googleLogin: async (data: { email: string; name: string; google_id?: string; profile_picture?: string }) => {
        const response = await authService.googleLogin(data);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: Boolean(response.data.token),
        });
      },

      register: async (data: RegisterFormData) => {
        const response = await authService.register(data);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: Boolean(response.data.token),
        });
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Keep local logout deterministic even if the token is already invalid.
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'customer-auth-storage',
      // Gunakan sessionStorage agar sesi customer terisolasi per-tab,
      // sama seperti admin. Proteksi lintas-role jadi simetris sempurna:
      // tab customer tidak bisa akses admin, tab admin tidak bisa akses customer.
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        },
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to hydrate customer auth store.', error);
        }

        if (state && !state.token) {
          state.user = null;
          state.isAuthenticated = false;
        }

        state?.setHasHydrated(true);
      },
    }
  )
);
