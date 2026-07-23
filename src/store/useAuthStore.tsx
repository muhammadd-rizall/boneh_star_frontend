import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Permission {
  id: string
  name: string
  slug: string
  group: string
}

interface Role {
  id: string
  name: string
  slug: string
  permissions?: Permission[]
}

interface User {
  id: string
  name: string
  email: string
  is_active: boolean
  roles: Role[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
  hasPermission: (permissionSlug: string) => boolean
  hasRole: (roleSlug: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("auth-storage");
      },

      updateUser: (user: User) => {
        set({ user });
      },

      hasPermission: (permissionSlug: string) => {
        const { user } = get();
        if (!user || !user.roles) return false;
        return user.roles.some((role) => 
          role.permissions?.some((p: Permission) => p.slug === permissionSlug)
        );
      },

      hasRole: (roleSlug: string) => {
        const { user } = get();
        if (!user || !user.roles) return false;
        return user.roles.some((role) => role.slug === roleSlug);
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
