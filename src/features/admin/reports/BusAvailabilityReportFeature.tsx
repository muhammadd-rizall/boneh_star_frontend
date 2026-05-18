
import { useState } from "react";
import { useBusAvailabilityReport } from "./hooks/useBusAvailabilityReport";
import BusAvailabilityFilters from "./components/BusAvailabilityFilters";
import BusAvailabilityReportTable from "./components/BusAvailabilityReportTable";
import BusAvailabilityTimeline from "./components/BusAvailabilityTimeline";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageComponents";
import { RefreshCw, LayoutList, Calendar as CalendarIcon } from "lucide-react";

const BusAvailabilityReportFeature = () => {
  const { data, loading, error, filters, updateFilters, refetch } = useBusAvailabilityReport();
  const [view, setView] = useState<'table' | 'timeline'>('timeline');

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Bus Availability Reports"
        subtitle={data ? `Periode Laporan: ${data.period.start_date} s/d ${data.period.end_date}` : "Monitoring ketersediaan unit armada"}
        badge="Operasional"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setView('table')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  view === 'table' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutList size={14} />
                Table
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  view === 'timeline' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <CalendarIcon size={14} />
                Calendar
              </button>
            </div>
            <Button 
              variant="outline" 
              icon={RefreshCw} 
              onClick={refetch}
              loading={loading}
              size="sm"
              className="rounded-xl"
            >
              Update
            </Button>
          </div>
        }
      />

      <BusAvailabilityFilters filters={filters} onFilterChange={updateFilters} />

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : data ? (
        view === 'table' ? (
          <BusAvailabilityReportTable data={data.data} loading={loading} />
        ) : (
          <BusAvailabilityTimeline data={data.data} period={data.period} />
        )
      ) : null}
    </div>
  );
};

export default BusAvailabilityReportFeature;
