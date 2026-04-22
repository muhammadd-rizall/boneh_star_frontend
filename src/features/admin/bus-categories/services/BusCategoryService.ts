import axios from '@/api/Axios';
import type { BusCategory, BusCategoryFormData, BusCategoryApiResponse, BusCategoryStatistics } from '@/features/admin/bus-categories/types/BusCategory';

const ENDPOINTS = {
  BASE: '/admin/bus-categories',
  DETAIL: (id: string) => `/admin/bus-categories/${id}`,
  TRASHED: '/admin/bus-categories/trashed',
  RESTORE: (id: string) => `/admin/bus-categories/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/bus-categories/${id}/force-delete`,
};

export const busCategoryService = {
  getAll: async (search?: string): Promise<{ categories: BusCategory[], statistics: BusCategoryStatistics | null }> => {
    try {
      const response = await axios.get<BusCategoryApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const responseData = response.data.data;
      
      let categories: BusCategory[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        categories = responseData.data;
      } else if (Array.isArray(responseData)) {
        categories = responseData;
      }

      return {
        categories,
        statistics: response.data.statistic || response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching bus categories:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<BusCategory[]> => {
    try {
      const response = await axios.get<BusCategoryApiResponse>(ENDPOINTS.TRASHED);
      const responseData = response.data.data;
      
      let categories: BusCategory[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        categories = responseData.data;
      } else if (Array.isArray(responseData)) {
        categories = responseData;
      }
      
      return categories;
    } catch (error) {
      console.error('Error fetching trashed bus categories:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<BusCategory> => {
    try {
      const response = await axios.get<BusCategoryApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as BusCategory;
    } catch (error) {
      console.error(`Error fetching bus category ${id}:`, error);
      throw error;
    }
  },

  create: async (data: BusCategoryFormData): Promise<BusCategory> => {
    try {
      const response = await axios.post<BusCategoryApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as BusCategory;
    } catch (error) {
      console.error('Error creating bus category:', error);
      throw error;
    }
  },

  update: async (id: string, data: BusCategoryFormData): Promise<BusCategory> => {
    if (!id || id === 'undefined') {
      throw new Error("Invalid ID provided for update");
    }
    try {
      const response = await axios.put<BusCategoryApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as BusCategory;
    } catch (error) {
      console.error(`Error updating bus category ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!id || id === 'undefined') {
      throw new Error("Invalid ID provided for delete");
    }
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting bus category ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<BusCategory> => {
    try {
      const response = await axios.post<BusCategoryApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as BusCategory;
    } catch (error) {
      console.error(`Error restoring bus category ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting bus category ${id}:`, error);
      throw error;
    }
  },
};

export default busCategoryService;
