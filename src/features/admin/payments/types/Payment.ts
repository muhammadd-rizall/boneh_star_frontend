import type { Payment as BasePayment, PaymentStatus, PaymentType } from "@/types/Database";

export type Payment = BasePayment;

export interface PaymentStatistics {
  cards: {
    total_amount: number;
    total_count: number;
    pending_count: number;
    verified_count: number;
  };
  by_status: Record<PaymentStatus, number>;
  by_type: Record<PaymentType, number>;
}

export interface PaymentFormData {
  transaction_id: string;
  payment_method_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_date: string;
  transfer_proof: File | string | null;
}

export interface PaymentVerifyData {
  status: 'verified' | 'rejected';
  rejection_reason?: string;
}

export interface PaymentApiResponse {
  success: boolean;
  message: string;
  data: Payment | Payment[];
  statistics?: PaymentStatistics;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
