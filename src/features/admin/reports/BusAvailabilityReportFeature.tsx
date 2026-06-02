
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
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center rounded-xl border border-platinum-tint bg-white p-1 shadow-sm">
              <button
                onClick={() => setView('table')}
                className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all sm:flex-none ${
                  view === 'table' ? "bg-midnight-indigo text-white shadow-sm" : "text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo"
                }`}
              >
                <LayoutList size={14} />
                Table
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all sm:flex-none ${
                  view === 'timeline' ? "bg-midnight-indigo text-white shadow-sm" : "text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo"
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
              size="md"
              className="h-11 rounded-xl border-platinum-tint bg-white px-4 text-sm font-semibold text-slate-blue shadow-sm hover:bg-cloud-mist hover:text-midnight-indigo"
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
