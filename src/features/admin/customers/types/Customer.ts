import type { TimestampedEntity, ActivableEntity } from "@/types/Database";

export interface Customer extends TimestampedEntity, ActivableEntity {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  profile_picture?: string | null;
  address?: string | null;
}

export interface CustomerStatistics {
  cards: {
    total: number;
    active: number;
    new_members: number;
    loyal_customers: number;
  };
  account_status: {
    active: number;
    inactive: number;
  };
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  address?: string | null;
  is_active: boolean;
}

export interface CustomerApiResponse {
  success: boolean;
  message: string;
  statistic?: CustomerStatistics;
  data: Customer | Customer[] | any; // To handle paginated response structure if needed
}
