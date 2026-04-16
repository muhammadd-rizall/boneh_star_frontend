import type { Driver as BaseDriver } from "@/types/Database";

export type Driver = BaseDriver;

export interface DriverStatistics {
  total: number;
  available: number;
  on_duty: number;
  inactive: number;
  trashed: number;
}

export interface DriverFormData {
  name: string;
  phone: string;
  address: string;
  photo?: string | null;
  status: 'available' | 'on_duty' | 'inactive';
  notes?: string | null;
}

export interface DriverApiResponse {
  success: boolean;
  message: string;
  statistic?: DriverStatistics;
  data: Driver | Driver[] | { data: Driver[] };
}
