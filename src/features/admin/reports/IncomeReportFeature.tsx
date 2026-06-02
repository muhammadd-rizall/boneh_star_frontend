import { useState, useRef, useEffect } from "react";
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
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
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
                Export
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
                      <span className="text-sm font-bold text-midnight-indigo whitespace-nowrap">Excel Spreadsheet</span>
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
                      <span className="text-sm font-bold text-midnight-indigo whitespace-nowrap">PDF Document</span>
                    </button>
                  </div>
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
