export interface BusSchedule {
  booking_id: string;
  booking_code: string;
  departure_date: string;
  return_date: string | null;
  status: string;
}

export interface BusAvailability {
  id: string;
  name: string;
  plat_number: string;
  status: string;
  category_name?: string | null;
  seat_count?: number;
  primary_image?: string | null;
  schedules: BusSchedule[];
}

export interface BusAvailabilityReportFilters {
  start_date: string;
  end_date: string;
}

export interface BusAvailabilityReportApiResponse {
  success: boolean;
  period: {
    start_date: string;
    end_date: string;
  };
  data: BusAvailability[];
  message: string;
}
