import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "@/page/auth/admin/Login";
import DahsbordLayout from "@/layouts/admin/DahsbordLayout";
import { useAuthStore } from "@/store/useAuthStore";
import UserPage from "@/page/admin/users/UserPage";
import RolePage from "@/page/admin/roles/RolePage";
import CustomerPage from "@/page/admin/customers/CustomerPage";
import BusCategoryPage from "@/page/admin/bus-categories/BusCategoryPage";
import BusFacilityPage from "@/page/admin/bus-facilities/BusFacilityPage";
import ActivityTypePage from "@/page/admin/activity-types/ActivityTypePage";
import RouteTypePage from "@/page/admin/route-types/RouteTypePage";
import "./App.css";
import BusPage from "./page/admin/buses/BusPage";

const DashboardHome = () => (
  <div className="flex flex-col gap-8">
    <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin overview</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Dashboard yang lebih tenang, fokus, dan mudah dipindai.</h1>
        <p className="mt-3 text-base leading-7 text-slate-500">
          Kelola user, role, dan konfigurasi utama dari satu ruang kerja dengan tampilan yang lebih rapi dan minim distraksi.
        </p>
      </div>
    </section>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {[
        { label: "Total Users", value: "128", detail: "Akun terdaftar di sistem" },
        { label: "Active Roles", value: "8", detail: "Role yang sedang digunakan" },
        { label: "Pending Review", value: "12", detail: "Data yang perlu ditinjau" },
      ].map((stat, i) => (
        <div key={i} className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
          </div>
          <p className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">{stat.detail}</p>
        </div>
      ))}
    </div>

    <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Quick management flow</h2>
            <p className="mt-1 text-sm text-slate-500">Prioritas untuk operasional admin hari ini.</p>
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Updated</span>
        </div>
        <div className="mt-6 grid gap-3">
          {[
            "Tinjau akun baru dan pastikan role sudah sesuai.",
            "Periksa role yang punya permission terlalu luas.",
            "Rapikan akun nonaktif agar akses tetap terkendali.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/80 bg-slate-900 p-6 text-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.7)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">System note</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Access control is healthy.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Struktur dashboard sekarang lebih ringan secara visual, sehingga fokus admin langsung ke data inti dan tindakan utama.
        </p>
      </div>
    </section>
  </div>
);

function Home() {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-[36px] border border-slate-200/80 bg-white/90 p-12 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-900">
          <div className="h-10 w-10 rounded-full border-4 border-white/20"></div>
        </div>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900">Boneh <span className="text-slate-400">Star</span></h1>
        <p className="mb-10 leading-relaxed text-slate-500">
          The future of transportation management. <br/> Access your dashboard to manage everything.
        </p>
        <a
          href="/admin/login"
          className="inline-block rounded-full border border-slate-900 bg-slate-900 px-10 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800"
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
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/login"
        element={
          isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated ? <DahsbordLayout /> : <Navigate to="/admin/login" />
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="buses" element={<BusPage/>}/>
        <Route path="bus-categories" element={<BusCategoryPage/>}/>
        <Route path="bus-facilities" element={<BusFacilityPage/>}/>
        <Route path="activity-types" element={<ActivityTypePage/>}/>
        <Route path="route-types" element={<RouteTypePage/>}/>
        <Route path="users" element={<UserPage />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="roles" element={<RolePage />} />
        <Route path="settings" element={<div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.45)]"><h1 className="text-2xl font-semibold text-slate-900">System Settings</h1><p className="mt-2 text-slate-500">Pengaturan sistem utama.</p></div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
