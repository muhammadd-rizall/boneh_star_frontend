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

  // Default filters: next 14 days for availability
  const [filters, setFilters] = useState<BusAvailabilityReportFilters>(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 14);
    
    return {
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    };
  });

  const fetchReport = useCallback(async (currentFilters: BusAvailabilityReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await busAvailabilityReportService.getBusAvailabilityReport(currentFilters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bus availability report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = (newFilters: Partial<BusAvailabilityReportFilters>) => {
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
