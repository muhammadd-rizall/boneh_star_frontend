import { useState } from "react"
import { usePayments, useTrashedPayments } from "./hooks/usePayments"
import PaymentTable from "./components/PaymentTable"
import PaymentVerifyForm from "./components/PaymentVerifyForm"
import Modal from "@/components/ui/Modal"
import Card from "@/components/ui/Card"
import { List, History, Receipt, DollarSign, Clock, CheckCircle } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { Payment } from "./types/Payment"

export default function PaymentsFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { 
    payments, 
    statistics, 
    loading, 
    error, 
    refetch, 
    deletePayment,
    page,
    setPage,
    meta
  } = usePayments()
  
  const { 
    payments: trashedPayments, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restorePayment,
    forceDeletePayment 
  } = useTrashedPayments()

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [paymentToAction, setPaymentToAction] = useState<Payment | null>(null)

  const handleVerify = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsVerifyModalOpen(true)
  }

  const handleViewProof = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsProofModalOpen(true)
  }

  const handleDeleteClick = (payment: Payment) => {
    setPaymentToAction(payment)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const payment = trashedPayments.find(f => f.id === id) || null
    setPaymentToAction(payment)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (payment: Payment) => {
    setPaymentToAction(payment)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (paymentToAction) {
      try {
        await deletePayment(paymentToAction.id)
        setIsDeleteConfirmOpen(false)
        setPaymentToAction(null)
        refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (paymentToAction) {
      try {
        await restorePayment(paymentToAction.id)
        setIsRestoreConfirmOpen(false)
        setPaymentToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (paymentToAction) {
      try {
        await forceDeletePayment(paymentToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setPaymentToAction(null)
      } catch (err) {
        console.error("Failed to force delete:", err)
      }
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-sm text-slate-500 font-medium">Verify and manage customer payment submissions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'all' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={18} />
                <span>All Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'trash' 
                    ? 'bg-white text-rose-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <History size={18} />
                <span>Trash</span>
              </button>
            </div>
          </div>
        </div>

        {statistics && activeTab === 'all' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Verified</p>
                <p className="text-lg font-bold text-slate-900">
                  Rp {new Intl.NumberFormat('id-ID').format(statistics.cards.total_amount)}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending</p>
                <p className="text-lg font-bold text-slate-900">{statistics.cards.pending_count}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified</p>
                <p className="text-lg font-bold text-slate-900">{statistics.cards.verified_count}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
                <Receipt size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Count</p>
                <p className="text-lg font-bold text-slate-900">{statistics.cards.total_count}</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <>
            <PaymentTable 
              data={payments} 
              loading={loading}
              onVerify={handleVerify}
              onViewProof={handleViewProof}
              onDelete={handleDeleteClick}
            />
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-slate-500">
                  Page {page} of {meta.last_page}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <PaymentTable 
            data={trashedPayments} 
            loading={trashLoading}
            isTrash
            onVerify={() => {}} 
            onViewProof={handleViewProof}
            onDelete={handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </Card>

      {/* Verify Modal */}
      <Modal
        open={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Payment"
      >
        {selectedPayment && (
          <PaymentVerifyForm
            payment={selectedPayment}
            onSuccess={() => {
              setIsVerifyModalOpen(false)
              refetch()
            }}
            onCancel={() => setIsVerifyModalOpen(false)}
          />
        )}
      </Modal>

      {/* Proof Modal */}
      <Modal
        open={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        title="Transfer Proof"
      >
        {selectedPayment && (
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img 
                src={selectedPayment.transfer_proof} 
                alt="Transfer Proof" 
                className="h-auto w-full object-contain"
                style={{ maxHeight: '70vh' }}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setIsProofModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Payment?"
        message="Are you sure you want to delete this payment record? It will be moved to the trash."
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Payment?"
        message="Restore this payment record back to the active list?"
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message="This action cannot be undone. This payment record will be permanently removed from the database."
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
