import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/Axios";
import { useNotifications, NotificationDrawer } from "@/features/admin/notifications";
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
      `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150
      ${
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }
      ${collapsed ? "justify-center" : ""}`
    }
  >
    <Icon size={16} className="flex-shrink-0" />
    {!collapsed && (
      <span className="font-medium leading-none">{label}</span>
    )}
  </NavLink>
);

const SidebarGroup = ({ label, children, collapsed }: SidebarGroupProps) => (
  <div className="mb-4">
    {!collapsed && (
      <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
    )}
    {collapsed && <div className="mb-2 mx-2.5 h-px bg-slate-100" />}
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

  const sidebarWidth = isCollapsed ? "w-[64px]" : "w-60";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200
          lg:sticky lg:top-0 lg:h-screen ${sidebarWidth}
          ${isMobileOpen ? "translate-x-0 w-60" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header / Logo */}
        <div className={`flex h-14 flex-shrink-0 items-center border-b border-slate-100 ${isCollapsed ? "justify-center px-2.5" : "justify-between px-4"}`}>
          {!isCollapsed ? (
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                <BusFront size={14} />
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Boneh<span className="font-normal text-slate-400">Star</span>
              </span>
            </Link>
          ) : (
            <Link to="/admin/dashboard">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <BusFront size={15} />
              </div>
            </Link>
          )}

          {!isCollapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:flex transition-colors"
            >
              <Menu size={15} />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-50 lg:flex"
            >
              <ChevronRight size={11} />
            </button>
          )}
          <button onClick={() => setMobileOpen(false)} className="flex rounded-md p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X size={15} />
          </button>
        </div>

        {/* ── NAV MENU (SCROLLABLE) ────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4">
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
        <div className={`flex-shrink-0 border-t border-slate-100 p-2.5 ${isCollapsed ? "flex justify-center" : ""}`}>
          {isCollapsed ? (
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
              <LogOut size={15} />
            </button>
          ) : (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-200 text-slate-500">
                  <UserCircle size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-800">{user?.name || "Admin User"}</p>
                  <p className="truncate text-[11px] text-slate-400">{user?.role?.name || "Administrator"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-2.5">
            {isCollapsed && (
              <button onClick={() => setCollapsed(false)} className="hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:flex">
                <Menu size={16} />
              </button>
            )}
            <button className="flex rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-semibold text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="mx-0.5 h-5 w-px bg-slate-200" />

            {/* User badge */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                <UserCircle size={13} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-none text-slate-800">{user?.name || "Admin"}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{user?.role?.name || "Administrator"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  );
}
