import type { TimestampedEntity, BookingStatus, CancelledBy, QuotationStatus, TransactionStatus, PaymentStatus, PaymentType, BookingBus } from '@/types/Database';

export interface CustomerBooking extends TimestampedEntity {
  customer_id: string;
  activity_id: string;
  route_type_id: string;
  booking_code: string;
  departure_date: string;
  return_date: string | null;
  origin: string;
  full_route: string | null;
  passenger_count: number;
  bus_count_requested: number;
  special_notes: string | null;
  status: BookingStatus;
  cancelled_by: CancelledBy | null;
  cancelled_reason: string | null;
  
  // Relations
  activity?: { id: string; name: string };
  route_type?: { id: string; name: string; scope: string };
  quotation?: CustomerQuotation;
  transaction?: CustomerTransaction;
  booking_buses?: BookingBus[];
}

export interface CustomerQuotation extends TimestampedEntity {
  booking_id: string;
  proposed_price: number;
  initial_price: number;
  dp_amount: number;
  note_to_customer: string;
  status: QuotationStatus;
  valid_until: string;
  revision_note: string | null;
}

export interface CustomerTransaction extends TimestampedEntity {
  booking_id: string;
  quotation_id: string;
  invoice_number: string;
  total_amount: number;
  dp_paid: number;
  remaining_amount: number;
  status: TransactionStatus;
  payments?: CustomerPayment[];
}

export interface CustomerPayment extends TimestampedEntity {
  transaction_id: string;
  payment_method_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_date: string;
  transfer_proof: string;
  status: PaymentStatus;
  rejection_reason: string | null;
  payment_method?: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

export interface BookingFormData {
  activity_id: string;
  route_type_id: string;
  departure_date: string;
  return_date: string;
  origin: string;
  full_route: string;
  passenger_count: number;
  bus_count_requested: number;
  special_notes?: string;
}

export interface PaymentFormData {
  payment_method_id: string;
  amount: number;
  payment_type: 'dp' | 'settlement';
  payment_date: string;
  transfer_proof: File;
}
