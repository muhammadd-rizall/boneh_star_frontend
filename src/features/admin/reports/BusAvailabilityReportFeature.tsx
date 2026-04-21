
import { useBusAvailabilityReport } from "./hooks/useBusAvailabilityReport";
import BusAvailabilityFilters from "./components/BusAvailabilityFilters";
import BusAvailabilityReportTable from "./components/BusAvailabilityReportTable";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import Button from "@/components/ui/Button";
import { Download, RefreshCw, Calendar } from "lucide-react";

const BusAvailabilityReportFeature = () => {
  const { data, loading, error, filters, updateFilters, refetch } = useBusAvailabilityReport();

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Bus Availability Reports</h1>
          {data && (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Calendar size={14} />
              <span>Report Period: {data.period.start_date} to {data.period.end_date}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            icon={RefreshCw} 
            onClick={refetch}
            loading={loading}
          >
            Update
          </Button>
          <Button 
            variant="primary" 
            icon={Download}
            onClick={() => window.print()}
          >
            Export Report
          </Button>
        </div>
      </div>

      <BusAvailabilityFilters filters={filters} onFilterChange={updateFilters} />

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : data ? (
        <BusAvailabilityReportTable data={data.data} loading={loading} />
      ) : null}
    </div>
  );
};

export default BusAvailabilityReportFeature;
