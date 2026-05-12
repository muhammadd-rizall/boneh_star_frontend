
import { useBusAvailabilityReport } from "./hooks/useBusAvailabilityReport";
import BusAvailabilityFilters from "./components/BusAvailabilityFilters";
import BusAvailabilityReportTable from "./components/BusAvailabilityReportTable";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageComponents";
import { RefreshCw } from "lucide-react";

const BusAvailabilityReportFeature = () => {
  const { data, loading, error, filters, updateFilters, refetch } = useBusAvailabilityReport();

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Bus Availability Reports"
        subtitle={data ? `Periode Laporan: ${data.period.start_date} s/d ${data.period.end_date}` : "Monitoring ketersediaan unit armada"}
        badge="Operasional"
        actions={
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
        }
      />

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
