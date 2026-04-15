import type { BusCategory as BaseBusCategory } from "@/types/Database";

export type BusCategory = BaseBusCategory;

export interface BusCategoryStatistics {
  total: number;
  active?: number;
  inactive?: number;
  trashed?: number;
}

export interface BusCategoryFormData {
  name: string;
  min_capacity: number;
  max_capacity: number;
  description?: string | null;
}

export interface BusCategoryApiResponse {
  success: boolean;
  message: string;
  statistic?: BusCategoryStatistics;
  data: BusCategory | BusCategory[] | { data: BusCategory[] };
}
