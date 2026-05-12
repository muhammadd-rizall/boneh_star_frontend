import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/BookingService';
import type { CustomerBooking } from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';

export function useBookings() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data.data.data); // Based on Laravel Paginated Resource structure
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refresh: fetchBookings };
}

export function useBookingDetail(id: string) {
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [bookingData, methods] = await Promise.all([
        bookingService.getById(id),
        bookingService.getPaymentMethods(),
      ]);
      setBooking(bookingData);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const cancelBooking = async (reason: string) => {
    await bookingService.cancel(id, reason);
    await fetchDetail();
  };

  const acceptQuotation = async (quotationId: string) => {
    await bookingService.acceptQuotation(quotationId);
    await fetchDetail();
  };

  const reviseQuotation = async (quotationId: string, note: string) => {
    await bookingService.reviseQuotation(quotationId, note);
    await fetchDetail();
  };

  return { 
    booking, 
    paymentMethods,
    loading, 
    error, 
    refresh: fetchDetail, 
    cancelBooking,
    acceptQuotation,
    reviseQuotation
  };
}
