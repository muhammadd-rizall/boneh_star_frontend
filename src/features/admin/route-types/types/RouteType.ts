import type { RouteType as BaseRouteType } from "@/types/Database";

export type RouteType = BaseRouteType;

export interface RouteTypeStatistics {
  total: number;
  trashed: number;
}

export interface RouteTypeFormData {
  name: string;
  scope: 'inside' | 'outside';
  description: string;
}

export interface RouteTypeApiResponse {
  success: boolean;
  message: string;
  statistic?: RouteTypeStatistics;
  statistics?: RouteTypeStatistics; // Menambahkan dukungan untuk plural
  data: RouteType | RouteType[] | { data: RouteType[] };
}
