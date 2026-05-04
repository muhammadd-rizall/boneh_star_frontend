import type { TimestampedEntity } from '@/types/Database';
import type { CustomerBooking } from '@/features/customer/bookings/types/Booking';

export interface CustomerReview extends TimestampedEntity {
  booking_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  is_publish: boolean;
  
  // Relations
  booking?: CustomerBooking;
}

export interface ReviewFormData {
  booking_id: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewFormData {
  rating?: number;
  comment?: string;
}

export interface ReviewApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
