import type { PaymentMethod as BasePaymentMethod } from "@/types/Database";

export type PaymentMethod = BasePaymentMethod;

export interface PaymentMethodStatistics {
  total: number;
  active: number;
  inactive: number;
  trashed: number;
}

export interface PaymentMethodFormData {
  bank_name: string;
  account_number: string;
  account_name: string;
  is_active: boolean;
}

export interface PaymentMethodApiResponse {
  success: boolean;
  message: string;
  data: PaymentMethod | PaymentMethod[];
}
