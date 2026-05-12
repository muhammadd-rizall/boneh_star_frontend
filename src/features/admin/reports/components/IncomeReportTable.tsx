
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { formatCurrency, formatDate } from "@/utils/formatter";
import type { Payment } from "@/types/Database";

interface IncomeReportTableProps {
  data: Payment[];
  loading?: boolean;
}

export default function IncomeReportTable({ data, loading }: IncomeReportTableProps) {
  const columns: Column<Payment>[] = [
    {
      header: "Date",
      accessor: (row) => formatDate(row.payment_date),
    },
    {
      header: "Invoice",
      accessor: (row) => row.transaction?.invoice_number || "-",
      className: "font-semibold text-slate-900",
    },
    {
      header: "Method",
      accessor: (row) => row.payment_method?.bank_name || "-",
    },
    {
      header: "Type",
      accessor: (row) => (
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
          row.payment_type === 'dp' 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-emerald-100 text-emerald-600'
        }`}>
          {row.payment_type === 'dp' ? 'Down Payment' : 'Settlement'}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="font-bold text-slate-900">
          {formatCurrency(row.amount)}
        </span>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-slate-800">Verified Payments History</h3>
      </div>
      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading} 
        emptyMessage="No verified payments in this period"
      />
    </div>
  );
}
