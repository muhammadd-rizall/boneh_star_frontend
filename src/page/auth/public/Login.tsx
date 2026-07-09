import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, BusFront } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCustomerAuthStore } from "@/features/auth/public";
import { useCompanyProfile } from "@/features/admin/company-profile";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { SocialAuthButtons } from "./components/SocialAuthButtons";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const login = useCustomerAuthStore((state) => state.login);
  const { profile: companyProfile } = useCompanyProfile();

  const logoUrl = companyProfile ? resolveMediaUrl(companyProfile.logo) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate("/customer/bookings");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud-mist px-4 py-8 text-midnight-indigo">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(31,35,70,0.16)] lg:min-h-[640px] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="auth-slide-left relative overflow-hidden bg-action-blue px-8 py-9 text-white sm:px-12 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="relative z-10 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              {logoUrl ? (
                <img
                  key="logo-img"
                  src={logoUrl}
                  alt={companyProfile?.company_name || "Logo"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BusFront key="logo-icon" size={20} />
              )}
            </div>
            <span className="leading-tight">
              <span className="block text-sm font-black">{companyProfile?.company_name || "BonehStar"}</span>
              <span className="block text-xs font-semibold text-white/70">Sewa Bus Online</span>
            </span>
          </Link>

          <div className="relative z-10 mt-10 max-w-sm lg:mt-0">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Kelola perjalanan Anda dalam satu akun.
            </h1>
            <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
              Masuk untuk melihat status booking, riwayat pemesanan, dan penawaran dari tim BonehStar.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex justify-center lg:mt-0">
      
          </div>

          <div className="absolute -right-20 bottom-12 size-52 rounded-full bg-white/10" />
          <div className="absolute left-12 top-36 size-16 rounded-full bg-white/10" />
        </aside>

        <section className="auth-slide-right relative flex items-center justify-center bg-white px-7 py-10 sm:px-12 lg:-ml-8 lg:rounded-l-[38px] lg:px-20">
          <div className="w-full max-w-[460px]">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-midnight-indigo">
                Masuk Akun
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-blue">
                Lanjutkan pemesanan dan pantau kebutuhan perjalanan Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-12 w-full border-0 border-b border-[#e5e6ef] bg-transparent px-0 text-sm font-semibold text-midnight-indigo outline-none transition-colors placeholder:text-[#a7a8b7] focus:border-action-blue focus:ring-0"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-12 w-full border-0 border-b border-[#e5e6ef] bg-transparent px-0 pr-10 text-sm font-semibold text-midnight-indigo outline-none transition-colors placeholder:text-[#a7a8b7] focus:border-action-blue focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#a7a8b7] hover:text-action-blue"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </label>

              <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-blue">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-[#d7d9ed] text-action-blue focus:ring-action-blue/20"
                  />
                  Ingat saya
                </label>
                <Link to="/auth/forgot-password" className="text-action-blue hover:underline">
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="h-12 w-full rounded-full bg-action-blue text-base font-black shadow-none hover:bg-glacier-blue"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-10">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-[#ececf4]" />
                <span className="text-sm font-semibold text-[#a7a8b7]">Or Sign In With</span>
                <span className="h-px flex-1 bg-[#ececf4]" />
              </div>

              <SocialAuthButtons action="Masuk" />
            </div>

            <p className="mt-8 text-center text-xs font-semibold text-[#a7a8b7]">
              Belum punya akun?{" "}
              <Link to="/auth/register" className="font-black text-action-blue hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
