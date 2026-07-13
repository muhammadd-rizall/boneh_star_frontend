
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
      header: "Keberangkatan",
      accessor: (row) => formatDate(row.departure_date),
    },
    {
      header: "Sisa Tagihan",
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
        <h3 className="text-lg font-bold text-slate-800">Pembayaran Tersisa</h3>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
          {data.length} Invoice Belum Lunas
        </span>
      </div>
      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading} 
        emptyMessage="Tidak ada sisa pembayaran"
        paginated
      />
    </div>
  );
}
