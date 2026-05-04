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
  Link as LinkIcon
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    remove_logo: false,
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
      setFormData({ ...formData, logo: file, remove_logo: false });
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

  const validateForm = () => {
    if (!formData.company_name.trim()) return "Nama perusahaan wajib diisi";
    if (!formData.address.trim()) return "Alamat kantor wajib diisi";
    
    // Validasi email jika diisi
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Format email tidak valid";
    }

    // Validasi Social Media URL
    for (const sm of normalizeSocialMedia(formData.social_media)) {
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
      await updateProfile({
        ...formData,
        social_media: normalizeSocialMedia(formData.social_media),
      });
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
        <Alert variant="error" title="Perhatian" message={formError || error || ""} />
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
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Maksimal ukuran file 2MB.</p>
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
                    setFormData({ ...formData, logo: null, remove_logo: true });
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
            label="Deskripsi Singkat (Opsional)"
            placeholder="Buatkan Deskripsi Singkat..."
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
        
        <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Nomor WhatsApp Aktif</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Tambahkan semua nomor yang dapat dihubungi pelanggan. Nomor bisa dihapus langsung dari daftar.
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-dashed"
              icon={Plus}
              onClick={addArrayItem}
            >
              Tambah Nomor
            </Button>
          </div>

          {formData.whatsapp.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-600">Belum ada nomor komunikasi</p>
              <p className="mt-1 text-xs text-slate-400">
                Klik `Tambah Nomor` jika ingin menambahkan WhatsApp perusahaan.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {formData.whatsapp.map((num, index) => (
                <div
                  key={`ws-${index}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.35)]"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Nomor {index + 1}</p>
                      <p className="text-xs text-slate-400">Format Indonesia tanpa simbol tambahan.</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50"
                      onClick={() => removeArrayItem(index)}
                      icon={Trash2}
                    >
                      Hapus
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      +62
                    </div>
                    <Input
                      className="rounded-2xl pl-12"
                      placeholder="8123456789"
                      value={num}
                      onChange={(e) => handleArrayChange(index, e.target.value)}
                      hint="Contoh: 8123456789"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
        
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-slate-700">Pilih ikon media sosial</p>
            <p className="mt-1 text-xs text-slate-400">
              Setelah ikon dipilih, kolom URL untuk platform tersebut akan muncul di bawah.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isSelected = formData.social_media.some(
                (item) => item.platform === platform.id
              );

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => toggleSocialPlatform(platform.id)}
                  className={`flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border px-4 py-5 text-sm transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isSelected ? "bg-white/10" : "bg-slate-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={platform.icon} className="text-lg" />
                  </span>
                  <span className="font-medium">{platform.label}</span>
                </button>
              );
            })}
          </div>

          {formData.social_media.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-slate-400">
              <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                <Share2 size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Belum ada platform dipilih</p>
              <p className="mt-1 text-xs text-slate-400">
                Klik ikon media sosial di atas untuk menghubungkan akun perusahaan.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {formData.social_media.map((social) => {
                const platform = SOCIAL_PLATFORMS.find((item) => item.id === social.platform);
                if (!platform) return null;

                return (
                  <div
                    key={social.platform}
                    className="rounded-[2rem] border border-slate-100 bg-slate-50/40 p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                          <FontAwesomeIcon icon={platform.icon} className="text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{platform.label}</p>
                          <p className="text-xs text-slate-400">Masukkan URL profil resmi</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50"
                        icon={Trash2}
                        onClick={() => toggleSocialPlatform(social.platform)}
                      >
                        Hapus
                      </Button>
                    </div>
                    <Input
                      label={`URL ${platform.label}`}
                      placeholder="https://..."
                      icon={LinkIcon}
                      value={social.url}
                      onChange={(e) => handleSocialUrlChange(social.platform, e.target.value)}
                      required
                    />
                  </div>
                );
              })}
            </div>
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
