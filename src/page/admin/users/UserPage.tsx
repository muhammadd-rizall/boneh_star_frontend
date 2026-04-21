import { useState, useEffect } from "react"
import { 
  UserTable, 
  UserForm, 
  useUsers,
  useTrashedUsers,
  type User 
} from "@/features/admin/users"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, Users, UserCheck, UserMinus, Trash2, ShieldAlert, List } from "lucide-react"

export default function UserPage() {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    users, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteUser, 
    refetch: refetchActive 
  } = useUsers()

  const {
    users: trashedUsers,
    loading: trashLoading,
    error: trashError,
    refetch: refetchTrash,
    restoreUser,
    forceDeleteUser
  } = useTrashedUsers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  
  const [userToManage, setUserToManage] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Server-side search with debounce for active view
  useEffect(() => {
    if (view === 'active') {
      const timer = setTimeout(() => {
        refetchActive(searchTerm)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchTerm, view, refetchActive])

  // Refetch trash when entering trash view
  useEffect(() => {
    if (view === 'trash') {
      refetchTrash()
    }
  }, [view, refetchTrash])

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
    if (view === 'active') refetchActive(searchTerm)
    else refetchTrash()
  }

  const handleDeleteClick = (user: User) => {
    setUserToManage(user)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToManage) return
    setActionLoading(true)
    try {
      await deleteUser(userToManage.id)
      setIsDeleteConfirmOpen(false)
      setUserToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreClick = (id: string) => {
    const user = trashedUsers.find(u => u.id === id)
    if (user) {
      setUserToManage(user)
      setIsRestoreConfirmOpen(true)
    }
  }

  const handleConfirmRestore = async () => {
    if (!userToManage) return
    setActionLoading(true)
    try {
      await restoreUser(userToManage.id)
      setIsRestoreConfirmOpen(false)
      setUserToManage(null)
      refetchActive(searchTerm)
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDeleteClick = (user: User) => {
    setUserToManage(user)
    setIsForceDeleteConfirmOpen(true)
  }

  const handleConfirmForceDelete = async () => {
    if (!userToManage) return
    setActionLoading(true)
    try {
      await forceDeleteUser(userToManage.id)
      setIsForceDeleteConfirmOpen(false)
      setUserToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const stats = [
    { label: "Total Users", value: statistics?.total ?? 0, icon: Users, note: "Seluruh akun terdaftar" },
    { label: "Active Accounts", value: statistics?.active ?? 0, icon: UserCheck, note: "Akun yang masih aktif" },
    { label: "Inactive", value: statistics?.inactive ?? 0, icon: UserMinus, note: "Butuh evaluasi akses" },
    { label: "Recycle Bin", value: statistics?.trashed ?? 0, icon: Trash2, note: "Akun yang dihapus" },
  ]

  const loading = view === 'active' ? activeLoading : trashLoading
  const error = view === 'active' ? activeError : trashError
  const displayData = view === 'active' 
    ? users 
    : trashedUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin users</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Users Management</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by name or email..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={view === 'active' ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 border-b border-slate-100 pb-6">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <stat.icon size={20} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 truncate">
                {activeLoading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
          <button
            onClick={() => setView('active')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={14} />
            Active Users
          </button>
          <button
            onClick={() => setView('trash')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'trash' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Trash2 size={14} />
            Recycle Bin
          </button>
        </div>
      </section>

      <div className="min-h-[400px]">
        {error ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-12 text-center shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mx-auto inline-flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-6 text-left text-rose-700">
              <ShieldAlert size={36} />
              <div className="space-y-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Error Occurred</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={view === 'active' ? () => refetchActive(searchTerm) : refetchTrash}>Try Again</Button>
            </div>
          </div>
        ) : (
          <UserTable 
            data={displayData} 
            onDelete={view === 'active' ? handleDeleteClick : handleForceDeleteClick} 
            onEdit={handleEdit}
            onRestore={handleRestoreClick}
            loading={loading} 
            isTrash={view === 'trash'}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedUser ? "Update User Access" : "Register New Administrator"}>
        <UserForm user={selectedUser} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Move to Trash"
        message={`Are you sure you want to move user "${userToManage?.name}" to recycle bin?`}
      />

      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleConfirmRestore}
        loading={actionLoading}
        title="Restore User"
        message={`Are you sure you want to restore user "${userToManage?.name}"?`}
      />

      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={handleConfirmForceDelete}
        loading={actionLoading}
        variant="danger"
        title="Permanently Delete"
        message={`WARNING: Are you sure you want to permanently delete user "${userToManage?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
