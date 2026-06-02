import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminAuthService } from "@/features/auth/admin";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertCircle, BusFront, Lock, Mail, ShieldCheck } from "lucide-react";
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
        err.response?.data?.message || err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cloud-mist p-6 font-sans">
      
      {/* DESAIGN.md Imagery: abstract, fluid shapes in vibrant accent colors */}
      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-action-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-lavender-glow/10 blur-[150px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-amethyst/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight-indigo shadow-sm">
            <BusFront size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-[38px] font-bold leading-[1.21] tracking-tight text-midnight-indigo">
            Boneh<span className="text-action-blue">Star</span>
          </h1>
          
          {/* DESAIGN.md Informational Badge: Pale Gray background, Glacier Blue text, 50px radius */}
          <div className="mt-4 flex items-center gap-1.5 rounded-full bg-pale-gray px-3 py-1.5 ring-1 ring-platinum-tint/50">
            <ShieldCheck size={14} className="text-glacier-blue" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-glacier-blue">
              Admin Gateway
            </span>
          </div>
        </div>

        {/* DESAIGN.md Floating Content Card: Snow White background, 16px radius, triple-layer shadow */}
        <div 
          className="rounded-[16px] bg-white p-8 sm:p-12"
          style={{ boxShadow: "rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px" }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-bold leading-[1.2] tracking-tight text-midnight-indigo">
              Log In
            </h2>
            <p className="mt-2 text-[16px] font-medium leading-[1.6] text-slate-blue">
              Access your administrative portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="flex items-start gap-3 rounded-[8px] border border-red-100 bg-red-50 p-4 text-[14px] text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="[&_input]:h-12 [&_input]:rounded-[8px] [&_input]:border-platinum-tint [&_input]:bg-white focus-within:[&_input]:border-action-blue focus-within:[&_input]:ring-action-blue/10 [&_label]:text-midnight-indigo [&_label]:text-[14px] [&_label]:font-semibold"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="[&_input]:h-12 [&_input]:rounded-[8px] [&_input]:border-platinum-tint [&_input]:bg-white focus-within:[&_input]:border-action-blue focus-within:[&_input]:ring-action-blue/10 [&_label]:text-midnight-indigo [&_label]:text-[14px] [&_label]:font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 cursor-pointer rounded-[4px] border-platinum-tint text-action-blue focus:ring-action-blue/20 transition-all" 
              />
              <label htmlFor="remember" className="cursor-pointer text-[14px] font-medium text-slate-blue select-none">
                Remember me
              </label>
            </div>

            {/* DESAIGN.md Primary Call-to-Action Button: Action Blue, Snow White text, 8px radius */}
            <Button 
              type="submit" 
              loading={loading} 
              className="mt-2 flex h-12 w-full items-center justify-center rounded-[8px] bg-action-blue px-[16px] py-[6px] text-[16px] font-bold text-white transition-all hover:bg-action-blue/90 active:translate-y-px"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[14px] font-medium text-steel-gray">
            &copy; {new Date().getFullYear()} Boneh Star Team.
          </p>
        </div>
        
      </div>
    </div>
  );
}
