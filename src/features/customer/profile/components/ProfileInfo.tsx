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
    <Card className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="group relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md sm:h-32 sm:w-32">
            {profile.profile_picture ? (
              <img
                src={resolveMediaUrl(profile.profile_picture)}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
          <p className="text-sm font-medium text-slate-500">Pelanggan Setia Boneh Star</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
            <Button onClick={onEdit} size="sm">
              Edit Profil
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-slate-100 pt-8 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</p>
            <p className="text-sm font-semibold text-slate-700">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">No. Telepon</p>
            <p className="text-sm font-semibold text-slate-700">{profile.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alamat</p>
            <p className="text-sm font-semibold text-slate-700">{profile.address || 'Alamat belum diatur'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
