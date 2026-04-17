import { useState, useMemo } from "react"
import { 
  QuotationTable, 
  QuotationForm, 
  useQuotations,
  type Quotation 
} from "@/features/admin/quotations"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import Confirmation from "@/components/feedback/Confirmation"
import { 
  Plus, 
  RefreshCcw, 
  FileText, 
  CheckCircle, 
  ShieldAlert,
  Send,
  AlertCircle
} from "lucide-react"

export default function QuotationPage() {
  const { quotations, statistics, loading, error, deleteQuotation, refetch } = useQuotations()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredQuotations = useMemo(() => {
    return quotations.filter(q => 
      q.booking?.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.booking?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [quotations, searchTerm])

  const handleCreate = () => {
    setSelectedQuotation(null)
    setIsModalOpen(true)
  }

  const handleEdit = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (quotation: Quotation) => {
    setQuotationToDelete(quotation)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!quotationToDelete) return
    setDeleteLoading(true)
    try {
      await deleteQuotation(quotationToDelete.id)
      setIsConfirmOpen(false)
      setQuotationToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { label: "Total Quotations", value: statistics?.total_quotations ?? 0, icon: FileText, note: "All generated offers" },
    { label: "Accepted", value: statistics?.by_status.accepted ?? 0, icon: CheckCircle, note: "Ready for payment" },
    { label: "Pending/Sent", value: (statistics?.by_status.sent ?? 0) + (statistics?.by_status.draft ?? 0), icon: Send, note: "Awaiting response" },
    { label: "Revision/Rejected", value: (statistics?.by_status.revision ?? 0) + (statistics?.by_status.rejected ?? 0), icon: AlertCircle, note: "Need attention" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Quotation Management</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by booking code or customer..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Quotation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <stat.icon size={20} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="min-h-[400px]">
        {error ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-12 text-center shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mx-auto inline-flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-6 text-left text-rose-700">
              <ShieldAlert size={36} />
              <div className="space-y-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Authorization Required</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={refetch}>Try Again</Button>
            </div>
          </div>
        ) : (
          <QuotationTable 
            data={filteredQuotations} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedQuotation ? "Update Quotation" : "Create New Quotation"} size="xl">
        <QuotationForm quotation={selectedQuotation} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this quotation? This action will move it to trash.`}
      />
    </div>
  )
}
