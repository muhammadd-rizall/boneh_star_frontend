import type { Bus as BaseBus } from "@/types/Database";

export type Bus = BaseBus;

export interface BusStatistics {
  cards: {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
  };
  by_status: Record<string, number>;
}

export interface BusFormData {
  bus_category_id: string;
  plat_number: string;
  name: string;
  seat_count: number;
  production_year: number;
  brand?: string;
  status: 'available' | 'booked' | 'maintenance' | 'inactive';
  notes?: string;
  facilities?: string[]; // IDs of facilities
  images?: File[];
}

export interface BusApiResponse {
  success: boolean;
  message: string;
  statistic?: BusStatistics;
  data: Bus | Bus[] | { data: Bus[] };
}
