import axios from '@/api/Axios';
import type { 
  Review, 
  ReviewFormData, 
  ReviewApiResponse, 
  ReviewStatistics 
} from '@/features/admin/reviews/types/Review';

const ENDPOINTS = {
  BASE: '/admin/reviews',
  DETAIL: (id: string) => `/admin/reviews/${id}`,
  TOGGLE_PUBLISH: (id: string) => `/admin/reviews/${id}/toggle-publish`,
  TRASHED: '/admin/reviews/trashed',
  RESTORE: (id: string) => `/admin/reviews/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/reviews/${id}/force-delete`,
};

export const reviewService = {
  getPaginated: async (params?: { page?: number; per_page?: number }): Promise<{ 
    reviews: Review[], 
    statistics: ReviewStatistics | null,
    meta: any
  }> => {
    try {
      const response = await axios.get<ReviewApiResponse>(ENDPOINTS.BASE, { params });
      const data = response.data.data;
      
      return {
        reviews: data.data || [],
        statistics: response.data.statistic || null,
        meta: {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total
        }
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Review[]> => {
    try {
      const response = await axios.get<ReviewApiResponse>(ENDPOINTS.TRASHED);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching trashed reviews:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Review> => {
    try {
      const response = await axios.get<ReviewApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Review;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  },

  create: async (data: ReviewFormData): Promise<Review> => {
    try {
      const response = await axios.post<ReviewApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as Review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<ReviewFormData>): Promise<Review> => {
    try {
      const response = await axios.put<ReviewApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as Review;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  },

  togglePublish: async (id: string): Promise<Review> => {
    try {
      const response = await axios.post<ReviewApiResponse>(ENDPOINTS.TOGGLE_PUBLISH(id));
      return response.data.data as Review;
    } catch (error) {
      console.error(`Error toggling publish for review ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
    } catch (error) {
      console.error(`Error restoring review ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting review ${id}:`, error);
      throw error;
    }
  },
};

export default reviewService;
