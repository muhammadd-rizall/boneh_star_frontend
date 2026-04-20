import axios from '@/api/Axios';
import type { 
  PaymentMethod, 
  PaymentMethodFormData, 
  PaymentMethodApiResponse, 
  PaymentMethodStatistics 
} from '@/features/admin/payment-methods/types/PaymentMethod';

const ENDPOINTS = {
  BASE: '/admin/payment-methods',
  DETAIL: (id: string) => `/admin/payment-methods/${id}`,
  ACTIVE: '/admin/payment-methods/active',
  TRASHED: '/admin/payment-methods/trashed',
  RESTORE: (id: string) => `/admin/payment-methods/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/payment-methods/${id}/force-delete`,
};

export const paymentMethodService = {
  getAll: async (): Promise<{ paymentMethods: PaymentMethod[], statistics: PaymentMethodStatistics | null }> => {
    try {
      const response = await axios.get<PaymentMethodApiResponse>(ENDPOINTS.BASE);
      const data = response.data.data;
      
      const paymentMethods = Array.isArray(data) ? data : [];
      
      // Calculate basic statistics if not provided by backend
      const statistics: PaymentMethodStatistics = {
        total: paymentMethods.length,
        active: paymentMethods.filter(pm => pm.is_active).length,
        inactive: paymentMethods.filter(pm => !pm.is_active).length,
        trashed: 0, // Will be updated if we fetch trashed
      };

      return {
        paymentMethods,
        statistics
      };
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  getActive: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await axios.get<PaymentMethodApiResponse>(ENDPOINTS.ACTIVE);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching active payment methods:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await axios.get<PaymentMethodApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed payment methods:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PaymentMethod> => {
    try {
      const response = await axios.get<PaymentMethodApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as PaymentMethod;
    } catch (error) {
      console.error(`Error fetching payment method ${id}:`, error);
      throw error;
    }
  },

  create: async (data: PaymentMethodFormData): Promise<PaymentMethod> => {
    try {
      const response = await axios.post<PaymentMethodApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as PaymentMethod;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  },

  update: async (id: string, data: PaymentMethodFormData): Promise<PaymentMethod> => {
    try {
      const response = await axios.put<PaymentMethodApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as PaymentMethod;
    } catch (error) {
      console.error(`Error updating payment method ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting payment method ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
    } catch (error) {
      console.error(`Error restoring payment method ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting payment method ${id}:`, error);
      throw error;
    }
  },
};

export default paymentMethodService;
