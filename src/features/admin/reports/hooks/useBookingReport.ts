import { useState, useCallback, useEffect } from "react";
import { bookingReportService } from "../services/BookingReportService";
import type { 
  BookingReportFilters, 
  BookingReportApiResponse 
} from "../types/BookingReport";

export function useBookingReport() {
  const [data, setData] = useState<BookingReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filters: last 30 days
  const [filters, setFilters] = useState<BookingReportFilters>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    
    return {
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    };
  });

  const fetchReport = useCallback(async (currentFilters: BookingReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingReportService.getBookingReport(currentFilters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch booking report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = (newFilters: Partial<BookingReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchReport(filters);
  }, [filters, fetchReport]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: () => fetchReport(filters),
  };
}
