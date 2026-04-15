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
      const responseData = response.data.data;
      
      let buses: Bus[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
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
      const formData = new FormData();
      
      // Basic fields
      formData.append('bus_category_id', data.bus_category_id);
      formData.append('plat_number', data.plat_number);
      formData.append('name', data.name);
      formData.append('seat_count', String(data.seat_count));
      formData.append('production_year', String(data.production_year));
      formData.append('status', data.status);
      
      if (data.brand) formData.append('brand', data.brand);
      if (data.notes) formData.append('notes', data.notes);

      // Facilities array
      if (data.facilities && data.facilities.length > 0) {
        data.facilities.forEach((id, index) => {
          formData.append(`facilities[${index}]`, id);
        });
      }

      // Images array
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append('images[]', file);
        });
      }

      const response = await axios.post<BusApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as Bus;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<BusFormData>): Promise<Bus> => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // For Laravel multipart/form-data update

      if (data.bus_category_id) formData.append('bus_category_id', data.bus_category_id);
      if (data.plat_number) formData.append('plat_number', data.plat_number);
      if (data.name) formData.append('name', data.name);
      if (data.seat_count) formData.append('seat_count', String(data.seat_count));
      if (data.production_year) formData.append('production_year', String(data.production_year));
      if (data.status) formData.append('status', data.status);
      
      if (data.brand !== undefined) formData.append('brand', data.brand || '');
      if (data.notes !== undefined) formData.append('notes', data.notes || '');

      if (data.facilities) {
        data.facilities.forEach((id, index) => {
          formData.append(`facilities[${index}]`, id);
        });
      }

      if (data.images) {
        data.images.forEach((file) => {
          formData.append('images[]', file);
        });
      }

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
