import axios from '@/api/Axios';
import type { BusFacility, BusFacilityFormData, BusFacilityApiResponse, BusFacilityStatistics } from '@/features/admin/bus-facilities/types/BusFacility';

const ENDPOINTS = {
  BASE: '/admin/bus-facilities',
  DETAIL: (id: string) => `/admin/bus-facilities/${id}`,
  TRASHED: '/admin/bus-facilities/trashed',
  RESTORE: (id: string) => `/admin/bus-facilities/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/bus-facilities/${id}/force-delete`,
};

export const busFacilityService = {
  getAll: async (search?: string): Promise<{ facilities: BusFacility[], statistics: BusFacilityStatistics | null }> => {
    try {
      const response = await axios.get<BusFacilityApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const responseData = response.data.data;
      
      let facilities: BusFacility[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        facilities = responseData.data;
      } else if (Array.isArray(responseData)) {
        facilities = responseData;
      }

      return {
        facilities,
        statistics: response.data.statistic || response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching bus facilities:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<BusFacility[]> => {
    try {
      const response = await axios.get<BusFacilityApiResponse>(ENDPOINTS.TRASHED);
      const responseData = response.data.data;
      
      let facilities: BusFacility[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        facilities = responseData.data;
      } else if (Array.isArray(responseData)) {
        facilities = responseData;
      }
      
      return facilities;
    } catch (error) {
      console.error('Error fetching trashed bus facilities:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<BusFacility> => {
    try {
      const response = await axios.get<BusFacilityApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as BusFacility;
    } catch (error) {
      console.error(`Error fetching bus facility ${id}:`, error);
      throw error;
    }
  },

  create: async (data: BusFacilityFormData): Promise<BusFacility> => {
    try {
      const response = await axios.post<BusFacilityApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as BusFacility;
    } catch (error) {
      console.error('Error creating bus facility:', error);
      throw error;
    }
  },

  update: async (id: string, data: BusFacilityFormData): Promise<BusFacility> => {
    try {
      const response = await axios.put<BusFacilityApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as BusFacility;
    } catch (error) {
      console.error(`Error updating bus facility ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting bus facility ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<BusFacility> => {
    try {
      const response = await axios.post<BusFacilityApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as BusFacility;
    } catch (error) {
      console.error(`Error restoring bus facility ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting bus facility ${id}:`, error);
      throw error;
    }
  },
};

export default busFacilityService;
