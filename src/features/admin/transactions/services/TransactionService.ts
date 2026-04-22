import axios from '@/api/Axios';
import type { Transaction, TransactionFormData, TransactionApiResponse, TransactionStatistics } from '@/features/admin/transactions/types/Transaction';

const ENDPOINTS = {
  BASE: '/admin/transactions',
  DETAIL: (id: string) => `/admin/transactions/${id}`,
  TRASHED: '/admin/transactions/trashed',
  RESTORE: (id: string) => `/admin/transactions/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/transactions/${id}/force-delete`,
};

export const transactionService = {
  getAll: async (search?: string): Promise<{ transactions: Transaction[], statistics: TransactionStatistics | null }> => {
    try {
      const response = await axios.get<TransactionApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const data = response.data.data;
      return {
        transactions: Array.isArray(data) ? data : [],
        statistics: response.data.statistics || response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Transaction[]> => {
    try {
      const response = await axios.get<TransactionApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed transactions:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await axios.get<TransactionApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Transaction;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  },

  create: async (data: TransactionFormData): Promise<Transaction> => {
    try {
      const response = await axios.post<TransactionApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as Transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  update: async (id: string, data: TransactionFormData): Promise<Transaction> => {
    try {
      const response = await axios.put<TransactionApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as Transaction;
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
    } catch (error) {
      console.error(`Error restoring transaction ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting transaction ${id}:`, error);
      throw error;
    }
  },
};

export default transactionService;
