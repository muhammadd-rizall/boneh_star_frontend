import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/Axios";
import { useNotifications, NotificationDrawer } from "@/features/admin/notifications";
import ToastContainer from "@/components/feedback/ToastContainer";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  BusFront,
  Bell,
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
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/bookings": "Pemesanan",
  "/admin/quotations": "Penawaran",
  "/admin/transactions": "Transaksi",
  "/admin/payments": "Pembayaran",
  "/admin/payment-methods": "Metode Pembayaran",
  "/admin/reports/bookings": "Laporan Pemesanan",
  "/admin/reports/income": "Laporan Pendapatan",
  "/admin/reports/bus-availability": "Ketersediaan Bus",
  "/admin/reviews": "Ulasan Pelanggan",
  "/admin/buses": "Data Bus",
  "/admin/bus-categories": "Kategori Bus",
  "/admin/bus-facilities": "Fasilitas Bus",
  "/admin/activity-types": "Jenis Aktivitas",
  "/admin/route-types": "Jenis Rute",
  "/admin/galleries": "Galeri Perjalanan",
  "/admin/drivers": "Pengemudi",
  "/admin/users": "Pengguna",
  "/admin/customers": "Pelanggan",
  "/admin/roles": "Hak Akses",
  "/admin/settings": "Pengaturan",
};

const SidebarItem = ({ to, icon: Icon, label, collapsed, onNavigate }: { to: string; icon: React.ElementType; label: string; collapsed: boolean; onNavigate: () => void }) => (
  <NavLink
    to={to}
    title={collapsed ? label : undefined}
    onClick={onNavigate}
    className={({ isActive }) =>
      cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-midnight-indigo to-slate-blue text-white shadow-button font-semibold"
          : "text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo font-medium",
        collapsed ? "justify-center px-0" : "justify-start"
      )
    }
  >
    <Icon size={17} className="shrink-0" strokeWidth={2.2} />
    {!collapsed && <span className="truncate whitespace-nowrap">{label}</span>}
  </NavLink>
);

