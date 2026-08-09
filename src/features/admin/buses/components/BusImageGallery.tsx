import { useState } from "react";
import { Star, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { busImageService } from "../services/BusImageService";
import type { BusImage } from "@/types/Database";
import { cn } from "@/lib/utils";

interface BusImageGalleryProps {
  busId: string;
  images: BusImage[];
  onRefresh: () => void;
}

export default function BusImageGallery({ busId, images, onRefresh }: BusImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml", "image/webp"];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Format file "${file.name}" tidak didukung. Harap pilih gambar JPG, PNG, WEBP, GIF, atau SVG.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`Ukuran file "${file.name}" melebihi batas maksimal 5MB.`);
        return;
      }
    }

    setUploading(true);
    try {
      await busImageService.upload(busId, files);
      onRefresh();
    } catch (err: any) {
      console.error("Upload failed", err);
      const msg = err.response?.data?.message || err.message || "Gagal mengunggah foto armada.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setProcessingId(id);
    try {
      await busImageService.delete(id);
      onRefresh();
    } catch (err: any) {
      console.error("Delete failed", err);
      setError("Gagal menghapus foto.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setError(null);
    setProcessingId(id);
    try {
      await busImageService.setPrimary(id);
      onRefresh();
    } catch (err: any) {
      console.error("Set primary failed", err);
      setError("Gagal menyetel foto utama.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between border-b border-platinum-tint/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <ImageIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-midnight-indigo tracking-tight">Galeri Armada</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Kelola foto-foto unit bus untuk katalog</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={handleUpload}
            accept="image/*"
            disabled={uploading}
          />
          <Button 
            variant="outline" 
            size="md"
            icon={uploading ? Loader2 : Plus} 
            className="rounded-xl font-medium border-platinum-tint shadow-sm hover:border-action-blue hover:text-action-blue transition-all"
            loading={uploading}
          >
            {uploading ? "Mengunggah..." : "Tambah Foto"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-[32px] border-2 border-dashed border-platinum-tint bg-cloud-mist/30 text-slate-blue/50">
          <ImageIcon size={56} strokeWidth={1.5} className="mb-4 opacity-30" />
          <p className="text-base font-bold text-midnight-indigo/40">Belum ada foto yang diunggah.</p>
          <p className="text-sm font-medium mt-1">Klik tombol di atas untuk memilih file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((image) => (
            <div 
              key={image.id} 
              className={cn(
                "group relative aspect-[4/5] rounded-[24px] overflow-hidden border-2 transition-all duration-500 hover:shadow-card hover:-translate-y-1",
                image.is_primary 
                  ? "border-action-blue ring-8 ring-blue-50/50 shadow-md" 
                  : "border-platinum-tint bg-white hover:border-action-blue/30"
              )}
            >
              <img 
                src={image.url} 
                alt={image.caption || "Bus Image"} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-midnight-indigo/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
                {!image.is_primary && (
                  <button 
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={!!processingId}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-midnight-indigo shadow-lg transition-all hover:bg-action-blue hover:text-white hover:scale-105 active:scale-95"
                    title="Jadikan Foto Utama"
                  >
                    {processingId === image.id ? <Loader2 className="animate-spin" size={20} /> : <Star size={20} strokeWidth={2.5} />}
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(image.id)}
                  disabled={!!processingId}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 hover:scale-105 active:scale-95"
                  title="Hapus Foto"
                >
                  {processingId === image.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} strokeWidth={2.5} />}
                </button>
              </div>

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-action-blue text-white text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 backdrop-blur-md">
                  <Star size={10} className="fill-current" />
                  Utama
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
