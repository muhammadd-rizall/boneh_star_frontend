import axios from '@/api/Axios';
import type { 
  Payment, 
  PaymentFormData, 
  PaymentApiResponse, 
  PaymentVerifyData,
  PaymentStatistics 
} from '@/features/admin/payments/types/Payment';

const ENDPOINTS = {
  BASE: '/admin/payments',
  DETAIL: (id: string) => `/admin/payments/${id}`,
  VERIFY: (id: string) => `/admin/payments/${id}/verify`,
  TRASHED: '/admin/payments/trashed',
  RESTORE: (id: string) => `/admin/payments/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/payments/${id}/force-delete`,
};

export const paymentService = {
  getPaginated: async (params?: { page?: number; per_page?: number }): Promise<{ 
    payments: Payment[], 
    statistics: PaymentStatistics | null,
    meta: PaymentApiResponse['meta']
  }> => {
    try {
      const response = await axios.get<PaymentApiResponse>(ENDPOINTS.BASE, { params });
      const data = response.data.data;
      
      return {
        payments: Array.isArray(data) ? data : [],
        statistics: response.data.statistics || null,
        meta: response.data.meta
      };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Payment[]> => {
    try {
      const response = await axios.get<PaymentApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed payments:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Payment> => {
    try {
      const response = await axios.get<PaymentApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Payment;
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },

  create: async (data: PaymentFormData): Promise<Payment> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      });

      const response = await axios.post<PaymentApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data as Payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<PaymentFormData>): Promise<Payment> => {
    try {
      const formData = new FormData();
      // Laravel often requires _method=PUT for multipart updates via POST
      formData.append('_method', 'PUT');
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      });

      const response = await axios.post<PaymentApiResponse>(ENDPOINTS.DETAIL(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data as Payment;
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  },

  verify: async (id: string, data: PaymentVerifyData): Promise<Payment> => {
    try {
      const response = await axios.post<PaymentApiResponse>(ENDPOINTS.VERIFY(id), data);
      return response.data.data as Payment;
    } catch (error) {
      console.error(`Error verifying payment ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
    } catch (error) {
      console.error(`Error restoring payment ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting payment ${id}:`, error);
      throw error;
    }
  },
};

export default paymentService;
