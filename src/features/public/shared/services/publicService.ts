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

// In-memory cache variables for public endpoints
const cache: Record<string, any> = {};

export const publicService = {
  getCompanyProfile: async () => {
    const cacheKey = 'profile';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.PROFILE);
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },
  
  getBuses: async (params?: { per_page?: number; search?: string; start_date?: string; end_date?: string }): Promise<Bus[]> => {
    const cacheKey = `buses_${JSON.stringify(params || {})}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.BUSES, { params });
    const data = response.data.data;
    const result = extractCollection<Bus>(data);
    cache[cacheKey] = result;
    return result;
  },

  getBusesPaginated: async (params?: { per_page?: number; search?: string; start_date?: string; end_date?: string }): Promise<PaginatedResponse<Bus>> => {
    const cacheKey = `buses_paginated_${JSON.stringify(params || {})}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.BUSES, { params });
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },
  
  getBusDetail: async (id: string) => {
    const cacheKey = `bus_detail_${id}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.BUS_DETAIL(id));
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },

  getFacilities: async (): Promise<BusFacility[]> => {
    const cacheKey = 'facilities';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.FACILITIES);
    const result = extractCollection<BusFacility>(response.data.data);
    cache[cacheKey] = result;
    return result;
  },

  getReviews: async (params?: { per_page?: number }): Promise<Review[]> => {
    const cacheKey = `reviews_${JSON.stringify(params || {})}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.REVIEWS, { params });
    const result = extractCollection<Review>(response.data.data);
    cache[cacheKey] = result;
    return result;
  },

  getReviewsPaginated: async (params?: { per_page?: number }): Promise<PaginatedResponse<Review>> => {
    const cacheKey = `reviews_paginated_${JSON.stringify(params || {})}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.REVIEWS, { params });
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },

  getActivityTypes: async (): Promise<ActivityType[]> => {
    const cacheKey = 'activity_types';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.ACTIVITY_TYPES);
    const result = extractCollection<ActivityType>(response.data.data);
    cache[cacheKey] = result;
    return result;
  },

  getRouteTypes: async (): Promise<RouteType[]> => {
    const cacheKey = 'route_types';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.ROUTE_TYPES);
    const result = extractCollection<RouteType>(response.data.data);
    cache[cacheKey] = result;
    return result;
  },

  getRouteTypesPaginated: async (): Promise<PaginatedResponse<RouteType>> => {
    const cacheKey = 'route_types_paginated';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.ROUTE_TYPES, { params: { per_page: 1 } });
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },

  getBusCategories: async (): Promise<BusCategory[]> => {
    const cacheKey = 'bus_categories';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await api.get(ENDPOINTS.BUS_CATEGORIES);
    const result = extractCollection<BusCategory>(response.data.data);
    cache[cacheKey] = result;
    return result;
  },
};
