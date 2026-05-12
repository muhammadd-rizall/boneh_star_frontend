import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useCustomerAuthStore } from '@/features/auth/public';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const login = useCustomerAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/customer/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah.');
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
              Masuk <span className="text-orange-500">Akun</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Selamat datang kembali di Boneh Star Charter
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
                  label="Alamat Email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <Link to="#" className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">
                  Lupa Password?
                </Link>
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                size="lg" 
                className="w-full shadow-lg shadow-slate-200" 
                suffix={ArrowRight}
              >
                Masuk Sekarang
              </Button>
            </form>

            <div className="mt-10 border-t border-slate-50 pt-8 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Belum punya akun?{' '}
                <Link to="/auth/register" className="font-black text-orange-600 hover:text-orange-500 transition-colors">
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
