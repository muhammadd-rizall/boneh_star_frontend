import React from 'react';
import type { CustomerProfile, UpdateProfileData } from '../types/Profile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

interface Props {
  profile: CustomerProfile;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
}

export default function ProfileEditForm({ profile, onSubmit }: Props) {
  const [formData, setFormData] = React.useState<UpdateProfileData>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address || '',
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-sm font-bold text-emerald-600 animate-in fade-in zoom-in-95 duration-300">
          Profil berhasil diperbarui.
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Nama Lengkap"
          icon={User}
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="No. Telepon"
          icon={Phone}
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Alamat Lengkap"
            icon={MapPin}
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Masukkan alamat lengkap Anda..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-platinum-tint/50 mt-4">
        <Button 
          type="submit" 
          variant="primary"
          loading={loading} 
          className="px-8"
          icon={Save}
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
