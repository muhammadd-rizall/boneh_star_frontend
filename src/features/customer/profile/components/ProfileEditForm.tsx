import React from 'react';
import type { CustomerProfile, UpdateProfileData } from '../types/Profile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { DialogFooter } from "@/components/ui/Dialog";
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
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

      <DialogFooter>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel} 
          className="px-10 font-bold"
          disabled={loading}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          loading={loading} 
          className="flex-1"
          icon={Save}
        >
          Simpan Perubahan
        </Button>
      </DialogFooter>
    </form>
  );
}
