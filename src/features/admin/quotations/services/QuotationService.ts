import axios from '@/api/Axios';
import type { Quotation, QuotationFormData, QuotationApiResponse, QuotationStatistics } from '@/features/admin/quotations/types/Quotation';
import { clearBookingCache } from '@/features/admin/bookings/services/BookingService';

const ENDPOINTS = {
  BASE: '/admin/quotations',
  DETAIL: (id: string) => `/admin/quotations/${id}`,
  TRASHED: '/admin/quotations/trashed',
  RESTORE: (id: string) => `/admin/quotations/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/quotations/${id}/force-delete`,
};

export const quotationService = {
  getAll: async (search?: string): Promise<{ quotations: Quotation[], statistics: QuotationStatistics | null }> => {
    try {
      const response = await axios.get<QuotationApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const data = response.data.data;
      
      let quotations: Quotation[] = [];
      if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        quotations = (data as any).data;
      } else if (Array.isArray(data)) {
        quotations = data;
      }

      return {
        quotations,
        statistics: response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Quotation[]> => {
    try {
      const response = await axios.get<QuotationApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed quotations:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Quotation> => {
    try {
      const response = await axios.get<QuotationApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Quotation;
    } catch (error) {
      console.error(`Error fetching quotation ${id}:`, error);
      throw error;
    }
  },

  create: async (data: QuotationFormData): Promise<Quotation> => {
    try {
      const response = await axios.post<QuotationApiResponse>(ENDPOINTS.BASE, data);
      clearBookingCache();
      return response.data.data as Quotation;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  },

  update: async (id: string, data: QuotationFormData): Promise<Quotation> => {
    try {
      const response = await axios.put<QuotationApiResponse>(ENDPOINTS.DETAIL(id), data);
      clearBookingCache();
      return response.data.data as Quotation;
    } catch (error) {
      console.error(`Error updating quotation ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
      clearBookingCache();
    } catch (error) {
      console.error(`Error deleting quotation ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
      clearBookingCache();
    } catch (error) {
      console.error(`Error restoring quotation ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
      clearBookingCache();
    } catch (error) {
      console.error(`Error force deleting quotation ${id}:`, error);
      throw error;
    }
  },
};

export default quotationService;
