import axios from '@/api/Axios';
import type { Driver, DriverFormData, DriverApiResponse, DriverStatistics } from '@/features/admin/drivers/types/Driver';

const ENDPOINTS = {
  BASE: '/admin/drivers',
  DETAIL: (id: string) => `/admin/drivers/${id}`,
  TRASHED: '/admin/drivers/trashed',
  RESTORE: (id: string) => `/admin/drivers/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/drivers/${id}/force-delete`,
};

export const driverService = {
  getAll: async (): Promise<{ drivers: Driver[], statistics: DriverStatistics | null }> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.BASE);
      const responseData = response.data.data;
      
      let drivers: Driver[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        drivers = responseData.data;
      } else if (Array.isArray(responseData)) {
        drivers = responseData;
      }

      return {
        drivers,
        statistics: response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Driver[]> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed drivers:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Driver> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Driver;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      throw error;
    }
  },

  create: async (data: DriverFormData): Promise<Driver> => {
    try {
      const response = await axios.post<DriverApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as Driver;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  },

  update: async (id: string, data: DriverFormData): Promise<Driver> => {
    try {
      const response = await axios.put<DriverApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as Driver;
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<Driver> => {
    try {
      const response = await axios.post<DriverApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as Driver;
    } catch (error) {
      console.error(`Error restoring driver ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting driver ${id}:`, error);
      throw error;
    }
  },
};

export default driverService;
