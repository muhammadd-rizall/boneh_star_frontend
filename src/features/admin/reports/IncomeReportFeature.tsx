import { useState } from "react";
import { useIncomeReport } from "./hooks/useIncomeReport";
import IncomeReportFilters from "./components/IncomeReportFilters";
import IncomeReportSummary from "./components/IncomeReportSummary";
import IncomeReportCharts from "./components/IncomeReportCharts";
import IncomeReportTable from "./components/IncomeReportTable";
import OutstandingList from "./components/OutstandingList";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageComponents";
import { Download, RefreshCw, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { formatMonth } from "@/utils/formatter";

const IncomeReportFeature = () => {
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
  } = useIncomeReport();
  const [showExportOptions, setShowExportOptions] = useState(false);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const periodText = data 
    ? `${data.period.month ? formatMonth(data.period.month) + ' ' : ''}${data.period.year}`
    : "Ringkasan Pendapatan";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Income Reports"
        subtitle={data ? `Periode Laporan: ${periodText}` : "Analisis pendapatan dan penagihan"}
        badge="Keuangan"
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

      <IncomeReportFilters filters={filters} onFilterChange={updateFilters} />

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : data ? (
        <>
          <IncomeReportSummary summary={data.statistics.summary} />
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="lg:col-span-2">
               <IncomeReportCharts statistics={data.statistics} />
            </div>
            
            <OutstandingList data={data.statistics.outstanding_list} loading={loading} />
            
            <IncomeReportTable data={data.data} loading={loading} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default IncomeReportFeature;
