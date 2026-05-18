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
  Info,
} from "lucide-react";
import "./App.css";
import BusPage from "./page/admin/buses/BusPage";
import Home from "@/page/public/home";
import ContactPage from "@/page/public/contact";
import FleetPage from "@/page/public/fleet";
import CustomerProfilePage from "@/page/customer/profile";
import BookingIndexPage from "@/page/customer/bookings";
import BookingDetailPage from "@/page/customer/bookings/BookingDetailPage";
import HistoryDetailPage from "@/page/customer/bookings/HistoryDetailPage";
import BookingRequestPage from "@/page/customer/bookings/request";
import ReviewIndexPage from "@/page/customer/reviews";
import NotificationIndexPage from "@/page/customer/notifications";
import LoginPage from "@/page/auth/public/Login";
import RegisterPage from "@/page/auth/public/Register";
import ForgotPasswordPage from "@/page/auth/public/ForgotPassword";
import ResetPasswordPage from "@/page/auth/public/ResetPassword";
import { useCustomerAuthStore } from "@/features/auth/public";
import Loader from "@/components/feedback/Loader";
import { useDashboard } from "@/features/admin/dashboard/hooks/useDashboard";
import MonthlyTrendChart from "@/features/admin/dashboard/components/MonthlyTrendChart";

const iconMap: Record<string, any> = {
  CalendarCheck,
  Users,
  Bus,
  TrendingUp,
  Receipt,
  Star,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  CreditCard,
  Info,
};

function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const isCustomerAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useCustomerAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <Loader text="Memuat sesi pelanggan..." />;
  }

  if (!isCustomerAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

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
  loading = false,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: "slate" | "emerald" | "violet" | "amber" | "rose" | "sky";
  href?: string;
  loading?: boolean;
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
      {loading ? (
        <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      )}
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
  icon: any;
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
  const { data, loading, error } = useDashboard();
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Selamat pagi" : now.getHours() < 18 ? "Selamat siang" : "Selamat malam";

  const defaultStats = [
    { label: "Total Pemesanan", icon: CalendarCheck, color: "emerald" as const },
    { label: "Total Pengguna", icon: Users, color: "violet" as const },
    { label: "Bus Aktif", icon: Bus, color: "sky" as const },
    { label: "Pendapatan", icon: TrendingUp, color: "amber" as const },
    { label: "Transaksi", icon: Receipt, color: "slate" as const },
    { label: "Rating Rata-rata", icon: Star, color: "rose" as const },
  ];

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-rose-600">
        <p className="font-bold">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

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
        {loading ? (
          defaultStats.map((s) => (
            <StatCard key={s.label} label={s.label} value="..." sub="memuat..." icon={s.icon} color={s.color} loading />
          ))
        ) : (
          data?.stats.map((s) => (
            <StatCard key={s.label} {...s} icon={iconMap[s.icon] || Star} trend={s.trend as any} />
          ))
        )}
      </div>

      {/* Monthly Chart */}
      <MonthlyTrendChart data={data?.monthly_chart || []} loading={loading} />

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
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-slate-50" />)}
              </div>
            ) : (
              data?.recent_activity.map((act, i) => {
                const Icon = iconMap[act.icon] || Info;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon size={15} className={`mt-0.5 flex-shrink-0 ${act.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{act.text}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{act.time}</p>
                    </div>
                  </div>
                );
              })
            )}
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

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCustomerAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const hasCustomerHydrated = useCustomerAuthStore((state) => state.hasHydrated);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/armada" element={<FleetPage />} />
      <Route
        path="/customer/profile"
        element={
          <CustomerProtectedRoute>
            <CustomerProfilePage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings"
        element={
          <CustomerProtectedRoute>
            <BookingIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings/request"
        element={
          <CustomerProtectedRoute>
            <BookingRequestPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings/:id"
        element={
          <CustomerProtectedRoute>
            <BookingDetailPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/history/:id"
        element={
          <CustomerProtectedRoute>
            <HistoryDetailPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/reviews"
        element={
          <CustomerProtectedRoute>
            <ReviewIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/notifications"
        element={
          <CustomerProtectedRoute>
            <NotificationIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/auth/login"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <LoginPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/register"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <RegisterPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/forgot-password"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/reset-password"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <ResetPasswordPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
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
