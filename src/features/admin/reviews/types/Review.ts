import type { Review as BaseReview } from "@/types/Database";

export type Review = BaseReview;

export interface ReviewStatistics {
  cards: {
    total_count: number;
    published_count: number;
    unpublished_count: number;
    average_rating: number;
  };
  by_rating: Record<number, number>;
  by_publish_status: {
    published: number;
    unpublished: number;
  };
}

export interface ReviewFormData {
  booking_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  is_publish: boolean;
}

export interface ReviewApiResponse {
  success: boolean;
  message: string;
  data: any; // Can be Review or Paginated Data
  statistic?: ReviewStatistics;
}
