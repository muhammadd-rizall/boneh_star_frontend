import { useState } from "react";
import { useBusAvailabilityReport } from "@/features/admin/reports/hooks/useBusAvailabilityReport";
import BusAvailabilityFilters from "@/features/admin/reports/components/BusAvailabilityFilters";
import BusAvailabilityReportTable from "@/features/admin/reports/components/BusAvailabilityReportTable";
import BusAvailabilityTimeline from "@/features/admin/reports/components/BusAvailabilityTimeline";
import BusAvailabilityMetrics from "@/features/admin/reports/components/BusAvailabilityMetrics";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { PageHeader } from "@/components/ui/PageComponents";
import { RefreshCw } from "lucide-react";

export default function BusAvailabilityReportPage() {
  const { data, loading, error, filters, updateFilters, refetch } = useBusAvailabilityReport();
  const [view, setView] = useState<'table' | 'timeline'>('table');

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header with Badge */}
      <PageHeader
        title="Laporan Ketersediaan Bus"
        subtitle="Kelola dan pantau ketersediaan armada dalam periode yang dipilih."
        badge="Laporan"
        actions={
          <button 
            onClick={refetch}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        }
      />

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
