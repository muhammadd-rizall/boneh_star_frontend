import { useState } from "react"
import { 
  UserTable, 
  UserForm, 
  useUsers,
  type User 
} from "@/features/admin/users"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, Users, UserCheck, UserMinus, Trash2, ShieldAlert } from "lucide-react"

export default function UserPage() {
  const { users, statistics, loading, error, deleteUser, refetch } = useUsers()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setDeleteLoading(true)
    try {
      await deleteUser(userToDelete.id)
      setIsConfirmOpen(false)
      setUserToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { 
      label: "Total Users", 
      value: statistics?.total ?? 0, 
      icon: Users, 
      note: "Seluruh akun terdaftar" 
    },
    { 
      label: "Active Accounts", 
      value: statistics?.active ?? 0, 
      icon: UserCheck, 
      note: "Akun yang masih aktif" 
    },
    { 
      label: "Inactive", 
      value: statistics?.inactive ?? 0, 
      icon: UserMinus, 
      note: "Butuh evaluasi akses" 
    },
    { 
      label: "Recycle Bin", 
      value: statistics?.trashed ?? 0, 
      icon: Trash2, 
      note: "Akun yang dihapus" 
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin users</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Users Management</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Kelola akun administrator, status akses, dan distribusi role dengan tampilan yang lebih ringkas.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create User
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
          <UserTable 
            data={users} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Update User Access" : "Register New Administrator"}
      >
        <UserForm user={selectedUser} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
