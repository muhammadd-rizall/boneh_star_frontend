import { useState, useCallback, useEffect } from "react";
import { incomeReportService } from "../services/IncomeReportService";
import type { 
  IncomeReportFilters, 
  IncomeReportApiResponse 
} from "../types/IncomeReport";

export function useIncomeReport() {
  const [data, setData] = useState<IncomeReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filters: Current year
  const [filters, setFilters] = useState<IncomeReportFilters>(() => {
    return {
      year: new Date().getFullYear(),
    };
  });

  const fetchReport = useCallback(async (currentFilters: IncomeReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await incomeReportService.getIncomeReport(currentFilters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch income report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = (newFilters: Partial<IncomeReportFilters>) => {
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
