import { useState, useEffect } from "react"
import {
  QuotationTable,
  QuotationForm,
  useQuotations,
  type Quotation,
} from "@/features/admin/quotations"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import {
  PageHeader, StatCard, StatGrid, PageToolbar, ErrorBanner,
} from "@/components/ui/PageComponents"
import { Plus, RefreshCcw, FileText, CheckCircle2, Send, AlertCircle } from "lucide-react"

export default function QuotationPage() {
  const { quotations, statistics, loading, error, deleteQuotation, refetch } = useQuotations()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { const t = setTimeout(() => refetch(searchTerm), 500); return () => clearTimeout(t) }, [searchTerm, refetch])

  const handleCreate = () => { setSelectedQuotation(null); setIsModalOpen(true) }
  const handleEdit = (q: Quotation) => { setSelectedQuotation(q); setIsModalOpen(true) }
  const handleSuccess = () => { setIsModalOpen(false); refetch(searchTerm) }
  const handleDeleteClick = (q: Quotation) => { setQuotationToDelete(q); setIsConfirmOpen(true) }
  const handleConfirmDelete = async () => {
    if (!quotationToDelete) return; setDeleteLoading(true)
    try { await deleteQuotation(quotationToDelete.id); setIsConfirmOpen(false); setQuotationToDelete(null) }
    finally { setDeleteLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manajemen Penawaran"
        subtitle="Kelola seluruh data penawaran harga kepada pelanggan"
        badge="Penawaran"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm}
            searchPlaceholder="Cari kode booking atau pelanggan..."
            onCreate={handleCreate} createLabel="Buat Penawaran" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={() => refetch(searchTerm)} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={4}>
        <StatCard label="Total Penawaran" value={statistics?.total_quotations ?? 0} icon={FileText} loading={loading} />
        <StatCard label="Diterima" value={statistics?.by_status.accepted ?? 0} icon={CheckCircle2} loading={loading} color="emerald" />
        <StatCard label="Terkirim / Draft" value={(statistics?.by_status.sent ?? 0) + (statistics?.by_status.draft ?? 0)} icon={Send} loading={loading} color="blue" />
        <StatCard label="Revisi / Ditolak" value={(statistics?.by_status.revision ?? 0) + (statistics?.by_status.rejected ?? 0)} icon={AlertCircle} loading={loading} color="rose" />
      </StatGrid>

      {error ? (
        <ErrorBanner error={error} onRetry={() => refetch(searchTerm)} />
      ) : (
        <QuotationTable data={quotations} onDelete={handleDeleteClick} onEdit={handleEdit} loading={loading} />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedQuotation ? "Edit Penawaran" : "Buat Penawaran Baru"} subtitle="Detail penawaran harga sewa bus" size="xl">
        <QuotationForm quotation={selectedQuotation} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} title="Hapus Penawaran?" message="Penawaran ini akan dihapus. Tindakan ini tidak dapat dibatalkan." variant="danger" confirmText="Ya, Hapus" />
    </div>
  )
}
