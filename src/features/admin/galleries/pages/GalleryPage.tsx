import { useState, useEffect } from "react"
import { PageHeader, PageToolbar } from "@/components/ui/PageComponents"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Plus } from "lucide-react"
import type { Gallery } from "../types/Gallery"
import { galleryService } from "../services/GalleryService"
import GalleryTable from "../components/GalleryTable"
import GalleryForm from "../components/GalleryForm"
import { useModulePermission } from "@/hooks/useModulePermission"
import Confirmation from "@/components/feedback/Confirmation"

export default function GalleryPage() {
  const { canDelete, canUpdate } = useModulePermission("galleries")
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null)

  const fetchGalleries = async (searchQuery: string = "") => {
    try {
      setLoading(true)
      const response = await galleryService.getAll({ search: searchQuery })
      setGalleries(response.data)
    } catch (error) {
      console.error("Failed to fetch galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => fetchGalleries(search), 500)
    return () => clearTimeout(t)
  }, [search])

  const handleCreate = () => {
    setSelectedGallery(null)
    setIsFormOpen(true)
  }

  const handleEdit = (gallery: Gallery) => {
    setSelectedGallery(gallery)
    setIsFormOpen(true)
  }

  const handleDelete = (gallery: Gallery) => {
    setGalleryToDelete(gallery)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!galleryToDelete) return
    try {
      await galleryService.delete(galleryToDelete.id)
      setIsDeleteConfirmOpen(false)
      setGalleryToDelete(null)
      fetchGalleries(search)
    } catch (error) {
      console.error("Failed to delete gallery:", error)
    }
  }

  const handleTogglePublish = async (gallery: Gallery) => {
    try {
      await galleryService.update(gallery.id, {
        title: gallery.title,
        description: gallery.description || "",
        date: gallery.date || "",
        is_publish: !gallery.is_publish
      })
      fetchGalleries(search)
    } catch (error) {
      console.error("Failed to toggle publish status:", error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    fetchGalleries(search)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Galeri Perjalanan"
        subtitle="Kelola foto dan dokumentasi perjalanan pelanggan Anda."
        badge="Operasional"
        actions={
          <PageToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Cari galeri..."
            onCreate={handleCreate}
            createLabel="Tambah Galeri"
            createIcon={Plus}
            createPermission="galleries.create"
          />
        }
      />

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <GalleryTable 
          data={galleries} 
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white rounded-2xl">
          <DialogHeader className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {selectedGallery ? "Edit Galeri" : "Tambah Galeri Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <GalleryForm 
              gallery={selectedGallery}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false)
          setGalleryToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Galeri?"
        message={`Galeri "${galleryToDelete?.title}" akan dihapus secara permanen.`}
        variant="danger"
        confirmText="Ya, Hapus"
      />
    </div>
  )
}
