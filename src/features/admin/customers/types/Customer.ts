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

export interface CustomerApiResponse {
  success: boolean;
  message: string;
  statistic?: CustomerStatistics;
  data: Customer | PaginatedData<Customer> | Customer[];
}
