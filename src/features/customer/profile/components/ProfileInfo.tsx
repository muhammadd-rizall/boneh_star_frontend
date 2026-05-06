import React from 'react';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import type { CustomerProfile } from '../types/Profile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';

interface Props {
  profile: CustomerProfile;
  onEdit: () => void;
  onUpload: (file: File) => void;
}

export default function ProfileInfo({ profile, onEdit, onUpload }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card className="flex flex-col gap-10 border-none shadow-xl shadow-slate-100/50">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="group relative">
          <div className="h-28 w-28 overflow-hidden rounded-[2.5rem] border-4 border-white bg-slate-100 shadow-xl shadow-slate-200/50 sm:h-36 sm:w-36 transition-transform group-hover:scale-[1.02] duration-300">
            {profile.profile_picture ? (
              <img
                src={resolveMediaUrl(profile.profile_picture)}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <User size={48} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-90"
          >
            <Camera size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <h2 className="text-3xl font-black tracking-tighter text-slate-950">{profile.name}</h2>
          <p className="text-sm font-semibold text-slate-400">Customer @ Boneh Star</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
            <Button onClick={onEdit} size="sm" variant="outline" className="rounded-xl border-slate-100">
              Edit Profil
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 border-t border-slate-50 pt-10 sm:grid-cols-2">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Mail size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
            <p className="text-sm font-bold text-slate-700">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Phone size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Telepon</p>
            <p className="text-sm font-bold text-slate-700">{profile.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <MapPin size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Alamat Lengkap</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{profile.address || 'Alamat belum diatur'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
