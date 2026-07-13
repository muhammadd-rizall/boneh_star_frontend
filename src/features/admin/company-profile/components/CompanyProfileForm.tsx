import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Info, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2,
  Share2,
  Link as LinkIcon,
  Smartphone,
  Upload,
} from "lucide-react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import type { CompanyProfileFormData } from "../types/CompanyProfile";
import Loader from "@/components/feedback/Loader";
import Alert from "@/components/feedback/Alert";
import {
  normalizeSocialMedia,
  normalizeSocialPlatform,
  resolveMediaUrl,
  SOCIAL_PLATFORMS,
} from "../utils/companyProfileUtils";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function CompanyProfileForm() {
  const { profile, loading, error, updateProfile, refetch, mapToFormData } = useCompanyProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const showSuccess = useToastStore(state => state.showSuccess);

  const [formData, setFormData] = useState<CompanyProfileFormData>({
    company_name: "",
    address: "",
    whatsapp: [""],
    social_media: [],
    email: "",
    description: "",
    logo: null,
    remove_logo: false,
  });

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
      if (file.size > 2 * 1024 * 1024) {
        setFormError("Ukuran logo tidak boleh lebih dari 2MB");
        return;
      }
      setFormError(null);
      setFormData({ ...formData, logo: file, remove_logo: false });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const newArray = [...formData.whatsapp];
    newArray[index] = numericValue;
    setFormData({ ...formData, whatsapp: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, whatsapp: [...formData.whatsapp, ""] });
  };

  const removeArrayItem = (index: number) => {
    const newArray = formData.whatsapp.filter((_, i) => i !== index);
    setFormData({ ...formData, whatsapp: newArray });
  };

  const toggleSocialPlatform = (platform: string) => {
    const normalizedPlatform = normalizeSocialPlatform(platform);
    const normalizedSocialMedia = normalizeSocialMedia(formData.social_media);
    const exists = normalizedSocialMedia.some((item) => item.platform === normalizedPlatform);

    if (exists) {
      setFormData({
        ...formData,
        social_media: normalizedSocialMedia.filter((item) => item.platform !== normalizedPlatform),
      });
      return;
    }

    setFormData({
      ...formData,
      social_media: [...normalizedSocialMedia, { platform: normalizedPlatform, url: "" }],
    });
  };

  const handleSocialUrlChange = (platform: string, value: string) => {
    const normalizedPlatform = normalizeSocialPlatform(platform);
    setFormData({
      ...formData,
      social_media: normalizeSocialMedia(formData.social_media).map((item) =>
        item.platform === normalizedPlatform ? { ...item, url: value } : item
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setFormError(null);

    setIsSaving(true);
    try {
      await updateProfile({
        ...formData,
        social_media: normalizeSocialMedia(formData.social_media),
      });
      setSuccessMessage("Profil perusahaan berhasil diperbarui!");
      showSuccess("Profil perusahaan berhasil diperbarui!");
      await refetch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile?.company_name) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader text="Memuat profil perusahaan..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {(error || formError) && (
        <Alert variant="error" title="Perhatian" message={formError || error || ""} />
      )}

      {successMessage && (
        <Alert variant="success" title="Berhasil" message={successMessage} />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        {/* Logo Section */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
            <h3 className="text-lg font-semibold text-midnight-indigo">Logo Perusahaan</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-12">
            <div className="relative shrink-0">
              <div className={cn(
                "h-80 w-80 flex items-center justify-center rounded-[40px] overflow-hidden transition-all bg-white border-2 shadow-sm",
                imagePreview ? "border-platinum-tint p-2" : "border-dashed border-platinum-tint/60 bg-cloud-mist/30"
              )}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Logo Preview" 
                    className="h-full w-full object-contain transition-transform duration-500 hover:scale-105" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-20 text-midnight-indigo">
                    <ImageIcon size={64} strokeWidth={1} />
                    <p className="text-xs font-black uppercase tracking-widest text-center">Belum Ada<br/>Logo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                />
              </div>
              
              {imagePreview && (
                <div className="absolute -bottom-3 -right-3 flex gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setFormData({ ...formData, logo: null, remove_logo: true }); }}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-red-100 text-red-500 shadow-xl transition-all hover:bg-red-500 hover:text-white active:scale-95"
                    title="Hapus Logo"
                  >
                    <Trash2 size={20} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action-blue text-white shadow-xl transition-all hover:bg-glacier-blue active:scale-95"
                    title="Ganti Logo"
                  >
                    <Upload size={20} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-4 py-4">
              <div className="space-y-1">
                <h5 className="text-xl font-bold text-midnight-indigo tracking-tight">Identitas Visual</h5>
                <p className="text-sm font-medium text-slate-blue opacity-60 leading-relaxed max-w-sm">
                  Gunakan gambar resolusi tinggi dengan latar belakang transparan (PNG) untuk hasil terbaik.
                </p>
              </div>
              <ul className="space-y-2 mt-2">
                <li className="flex items-center gap-2 text-[11px] font-bold text-slate-blue opacity-50 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-action-blue" /> Maksimal Ukuran: 2 MB
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-slate-blue opacity-50 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-action-blue" /> Format File: PNG, JPG, WEBP
                </li>
              </ul>
              {!imagePreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="md" 
                  className="rounded-xl font-bold w-fit mt-3 border-platinum-tint hover:border-action-blue"
                  icon={Upload}
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                >
                  Pilih Logo
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-midnight-indigo border-b border-platinum-tint/50 pb-2">Informasi Umum</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Nama Perusahaan" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required icon={Building2} />
            <Input label="Email Resmi" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} icon={Mail} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Textarea label="Alamat Kantor" placeholder="masukkan alamat kantor" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required icon={MapPin} rows={3} />
            <Textarea label="Deskripsi Perusahaan (opsional)" placeholder="masukkan deskripsi...(opsional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} icon={Info} rows={3} />
          </div>
        </section>

        {/* Contact Info */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-platinum-tint/50 pb-2">
            <h3 className="text-lg font-semibold text-midnight-indigo">Nomor WhatsApp</h3>
            <Button type="button" variant="outline" size="xs" className="rounded-lg font-bold" icon={Plus} onClick={addArrayItem}>Tambah</Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {formData.whatsapp.map((num, index) => (
              <div key={index} className="flex items-end gap-3 group animate-in fade-in duration-200">
                <div className="flex-1">
                  <Input 
                    label={`WhatsApp ${index + 1}`} 
                    value={num} 
                    onChange={(e) => handleArrayChange(index, e.target.value)} 
                    placeholder="0812..." 
                    icon={Smartphone}
                    className="pl-10" 
                  />
                </div>
                <button type="button" onClick={() => removeArrayItem(index)} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-blue opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 border border-platinum-tint/50 mb-0.5"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-midnight-indigo border-b border-platinum-tint/50 pb-2">Media Sosial</h3>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isSelected = formData.social_media.some(item => item.platform === platform.id);
              const IconComponent = platform.icon;
              
              // Only apply fill-current to icons that are monochrome by nature or need clear visibility
              const needsMonochrome = ["facebook", "twitter", "threads"].includes(platform.id);
              
              return (
                <button 
                  key={platform.id} 
                  type="button" 
                  onClick={() => toggleSocialPlatform(platform.id)} 
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2", 
                    isSelected 
                      ? "bg-midnight-indigo border-midnight-indigo text-white shadow-sm" 
                      : "bg-white border-platinum-tint text-slate-blue hover:border-action-blue"
                  )}
                >
                  <IconComponent 
                    className={cn(
                      "size-4 shrink-0", 
                      needsMonochrome && "fill-current [&_path]:fill-current"
                    )} 
                  /> 
                  {platform.label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 mt-2">
            {formData.social_media.map((social) => {
              const platform = SOCIAL_PLATFORMS.find(item => item.id === social.platform);
              return (
                <div key={social.platform} className="flex items-end gap-2 group animate-in fade-in duration-200">
                  <div className="flex-1">
                    <Input label={`URL ${platform?.label}`} value={social.url} onChange={(e) => handleSocialUrlChange(social.platform, e.target.value)} icon={LinkIcon} />
                  </div>
                  <button type="button" onClick={() => toggleSocialPlatform(social.platform)} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-blue hover:bg-red-50 hover:text-red-500 active:scale-90 border border-platinum-tint/50 mb-0.5"><Trash2 size={16} /></button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end mt-4 pt-10 border-t border-platinum-tint/50">
          <Button type="submit" variant="primary" size="lg" className="rounded-xl font-medium px-16 h-14 shadow-button" loading={isSaving} icon={Save}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
