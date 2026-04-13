import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "@/page/auth/admin/Login";
import DahsbordLayout from "@/layouts/admin/DahsbordLayout";
import { useAuthStore } from "@/store/useAuthStore";
import UserPage from "@/page/admin/users/UserPage";
import "./App.css";

// Komponen Placeholder untuk halaman Dashboard
const DashboardHome = () => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview Dashboard</h1>
    <p className="text-slate-500 mt-2 font-medium">Selamat datang di panel kendali Boneh Star.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {[
        { label: "Total Users", value: "128", color: "bg-indigo-600" },
        { label: "Active Buses", value: "14", color: "bg-emerald-500" },
        { label: "New Bookings", value: "42", color: "bg-amber-500" },
      ].map((stat, i) => (
        <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl shadow-lg flex items-center justify-center`}>
              <div className="w-5 h-5 bg-white/20 rounded-full"></div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live</span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{stat.label}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  </div>
);

// Halaman Home/Landing sederhana
function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 text-center">
      <div className="max-w-md bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
          <div className="w-10 h-10 border-4 border-white/30 rounded-full"></div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Boneh <span className="text-indigo-600">Star</span></h1>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          The future of transportation management. <br/> Access your dashboard to manage everything.
        </p>
        <a
          href="/admin/login"
          className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 active:scale-95"
        >
          Go to Admin Portal
        </a>
      </div>
    </div>
  );
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/login"
        element={
          isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
        }
      />

      {/* Rute Admin (Protected) */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? <DahsbordLayout /> : <Navigate to="/admin/login" />
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<DashboardHome />} />
        
        {/* Fitur Users */}
        <Route path="users" element={<UserPage />} />
        
        {/* Placeholder untuk menu lainnya */}
        <Route path="roles" element={<div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"><h1 className="text-2xl font-bold">Roles & Permissions</h1><p className="text-slate-500">Halaman manajemen hak akses.</p></div>} />
        <Route path="settings" element={<div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"><h1 className="text-2xl font-bold">System Settings</h1><p className="text-slate-500">Pengaturan sistem utama.</p></div>} />
      </Route>

      {/* Fallback ke Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
