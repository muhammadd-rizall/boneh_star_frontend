import React from 'react';
import { Mail, Phone, MapPin, Camera, Shield, CheckCircle, Upload } from 'lucide-react';
import type { CustomerProfile } from '../types/Profile';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';

interface Props {
  profile: CustomerProfile;
  onUpload: (file: File) => void;
}

export default function ProfileInfo({ profile, onUpload }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const infoItems = [
    { icon: Mail, label: 'Email', value: profile.email, verified: true },
    { icon: Phone, label: 'Nomor Telepon', value: profile.phone || '—' },
    { icon: MapPin, label: 'Alamat', value: profile.address || '—', wide: true },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Kotak Foto Profil ── */}
      <div className="rounded-2xl bg-white border border-platinum-tint/80 shadow-[0_2px_12px_-4px_rgba(11,53,88,0.08)] overflow-hidden">
        <div className="h-20 bg-action-blue relative flex items-center px-6 gap-3">
          <Shield size={14} className="text-white/70" />
          <p className="text-xs font-black uppercase tracking-widest text-white">Foto Profil</p>
          <div className="absolute top-0 right-0 w-32 h-full opacity-10"
            style={{ background: 'radial-gradient(circle at right, white, transparent)' }}
          />
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-pale-gray bg-pale-gray shadow-lg">
              {profile.profile_picture ? (
                <img
                  src={resolveMediaUrl(profile.profile_picture)}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-action-blue">
                  <span className="text-4xl font-black text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Badge nama */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-white border border-platinum-tint shadow text-[10px] font-bold text-midnight-indigo">
              {profile.name.split(' ')[0]}
            </div>
          </div>

          {/* Area upload */}
          <div className="flex-1 w-full">
            <p className="text-sm font-bold text-midnight-indigo mb-1">{profile.name}</p>
            <p className="text-xs text-slate-blue mb-4">
              Format yang didukung: JPG, PNG, WEBP · Ukuran maks. 2 MB
            </p>

            {/* Kotak drop area */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-platinum-tint bg-cloud-mist hover:border-action-blue hover:bg-action-blue/5 transition-all duration-200 cursor-pointer py-5 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-platinum-tint shadow-sm group-hover:bg-action-blue group-hover:border-action-blue transition-colors duration-200">
                <Upload size={18} className="text-steel-gray group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-midnight-indigo group-hover:text-action-blue transition-colors">
                  Klik untuk unggah foto
                </p>
                <p className="text-xs text-steel-gray mt-0.5">atau seret & lepas file di sini</p>
              </div>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* ── Kotak Informasi Akun ── */}
      <div className="rounded-2xl bg-white border border-platinum-tint/80 shadow-[0_2px_12px_-4px_rgba(11,53,88,0.08)] overflow-hidden">
        <div className="px-6 py-4 border-b border-pale-gray">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-steel-gray">
            Informasi Akun
          </p>
        </div>

        <div className="px-6 divide-y divide-pale-gray">
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-start gap-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-platinum-tint bg-cloud-mist">
                <item.icon size={15} className="text-slate-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-steel-gray mb-1">
                  {item.label}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-midnight-indigo break-all">
                    {item.value}
                  </p>
                  {item.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle size={10} />
                      Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
