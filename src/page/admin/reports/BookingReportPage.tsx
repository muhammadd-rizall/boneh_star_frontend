import { useState, useRef, useEffect } from "react";
import { useBookingReport } from "@/features/admin/reports/hooks/useBookingReport";
import ReportFilters from "@/features/admin/reports/components/ReportFilters";
import ReportSummary from "@/features/admin/reports/components/ReportSummary";
import ReportTable from "@/features/admin/reports/components/ReportTable";
import ReportCharts from "@/features/admin/reports/components/ReportCharts";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageComponents";
import { Download, RefreshCw, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

export default function BookingReportPage() {
  const { 
    data, 
    loading, 
    exporting, 
    error, 
    filters, 
    updateFilters, 
    refetch, 
    exportExcel, 
    exportPdf 
  } = useBookingReport();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };

    if (showExportOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportOptions]);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Laporan Pemesanan"
        subtitle={
          filters.start_date && filters.end_date 
            ? `Periode Laporan: ${formatDateIndo(filters.start_date)} s/d ${formatDateIndo(filters.end_date)}`
            : "Statistik pemesanan armada"
        }
        badge="Laporan"
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button 
              variant="outline" 
              icon={RefreshCw} 
              onClick={refetch}
              loading={loading}
              size="md"
              className="h-11 rounded-xl border-platinum-tint bg-white px-4 text-sm font-semibold text-slate-blue shadow-sm hover:bg-cloud-mist hover:text-midnight-indigo"
            >
              Refresh
            </Button>
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <Button 
                variant="primary" 
                icon={Download}
                onClick={() => setShowExportOptions(!showExportOptions)}
                loading={exporting}
                suffix={ChevronDown}
                size="md"
                className="h-11 w-full justify-between rounded-xl px-4 text-sm font-semibold shadow-button sm:w-auto sm:justify-center"
              >
                Ekspor
              </Button>
              
              {showExportOptions && (
                <div className="absolute right-0 z-50 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-platinum-tint bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        exportExcel();
                        setShowExportOptions(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-cloud-mist"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <FileSpreadsheet size={20} />
                      </div>
                      <span className="text-sm font-bold text-midnight-indigo whitespace-nowrap">Lembar Kerja Excel</span>
                    </button>
                    <button
                      onClick={() => {
                        exportPdf();
                        setShowExportOptions(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-cloud-mist"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-midnight-indigo whitespace-nowrap">Dokumen PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />

      <ReportFilters filters={filters} onFilterChange={updateFilters} />

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : data ? (
        <>
          <ReportSummary summary={data.statistics.summary} />
          
          <ReportCharts statistics={data.statistics} />

          <ReportTable data={data.data} loading={loading} />
        </>
      ) : null}
    </div>
  );
}
