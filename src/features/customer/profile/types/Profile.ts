import type { TimestampedEntity, ActivableEntity } from '@/types/Database';

export interface CustomerProfile extends TimestampedEntity, ActivableEntity {
  name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  address: string | null;
}

export type Customer = CustomerProfile;

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface BookingStatistics {
  total_bookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface ProfileApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
