import type { TimestampedEntity, ActivableEntity } from "@/types/Database";

export interface Bus extends TimestampedEntity, ActivableEntity {
  code: string;
  name: string;
  capacity: string;
  price_per_day: number | string;
  image: string;
  description?: string | null;
  is_active: boolean;
}

export interface BusStatistics {
  cards: {
    total: number;
    active: number;
    inactive: number;
    average_price: number;
  };
  by_capacity: Record<string, number>;
}

export interface BusFormData {
  code: string;
  name: string;
  capacity: string;
  price_per_day: number;
  image?: File | string | null;
  description?: string | null;
  is_active: boolean;
}

export interface BusApiResponse {
  success: boolean;
  message: string;
  statistic?: BusStatistics;
  data: Bus | Bus[] | any; // To handle paginated response structure
}
