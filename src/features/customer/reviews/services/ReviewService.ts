import axios from '@/api/Axios';
import type { 
  CustomerReview, 
  ReviewFormData, 
  UpdateReviewFormData, 
  ReviewApiResponse 
} from '../types/Review';

const ENDPOINTS = {
  REVIEWS: '/customer/reviews',
  REVIEW_DETAIL: (id: string) => `/customer/reviews/${id}`,
};

export const reviewService = {
  getAll: async (params?: { per_page?: number; page?: number }) => {
    const response = await axios.get(ENDPOINTS.REVIEWS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<CustomerReview> => {
    const response = await axios.get<ReviewApiResponse<CustomerReview>>(ENDPOINTS.REVIEW_DETAIL(id));
    return response.data.data;
  },

  create: async (data: ReviewFormData): Promise<CustomerReview> => {
    const response = await axios.post<ReviewApiResponse<CustomerReview>>(ENDPOINTS.REVIEWS, data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateReviewFormData): Promise<CustomerReview> => {
    const response = await axios.patch<ReviewApiResponse<CustomerReview>>(ENDPOINTS.REVIEW_DETAIL(id), data);
    return response.data.data;
  },
};

export default reviewService;
