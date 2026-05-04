import React from 'react';
import type { CustomerProfile, UpdateProfileData } from '../types/Profile';
import Button from '@/components/ui/Button';
import FormField from '@/components/form/FormField';
import Textarea from '@/components/ui/Textarea';

interface Props {
  profile: CustomerProfile;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = React.useState<UpdateProfileData>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address || '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nama Lengkap"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <FormField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <FormField
          label="No. Telepon"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Alamat"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
