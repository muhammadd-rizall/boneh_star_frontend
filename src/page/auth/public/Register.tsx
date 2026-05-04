import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useCustomerAuthStore } from '@/features/auth/public';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Section, Container } from '@/components/ui/PageComponents';
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
      <Section className="pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-[400px]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-black text-slate-900">Buat Akun Baru</h1>
              <p className="mt-2 text-slate-500">Bergabunglah dan mulai perjalanan Anda</p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="John Doe"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="anda@email.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Button type="submit" loading={loading} size="lg" className="w-full" icon={ArrowRight}>
                  Daftar
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Sudah punya akun?{' '}
                <Link to="/auth/login" className="font-bold text-orange-600 hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
