import { useState, useCallback, useEffect } from "react";
import { busAvailabilityReportService } from "../services/BusAvailabilityReportService";
import type { 
  BusAvailabilityReportFilters, 
  BusAvailabilityReportApiResponse 
} from "../types/BusAvailabilityReport";

export function useBusAvailabilityReport() {
  const [data, setData] = useState<BusAvailabilityReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filters: empty
  const [filters, setFilters] = useState<BusAvailabilityReportFilters>(() => {
    return {
      start_date: "",
      end_date: "",
    };
  });

  const fetchReport = useCallback(async (currentFilters: BusAvailabilityReportFilters) => {
    const apiFilters = { ...currentFilters };
    if (!apiFilters.start_date || !apiFilters.end_date) {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 14);
      apiFilters.start_date = apiFilters.start_date || start.toISOString().split('T')[0];
      apiFilters.end_date = apiFilters.end_date || end.toISOString().split('T')[0];
    }

    // Prevent fetching if dates are in an invalid relationship
    if (new Date(apiFilters.start_date) > new Date(apiFilters.end_date)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await busAvailabilityReportService.getBusAvailabilityReport(apiFilters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bus availability report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = (newFilters: Partial<BusAvailabilityReportFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Auto-correct: If new start_date is after current end_date, push end_date forward
      if (newFilters.start_date && updated.end_date) {
        const start = new Date(newFilters.start_date);
        const end = new Date(updated.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start > end) {
          const newEnd = new Date(start);
          newEnd.setDate(start.getDate() + 14);
          updated.end_date = newEnd.toISOString().split('T')[0];
        }
      }
      
      // Auto-correct: If new end_date is before current start_date, pull start_date backward
      if (newFilters.end_date && updated.start_date) {
        const start = new Date(updated.start_date);
        const end = new Date(newFilters.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
          const newStart = new Date(end);
          newStart.setDate(end.getDate() - 14);
          updated.start_date = newStart.toISOString().split('T')[0];
        }
      }
      
      return updated;
    });
  };

  useEffect(() => {
    // Only call API if dates are in valid range or both empty
    if (!filters.start_date && !filters.end_date) {
      fetchReport(filters);
    } else if (filters.start_date && filters.end_date && new Date(filters.start_date) <= new Date(filters.end_date)) {
      fetchReport(filters);
    }
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
