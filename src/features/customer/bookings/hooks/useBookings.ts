import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/BookingService';
import type { CustomerBooking } from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';
import { useToastStore } from '@/store/useToastStore';

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
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [bookingData, methods, profile] = await Promise.all([
        bookingService.getById(id),
        bookingService.getPaymentMethods(),
        bookingService.getCompanyProfile(),
      ]);
      setBooking(bookingData);
      setPaymentMethods(methods);
      setCompanyProfile(profile);
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
    try {
      await bookingService.cancel(id, reason);
      showSuccess('Pemesanan berhasil dibatalkan');
      await fetchDetail();
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal membatalkan pemesanan');
    }
  };

  const acceptQuotation = async (quotationId: string) => {
    try {
      await bookingService.acceptQuotation(quotationId);
      showSuccess('Penawaran berhasil disetujui');
      await fetchDetail();
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal menyetujui penawaran');
    }
  };

  const reviseQuotation = async (quotationId: string, note: string) => {
    try {
      await bookingService.reviseQuotation(quotationId, note);
      showSuccess('Permintaan negosiasi berhasil dikirim');
      await fetchDetail();
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal mengirim permintaan negosiasi');
    }
  };

  const completeBooking = async () => {
    try {
      await bookingService.complete(id);
      showSuccess('Pemesanan perjalanan berhasil diselesaikan');
      await fetchDetail();
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal menyelesaikan pemesanan');
    }
  };

  return { 
    booking, 
    paymentMethods,
    companyProfile,
    loading, 
    error, 
    refresh: fetchDetail, 
    cancelBooking,
    acceptQuotation,
    reviseQuotation,
    completeBooking
  };
}
