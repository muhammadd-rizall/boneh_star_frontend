import axios from '@/api/Axios';
import type { BusImage } from '@/types/Database';

export interface BusImageFormData {
  caption?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface BusImageApiResponse {
  success: boolean;
  message: string;
  data: BusImage | BusImage[];
}

const ENDPOINTS = {
  BASE: '/admin/bus-images',
  DETAIL: (id: string) => `/admin/bus-images/${id}`,
  SET_PRIMARY: (id: string) => `/admin/bus-images/${id}/set-primary`,
};

export const busImageService = {
  upload: async (busId: string, files: File[]): Promise<BusImage[]> => {
    try {
      const formData = new FormData();
      formData.append('bus_id', busId);
      files.forEach((file) => {
        formData.append('images[]', file);
      });

      const response = await axios.post<BusImageApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as BusImage[];
    } catch (error) {
      console.error('Error uploading bus images:', error);
      throw error;
    }
  },

  update: async (id: string, data: BusImageFormData): Promise<BusImage> => {
    try {
      const response = await axios.patch<BusImageApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as BusImage;
    } catch (error) {
      console.error(`Error updating bus image ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting bus image ${id}:`, error);
      throw error;
    }
  },

  setPrimary: async (id: string): Promise<BusImage> => {
    try {
      const response = await axios.post<BusImageApiResponse>(ENDPOINTS.SET_PRIMARY(id));
      return response.data.data as BusImage;
    } catch (error) {
      console.error(`Error setting primary bus image ${id}:`, error);
      throw error;
    }
  },
};

export default busImageService;