const SidebarGroup = ({ label, children, collapsed }: { label: string; children: React.ReactNode; collapsed: boolean }) => (
  <div className="mb-6">
    {!collapsed && (
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-steel-gray opacity-80 whitespace-nowrap overflow-hidden">
        {label}
      </p>
    )}
    {collapsed && <div className="mb-3 mx-2 h-px bg-platinum-tint/30" />}
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const SidebarToggleIcon = ({ expanded }: { expanded: boolean }) => (
  <span className="relative block h-4 w-5" aria-hidden="true">
    <span className={cn("absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300", expanded && "top-[7px] rotate-45")} />
    <span className={cn("absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all duration-300", expanded && "scale-x-0 opacity-0")} />
    <span className={cn("absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-all duration-300", expanded && "top-[7px] -rotate-45")} />
  </span>
);

const formatRoleName = (role: string) =>
  role
    .replace(/[_-]+/g, " ")
    .replace(/super\s*admin/gi, "Super Admin")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function DahsbordLayout() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const notificationState = useNotifications();
  const { unreadCount } = notificationState;
  const navigate = useNavigate();
  const location = useLocation();

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

  const collapsed = isCollapsed && !isMobileOpen;
  const sidebarWidth = collapsed ? "w-[76px]" : "w-[256px]";
  const pageTitle = pageTitles[location.pathname] ?? "Panel Administrasi";
  const roleName = formatRoleName(user?.roles?.[0]?.name || "Administrator");
  const initial = user?.name?.charAt(0).toUpperCase() || "A";

  interface MenuItem {
    to: string;
    icon: React.ElementType;
    label: string;
    permission?: string;
  }

  interface MenuGroup {
    label: string;
    items: MenuItem[];
  }

  const menuGroups: MenuGroup[] = [
    {
      label: "Ringkasan",
      items: [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ],
    },
    {
      label: "Operasional",
      items: [
        { to: "/admin/bookings", icon: CalendarCheck, label: "Pemesanan", permission: "bookings.view" },
        { to: "/admin/quotations", icon: FileText, label: "Penawaran", permission: "quotations.view" },
      ],
    },
    {
      label: "Keuangan",
      items: [
        { to: "/admin/transactions", icon: Receipt, label: "Transaksi", permission: "transactions.view" },
        { to: "/admin/payments", icon: CreditCard, label: "Pembayaran", permission: "payments.view" },
        { to: "/admin/payment-methods", icon: Banknote, label: "Metode Bayar", permission: "payment_methods.view" },
      ],
    },
    {
      label: "Laporan",
      items: [
        { to: "/admin/reports/bookings", icon: BarChart3, label: "Laporan Booking", permission: "reports.bookings" },
        { to: "/admin/reports/income", icon: TrendingUp, label: "Pendapatan", permission: "reports.income" },
        { to: "/admin/reports/bus-availability", icon: CalendarRange, label: "Ketersediaan Bus", permission: "buses.view" },
        { to: "/admin/reviews", icon: MessageSquare, label: "Ulasan", permission: "reviews.view" },
      ],
    },
    {
      label: "Armada",
      items: [
        { to: "/admin/buses", icon: Bus, label: "Data Bus", permission: "buses.view" },
        { to: "/admin/bus-categories", icon: Layers, label: "Kategori Bus", permission: "categories.view" },
        { to: "/admin/bus-facilities", icon: Wrench, label: "Fasilitas Bus", permission: "facilities.view" },
        { to: "/admin/activity-types", icon: Tag, label: "Jenis Aktivitas", permission: "activities.view" },
        { to: "/admin/route-types", icon: Map, label: "Jenis Rute", permission: "routes.view" },
        { to: "/admin/galleries", icon: ImageIcon, label: "Galeri Perjalanan", permission: "galleries.view" },
      ],
    },
    {
      label: "Manajemen",
      items: [
        { to: "/admin/drivers", icon: UserCheck, label: "Pengemudi", permission: "drivers.view" },
        { to: "/admin/users", icon: Users, label: "Pengguna", permission: "users.view" },
        { to: "/admin/customers", icon: UserCircle, label: "Pelanggan", permission: "customers.view" },
        { to: "/admin/roles", icon: ShieldCheck, label: "Hak Akses", permission: "roles.view" },
      ],
    },
    {
      label: "Sistem",
      items: [
        { to: "/admin/settings", icon: Settings, label: "Pengaturan", permission: "company_profile.view" },
      ],
    },
  ];

  const filteredMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || hasPermission(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white font-sans text-midnight-indigo">
      <ToastContainer />
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] bg-midnight-indigo/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex flex-col border-r border-platinum-tint/70 bg-white transition-[width,transform] duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarWidth,
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          aria-label={isCollapsed ? "Tampilkan label sidebar" : "Sembunyikan label sidebar"}
          aria-expanded={!isCollapsed}
          onClick={() => setCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-4 z-10 hidden h-10 w-10 items-center justify-center rounded-xl border border-platinum-tint/80 bg-white text-slate-blue shadow-button transition-all duration-300 hover:border-action-blue hover:text-action-blue hover:shadow-card active:scale-90 lg:flex",
            collapsed ? "right-[18px]" : "-right-5"
          )}
        >
          <SidebarToggleIcon expanded={!isCollapsed} />
        </button>

        <div className={cn("flex h-[72px] shrink-0 items-center border-b border-platinum-tint/60", collapsed ? "justify-center px-3" : "justify-between px-5")}>
          <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-midnight-indigo to-slate-blue text-white shadow-button">
              <BusFront size={18} />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-midnight-indigo whitespace-nowrap">
                Boneh<span className="text-action-blue">Star</span>
              </span>
            )}
          </Link>
          {isMobileOpen && (
            <button aria-label="Tutup menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-blue transition-colors hover:bg-cloud-mist hover:text-midnight-indigo lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className={cn("flex-1 overflow-x-hidden overflow-y-auto py-5 text-midnight-indigo", collapsed ? "px-3" : "px-4")}>
          {filteredMenuGroups.map((group) => (
            <SidebarGroup key={group.label} label={group.label} collapsed={collapsed}>
              {group.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </SidebarGroup>
          ))}
        </nav>

        <div className={cn("shrink-0 border-t border-platinum-tint/60", collapsed ? "p-3" : "p-4")}>
          <button title={collapsed ? "Keluar" : undefined} onClick={handleLogout} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-blue transition-all hover:bg-red-50 hover:text-red-600", collapsed ? "justify-center px-0" : "justify-start")}>
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col h-full bg-white overflow-hidden">
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-platinum-tint/70 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button aria-label="Buka menu" onClick={() => setMobileOpen(true)} className="rounded-xl border border-platinum-tint/70 bg-white p-2 text-slate-blue shadow-sm transition-all hover:border-action-blue hover:text-action-blue lg:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden h-7 w-px bg-platinum-tint sm:block" />
            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-steel-gray sm:block">Panel Administrasi</p>
              <h1 className="truncate text-sm font-bold text-midnight-indigo sm:text-base">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button aria-label="Buka notifikasi" onClick={() => setIsNotificationOpen(true)} className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-platinum-tint/70 bg-white text-slate-blue shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-action-blue hover:text-action-blue hover:shadow-button active:translate-y-0 active:scale-95">
              <Bell size={18} className={cn("origin-top transition-transform duration-300 group-hover:rotate-12", unreadCount > 0 && "animate-[admin-bell-ring_2.8s_ease-in-out_infinite]")} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-[admin-notification-pulse_2s_ease-in-out_infinite] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-4 ring-white shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <div className="hidden h-7 w-px bg-platinum-tint sm:block" />
            <div className="group flex items-center gap-2.5 rounded-xl border border-platinum-tint/70 bg-white p-1.5 pr-2.5 shadow-sm transition-all duration-300 hover:border-action-blue/50 hover:shadow-button">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-midnight-indigo text-xs font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105">{initial}</div>
              <div className="hidden max-w-[192px] min-w-0 text-left sm:block">
                <p className="truncate text-xs font-semibold leading-tight text-midnight-indigo" title={user?.name || "Admin"}>{user?.name || "Admin"}</p>
                <p className="mt-0.5 truncate text-[10px] font-medium leading-tight text-slate-blue" title={roleName}>{roleName}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-cloud-mist/50 p-4 sm:p-6 xl:p-8 scrollbar-thin">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} state={notificationState} />
    </div>
  );
}
