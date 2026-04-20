import type { Booking } from "@/types/Database";

export interface BookingReportSummary {
  total_bookings: number;
  total_passengers: number;
  avg_passengers: number;
}

export interface MonthlyChartData {
  month: string;
  count: number;
}

export interface ActivityChartData {
  activity_type_id: string;
  count: number;
  activity?: {
    id: string;
    name: string;
  };
}

export interface StatusChartData {
  status: string;
  count: number;
}

export interface BookingReportStatistics {
  summary: BookingReportSummary;
  monthly_chart: MonthlyChartData[];
  activity_chart: ActivityChartData[];
  status_chart: StatusChartData[];
}

export interface BookingReportFilters {
  start_date: string;
  end_date: string;
  status?: string;
  scope?: 'internal' | 'external';
}

export interface BookingReportApiResponse {
  success: boolean;
  period: {
    start_date: string;
    end_date: string;
  };
  filters: {
    status: string | null;
    scope: string | null;
  };
  statistics: BookingReportStatistics;
  data: Booking[];
  message: string;
}
