import axios from '@/api/Axios';
import type { 
  Review, 
  ReviewFormData, 
  ReviewApiResponse, 
  ReviewReportData
} from '@/features/admin/reviews/types/Review';

const ENDPOINTS = {
  BASE: '/admin/reports/reviews', 
  TOGGLE_PUBLISH: (id: string) => `/admin/reports/reviews/${id}/toggle-publish`,
  DELETE: (id: string) => `/admin/reports/reviews/${id}`,
};

export interface ReviewQueryParams {
  start_date?: string;
  end_date?: string;
  rating?: number;
  per_page?: number;
  page?: number;
}

export const reviewService = {
  getReport: async (params?: ReviewQueryParams): Promise<ReviewReportData> => {
    try {
      const response = await axios.get<ReviewApiResponse<ReviewReportData>>(ENDPOINTS.BASE, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching review report:', error);
      throw error;
    }
  },

  togglePublish: async (id: string): Promise<Review> => {
    try {
      const response = await axios.post<ReviewApiResponse<Review>>(ENDPOINTS.TOGGLE_PUBLISH(id));
      return response.data.data;
    } catch (error) {
      console.error(`Error toggling publish for review ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DELETE(id));
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  },
};

export default reviewService;
