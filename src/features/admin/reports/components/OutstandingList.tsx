import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatter";
import type { OutstandingItem } from "../types/IncomeReport";
import { Calendar, FileText, User } from "lucide-react";

interface OutstandingListProps {
  data: OutstandingItem[];
  loading?: boolean;
}

export default function OutstandingList({ data, loading }: OutstandingListProps) {
  const columns: Column<OutstandingItem>[] = [
    {
      header: "Invoice",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-rose-500 shrink-0" />
          <span className="font-bold text-midnight-indigo">{row.invoice_number}</span>
        </div>
      ),
    },
    {
      header: "Penyewa",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-sm font-bold text-midnight-indigo">
          <User size={14} className="text-slate-400 shrink-0" />
          <span>{row.penyewa}</span>
        </div>
      ),
    },
    {
      header: "Keberangkatan",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-blue opacity-85">
          <Calendar size={14} className="text-slate-blue/60 shrink-0" />
          <span>
            {new Date(row.departure_date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Sisa Tagihan",
      accessor: (row) => (
        <span className="text-sm font-black text-rose-600">
          - {formatCurrency(row.remaining_amount)}
        </span>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="rounded-[24px] border border-platinum-tint bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="px-6 pt-6 pb-5 border-b border-platinum-tint/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Tagihan Belum Lunas</h3>
          <p className="text-sm font-medium text-slate-blue opacity-60 mt-1">Invoice penyewaan dengan sisa pembayaran terutang</p>
        </div>
        <span className="inline-flex self-start sm:self-auto rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1 text-xs font-black text-rose-600 shadow-sm">
          {data.length} Invoice
        </span>
      </div>
      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading} 
        emptyMessage="Tidak ada sisa pembayaran"
        paginated
        className="border-none shadow-none rounded-none"
      />
    </div>
  );
}

