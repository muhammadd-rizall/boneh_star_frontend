import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { PaymentMethod } from "@/features/admin/payment-methods/types/PaymentMethod"
import { Edit, Trash2, CreditCard, RotateCcw } from "lucide-react"

interface PaymentMethodTableProps {
  data: PaymentMethod[]
  onDelete: (paymentMethod: PaymentMethod) => void
  onEdit: (paymentMethod: PaymentMethod) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function PaymentMethodTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: PaymentMethodTableProps) {
  const columns: Column<PaymentMethod>[] = [
    { 
      header: "Bank Information", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <CreditCard size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.bank_name}</span>
            <span className="text-xs text-slate-500">{row.account_number}</span>
          </div>
        </div>
      )
    },
    {
      header: "Account Name",
      accessor: (row) => (
        <span className="text-sm font-medium text-slate-700">{row.account_name}</span>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
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
                title="Restore Payment Method" 
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
                icon={Edit} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onEdit(row)}
                title="Edit Payment Method" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Payment Method"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
