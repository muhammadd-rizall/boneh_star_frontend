import { useState } from "react";
import { useBusAvailabilityReport } from "@/features/admin/reports/hooks/useBusAvailabilityReport";
import BusAvailabilityFilters from "@/features/admin/reports/components/BusAvailabilityFilters";
import BusAvailabilityReportTable from "@/features/admin/reports/components/BusAvailabilityReportTable";
import BusAvailabilityTimeline from "@/features/admin/reports/components/BusAvailabilityTimeline";
import BusAvailabilityMetrics from "@/features/admin/reports/components/BusAvailabilityMetrics";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { RefreshCw, Download, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export default function BusAvailabilityReportPage() {
  const { data, loading, error, filters, updateFilters, refetch } = useBusAvailabilityReport();
  const [view, setView] = useState<'table' | 'timeline'>('timeline');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const { showSuccess } = useToastStore();

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const handleExport = (type: 'excel' | 'pdf') => {
    showSuccess(`Mengekspor laporan ketersediaan bus ke format ${type.toUpperCase()}...`);
    setShowExportDropdown(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Redesigned Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Ketersediaan Bus</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Dashboard</span>
            <span className="text-[10px] text-slate-300">&gt;</span>
            <span>Laporan</span>
            <span className="text-[10px] text-slate-300">&gt;</span>
            <span className="text-slate-500">Ketersediaan Bus</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={refetch}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
              <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg z-50">
                <button
                  onClick={() => handleExport('excel')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-rose-600" />
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redesigned Filters card */}
      <BusAvailabilityFilters 
        filters={filters} 
        onFilterChange={updateFilters} 
        view={view}
        onViewChange={setView}
      />

      {/* Summary Metrics */}
      {data && (
        <BusAvailabilityMetrics 
          data={data.data} 
          period={data.period}
        />
      )}

      {/* Main Content Area */}
      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : data ? (
        view === 'table' ? (
          <BusAvailabilityReportTable data={data.data} loading={loading} />
        ) : (
          <BusAvailabilityTimeline 
            data={data.data} 
            period={data.period} 
            filters={filters}
            onFilterChange={updateFilters}
          />
        )
      ) : null}
    </div>
  );
}
