import { useState, useCallback, useEffect } from "react";
import { incomeReportService } from "../services/IncomeReportService";
import type { 
  IncomeReportFilters, 
  IncomeReportApiResponse 
} from "../types/IncomeReport";

export function useIncomeReport() {
  const [data, setData] = useState<IncomeReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filters: empty
  const [filters, setFilters] = useState<IncomeReportFilters>(() => {
    return {
      start_date: "",
      end_date: "",
    };
  });

  const fetchReport = useCallback(async (currentFilters: IncomeReportFilters) => {
    if (currentFilters.start_date && currentFilters.end_date && new Date(currentFilters.start_date) > new Date(currentFilters.end_date)) {
      return;
    }

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

  const exportExcel = async () => {
    try {
      setExporting(true);
      await incomeReportService.exportExcel(filters);
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
      await incomeReportService.exportPdf(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export PDF";
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const updateFilters = (newFilters: Partial<IncomeReportFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Auto-correct: If new start_date is after current end_date, push end_date forward
      if (newFilters.start_date && updated.end_date) {
        const start = new Date(newFilters.start_date);
        const end = new Date(updated.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start > end) {
          const newEnd = new Date(start);
          newEnd.setMonth(start.getMonth() + 1);
          updated.end_date = newEnd.toISOString().split('T')[0];
        }
      }
      
      // Auto-correct: If new end_date is before current start_date, pull start_date backward
      if (newFilters.end_date && updated.start_date) {
        const start = new Date(updated.start_date);
        const end = new Date(newFilters.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
          const newStart = new Date(end);
          newStart.setMonth(end.getMonth() - 1);
          updated.start_date = newStart.toISOString().split('T')[0];
        }
      }
      
      return updated;
    });
  };

  useEffect(() => {
    if (filters.start_date && filters.end_date && new Date(filters.start_date) <= new Date(filters.end_date)) {
      fetchReport(filters);
    } else if (!filters.start_date && !filters.end_date) {
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
