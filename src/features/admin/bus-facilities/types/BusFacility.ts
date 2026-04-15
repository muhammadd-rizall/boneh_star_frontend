import type { BusFacility as BaseBusFacility } from "@/types/Database";

export type BusFacility = BaseBusFacility;

export interface BusFacilityStatistics {
  total: number;
  trashed: number;
}

export interface BusFacilityFormData {
  name: string;
}

export interface BusFacilityApiResponse {
  success: boolean;
  message: string;
  statistic?: BusFacilityStatistics;
  data: BusFacility | BusFacility[] | { data: BusFacility[] };
}
