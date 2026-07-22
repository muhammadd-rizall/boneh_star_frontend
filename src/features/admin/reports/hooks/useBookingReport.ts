import { useState, useCallback, useEffect } from "react";
import { bookingReportService } from "../services/BookingReportService";
import type { 
  BookingReportFilters, 
  BookingReportApiResponse 
} from "../types/BookingReport";

export function useBookingReport() {
  const [data, setData] = useState<BookingReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filters: empty
  const [filters, setFilters] = useState<BookingReportFilters>(() => {
    return {
      start_date: "",
      end_date: "",
    };
  });

  const fetchReport = useCallback(async (currentFilters: BookingReportFilters) => {
    const apiFilters = { ...currentFilters };
    if (!apiFilters.start_date || !apiFilters.end_date) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      apiFilters.start_date = apiFilters.start_date || start.toISOString().split('T')[0];
      apiFilters.end_date = apiFilters.end_date || end.toISOString().split('T')[0];
    }

    if (new Date(apiFilters.start_date) > new Date(apiFilters.end_date)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await bookingReportService.getBookingReport(apiFilters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch booking report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportExcel = async () => {
    try {
      setExporting(true);
      const apiFilters = { ...filters };
      if (!apiFilters.start_date || !apiFilters.end_date) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        apiFilters.start_date = apiFilters.start_date || start.toISOString().split('T')[0];
        apiFilters.end_date = apiFilters.end_date || end.toISOString().split('T')[0];
      }
      await bookingReportService.exportExcel(apiFilters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export Excel";
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const exportPdf = async () => {
    try {
      setExporting(true);
      const apiFilters = { ...filters };
      if (!apiFilters.start_date || !apiFilters.end_date) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        apiFilters.start_date = apiFilters.start_date || start.toISOString().split('T')[0];
        apiFilters.end_date = apiFilters.end_date || end.toISOString().split('T')[0];
      }
      await bookingReportService.exportPdf(apiFilters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export PDF";
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const updateFilters = (newFilters: Partial<BookingReportFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Auto-correct: If new start_date is after current end_date, push end_date forward
      if (newFilters.start_date && updated.end_date) {
        const start = new Date(newFilters.start_date);
        const end = new Date(updated.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start > end) {
          const newEnd = new Date(start);
          newEnd.setDate(start.getDate() + 30);
          updated.end_date = newEnd.toISOString().split('T')[0];
        }
      }
      
      // Auto-correct: If new end_date is before current start_date, pull start_date backward
      if (newFilters.end_date && updated.start_date) {
        const start = new Date(updated.start_date);
        const end = new Date(newFilters.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
          const newStart = new Date(end);
          newStart.setDate(end.getDate() - 30);
          updated.start_date = newStart.toISOString().split('T')[0];
        }
      }
      
      return updated;
    });
  };

  useEffect(() => {
    if (!filters.start_date || !filters.end_date) {
      fetchReport(filters);
    } else if (new Date(filters.start_date) <= new Date(filters.end_date)) {
      fetchReport(filters);
    }
  }, [filters, fetchReport]);

  return {
    data,
    loading,
    exporting,
    error,
    filters,
    updateFilters,
    exportExcel,
    exportPdf,
    refetch: () => fetchReport(filters),
  };
}
