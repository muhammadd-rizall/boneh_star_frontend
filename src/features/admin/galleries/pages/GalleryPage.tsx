import { useState, useEffect } from "react"
import { PageHeader, PageToolbar } from "@/components/ui/PageComponents"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Plus } from "lucide-react"
import type { Gallery } from "../types/Gallery"
import { galleryService } from "../services/GalleryService"
import GalleryTable from "../components/GalleryTable"
import GalleryForm from "../components/GalleryForm"

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)

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

  const handleDelete = async (gallery: Gallery) => {
    if (window.confirm(`Are you sure you want to delete "${gallery.title}"? This cannot be undone.`)) {
      try {
        await galleryService.delete(gallery.id)
        fetchGalleries(search)
      } catch (error) {
        console.error("Failed to delete gallery:", error)
      }
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
    </div>
  )
}
