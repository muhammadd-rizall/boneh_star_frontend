import axios from '@/api/Axios';
import type { 
  CustomerBooking, 
  BookingFormData, 
  PaymentFormData 
} from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';

const ENDPOINTS = {
  BOOKINGS: '/customer/bookings',
  BOOKING_DETAIL: (id: string) => `/customer/bookings/${id}`,
  BOOKING_CANCEL: (id: string) => `/customer/bookings/${id}/cancel`,
  BOOKING_COMPLETE: (id: string) => `/customer/bookings/${id}/complete`,
  UPLOAD_PAYMENT: (id: string) => `/customer/bookings/${id}/upload-payment`,
  PAYMENT_METHODS: '/customer/bookings/payment-methods',
  QUOTATION_ACCEPT: (id: string) => `/customer/quotations/${id}/accept`,
  QUOTATION_REVISE: (id: string) => `/customer/quotations/${id}/request-revision`,
  COMPANY_PROFILE: '/public/company-profile',
};

// In-memory cache for customer booking features
const cache: Record<string, any> = {};

const clearCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
};

export const bookingService = {
  getAll: async (params?: { per_page?: number; page?: number }) => {
    const cacheKey = `all_${JSON.stringify(params || {})}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await axios.get(ENDPOINTS.BOOKINGS, { params });
    cache[cacheKey] = response.data;
    return response.data;
  },

  getById: async (id: string): Promise<CustomerBooking> => {
    const cacheKey = `detail_${id}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await axios.get(ENDPOINTS.BOOKING_DETAIL(id));
    const data = response.data.data;
    cache[cacheKey] = data;
    return data;
  },

  create: async (data: BookingFormData): Promise<CustomerBooking> => {
    clearCache();
    const response = await axios.post(ENDPOINTS.BOOKINGS, data);
    return response.data.data;
  },

  cancel: async (id: string, reason: string): Promise<void> => {
    clearCache();
    await axios.post(ENDPOINTS.BOOKING_CANCEL(id), { reason });
  },

  complete: async (id: string): Promise<void> => {
    clearCache();
    await axios.post(ENDPOINTS.BOOKING_COMPLETE(id));
  },

  uploadPayment: async (id: string, data: PaymentFormData): Promise<any> => {
    clearCache();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(ENDPOINTS.UPLOAD_PAYMENT(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const cacheKey = 'payment_methods';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await axios.get(ENDPOINTS.PAYMENT_METHODS);
    cache[cacheKey] = response.data.data;
    return response.data.data;
  },

  acceptQuotation: async (quotationId: string): Promise<any> => {
    clearCache();
    const response = await axios.post(ENDPOINTS.QUOTATION_ACCEPT(quotationId));
    return response.data.data;
  },

  reviseQuotation: async (quotationId: string, note: string): Promise<any> => {
    clearCache();
    const response = await axios.post(ENDPOINTS.QUOTATION_REVISE(quotationId), { revision_note: note });
    return response.data.data;
  },

  getCompanyProfile: async (): Promise<any> => {
    const cacheKey = 'company_profile';
    if (cache[cacheKey]) return cache[cacheKey];
    const response = await axios.get(ENDPOINTS.COMPANY_PROFILE);
    cache[cacheKey] = response.data.data;
    return response.data.data;
  }
};

export default bookingService;
