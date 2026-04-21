import { Routes, Route, Navigate, Link } from "react-router-dom";
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
import DriverPage from "@/page/admin/drivers/DriverPage";
import BookingPage from "@/page/admin/bookings/BookingPage";
import QuotationPage from "@/page/admin/quotations/QuotationPage";
import TransactionPage from "@/page/admin/transactions/TransactionPage";
import PaymentMethodPage from "@/page/admin/payment-methods/PaymentMethodPage";
import PaymentPage from "@/page/admin/payments/PaymentPage";
import ReviewPage from "@/page/admin/reviews/ReviewPage";
import NotificationPage from "@/page/admin/notifications/NotificationPage";
import BookingReportPage from "@/page/admin/reports/BookingReportPage";
import IncomeReportPage from "@/page/admin/reports/IncomeReportPage";
import BusAvailabilityReportPage from "@/page/admin/reports/BusAvailabilityReportPage";
import CompanyProfilePage from "@/page/admin/company-profile/CompanyProfilePage";
import {
  CalendarCheck,
  Users,
  Bus,
  TrendingUp,
  Receipt,
  Star,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  CreditCard,
} from "lucide-react";
import "./App.css";
import BusPage from "./page/admin/buses/BusPage";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendLabel,
  color = "slate",
  href,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: "slate" | "emerald" | "violet" | "amber" | "rose" | "sky";
  href?: string;
}) {
  const colorMap: Record<string, string> = {
    slate:   "bg-slate-100  text-slate-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet:  "bg-violet-50  text-violet-600",
    amber:   "bg-amber-50   text-amber-600",
    rose:    "bg-rose-50    text-rose-600",
    sky:     "bg-sky-50     text-sky-600",
  };
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-400";

  const content = (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        {href && (
          <ArrowUpRight size={15} className="text-slate-300 transition-colors group-hover:text-slate-500" />
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-center gap-1.5">
        {trendLabel && <span className={`text-xs font-medium ${trendColor}`}>{trendLabel}</span>}
        <span className="text-xs text-slate-400">{sub}</span>
      </div>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

// ─── Quick Action ──────────────────────────────────────────────────────────────
function QuickAction({
  to,
  icon: Icon,
  label,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="truncate text-xs text-slate-400">{desc}</p>
      </div>
      <ArrowUpRight size={14} className="ml-auto flex-shrink-0 text-slate-300 transition-colors group-hover:text-slate-600" />
    </Link>
  );
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
const DashboardHome = () => {
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Selamat pagi" : now.getHours() < 18 ? "Selamat siang" : "Selamat malam";

  const stats = [
    {
      label: "Total Pemesanan",
      value: "248",
      sub: "bulan ini",
      trendLabel: "+12%",
      trend: "up" as const,
      icon: CalendarCheck,
      color: "emerald" as const,
      href: "/admin/bookings",
    },
    {
      label: "Total Pengguna",
      value: "1,340",
      sub: "terdaftar",
      trendLabel: "+8 baru",
      trend: "up" as const,
      icon: Users,
      color: "violet" as const,
      href: "/admin/users",
    },
    {
      label: "Bus Aktif",
      value: "34",
      sub: "dari 40 unit",
      icon: Bus,
      color: "sky" as const,
      href: "/admin/buses",
    },
    {
      label: "Pendapatan",
      value: "Rp 84,5jt",
      sub: "bulan ini",
      trendLabel: "+5%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "amber" as const,
      href: "/admin/reports/income",
    },
    {
      label: "Transaksi",
      value: "186",
      sub: "total transaksi",
      icon: Receipt,
      color: "slate" as const,
      href: "/admin/transactions",
    },
    {
      label: "Rating Rata-rata",
      value: "4.7",
      sub: "dari semua ulasan",
      icon: Star,
      color: "rose" as const,
      href: "/admin/reviews",
    },
  ];

  const recentActivity = [
    { icon: CheckCircle2, color: "text-emerald-500", text: "Pemesanan #BK-1024 telah dikonfirmasi", time: "2 menit lalu" },
    { icon: CreditCard, color: "text-sky-500",     text: "Pembayaran Rp 3.200.000 diterima",       time: "15 menit lalu" },
    { icon: AlertCircle, color: "text-amber-500",  text: "Penawaran #QT-089 menunggu persetujuan", time: "1 jam lalu" },
    { icon: UserCheck, color: "text-violet-500",   text: "Pengemudi Ahmad Fauzan ditambahkan",     time: "2 jam lalu" },
    { icon: Star, color: "text-rose-500",          text: "Ulasan baru diterima dari pelanggan",    time: "3 jam lalu" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero / Greeting */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {greeting}, Admin 👋
        </h1>
        <p className="text-sm text-slate-500">Berikut ringkasan operasional Boneh Star hari ini.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Lower Grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Aksi Cepat</h2>
              <p className="text-xs text-slate-400">Navigasi langsung ke halaman utama</p>
            </div>
            <Clock size={15} className="text-slate-300" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <QuickAction to="/admin/bookings" icon={CalendarCheck} label="Kelola Pemesanan" desc="Lihat dan konfirmasi booking" />
            <QuickAction to="/admin/quotations" icon={Receipt} label="Penawaran" desc="Tinjau penawaran terbaru" />
            <QuickAction to="/admin/payments" icon={CreditCard} label="Pembayaran" desc="Verifikasi pembayaran masuk" />
            <QuickAction to="/admin/drivers" icon={UserCheck} label="Pengemudi" desc="Manajemen data pengemudi" />
            <QuickAction to="/admin/buses" icon={Bus} label="Data Bus" desc="Kelola armada kendaraan" />
            <QuickAction to="/admin/reports/bookings" icon={TrendingUp} label="Laporan" desc="Lihat laporan & statistik" />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h2>
              <p className="text-xs text-slate-400">Update sistem real-time</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <act.icon size={15} className={`mt-0.5 flex-shrink-0 ${act.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{act.text}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{act.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Status */}
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-xs font-semibold">Sistem Berjalan Normal</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              Semua layanan aktif. Tidak ada gangguan terdeteksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <Route path="drivers" element={<DriverPage/>}/>
        <Route path="bookings" element={<BookingPage/>}/>
        <Route path="quotations" element={<QuotationPage/>}/>
        <Route path="transactions" element={<TransactionPage/>}/>
        <Route path="payments" element={<PaymentPage/>}/>
        <Route path="payment-methods" element={<PaymentMethodPage/>}/>
        <Route path="reviews" element={<ReviewPage/>}/>
        <Route path="notifications" element={<NotificationPage/>}/>
        <Route path="reports/bookings" element={<BookingReportPage/>}/>
        <Route path="reports/income" element={<IncomeReportPage/>}/>
        <Route path="reports/bus-availability" element={<BusAvailabilityReportPage/>}/>
        <Route path="users" element={<UserPage />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="roles" element={<RolePage />} />
        <Route path="settings" element={<CompanyProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
