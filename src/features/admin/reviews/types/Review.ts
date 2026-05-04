import type { Review as BaseReview, Booking, Customer, ActivityType } from "@/types/Database";

export interface Review extends BaseReview {
  booking?: Booking & { activity?: ActivityType };
  customer?: Customer;
}

export interface ReviewPeriod {
  start_date: string | null;
  end_date: string | null;
}

export interface ReviewFilters {
  rating: number | null;
}

export interface ReviewStatistics {
  total_count: number;
  published_count: number;
  unpublished_count: number;
  average_rating: number;
  rating_distribution: Record<number, number>;
}

export interface MonthlyAverage {
  year: number;
  month: number;
  count: number;
  avg_rating: number;
}

export interface ActivityTypeAverage {
  activity_type: string;
  count: number;
  avg_rating: number;
}

export interface BusAverage {
  bus_name: string;
  plat_number: string;
  count: number;
  avg_rating: number;
}

export interface ReviewQueryParams {
  start_date?: string;
  end_date?: string;
  rating?: number;
  per_page?: number;
  page?: number;
}

export interface ReviewReportData {
  period: ReviewPeriod;
  filters: ReviewFilters;
  statistics: ReviewStatistics;
  monthly_averages: MonthlyAverage[];
  activity_type_averages: ActivityTypeAverage[];
  bus_averages: BusAverage[];
  reviews: {
    data: Review[];
    links: any[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ReviewApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReviewFormData {
  booking_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  is_publish: boolean;
}
