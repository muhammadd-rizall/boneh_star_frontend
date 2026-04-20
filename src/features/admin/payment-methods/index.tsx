import { useState } from "react"
import { usePaymentMethods, useTrashedPaymentMethods } from "./hooks/usePaymentMethods"
import PaymentMethodTable from "./components/PaymentMethodTable"
import PaymentMethodForm from "./components/PaymentMethodForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Plus, Trash2, CreditCard, List, History } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { PaymentMethod } from "./types/PaymentMethod"

export default function PaymentMethodsFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { paymentMethods, statistics, loading, error, refetch, deletePaymentMethod } = usePaymentMethods()
  const { 
    paymentMethods: trashedPaymentMethods, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restorePaymentMethod,
    forceDeletePaymentMethod 
  } = useTrashedPaymentMethods()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [paymentMethodToAction, setPaymentMethodToAction] = useState<PaymentMethod | null>(null)

  const handleCreate = () => {
    setSelectedPaymentMethod(null)
    setIsModalOpen(true)
  }

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (paymentMethod: PaymentMethod) => {
    setPaymentMethodToAction(paymentMethod)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const paymentMethod = trashedPaymentMethods.find(f => f.id === id) || null
    setPaymentMethodToAction(paymentMethod)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (paymentMethod: PaymentMethod) => {
    setPaymentMethodToAction(paymentMethod)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (paymentMethodToAction) {
      try {
        await deletePaymentMethod(paymentMethodToAction.id)
        setIsDeleteConfirmOpen(false)
        setPaymentMethodToAction(null)
        refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (paymentMethodToAction) {
      try {
        await restorePaymentMethod(paymentMethodToAction.id)
        setIsRestoreConfirmOpen(false)
        setPaymentMethodToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (paymentMethodToAction) {
      try {
        await forceDeletePaymentMethod(paymentMethodToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setPaymentMethodToAction(null)
      } catch (err) {
        console.error("Failed to force delete:", err)
      }
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Payment Methods</h1>
          <p className="text-sm text-slate-500 font-medium">Manage bank accounts for customer payments</p>
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
              <span>All Methods</span>
              {statistics && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${
                  activeTab === 'all' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {statistics.total}
                </span>
              )}
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

          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            New Payment Method
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <PaymentMethodTable 
            data={paymentMethods} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ) : (
          <PaymentMethodTable 
            data={trashedPaymentMethods} 
            loading={trashLoading}
            isTrash
            onEdit={() => {}} 
            onDelete={handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPaymentMethod ? "Edit Payment Method" : "Create Payment Method"}
      >
        <PaymentMethodForm
          paymentMethod={selectedPaymentMethod}
          onSuccess={() => {
            setIsModalOpen(false)
            refetch()
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Payment Method?"
        message={`Are you sure you want to delete "${paymentMethodToAction?.bank_name}"? It will be moved to the trash.`}
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Payment Method?"
        message={`Restore "${paymentMethodToAction?.bank_name}" back to the active list?`}
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message={`This action cannot be undone. "${paymentMethodToAction?.bank_name}" will be permanently removed from the database.`}
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
