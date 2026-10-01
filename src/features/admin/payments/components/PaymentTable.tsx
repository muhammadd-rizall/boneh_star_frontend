import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Payment } from "@/features/admin/payments/types/Payment"
import { Eye, CheckCircle, Trash2, Receipt, RotateCcw } from "lucide-react"
import { formatDateDMY } from "@/utils/formatter"
import { useModulePermission } from "@/hooks/useModulePermission"

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
  const { canVerify, canDelete } = useModulePermission("payments")

  const columns: Column<Payment>[] = [
    { 
      header: "Transaksi", 
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
              {row.payment_type.toUpperCase()} - {formatDateDMY(row.payment_date)}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Penyewa",
      accessor: (row) => (
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-slate-800">
            {row.transaction?.booking?.customer?.name || "N/A"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Booking: {row.transaction?.booking?.booking_code || "N/A"}
          </span>
        </div>
      )
    },
    {
      header: "Nominal",
      accessor: (row) => (
        <span className="text-sm font-bold text-slate-800">
          Rp {new Intl.NumberFormat('id-ID').format(row.amount)}
        </span>
      )
    },
    {
      header: "Metode Pembayaran",
      className: "hidden md:table-cell",
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
        const statusLabels = {
          pending: "Tertunda",
          verified: "Terverifikasi",
          rejected: "Ditolak",
        };
        const currentStatus = row.status as keyof typeof statusColors;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[currentStatus] || "bg-slate-100 text-slate-800"}`}>
            {statusLabels[currentStatus] || row.status}
          </span>
        );
      }
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              {canVerify && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={RotateCcw} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onRestore?.(row.id)}
                  title="Pulihkan Pembayaran" 
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus Permanen"
                />
              )}
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                icon={Eye} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onViewProof(row)}
                title="Lihat Bukti" 
              />
              {row.status === 'pending' && canVerify && (
                <Button 
                  size="sm" 
                  variant="primary" 
                  icon={CheckCircle} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onVerify(row)}
                  title="Verifikasi Pembayaran" 
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus Pembayaran"
                />
              )}
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
