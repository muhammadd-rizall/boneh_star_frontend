import { Button } from "@/components/ui/Button";
import MonthlyTrendChart from "@/features/admin/dashboard/components/MonthlyTrendChart";
import { useDashboard } from "@/features/admin/dashboard/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bus,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Receipt,
  RefreshCw,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
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

const statIconMap: Record<string, React.ElementType> = {
  "Total Pemesanan": CalendarCheck,
  "Total Pengguna": Users,
  "Bus Aktif": Bus,
  "Pendapatan": TrendingUp,
  "Transaksi": Receipt,
  "Rating Rata-rata": Star,
};

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
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: "slate" | "emerald" | "violet" | "amber" | "rose" | "sky";
  href?: string;
  loading?: boolean;
}) {
  const colorMap: Record<string, { icon: string; surface: string }> = {
    slate: {
      icon: "text-midnight-indigo",
      surface: "bg-cloud-mist",
    },
    emerald: {
      icon: "text-emerald-600",
      surface: "bg-emerald-50",
    },
    violet: {
      icon: "text-royal-amethyst",
      surface: "bg-royal-amethyst/10",
    },
    amber: {
      icon: "text-amber-600",
      surface: "bg-sunset-gold/10",
    },
    rose: {
      icon: "text-red-600",
      surface: "bg-red-50",
    },
    sky: {
      icon: "text-skybound-blue",
      surface: "bg-skybound-blue/10",
    },
  };
  const palette = colorMap[color] ?? colorMap.slate;

  const trendColor =
    trend === "up"
      ? "text-emerald-600 bg-emerald-50"
      : trend === "down"
        ? "text-red-600 bg-red-50"
        : "text-slate-blue bg-cloud-mist";

  const content = (
    <div className="group relative h-full min-h-[156px] overflow-hidden rounded-2xl border border-platinum-tint/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-platinum-tint hover:shadow-button sm:p-6">
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 transition-colors duration-200", palette.surface, palette.icon)}>
            <Icon size={22} strokeWidth={2.4} />
          </div>
          {href && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cloud-mist text-slate-blue/45 transition-all group-hover:bg-cloud-mist group-hover:text-action-blue">
              <ArrowUpRight size={16} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-blue/60">{label}</p>
          {loading ? (
            <div className="h-9 w-32 max-w-full animate-pulse rounded-xl bg-cloud-mist" />
          ) : (
            <h3 className="break-words text-[clamp(1.45rem,2vw,1.85rem)] font-bold leading-tight tracking-tight text-midnight-indigo tabular-nums">{value}</h3>
          )}
        </div>

        <div className="mt-4 flex min-h-6 flex-wrap items-center gap-2">
          {trendLabel && (
            <div className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold", trendColor)}>
              {trend === "up" && <ArrowUpRight size={10} />}
              {trend === "down" && <ArrowDownRight size={10} />}
              {trendLabel}
            </div>
          )}
          <span className="text-xs font-medium leading-relaxed text-slate-blue/65">{sub}</span>
        </div>
      </div>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

function QuickAction({
  to,
  icon: Icon,
  label,
  desc,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-platinum-tint bg-white p-5 transition-all duration-300 hover:border-action-blue/30 hover:shadow-card hover:-translate-y-1"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cloud-mist text-action-blue transition-all duration-300 group-hover:bg-action-blue group-hover:text-white group-hover:scale-105 shadow-sm">
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-midnight-indigo tracking-tight">{label}</p>
        <p className="truncate text-xs font-medium text-slate-blue opacity-60 mt-0.5">{desc}</p>
      </div>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cloud-mist text-platinum-tint transition-all group-hover:bg-action-blue/10 group-hover:text-action-blue">
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const user = useAuthStore((state) => state.user);
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
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-600 shadow-sm text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold">Gagal memuat dashboard</h3>
        <p className="text-sm mt-2 opacity-80">{error}</p>
        <Button variant="outline" className="mt-6" icon={RefreshCw} onClick={refetch}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-2xl bg-midnight-indigo px-5 py-6 text-white shadow-card sm:px-7 sm:py-7">
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-action-blue/40 blur-2xl" />
        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-lavender-glow/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
            <span className="flex h-2 w-2 rounded-full bg-action-blue animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
              Ringkasan Operasional
            </span>
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {greeting}, {user?.name || "Admin"}
          </h1>
          <p className="mt-1 text-sm font-medium capitalize text-white/65 sm:text-base">
            {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {loading ? (
          defaultStats.map((s) => (
            <StatCard key={s.label} label={s.label} value="..." sub="memuat..." icon={s.icon} color={s.color} loading />
          ))
        ) : (
          data?.stats.map((s) => (
            <StatCard key={s.label} {...s} icon={(s.icon && iconMap[s.icon]) || statIconMap[s.label] || Star} />
          ))
        )}
      </div>

      <MonthlyTrendChart data={data?.monthly_chart || []} loading={loading} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-2xl border border-platinum-tint bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-midnight-indigo">Aksi Cepat</h2>
              <p className="text-sm font-medium text-slate-blue opacity-70">Navigasi langsung ke modul utama</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-midnight-indigo shadow-sm"><Clock size={20} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction to="/admin/bookings" icon={CalendarCheck} label="Kelola Pemesanan" desc="Konfirmasi & tinjau booking" />
            <QuickAction to="/admin/quotations" icon={Receipt} label="Penawaran Harga" desc="Tinjau permintaan harga" />
            <QuickAction to="/admin/payments" icon={CreditCard} label="Pembayaran" desc="Verifikasi bukti transfer" />
            <QuickAction to="/admin/drivers" icon={UserCheck} label="Daftar Pengemudi" desc="Atur jadwal & data supir" />
            <QuickAction to="/admin/buses" icon={Bus} label="Data Armada" desc="Manajemen unit kendaraan" />
            <QuickAction to="/admin/reports/bookings" icon={TrendingUp} label="Laporan Statistik" desc="Analisis performa bisnis" />
          </div>
        </div>

        <div className="rounded-2xl border border-platinum-tint bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-midnight-indigo">Aktivitas Terbaru</h2>
              <p className="text-sm font-medium text-slate-blue opacity-70">Update sistem real-time</p>
            </div>
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-cloud-mist" />)}
              </div>
            ) : (
              data?.recent_activity.map((act, i) => {
                const Icon = iconMap[act.icon] || Info;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-platinum-tint/10 hover:bg-cloud-mist/30 transition-colors">
                    <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cloud-mist shadow-sm", act.color)}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-midnight-indigo leading-relaxed">{act.text}</p>
                      <p className="mt-1 text-[11px] font-medium text-steel-gray uppercase tracking-widest opacity-60">{act.time}</p>
                    </div>
                  </div>
                );
              })
            )}
            {!loading && data?.recent_activity.length === 0 && (
              <p className="rounded-xl bg-cloud-mist px-4 py-5 text-center text-sm font-medium text-slate-blue">
                Belum ada aktivitas terbaru.
              </p>
            )}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-midnight-indigo p-5 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-action-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-lavender-glow/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Sistem Berjalan Normal</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/70 font-normal">
                Seluruh layanan operasional aktif dan tidak ada gangguan yang terdeteksi.
              </p>
              <div className="mt-6 flex justify-end">
                <div className="h-1 w-20 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-full bg-action-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
