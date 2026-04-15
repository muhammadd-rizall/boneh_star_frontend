import { useState } from "react";
import { Star, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { busImageService } from "../services/BusImageService";
import type { BusImage } from "@/types/Database";

interface BusImageGalleryProps {
  busId: string;
  images: BusImage[];
  onRefresh: () => void;
}

export default function BusImageGallery({ busId, images, onRefresh }: BusImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      await busImageService.upload(busId, files);
      onRefresh();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    setProcessingId(id);
    try {
      await busImageService.delete(id);
      onRefresh();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setProcessingId(id);
    try {
      await busImageService.setPrimary(id);
      onRefresh();
    } catch (error) {
      console.error("Set primary failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Bus Gallery</h3>
        <div className="relative">
          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            accept="image/*"
            disabled={uploading}
          />
          <Button 
            variant="outline" 
            icon={uploading ? Loader2 : Plus} 
            loading={uploading}
          >
            {uploading ? "Uploading..." : "Add Images"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <ImageIcon size={48} strokeWidth={1.5} />
          <p className="mt-2 text-sm font-medium">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                image.is_primary ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img 
                src={image.url} 
                alt={image.caption || "Bus Image"} 
                className="h-full w-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.is_primary && (
                  <Button 
                    size="sm" 
                    variant="primary" 
                    icon={Star} 
                    className="h-9 w-9 rounded-full p-0"
                    onClick={() => handleSetPrimary(image.id)}
                    loading={processingId === image.id}
                    title="Set as Primary"
                  />
                )}
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0"
                  onClick={() => handleDelete(image.id)}
                  loading={processingId === image.id}
                  title="Delete Image"
                />
              </div>

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
