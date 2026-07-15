import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminAuthService } from "@/features/auth/admin";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertCircle, BusFront, Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuthService.login({ email, password });
      
      const responseData = response.data.data || response.data;
      const { user, token } = responseData;

      if (!token) {
        throw new Error("Token not found in response");
      }
      
      login(user, token);
      
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || err.message || "Login gagal. Silakan periksa kembali email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cloud-mist p-6 font-sans">
      
      {/* Background Imagery: abstract, fluid shapes in vibrant accent colors */}
      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-action-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-lavender-glow/10 blur-[150px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-amethyst/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-midnight-indigo to-slate-blue shadow-lg shadow-midnight-indigo/20 ring-4 ring-white">
            <BusFront size={40} className="text-white" strokeWidth={1.25} />
          </div>
          <h1 className="text-[38px] font-bold leading-[1.21] tracking-tight text-midnight-indigo">
            Boneh<span className="text-action-blue">Star</span>
          </h1>
          
          {/* Admin Badge */}
          <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm ring-1 ring-platinum-tint/50">
            <ShieldCheck size={16} className="text-action-blue" strokeWidth={2.5} />
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-midnight-indigo">
              Admin Gateway
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-[24px] border border-white/50 bg-white/80 p-8 shadow-card backdrop-blur-xl sm:p-12"
        >
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-bold leading-[1.2] tracking-tight text-midnight-indigo">
              Selamat Datang
            </h2>
            <p className="mt-2 text-[16px] font-medium leading-[1.6] text-slate-blue">
              Masuk untuk mengakses dashboard admin BonehStar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-[14px] text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Alamat Email"
                type="email"
                placeholder="admin@bonehstar.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-platinum-tint bg-white/50 focus:border-action-blue focus:ring-action-blue/10"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-platinum-tint bg-white/50 focus:border-action-blue focus:ring-action-blue/10"
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4.5 w-4.5 cursor-pointer rounded-md border-platinum-tint text-action-blue focus:ring-action-blue/20 transition-all" 
                />
                <label htmlFor="remember" className="cursor-pointer text-[14px] font-semibold text-slate-blue select-none hover:text-midnight-indigo transition-colors">
                  Tetap masuk
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              size="lg"
              suffix={ArrowRight}
              className="mt-2 w-full rounded-xl bg-action-blue font-bold text-white shadow-lg shadow-action-blue/20 transition-all hover:bg-action-blue/90 hover:shadow-action-blue/30"
            >
              Masuk
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[14px] font-medium text-steel-gray">
            &copy; {new Date().getFullYear()} Boneh Star Team. All rights reserved.
          </p>
        </div>
        
      </div>
    </div>
  );
}
