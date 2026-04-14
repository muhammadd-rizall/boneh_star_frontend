import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/api/Axios";
import { BusFront, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

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
      const response = await api.post("/admin/auth/login", { email, password });
      
      // Mengantisipasi struktur response Laravel (biasanya { data: { user, token } } atau { user, token })
      const responseData = response.data.data || response.data;
      const { user, token } = responseData;

      if (!token) {
        throw new Error("Token not found in response");
      }
      
      login(user, token);
      
      // Gunakan navigate agar transisi state SPA lebih mulus
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
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 transition-all duration-300">
            <BusFront className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Boneh <span className="text-slate-400">Star</span>
          </h1>
          <p className="mt-1 text-slate-500">Admin Management Portal</p>
        </div>

        <Card className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
            <p className="mt-1 text-sm text-slate-500">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-2">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <a href="#" className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400 transition-all" 
              />
              <label htmlFor="remember" className="cursor-pointer text-sm text-slate-600">
                Remember this device
              </label>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              size="lg"
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Boneh Star Team. <br/>
            <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-slate-300">Secure Admin Access</span>
          </p>
        </div>
      </div>
    </div>
  );
}
