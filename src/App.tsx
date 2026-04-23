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
} from "lucide-react";
import "./App.css";
import BusPage from "./page/admin/buses/BusPage";
import PublicLayout from "./layouts/public/PublicLayout";

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
    <PublicLayout>
      <section className="app-shell relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Public Transport Booking Platform
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Perjalanan rombongan lebih rapi, cepat, dan siap berangkat.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Boneh Star membantu pengelolaan pemesanan bus pariwisata dan kendaraan operasional dengan alur yang jelas, respons cepat, dan monitoring yang lebih profesional.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                Konsultasi Pemesanan
              </a>
              <a
                href="/admin/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Masuk Admin
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { value: "24/7", label: "Respon operasional" },
                { value: "120+", label: "Trip tertangani" },
                { value: "98%", label: "Ketepatan konfirmasi" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-8 top-8 h-32 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-32 w-32 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="relative w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_32px_90px_-42px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[28px] bg-slate-950 p-6 text-white">
                  <p className="text-sm font-medium text-slate-300">Status Armada</p>
                  <p className="mt-4 text-4xl font-semibold tracking-tight">34</p>
                  <p className="mt-2 text-sm text-slate-400">Unit aktif siap operasional minggu ini</p>
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Availability</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[78%] rounded-full bg-cyan-300" />
                    </div>
                    <p className="mt-3 text-sm text-slate-300">78% armada tersedia</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pemesanan</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">248</p>
                    <p className="mt-2 text-sm text-slate-500">Permintaan perjalanan diproses bulan ini</p>
                  </div>
                  <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Service Flow</p>
                    <ul className="mt-4 space-y-3 text-sm text-emerald-900">
                      <li>Penawaran cepat untuk rombongan dan instansi</li>
                      <li>Konfirmasi armada serta jadwal keberangkatan</li>
                      <li>Monitoring operasional dari admin dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Layanan</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Dirancang untuk kebutuhan perjalanan yang butuh koordinasi rapi.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Wisata & Study Tour",
              desc: "Pengelolaan keberangkatan rombongan sekolah, kampus, dan komunitas dengan alur booking yang jelas.",
            },
            {
              title: "Kebutuhan Perusahaan",
              desc: "Dukungan transportasi untuk event kantor, kunjungan kerja, dan mobilisasi tim operasional.",
            },
            {
              title: "Charter Armada",
              desc: "Pemesanan bus dan kendaraan dengan fleksibilitas rute, jadwal, dan kapasitas armada.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.4)]"
            >
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] bg-slate-950 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Keunggulan</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Tampilan public yang tegas, admin yang tetap fokus ke operasional.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Halaman depan berfungsi sebagai pintu masuk brand dan informasi, sementara dashboard admin tetap dipisahkan agar alur kerja internal tidak terganggu.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              "Header sticky untuk akses cepat ke section utama dan portal admin.",
              "Footer informatif dengan identitas brand, kontak, dan quick links.",
              "Komposisi visual ringan dengan kartu, gradient, dan spacing yang lebih rapi.",
              "Struktur siap dikembangkan jika nanti ditambah halaman layanan atau profil perusahaan.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[30px] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.35)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
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
