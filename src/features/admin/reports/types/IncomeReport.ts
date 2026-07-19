import type { Payment } from "@/types/Database";

export interface MonthlyIncomeChartData {
  month: string;
  total_masuk: string | number;
  total_dp: string | number;
  total_pelunasan: string | number;
}

export interface OutstandingItem {
  invoice_number: string;
  remaining_amount: string | number;
  penyewa: string;
  departure_date: string;
}

export interface IncomeReportSummary {
  total_verified_income: number;
  total_outstanding: number;
}

export interface IncomeReportStatistics {
  monthly_chart: MonthlyIncomeChartData[];
  outstanding_list: OutstandingItem[];
  summary: IncomeReportSummary;
}

export interface IncomeReportFilters {
  month?: number;
  year?: number;
  status?: string;
}

export interface IncomeReportApiResponse {
  success: boolean;
  period: {
    month: number | null;
    year: number;
  };
  statistics: IncomeReportStatistics;
  data: Payment[];
  message: string;
}
