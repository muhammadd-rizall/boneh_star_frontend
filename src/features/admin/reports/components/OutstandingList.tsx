
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { formatCurrency, formatDate } from "@/utils/formatter";
import type { OutstandingItem } from "../types/IncomeReport";

interface OutstandingListProps {
  data: OutstandingItem[];
  loading?: boolean;
}

export default function OutstandingList({ data, loading }: OutstandingListProps) {
  const columns: Column<OutstandingItem>[] = [
    {
      header: "Invoice",
      accessor: "invoice_number",
      className: "font-bold text-slate-900",
    },
    {
      header: "Penyewa",
      accessor: "penyewa",
    },
    {
      header: "Departure",
      accessor: (row) => formatDate(row.departure_date),
    },
    {
      header: "Remaining Amount",
      accessor: (row) => (
        <span className="font-semibold text-rose-600">
          {formatCurrency(row.remaining_amount)}
        </span>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-slate-800">Outstanding Payments</h3>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
          {data.length} Unpaid Invoices
        </span>
      </div>
      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading} 
        emptyMessage="No outstanding payments"
      />
    </div>
  );
}
