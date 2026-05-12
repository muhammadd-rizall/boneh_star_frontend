import api from '@/api/Axios';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { BusFacility } from '@/features/admin/bus-facilities/types/BusFacility';
import type { Review } from '@/features/admin/reviews/types/Review';
import type { ActivityType } from '@/features/admin/activity-types/types/ActivityType';
import type { RouteType } from '@/features/admin/route-types/types/RouteType';
import type { BusCategory } from '@/features/admin/bus-categories/types/BusCategory';

const ENDPOINTS = {
  PROFILE: '/public/company-profile',
  BUSES: '/public/buses',
  BUS_DETAIL: (id: string) => `/public/buses/${id}`,
  FACILITIES: '/public/facilities',
  REVIEWS: '/public/reviews',
  ACTIVITY_TYPES: '/public/activity-types',
  ROUTE_TYPES: '/public/route-types',
  BUS_CATEGORIES: '/public/bus-categories',
  BOOKINGS: '/public/bookings',
};

export interface PaginatedResponse<T> {
  data: T[];
  links: any;
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

function extractCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    // Handle Laravel Resource Collection wrapper: { data: [...] }
    if ('data' in payload && Array.isArray((payload as any).data)) {
      return (payload as any).data;
    }
  }

  return [];
}

export const publicService = {
  getCompanyProfile: async () => {
    const response = await api.get(ENDPOINTS.PROFILE);
    return response.data.data;
  },
  
  getBuses: async (params?: { per_page?: number; search?: string }): Promise<Bus[]> => {
    const response = await api.get(ENDPOINTS.BUSES, { params });
    const data = response.data.data;
    return extractCollection<Bus>(data);
  },

  getBusesPaginated: async (params?: { per_page?: number; search?: string }): Promise<PaginatedResponse<Bus>> => {
    const response = await api.get(ENDPOINTS.BUSES, { params });
    return response.data.data;
  },
  
  getBusDetail: async (id: string) => {
    const response = await api.get(ENDPOINTS.BUS_DETAIL(id));
    return response.data.data;
  },

  getFacilities: async (): Promise<BusFacility[]> => {
    const response = await api.get(ENDPOINTS.FACILITIES);
    return extractCollection<BusFacility>(response.data.data);
  },

  getReviews: async (params?: { per_page?: number }): Promise<Review[]> => {
    const response = await api.get(ENDPOINTS.REVIEWS, { params });
    return extractCollection<Review>(response.data.data);
  },

  getReviewsPaginated: async (params?: { per_page?: number }): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(ENDPOINTS.REVIEWS, { params });
    return response.data.data;
  },

  getActivityTypes: async (): Promise<ActivityType[]> => {
    const response = await api.get(ENDPOINTS.ACTIVITY_TYPES);
    return extractCollection<ActivityType>(response.data.data);
  },

  getRouteTypes: async (): Promise<RouteType[]> => {
    const response = await api.get(ENDPOINTS.ROUTE_TYPES);
    return extractCollection<RouteType>(response.data.data);
  },

  getRouteTypesPaginated: async (): Promise<PaginatedResponse<RouteType>> => {
    const response = await api.get(ENDPOINTS.ROUTE_TYPES, { params: { per_page: 1 } });
    return response.data.data;
  },

  getBusCategories: async (): Promise<BusCategory[]> => {
    const response = await api.get(ENDPOINTS.BUS_CATEGORIES);
    return extractCollection<BusCategory>(response.data.data);
  },
};
