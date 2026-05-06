import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useCustomerAuthStore } from '@/features/auth/public';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const register = useCustomerAuthStore((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      navigate('/customer/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[85vh] items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-black tracking-tighter text-slate-950">
              Buat <span className="text-orange-500">Akun</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Bergabunglah dan mulai rencanakan perjalanan Anda
            </p>
          </div>

          <Card className="p-10 border-none shadow-2xl shadow-slate-200/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-600 border border-rose-100 animate-in shake duration-500">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="John Doe"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                  required
                />

                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-200 text-orange-600 focus:ring-orange-500" required />
                <label className="text-xs font-semibold text-slate-500">
                  Saya setuju dengan <Link to="#" className="text-slate-950 underline">Syarat & Ketentuan</Link>
                </label>
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                size="lg" 
                className="w-full shadow-lg shadow-slate-200" 
                suffix={ArrowRight}
              >
                Daftar Sekarang
              </Button>
            </form>

            <div className="mt-10 border-t border-slate-50 pt-8 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Sudah punya akun?{' '}
                <Link to="/auth/login" className="font-black text-orange-600 hover:text-orange-500 transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
