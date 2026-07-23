import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Info, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2,
  Link as LinkIcon,
  Smartphone,
  Upload,
  Check,
  ExternalLink,
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
    <div className="flex flex-col gap-6 w-full">
      {(error || formError) && (
        <Alert variant="error" title="Perhatian" message={formError || error || ""} />
      )}

      {successMessage && (
        <Alert variant="success" title="Berhasil" message={successMessage} />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola informasi publik dan profil bisnis perusahaan</p>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="rounded-xl font-semibold px-6 h-11 bg-[#006bff] hover:bg-[#005ad4] text-white shadow-sm flex items-center gap-2 shrink-0 self-end sm:self-center"
            loading={isSaving}
            icon={Save}
          >
            Simpan Perubahan
          </Button>
        </div>

        {/* Logo Card */}
        <div className="rounded-[24px] border border-slate-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Logo Perusahaan</h3>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-[32px]">
            <div className="flex flex-col items-center w-[192px] shrink-0 gap-4">
              <div className={cn(
                "h-[192px] w-[192px] shrink-0 flex items-center justify-center rounded-2xl overflow-hidden transition-all bg-white border border-slate-150 relative shadow-sm",
                imagePreview ? "p-3" : "bg-slate-50/50"
              )}>
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Logo Preview" 
                      className="h-full w-full object-contain" 
                    />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setFormData({ ...formData, logo: null, remove_logo: true }); }}
                      className="absolute top-[10px] right-[10px] flex h-[36px] w-[36px] items-center justify-center rounded-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.2)] active:scale-90 z-20"
                      title="Hapus Logo"
                    >
                      <Trash2 size={16} strokeWidth={2.2} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-350">
                    <ImageIcon size={40} strokeWidth={1.5} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-center">Belum Ada Logo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-xl font-bold w-[192px] shrink-0 border-slate-200 hover:border-[#006bff] text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5 h-[40px] text-xs shadow-sm"
                icon={Upload}
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              >
                Ubah Logo
              </Button>
              <span className="text-[10px] text-slate-400 text-center w-[192px] shrink-0 block leading-normal">
                Format PNG, JPG, WEBP. Maksimal 2MB
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4 py-2">
              <h5 className="text-base font-bold text-slate-900">Identitas Visual</h5>
              <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-md">
                Informasi visual perusahaan yang digunakan pada seluruh sistem
              </p>
              
              <ul className="space-y-3 mt-2">
                <li className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-[#006bff] shrink-0" strokeWidth={3} />
                  <span>Ukuran ideal: 800 x 800 px</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-[#006bff] shrink-0" strokeWidth={3} />
                  <span>Format file: PNG, JPG, WEBP</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-[#006bff] shrink-0" strokeWidth={3} />
                  <span>Latar belakang transparan disarankan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Informasi Umum Card */}
        <div className="rounded-[24px] border border-slate-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Informasi Umum</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input 
              label="Nama Perusahaan" 
              value={formData.company_name} 
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} 
              required 
              icon={Building2} 
              placeholder="Nama Perusahaan"
            />
            <Input 
              label="Email Resmi" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              icon={Mail} 
              placeholder="email@company.com"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Input 
              label="Alamat Kantor" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              required 
              icon={MapPin} 
              placeholder="Alamat kantor lengkap"
            />
            <div className="flex flex-col gap-2 w-full text-left">
              <label className="text-[13px] font-semibold text-midnight-indigo ml-0.5 uppercase tracking-wider opacity-90">
                Deskripsi Perusahaan (Opsional)
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-5 text-slate-blue group-focus-within:text-action-blue transition-colors pointer-events-none">
                  <Info size={18} strokeWidth={2} />
                </div>
                <textarea
                  className={cn(
                    "w-full rounded-xl border bg-white py-4 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150 resize-none min-h-[140px] shadow-sm",
                    "placeholder:text-steel-gray placeholder:font-normal pl-11 pr-5 border-platinum-tint focus:border-action-blue focus:ring-4 focus:ring-action-blue/10"
                  )}
                  placeholder="Ceritakan tentang perusahaan Anda..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={500}
                  rows={3}
                />
                <div className="absolute bottom-3 right-4 text-[10px] text-slate-400 font-semibold">
                  {(formData.description || "").length}/500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="rounded-[24px] border border-slate-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Nomor WhatsApp</h3>
            <button 
              type="button" 
              onClick={addArrayItem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#006bff] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Plus size={14} />
              Tambah
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {formData.whatsapp.map((num, index) => (
              <div key={index} className="relative flex items-end group animate-in fade-in duration-200">
                <div className="w-full relative">
                  <Input 
                    label={index === 0 ? "WhatsApp 1" : `WhatsApp ${index + 1} (Opsional)`} 
                    value={num} 
                    onChange={(e) => handleArrayChange(index, e.target.value)} 
                    placeholder="0812..." 
                    icon={Smartphone}
                    className={index > 0 ? "pr-10" : ""}
                  />
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeArrayItem(index)} 
                      className="absolute right-3.5 bottom-3.5 text-slate-400 hover:text-red-500 transition-colors z-20"
                      title="Hapus nomor"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Sosial Card */}
        <div className="rounded-[24px] border border-slate-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Media Sosial</h3>
          
          {/* Toggle buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isSelected = formData.social_media.some(item => item.platform === platform.id);
              const IconComponent = platform.icon;
              
              let brandClass = "";
              if (platform.id === "instagram") brandClass = "instagram-icon";
              else if (platform.id === "facebook") brandClass = "facebook-icon";
              else if (platform.id === "twitter") brandClass = "x-icon";
              else if (platform.id === "youtube") brandClass = "youtube-icon";
              else if (platform.id === "tiktok") brandClass = "tiktok-icon";
              else if (platform.id === "threads") brandClass = "threads-icon";

              return (
                <button 
                  key={platform.id} 
                  type="button" 
                  onClick={() => toggleSocialPlatform(platform.id)} 
                  className={cn(
                    "px-4 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 shadow-sm", 
                    isSelected 
                      ? "bg-white border-slate-200 text-slate-700" 
                      : "bg-white/50 border-slate-200 border-dashed text-slate-400 opacity-60 hover:opacity-100 hover:bg-white hover:border-slate-300"
                  )}
                >
                  <IconComponent 
                    className={cn(
                      "size-4 shrink-0", 
                      brandClass,
                      !isSelected && "grayscale opacity-50"
                    )} 
                  /> 
                  {platform.label}
                </button>
              );
            })}
          </div>

          {/* Social inputs grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {formData.social_media.map((social) => {
              const platform = SOCIAL_PLATFORMS.find(item => item.id === social.platform);
              return (
                <div key={social.platform} className="relative flex items-end group animate-in fade-in duration-200">
                  <div className="w-full relative">
                    <Input 
                      label={`URL ${platform?.label}`} 
                      value={social.url} 
                      onChange={(e) => handleSocialUrlChange(social.platform, e.target.value)} 
                      icon={LinkIcon} 
                      placeholder={`https://${platform?.id === "twitter" ? "x" : platform?.id}.com/...`}
                      className="pr-10"
                    />
                    {social.url && (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3.5 bottom-3.5 text-slate-400 hover:text-[#006bff] transition-colors z-20"
                        title="Buka link"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
