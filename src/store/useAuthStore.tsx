import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Permission {
  id: string
  name: string
  slug: string
  group: string
}

interface Role {
  id: string
  name: string
  slug: string
}

interface User {
  id: string
  name: string
  email: string
  is_active: boolean
  role: Role
  permission: Permission[]
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
        if (!user) return false;
        return user.permission.some((p) => p.slug === permissionSlug);
      },

      hasRole: (roleSlug: string) => {
        const { user } = get();
        if (!user) return false;
        return user.role.slug === roleSlug;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
