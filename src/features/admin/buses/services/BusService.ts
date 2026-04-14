import axios from '@/api/Axios';
import type { Bus, BusFormData, BusApiResponse, BusStatistics } from '@/features/admin/buses/types/Bus';

const ENDPOINTS = {
  BASE: '/admin/buses',
  DETAIL: (id: string) => `/admin/buses/${id}`,
  TRASHED: '/admin/buses/trashed',
  RESTORE: (id: string) => `/admin/buses/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/buses/${id}/force-delete`,
};

export const busService = {
  getAll: async (): Promise<{ buses: Bus[], statistics: BusStatistics | null }> => {
    try {
      const response = await axios.get<BusApiResponse>(ENDPOINTS.BASE);
      // Backend returns { success, statistic, data: { data: [], links, meta }, message }
      const responseData = response.data.data;
      
      let buses: Bus[] = [];
      if (responseData && Array.isArray(responseData.data)) {
        buses = responseData.data;
      } else if (Array.isArray(responseData)) {
        buses = responseData;
      }

      return {
        buses,
        statistics: response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Bus[]> => {
    try {
      const response = await axios.get<BusApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed buses:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Bus> => {
    try {
      const response = await axios.get<BusApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Bus;
    } catch (error) {
      console.error(`Error fetching bus ${id}:`, error);
      throw error;
    }
  },

  create: async (data: BusFormData): Promise<Bus> => {
    try {
      // Use FormData for file upload if image is a File
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });

      const response = await axios.post<BusApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as Bus;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  update: async (id: string, data: BusFormData): Promise<Bus> => {
    try {
      // Use FormData for file upload. Laravel sometimes needs _method=PUT for multipart/form-data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });
      formData.append('_method', 'PUT');

      const response = await axios.post<BusApiResponse>(ENDPOINTS.DETAIL(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as Bus;
    } catch (error) {
      console.error(`Error updating bus ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting bus ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<Bus> => {
    try {
      const response = await axios.post<BusApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as Bus;
    } catch (error) {
      console.error(`Error restoring bus ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting bus ${id}:`, error);
      throw error;
    }
  },
};

export default busService;
