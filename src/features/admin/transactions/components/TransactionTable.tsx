import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Transaction } from "@/features/admin/transactions/types/Transaction"
import { Edit, Trash2, FileText, Banknote, User, RotateCcw, Receipt } from "lucide-react"

interface TransactionTableProps {
  data: Transaction[]
  onDelete: (transaction: Transaction) => void
  onEdit: (transaction: Transaction) => void
  onRestore?: (transaction: Transaction) => void
  onForceDelete?: (transaction: Transaction) => void
  loading?: boolean
  isTrashed?: boolean
}

export default function TransactionTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore, 
  onForceDelete, 
  loading, 
  isTrashed = false 
}: TransactionTableProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'dp_paid': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'fully_paid': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'overdue': return 'border-rose-200 bg-rose-50 text-rose-700';
      default: return 'border-slate-200 bg-slate-100 text-slate-500';
    }
  };

  const columns: Column<Transaction>[] = [
    {
      header: "Invoice & Booking",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 tracking-tight">
            <Receipt size={14} className="text-slate-400" />
            <span>{row.invoice_number}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <FileText size={12} />
            <span>{row.booking?.booking_code || 'No Booking'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Customer",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <User size={14} />
          </div>
          <span className="text-sm font-medium text-slate-700">{row.booking?.customer?.name || 'Unknown'}</span>
        </div>
      )
    },
    {
      header: "Payment Details",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
            <Banknote size={14} className="text-emerald-500" />
            <span>{formatCurrency(row.total_amount)}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-wider">
            <span className="text-blue-600">DP: {formatCurrency(row.dp_paid)}</span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-600">Rem: {formatCurrency(row.remaining_amount)}</span>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] border ${getStatusColor(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrashed ? (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                icon={RotateCcw} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onRestore?.(row)}
                title="Restore Transaction" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onForceDelete?.(row)}
                title="Permanently Delete"
              />
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                icon={Edit} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onEdit(row)}
                title="Edit Transaction" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Move to Trash"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} />
}
