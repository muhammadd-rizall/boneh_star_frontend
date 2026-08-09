import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";

import { Type, Save, AlignLeft, XCircle, Calendar, ImagePlus, Trash2 } from "lucide-react";
import type { Gallery, GalleryFormData } from "../types/Gallery";
import { galleryService } from "../services/GalleryService";

interface GalleryFormProps {
  gallery?: Gallery | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GalleryForm({ gallery, onSuccess, onCancel }: GalleryFormProps) {
  const isEdit = !!gallery;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<GalleryFormData>({
    title: "",
    description: "",
    date: "",
    is_publish: true,
    images: [],
    deleted_images: [],
  });

  // For displaying existing images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // For displaying preview of newly added images
  const [newImagePreviews, setNewImagePreviews] = useState<{file: File, url: string}[]>([]);

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title,
        description: gallery.description || "",
        date: gallery.date || "",
        is_publish: gallery.is_publish,
        images: [],
        deleted_images: [],
      });
      if (gallery.images) {
        setExistingImages(gallery.images); // these are the raw paths
      }
    }
  }, [gallery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_TOTAL_SIZE = 16 * 1024 * 1024; // 16MB warning
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml", "image/webp"];

    let validationError: string | null = null;
    const validFiles: File[] = [];

    // Calculate current total size of new previews
    let currentTotalSize = newImagePreviews.reduce((acc, curr) => acc + curr.file.size, 0);

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        validationError = `Format file "${file.name}" tidak didukung. Harap pilih gambar dengan format JPG, PNG, WEBP, GIF, atau SVG.`;
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        validationError = `File "${file.name}" melebihi batas ukuran maksimal 5MB. Silakan kompres gambar terlebih dahulu.`;
        break;
      }
      if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
        validationError = `Total ukuran gambar baru melebihi batas upload maksimal 16MB. Harap kurangi jumlah gambar atau kompres ukurannya.`;
        break;
      }
      currentTotalSize += file.size;
      validFiles.push(file);
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (imagePath: string) => {
    setExistingImages(prev => prev.filter(img => img !== imagePath));
    setFormData(prev => ({
      ...prev,
      deleted_images: [...(prev.deleted_images || []), imagePath]
    }));
  };

  const removeNewImage = (index: number) => {
    setNewImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url); // cleanup memory
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Attach new files
      const finalFormData = {
        ...formData,
        images: newImagePreviews.map(p => p.file)
      };

      if (isEdit && gallery) {
        await galleryService.update(gallery.id, finalFormData);
      } else {
        await galleryService.create(finalFormData);
      }
      onSuccess();
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan data.";
      
      // Handle Laravel array validation keys like images.0, images.1, etc.
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        
        if (firstErrorKey.startsWith("images.")) {
          const index = firstErrorKey.split(".")[1];
          errorMessage = `Foto ke-${Number(index) + 1} gagal diunggah. Pastikan format file sesuai (JPG, PNG, WEBP) dan ukurannya tidak melebihi 5MB.`;
        } else if (errors[firstErrorKey] && errors[firstErrorKey][0]) {
          errorMessage = errors[firstErrorKey][0];
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get full URL for existing image
  const getFullImageUrl = (path: string) => {
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '')}/storage/${path}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Input
          label="Judul Acara / Galeri"
          placeholder="Contoh: Study Tour SMAN 1"
          icon={Type}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tanggal Acara"
            type="date"
            icon={Calendar}
            value={formData.date || ""}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          
          <div className="flex flex-col gap-2 justify-center">
            <label className="text-sm font-bold text-slate-700">Tampilkan ke Publik?</label>
            <div className="flex items-center gap-3 mt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.is_publish}
                  onChange={(e) => setFormData({ ...formData, is_publish: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-action-blue/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-action-blue"></div>
              </label>
              <span className="text-sm text-slate-500 font-medium">
                {formData.is_publish ? "Ya, Tampilkan" : "Tidak, Sembunyikan"}
              </span>
            </div>
          </div>
        </div>

        <Textarea
          label="Deskripsi (Opsional)"
          placeholder="Tuliskan cerita singkat tentang perjalanan ini..."
          icon={AlignLeft}
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-slate-700">Foto Galeri</label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Existing Images */}
            {existingImages.map((path) => (
              <div key={path} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                <img src={getFullImageUrl(path)} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    icon={Trash2}
                    onClick={() => removeExistingImage(path)}
                  />
                </div>
              </div>
            ))}
            
            {/* New Image Previews */}
            {newImagePreviews.map((preview, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Baru</div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    icon={Trash2}
                    onClick={() => removeNewImage(idx)}
                  />
                </div>
              </div>
            ))}
            
            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
              <ImagePlus size={24} className="text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-500">Tambah Foto</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
            </label>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Format: JPG, PNG, WEBP. Maks 5MB/foto. Bisa pilih beberapa sekaligus.
          </p>
        </div>
      </div>

      <DialogFooter className="mt-4 border-t border-slate-200 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} className="px-8 font-bold h-14">Batal</Button>
        <Button type="submit" variant="primary" className="sm:flex-1 font-bold rounded-xl h-14 shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Tambah Galeri"}
        </Button>
      </DialogFooter>
    </form>
  );
}
