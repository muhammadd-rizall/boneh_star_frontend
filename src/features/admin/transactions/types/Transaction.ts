import type { Transaction, TransactionStatus, Booking, Quotation } from "@/types/Database";

export type { Transaction, TransactionStatus };

export interface TransactionStatistics {
  total_transactions: number;
  total_revenue: number;
  total_dp_collected: number;
  total_outstanding: number;
  by_status: {
    waiting: number;
    dp_paid: number;
    fully_paid: number;
    overdue: number;
  };
}

export interface TransactionFormData {
  booking_id: string;
  quotation_id: string;
  invoice_number: string;
  total_amount: number;
  dp_paid: number;
  remaining_amount: number;
  status: TransactionStatus;
}

export interface TransactionApiResponse {
  success: boolean;
  message: string;
  statistics?: TransactionStatistics;
  data: Transaction | Transaction[];
}
