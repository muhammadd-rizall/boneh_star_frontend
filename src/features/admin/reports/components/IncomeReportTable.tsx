import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatter";
import type { Payment } from "@/types/Database";
import { Calendar, FileText, CreditCard } from "lucide-react";

interface IncomeReportTableProps {
  data: Payment[];
  loading?: boolean;
}

export default function IncomeReportTable({ data, loading }: IncomeReportTableProps) {
  const columns: Column<Payment>[] = [
    {
      header: "Tanggal",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-blue opacity-85">
          <Calendar size={14} className="text-slate-blue/60 shrink-0" />
          <span>
            {new Date(row.payment_date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Invoice",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-action-blue shrink-0" />
          <span className="font-bold text-midnight-indigo">{row.transaction?.invoice_number || "-"}</span>
        </div>
      ),
    },
    {
      header: "Metode",
      accessor: (row) => (
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-midnight-indigo/80">
          <CreditCard size={12} className="text-slate-400 shrink-0" />
          <span>{row.payment_method?.bank_name || "-"}</span>
        </div>
      ),
    },
    {
      header: "Jenis",
      accessor: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          row.payment_type === 'dp' 
            ? 'border-blue-200 bg-blue-50 text-blue-700' 
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}>
          {row.payment_type === 'dp' ? 'Uang Muka (DP)' : 'Pelunasan'}
        </span>
      ),
    },
    {
      header: "Jumlah",
      accessor: (row) => (
        <span className="text-sm font-black text-emerald-600">
          + {formatCurrency(row.amount)}
        </span>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="rounded-[24px] border border-platinum-tint bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="px-6 pt-6 pb-5 border-b border-platinum-tint/50">
        <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Riwayat Pembayaran Terverifikasi</h3>
        <p className="text-sm font-medium text-slate-blue opacity-60 mt-1">Daftar transaksi pembayaran masuk yang telah dikonfirmasi oleh sistem</p>
      </div>
      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading} 
        emptyMessage="Tidak ada pembayaran terverifikasi pada periode ini"
        paginated
        className="border-none shadow-none rounded-none"
      />
    </div>
  );
}

