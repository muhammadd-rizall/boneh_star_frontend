import axios from '@/api/Axios';
import type { Customer, CustomerFormData, CustomerApiResponse, CustomerStatistics } from '@/features/admin/customers/types/Customer';

const ENDPOINTS = {
  BASE: '/admin/customers',
  DETAIL: (id: string) => `/admin/customers/${id}`,
  TRASHED: '/admin/customers/trashed',
  RESTORE: (id: string) => `/admin/customers/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/customers/${id}/force-delete`,
};

export const customerService = {
  getAll: async (): Promise<{ customers: Customer[], statistics: CustomerStatistics | null }> => {
    try {
      const response = await axios.get<CustomerApiResponse>(ENDPOINTS.BASE);
      // Backend returns { success, statistic, data: { data: [], links, meta }, message }
      const responseData = response.data.data;
      
      let customers: Customer[] = [];
      if (responseData && Array.isArray(responseData.data)) {
        customers = responseData.data;
      } else if (Array.isArray(responseData)) {
        customers = responseData;
      }

      return {
        customers,
        statistics: response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Customer[]> => {
    try {
      const response = await axios.get<CustomerApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed customers:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Customer> => {
    try {
      const response = await axios.get<CustomerApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Customer;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CustomerFormData): Promise<Customer> => {
    try {
      const response = await axios.post<CustomerApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as Customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  update: async (id: string, data: CustomerFormData): Promise<Customer> => {
    try {
      const response = await axios.put<CustomerApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as Customer;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<Customer> => {
    try {
      const response = await axios.post<CustomerApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as Customer;
    } catch (error) {
      console.error(`Error restoring customer ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting customer ${id}:`, error);
      throw error;
    }
  },
};

export default customerService;
