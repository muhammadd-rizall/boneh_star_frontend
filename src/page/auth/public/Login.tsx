import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCustomerAuthStore } from "@/features/auth/public";
import { useCompanyProfile } from "@/features/admin/company-profile";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

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
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F4F6] p-4 sm:p-6 md:p-8 overflow-x-hidden select-none">
      
      {/* Centered card container for the split-screen layout */}
      <div className="w-full max-w-[1140px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col lg:flex-row overflow-hidden min-h-[640px] lg:min-h-[700px]">
        
        {/* Left Section: Elegant Branding Panel */}
        <div className="lg:w-1/2 relative bg-gradient-to-tr from-[#E6EEF8] via-[#F3F7FC] to-[#EBF3FC] flex flex-col justify-between p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E5E7EB]">
          
          {/* Ambient light effects for visual interest */}
          <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none z-0" />
          <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-indigo-400/10 blur-[80px] pointer-events-none z-0" />
          
          {/* Dot matrix pattern top-right */}
          <div className="absolute top-12 right-12 opacity-20 pointer-events-none z-0">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
              ))}
            </div>
          </div>

          {/* Top Logo Section */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyProfile?.company_name || "Logo"}
                  className="h-11 w-11 object-contain"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-[#E5E7EB]">
                  {/* Custom Star Logo */}
                  <svg className="h-6 w-6 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="fill-[#0066FF]/10" />
                  </svg>
                </div>
              )}
              <div className="text-left leading-tight">
                <span className="text-lg font-black tracking-tight text-[#0f172a] block">
                  BONEH STAR
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#64748b] block mt-0.5">
                  PARIWISATA
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Content: Large typography */}
          <div className="relative z-10 max-w-md my-auto pt-16 lg:pt-0">
            <h1 className="text-4xl font-extrabold text-[#0f172a] leading-[1.25] tracking-tight">
              Perjalanan <span className="text-[#0066FF]">Nyaman</span>,<br />
              Kenangan Tak Terlupakan.
            </h1>
            
            {/* Divider line under title */}
            <div className="w-12 h-1 bg-[#0066FF] rounded-full mt-5" />

            <p className="text-sm font-semibold text-[#64748b] leading-relaxed mt-6">
              Boneh Star Pariwisata siap menjadi teman perjalanan terbaik Anda untuk setiap momen berharga.
            </p>
          </div>
        </div>

        {/* Right Section: Minimalist Login Form */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white relative z-10">
          
          {/* Card wrapper inside right pane to look exactly like screenshot */}
          <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                Selamat Datang Kembali
              </h2>
              <p className="text-xs text-[#64748b] mt-2 leading-relaxed font-semibold">
                Silakan masuk untuk melanjutkan ke akun Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs font-semibold text-red-650 animate-in shake duration-500">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Lock size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 text-slate-400 hover:text-[#0066FF] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 pt-1">
                <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    className="size-4 rounded-md border-slate-300 text-[#0066FF] focus:ring-[#0066FF]/15 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>
                <Link to="/auth/forgot-password" className="font-bold text-[#0066FF] hover:text-[#0052CC] transition-colors">
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="h-12 w-full rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-500/10 transition-all mt-6 cursor-pointer"
              >
                Masuk
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 py-4 mt-2">
              <span className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">atau masuk dengan</span>
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-12 w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f172a] transition-all cursor-pointer shadow-sm hover:border-slate-300"
            >
              <GoogleIcon className="size-4.5" />
              <span>Masuk dengan Google</span>
            </button>

            {/* Sign up link */}
            <p className="text-center text-xs font-semibold text-slate-500 mt-6">
              Belum punya akun?{" "}
              <Link to="/auth/register" className="font-extrabold text-[#0066FF] hover:text-[#0052CC] transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <p className="mt-8 text-center text-xs font-semibold text-slate-400">
        © {new Date().getFullYear()} Boneh Star Pariwisata. Semua hak dilindungi.
      </p>
    </main>
  );
}
