import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Info, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2,
  Globe,
  Share2,
  Link as LinkIcon,
  AlertCircle
} from "lucide-react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import type { CompanyProfileFormData } from "../types/CompanyProfile";
import Loader from "@/components/feedback/Loader";
import Alert from "@/components/feedback/Alert";
import { resolveMediaUrl } from "../utils/companyProfileUtils";

export default function CompanyProfileForm() {
  const { profile, loading, error, updateProfile, refetch, mapToFormData } = useCompanyProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyProfileFormData>({
    company_name: "",
    address: "",
    whatsapp: [""],
    social_media: [],
    email: "",
    description: "",
    logo: null,
  });

  // Sinkronisasi data dari global store ke local state form
  useEffect(() => {
    if (profile && profile.company_name) {
      setFormData(mapToFormData(profile));
      if (profile.logo) {
        setImagePreview(resolveMediaUrl(profile.logo));
      }
    }
  }, [profile, mapToFormData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (misal maks 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormError("Ukuran logo tidak boleh lebih dari 2MB");
        return;
      }
      
      setFormError(null);
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (
    index: number,
    value: string
  ) => {
    // Validasi hanya angka untuk WhatsApp
    const numericValue = value.replace(/\D/g, "");
    const newArray = [...formData.whatsapp];
    newArray[index] = numericValue;
    setFormData({ ...formData, whatsapp: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, whatsapp: [...formData.whatsapp, ""] });
  };

  const removeArrayItem = (index: number) => {
    if (formData.whatsapp.length > 1) {
      const newArray = formData.whatsapp.filter((_, i) => i !== index);
      setFormData({ ...formData, whatsapp: newArray });
    }
  };

  const handleSocialMediaChange = (index: number, field: "platform" | "url", value: string) => {
    const newSocialMedia = [...formData.social_media];
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
    setFormData({ ...formData, social_media: newSocialMedia });
  };

  const addSocialMediaItem = () => {
    setFormData({
      ...formData,
      social_media: [...formData.social_media, { platform: "", url: "" }],
    });
  };

  const removeSocialMediaItem = (index: number) => {
    const newSocialMedia = formData.social_media.filter((_, i) => i !== index);
    setFormData({ ...formData, social_media: newSocialMedia });
  };

  const validateForm = () => {
    if (!formData.company_name.trim()) return "Nama perusahaan wajib diisi";
    if (!formData.address.trim()) return "Alamat kantor wajib diisi";
    
    // Validasi email jika diisi
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Format email tidak valid";
    }

    // Validasi WhatsApp (minimal 1 nomor valid)
    const validWA = formData.whatsapp.filter(wa => wa.length >= 9);
    if (validWA.length === 0) return "Masukkan setidaknya satu nomor WhatsApp yang valid (min. 9 digit)";

    // Validasi Social Media URL
    for (const sm of formData.social_media) {
      if (sm.platform && !sm.url) return `URL untuk platform ${sm.platform} wajib diisi`;
      if (sm.url && !sm.url.startsWith("http")) return `URL untuk ${sm.platform || "media sosial"} harus diawali dengan http:// atau https://`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(formData);
      setSuccessMessage("Profil perusahaan berhasil diperbarui!");
      await refetch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      console.error("Gagal memperbarui profil", err);
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile?.company_name) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {(error || formError) && (
        <Alert variant="error" title="Perhatian" message={formError || error} icon={AlertCircle} />
      )}

      {successMessage && (
        <Alert variant="success" title="Berhasil" message={successMessage} />
      )}

      {/* Logo Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <ImageIcon size={18} />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Logo Perusahaan</h4>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative group h-36 w-36 flex items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 overflow-hidden transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
            {imagePreview ? (
              <img src={imagePreview} alt="Logo Preview" className="h-full w-full object-contain p-3" />
            ) : (
              <ImageIcon size={40} className="opacity-20" />
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-slate-800">Identitas Visual</h5>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Gunakan gambar PNG atau SVG transparan untuk hasil terbaik di Header. Maksimal ukuran file 2MB.</p>
            <div className="mt-2 flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              >
                Pilih File
              </Button>
              {imagePreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl text-rose-500 border-rose-100 hover:bg-rose-50"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, logo: null });
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Basic Info */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 size={18} />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Informasi Umum</h4>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nama Perusahaan"
            placeholder="Contoh: Boneh Star Transport"
            icon={Building2}
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            required
          />
          <Input
            label="Alamat Email"
            type="email"
            placeholder="Contoh: hello@bonehstar.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Textarea
            label="Alamat Lengkap"
            placeholder="Masukkan alamat kantor pusat..."
            icon={MapPin}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            rows={4}
          />
          <Textarea
            label="Deskripsi Singkat"
            placeholder="Ceritakan sejarah atau visi misi perusahaan..."
            icon={Info}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>
      </section>

      {/* Contact Info */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Globe size={18} />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Saluran Komunikasi</h4>
        </div>
        
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-700">Nomor WhatsApp Aktif</label>
          <div className="grid gap-3">
            {formData.whatsapp.map((num, index) => (
              <div key={`ws-${index}`} className="group flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                    +62
                  </div>
                  <Input
                    className="pl-12"
                    placeholder="8123456789"
                    value={num}
                    onChange={(e) => handleArrayChange(index, e.target.value)}
                  />
                </div>
                {formData.whatsapp.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="aspect-square rounded-2xl p-2 text-rose-500 border-rose-100 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeArrayItem(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1 border-dashed w-fit rounded-xl"
            icon={Plus}
            onClick={addArrayItem}
          >
            Tambah Nomor
          </Button>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Share2 size={18} />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Kehadiran Digital (Sosial Media)</h4>
        </div>
        
        <div className="flex flex-col gap-4">
          {formData.social_media.map((social, index) => (
            <div key={`social-${index}`} className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-slate-50/40 p-6 md:flex-row md:items-end">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nama Platform"
                  placeholder="Contoh: Instagram, Facebook"
                  icon={Share2}
                  value={social.platform}
                  onChange={(e) => handleSocialMediaChange(index, "platform", e.target.value)}
                  required
                />
                <Input
                  label="Tautan (URL)"
                  placeholder="https://..."
                  icon={LinkIcon}
                  value={social.url}
                  onChange={(e) => handleSocialMediaChange(index, "url", e.target.value)}
                  required
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="h-11 w-full md:w-auto p-2 text-rose-500 border-rose-100 hover:bg-rose-50 rounded-2xl"
                onClick={() => removeSocialMediaItem(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}

          {formData.social_media.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
              <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                <Share2 size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Belum ada media sosial</p>
              <p className="text-xs text-slate-400 mt-1">Tambahkan link profil untuk mempermudah pelanggan menemukan Anda</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-6 rounded-xl border-dashed"
                icon={Plus}
                onClick={addSocialMediaItem}
              >
                Hubungkan Sekarang
              </Button>
            </div>
          )}

          {formData.social_media.length > 0 && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-fit border-dashed rounded-xl"
              icon={Plus}
              onClick={addSocialMediaItem}
            >
              Tambah Platform Lain
            </Button>
          )}
        </div>
      </section>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-10">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full md:w-72 h-14 rounded-2xl text-base shadow-xl shadow-indigo-200" 
          loading={isSaving} 
          icon={Save}
        >
          Perbarui Profil Perusahaan
        </Button>
      </div>
    </form>
  );
}
