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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="w-full max-w-[440px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <BusFront className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Boneh <span className="text-indigo-600">Star</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Admin Management Portal</p>
        </div>

        <Card className="border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white rounded-3xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
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
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer">
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

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Boneh Star Team. <br/>
            <span className="text-slate-300 text-xs mt-1 block tracking-wider uppercase font-bold">Secure Admin Access</span>
          </p>
        </div>
      </div>
    </div>
  );
}
