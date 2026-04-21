import type { Booking, BookingStatus, CancelledBy, BookingBus } from "@/types/Database";

export type { Booking, BookingStatus, CancelledBy, BookingBus };

export interface BookingStatistics {
  total_bookings: number;
  by_status: {
    pending: number;
    quoted: number;
    confirmed: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  total_passengers: number;
  total_buses_requested: number;
}

export interface BookingBusFormData {
  bus_id: string;
  driver_id: string;
  seat_count: number;
  assignment_notes?: string | null;
}

export interface BookingFormData {
  customer_id: string;
  activity_id: string;
  route_type_id: string;
  booking_code: string;
  departure_date: string;
  return_date?: string | null;
  origin: string;
  full_route?: string | null;
  passenger_count: number;
  bus_count_requested: number;
  special_notes?: string | null;
  status: BookingStatus;
  cancelled_by?: CancelledBy | null;
  cancelled_reason?: string | null;
  buses?: BookingBusFormData[];
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: { url: string | null; label: string; active: boolean }[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedData<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  statistics?: BookingStatistics;
  data: Booking | PaginatedData<Booking> | Booking[];
}
