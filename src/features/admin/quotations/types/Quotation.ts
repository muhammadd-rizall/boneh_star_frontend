import type { Quotation, QuotationStatus } from "@/types/Database";

export type { Quotation, QuotationStatus };

export interface QuotationStatistics {
  total_quotations: number;
  by_status: {
    draft: number;
    sent: number;
    accepted: number;
    revision: number;
    expired: number;
    rejected: number;
  };
}

export interface QuotationFormData {
  booking_id: string;
  user_id: string;
  proposed_price: number;
  dp_amount: number;
  note_to_customer: string;
  status: QuotationStatus;
  valid_until: string;
  revision_note?: string | null;
}

export interface QuotationApiResponse {
  success: boolean;
  message: string;
  statistics?: QuotationStatistics;
  data: Quotation | Quotation[];
}
