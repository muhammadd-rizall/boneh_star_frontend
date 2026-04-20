import React from "react";
import { useIncomeReport } from "./hooks/useIncomeReport";
import IncomeReportFilters from "./components/IncomeReportFilters";
import IncomeReportSummary from "./components/IncomeReportSummary";
import IncomeReportCharts from "./components/IncomeReportCharts";
import IncomeReportTable from "./components/IncomeReportTable";
import OutstandingList from "./components/OutstandingList";
import Loader from "@/components/feedback/Loader";
import ErrorState from "@/components/feedback/ErrorState";
import Button from "@/components/ui/Button";
import { Download, RefreshCw, Calendar } from "lucide-react";
import { formatMonth } from "@/utils/formatter";

export default function IncomeReportFeature() {
  const { data, loading, error, filters, updateFilters, refetch } = useIncomeReport();

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const periodText = data 
    ? `${data.period.month ? formatMonth(data.period.month) + ' ' : ''}${data.period.year}`
    : "";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Income Reports</h1>
          {data && (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Calendar size={14} />
              <span>Report Period: {periodText}</span>
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
}
