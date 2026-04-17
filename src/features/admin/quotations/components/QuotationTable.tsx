import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Quotation } from "@/features/admin/quotations/types/Quotation"
import { Edit, Trash2, Calendar, FileText, Banknote, User } from "lucide-react"

interface QuotationTableProps {
  data: Quotation[]
  onDelete: (quotation: Quotation) => void
  onEdit: (quotation: Quotation) => void
  loading?: boolean
}

export default function QuotationTable({ data, onDelete, onEdit, loading }: QuotationTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'border-slate-200 bg-slate-50 text-slate-600';
      case 'sent': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'accepted': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'revision': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'expired': return 'border-rose-200 bg-rose-50 text-rose-700';
      case 'rejected': return 'border-red-200 bg-red-50 text-red-700';
      default: return 'border-slate-200 bg-slate-100 text-slate-500';
    }
  };

  const columns: Column<Quotation>[] = [
    {
      header: "Booking Details",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 tracking-tight">
            <FileText size={14} className="text-slate-400" />
            <span>{row.booking?.booking_code || 'No Code'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <User size={12} />
            <span>{row.booking?.customer?.name || 'Unknown Customer'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Pricing",
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
      header: "Validity",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Calendar size={12} className="text-slate-400" />
            <span>Until {formatDate(row.valid_until)}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Created by: {row.user?.name || 'Admin'}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] border ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            icon={Edit} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onEdit(row)}
            title="Edit Quotation" 
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onDelete(row)}
            title="Delete Quotation"
          />
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
