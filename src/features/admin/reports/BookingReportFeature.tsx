import { useState } from "react";
import { useBookingReport } from "./hooks/useBookingReport";
import ReportFilters from "./components/ReportFilters";
import ReportSummary from "./components/ReportSummary";
import ReportTable from "./components/ReportTable";
import ReportCharts from "./components/ReportCharts";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import Button from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageComponents";
import { Download, RefreshCw, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

const BookingReportFeature = () => {
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

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Booking Reports"
        subtitle={data ? `Periode Laporan: ${data.period.start_date} s/d ${data.period.end_date}` : "Statistik pemesanan armada"}
        badge="Laporan"
        actions={
          <div className="flex items-center gap-3">
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
            <div className="relative">
              <Button 
                variant="primary" 
                icon={Download}
                onClick={() => setShowExportOptions(!showExportOptions)}
                loading={exporting}
                suffix={ChevronDown}
                size="sm"
                className="rounded-xl shadow-lg shadow-slate-200"
              >
                Export Report
              </Button>
              
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5 z-20 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      exportExcel();
                      setShowExportOptions(false);
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileSpreadsheet size={16} className="mr-3 text-emerald-600" />
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => {
                      exportPdf();
                      setShowExportOptions(false);
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileText size={16} className="mr-3 text-rose-600" />
                    PDF (.pdf)
                  </button>
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
};

export default BookingReportFeature;
