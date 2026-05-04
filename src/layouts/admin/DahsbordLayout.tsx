import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/Axios";
import { useNotifications } from "@/features/admin/notifications/hooks/useNotifications";
import NotificationDrawer from "@/features/admin/notifications/components/NotificationDrawer";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  BusFront,
  Bell,
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Bus,
  Tag,
  Map,
  UserCheck,
  FileText,
  CreditCard,
  Receipt,
  MessageSquare,
  BarChart3,
  Layers,
  Wrench,
  CalendarCheck,
  Banknote,
  TrendingUp,
  CalendarRange,
  X,
  Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarItemProps {
  to: string;
  icon: React.ComponentType<{ size?: any; className?: string }>;
  label: string;
  collapsed?: boolean;
}

interface SidebarGroupProps {
  label: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SidebarItem = ({ to, icon: Icon, label, collapsed }: SidebarItemProps) => (
  <NavLink
    to={to}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
      ${
        isActive
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }
      ${collapsed ? "justify-center" : ""}`
    }
  >
    <Icon size={18} className="flex-shrink-0" />
    {!collapsed && (
      <>
        <span className="font-medium leading-none">{label}</span>
        <ChevronRight
          size={13}
          className="ml-auto opacity-0 transition-opacity group-hover:opacity-50"
        />
      </>
    )}
  </NavLink>
);

const SidebarGroup = ({ label, children, collapsed }: SidebarGroupProps) => (
  <div className="mb-2">
    {!collapsed && (
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    )}
    {collapsed && <div className="mb-2 mx-3 h-px bg-slate-100" />}
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
);

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function DahsbordLayout() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/admin/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/admin/login");
    }
  };

  const sidebarWidth = isCollapsed ? "w-[76px]" : "w-64";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300
          lg:sticky lg:top-0 lg:h-screen ${sidebarWidth}
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header / Logo (Fixed) */}
        <div className={`flex h-16 flex-shrink-0 items-center border-b border-slate-100 ${isCollapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          {!isCollapsed ? (
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <BusFront size={16} />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Boneh<span className="font-normal text-slate-400"> Star</span>
              </span>
            </Link>
          ) : (
            <Link to="/admin/dashboard">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <BusFront size={17} />
              </div>
            </Link>
          )}

          {!isCollapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:flex"
            >
              <Menu size={16} />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-50 lg:flex"
            >
              <ChevronRight size={12} />
            </button>
          )}
          <button onClick={() => setMobileOpen(false)} className="flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* ── AREA MENU (SCROLLABLE) ────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <SidebarGroup label="Overview" collapsed={isCollapsed}>
            <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Operasional" collapsed={isCollapsed}>
            <SidebarItem to="/admin/bookings" icon={CalendarCheck} label="Pemesanan" collapsed={isCollapsed} />
            <SidebarItem to="/admin/quotations" icon={FileText} label="Penawaran" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Keuangan" collapsed={isCollapsed}>
            <SidebarItem to="/admin/transactions" icon={Receipt} label="Transaksi" collapsed={isCollapsed} />
            <SidebarItem to="/admin/payments" icon={CreditCard} label="Pembayaran" collapsed={isCollapsed} />
            <SidebarItem to="/admin/payment-methods" icon={Banknote} label="Metode Bayar" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Laporan" collapsed={isCollapsed}>
            <SidebarItem to="/admin/reports/bookings" icon={BarChart3} label="Laporan Booking" collapsed={isCollapsed} />
            <SidebarItem to="/admin/reports/income" icon={TrendingUp} label="Laporan Pendapatan" collapsed={isCollapsed} />
            <SidebarItem to="/admin/reports/bus-availability" icon={CalendarRange} label="Ketersediaan Bus" collapsed={isCollapsed} />
            <SidebarItem to="/admin/reviews" icon={MessageSquare} label="Ulasan" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Armada" collapsed={isCollapsed}>
            <SidebarItem to="/admin/buses" icon={Bus} label="Data Bus" collapsed={isCollapsed} />
            <SidebarItem to="/admin/bus-categories" icon={Layers} label="Kategori Bus" collapsed={isCollapsed} />
            <SidebarItem to="/admin/bus-facilities" icon={Wrench} label="Fasilitas Bus" collapsed={isCollapsed} />
            <SidebarItem to="/admin/activity-types" icon={Tag} label="Jenis Aktivitas" collapsed={isCollapsed} />
            <SidebarItem to="/admin/route-types" icon={Map} label="Jenis Rute" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Manajemen" collapsed={isCollapsed}>
            <SidebarItem to="/admin/drivers" icon={UserCheck} label="Pengemudi" collapsed={isCollapsed} />
            <SidebarItem to="/admin/users" icon={Users} label="Pengguna" collapsed={isCollapsed} />
            <SidebarItem to="/admin/customers" icon={UserCircle} label="Pelanggan" collapsed={isCollapsed} />
            <SidebarItem to="/admin/roles" icon={ShieldCheck} label="Hak Akses" collapsed={isCollapsed} />
          </SidebarGroup>

          <SidebarGroup label="Sistem" collapsed={isCollapsed}>
            <SidebarItem to="/admin/settings" icon={Building2} label="Profil Perusahaan" collapsed={isCollapsed} />
          </SidebarGroup>
        </nav>

        {/* User Profile (Fixed at bottom) */}
        <div className={`flex-shrink-0 border-t border-slate-100 p-3 ${isCollapsed ? "flex justify-center" : ""}`}>
          {isCollapsed ? (
            <button onClick={handleLogout} title="Logout" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
              <LogOut size={16} />
            </button>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600"><UserCircle size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{user?.name || "Admin User"}</p>
                  <p className="truncate text-[11px] text-slate-400">{user?.role?.name || "Administrator"}</p>
                </div>
                <button onClick={handleLogout} title="Logout" className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            {isCollapsed && (
              <button onClick={() => setCollapsed(false)} className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:flex"><Menu size={18} /></button>
            )}
            <button className="flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsNotificationOpen(true)} className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700">
              <Bell size={16} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            <div className="mx-1 h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500"><UserCircle size={15} /></div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none text-slate-800">{user?.name || "Admin"}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{user?.role?.name || "Administrator"}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><div className="mx-auto max-w-7xl"><Outlet /></div></main>
      </div>
      <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  );
}
