import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Quotation } from "@/features/admin/quotations/types/Quotation"
import { Edit, Trash2, Calendar, FileText, Banknote, User, Eye } from "lucide-react"
import { useModulePermission } from "@/hooks/useModulePermission"

interface QuotationTableProps {
  data: Quotation[]
  onDelete: (quotation: Quotation) => void
  onEdit: (quotation: Quotation) => void
  onViewDetail?: (quotation: Quotation) => void
  loading?: boolean
}

export default function QuotationTable({ data, onDelete, onEdit, onViewDetail, loading }: QuotationTableProps) {
  const { canUpdate, canDelete } = useModulePermission("quotations")

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft': return { label: 'Draf', color: 'border-slate-200 bg-slate-50 text-slate-600' };
      case 'sent': return { label: 'Dikirim', color: 'border-blue-200 bg-blue-50 text-blue-700' };
      case 'accepted': return { label: 'Diterima', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
      case 'revision': return { label: 'Revisi', color: 'border-amber-200 bg-amber-50 text-amber-700' };
      case 'expired': return { label: 'Kedaluwarsa', color: 'border-rose-200 bg-rose-50 text-rose-700' };
      case 'rejected': return { label: 'Ditolak', color: 'border-red-200 bg-red-50 text-red-700' };
      default: return { label: status, color: 'border-slate-200 bg-slate-100 text-slate-500' };
    }
  };

  const columns: Column<Quotation>[] = [
    {
      header: "Detail Pemesanan",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 tracking-tight">
            <FileText size={14} className="text-slate-400" />
            <span>{row.booking?.booking_code || 'Tanpa Kode'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <User size={12} />
            <span>{row.booking?.customer?.name || 'Pelanggan Tidak Diketahui'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Harga Penawaran",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
            <Banknote size={14} className="text-emerald-500" />
            <span>{formatCurrency(row.proposed_price)}</span>
          </div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            DP: {formatCurrency(row.dp_amount)}
          </div>
        </div>
      )
    },
    {
      header: "Masa Berlaku",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Calendar size={12} className="text-slate-400" />
            <span>Hingga {formatDate(row.valid_until)}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Dibuat oleh: {row.user?.name || 'Admin'}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const config = getStatusConfig(row.status);
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] border ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button 
              size="sm" 
              variant="outline" 
              icon={Edit} 
              className="h-9 w-9 rounded-full p-0" 
              onClick={() => onEdit(row)}
              title="Edit Penawaran" 
            />
          )}
          {canDelete && (
            <Button 
              size="sm" 
              variant="danger" 
              icon={Trash2} 
              className="h-9 w-9 rounded-full p-0" 
              onClick={() => onDelete(row)}
              title="Hapus Penawaran" 
            />
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
