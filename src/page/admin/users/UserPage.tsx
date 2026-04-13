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

  // Menggunakan statistik dari backend sesuai rute terbaru
  const stats = [
    { 
      label: "Total Users", 
      value: statistics?.total ?? 0, 
      icon: Users, 
      color: "bg-indigo-600" 
    },
    { 
      label: "Active Accounts", 
      value: statistics?.active ?? 0, 
      icon: UserCheck, 
      color: "bg-emerald-500" 
    },
    { 
      label: "Inactive", 
      value: statistics?.inactive ?? 0, 
      icon: UserMinus, 
      color: "bg-amber-500" 
    },
    { 
      label: "Recycle Bin", 
      value: statistics?.trashed ?? 0, 
      icon: Trash2, 
      color: "bg-rose-500" 
    },
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users Management</h1>
          <p className="text-slate-500 font-medium tracking-wide mt-1">
            Overview and control of all system accounts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading} className="rounded-2xl">
            Refresh
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleCreate} className="rounded-2xl shadow-indigo-200">
            Create User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl shadow-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Statistics</span>
            </div>
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? "..." : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {error ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="bg-rose-50 text-rose-600 p-6 rounded-[2rem] inline-flex flex-col items-center gap-3 border border-rose-100 max-w-md text-left">
              <ShieldAlert size={40} />
              <div className="space-y-1">
                <span className="font-black uppercase text-xs tracking-widest block">Authorization Required</span>
                <p className="text-sm font-bold leading-relaxed">{error}</p>
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
