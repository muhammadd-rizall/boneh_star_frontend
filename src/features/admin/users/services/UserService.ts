import axios from '@/api/Axios';
import type { User, UserFormData, UserApiResponse, UserStatistics } from '@/features/admin/users/types/User';

const ENDPOINTS = {
  BASE: '/admin/users',
  DETAIL: (id: string) => `/admin/users/${id}`,
  TRASHED: '/admin/users/trashed',
  RESTORE: (id: string) => `/admin/users/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/users/${id}/force-delete`,
};

export const userService = {
  // Mengembalikan data dan statistik dengan dukungan pencarian
  getAll: async (search?: string): Promise<{ users: User[], statistics: UserStatistics | null }> => {
    try {
      const response = await axios.get<UserApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const responseData = response.data.data;
      
      let users: User[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        users = responseData.data;
      } else if (Array.isArray(responseData)) {
        users = responseData;
      }

      return {
        users,
        statistics: response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<User[]> => {
    try {
      const response = await axios.get<UserApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed users:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await axios.get<UserApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as User;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  create: async (data: UserFormData): Promise<User> => {
    try {
      const response = await axios.post<UserApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id: string, data: UserFormData): Promise<User> => {
    try {
      const response = await axios.put<UserApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as User;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<User> => {
    try {
      const response = await axios.post<UserApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as User;
    } catch (error) {
      console.error(`Error restoring user ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting user ${id}:`, error);
      throw error;
    }
  },
};

export default userService;
