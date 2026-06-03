import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { Lock, Save } from 'lucide-react';

interface Props {
  onSubmit: (data: any) => Promise<void>;
}

export default function PasswordChangeForm({ onSubmit }: Props) {
  const [formData, setFormData] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm font-bold text-red-600 animate-in fade-in zoom-in-95 duration-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-sm font-bold text-emerald-600 animate-in fade-in zoom-in-95 duration-300">
          Password berhasil diubah.
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Input
          label="Password Saat Ini"
          type="password"
          icon={Lock}
          value={formData.current_password}
          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
          required
        />
        <Input
          label="Password Baru"
          type="password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
        />
        <Input
          label="Konfirmasi Password Baru"
          type="password"
          icon={Lock}
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          required
          minLength={8}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-platinum-tint/50 mt-4">
        <Button 
          type="submit" 
          variant="primary"
          loading={loading} 
          className="px-8"
          icon={Save}
        >
          Simpan Password
        </Button>
      </div>
    </form>
  );
}
