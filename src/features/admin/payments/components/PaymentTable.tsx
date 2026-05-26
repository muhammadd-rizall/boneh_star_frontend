import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Payment } from "@/features/admin/payments/types/Payment"
import { Eye, CheckCircle, Trash2, Receipt, RotateCcw } from "lucide-react"

interface PaymentTableProps {
  data: Payment[]
  onVerify: (payment: Payment) => void
  onViewProof: (payment: Payment) => void
  onDelete: (payment: Payment) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function PaymentTable({ 
  data, 
  onVerify, 
  onViewProof,
  onDelete, 
  onRestore,
  loading, 
  isTrash = false 
}: PaymentTableProps) {
  const columns: Column<Payment>[] = [
    { 
      header: "Transaction", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <Receipt size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">
              {row.transaction?.invoice_number || "N/A"}
            </span>
            <span className="text-xs text-slate-500">
              {row.payment_type.toUpperCase()} - {new Date(row.payment_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="text-sm font-bold text-slate-800">
          Rp {new Intl.NumberFormat('id-ID').format(row.amount)}
        </span>
      )
    },
    {
      header: "Payment Method",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{row.payment_method?.bank_name}</span>
          <span className="text-xs text-slate-500">{row.payment_method?.account_name}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const statusColors = {
          pending: "bg-amber-100 text-amber-800",
          verified: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      }
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                icon={RotateCcw} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onRestore?.(row.id)}
                title="Restore Payment" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Permanently Delete"
              />
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                icon={Eye} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onViewProof(row)}
                title="View Proof" 
              />
              {row.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="primary" 
                  icon={CheckCircle} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onVerify(row)}
                  title="Verify Payment" 
                />
              )}
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Payment"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
