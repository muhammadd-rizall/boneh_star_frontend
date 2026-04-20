import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/Axios";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  BusFront, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Bus,
  Shield,
  Tag,
  Map,
  Contact,
  FileText,
  Banknote,
  Receipt,
  MessageSquare
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
}

const SidebarItem = ({ to, icon: Icon, label }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200
      ${isActive 
        ? "bg-slate-900 text-white shadow-[0_16px_28px_-20px_rgba(15,23,42,0.9)]" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}
    `}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className="font-medium">{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
  </NavLink>
);

export default function DahsbordLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Panggil API Logout backend sesuai rute admin.auth.logout
      await api.post("/admin/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Tetap hapus state lokal dan arahkan ke login walaupun API gagal
      logout();
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/bookings", icon: FileText, label: "Bookings" },
    { to: "/admin/quotations", icon: Banknote, label: "Quotations" },
    { to: "/admin/transactions", icon: Receipt, label: "Transactions" },
    { to: "/admin/payments", icon: Banknote, label: "Payments" },
    { to: "/admin/payment-methods", icon: Banknote, label: "Payment Methods" },
    { to: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
    { to: "/admin/buses", icon: Bus, label: "Bus" },
    { to: "/admin/bus-categories", icon: LayoutDashboard, label: "Bus Categories" },
    { to: "/admin/bus-facilities", icon: Shield, label: "Bus Facilities" },
    { to: "/admin/activity-types", icon: Tag, label: "Activity Types" },
    { to: "/admin/route-types", icon: Map, label: "Route Types" },
    { to: "/admin/drivers", icon: Contact, label: "Drivers Management" },
    { to: "/admin/users", icon: Users, label: "User Management" },
    { to: "/admin/customers", icon: UserCircle, label: "Customer Management" },
    { to: "/admin/roles", icon: ShieldCheck, label: "Roles & Permissions" },
    { to: "/admin/settings", icon: Settings, label: "System Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-transparent">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/70 bg-white/92 transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-full flex-col p-6">
          <Link to="/admin/dashboard" className="group mb-10 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white transition-transform group-hover:scale-[1.03]">
              <BusFront className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              Boneh <span className="text-slate-400">Star</span>
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-2">
            <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Main Menu</p>
            {menuItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <div className="mb-4 rounded-[24px] border border-slate-200/80 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user?.name || "Admin User"}</p>
              <p className="text-sm text-slate-500">{user?.role?.name || "Administrator"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 backdrop-blur lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Monitoring and system control</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-400 transition-colors hover:text-slate-700">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-slate-900"></span>
            </button>
            
            <div className="mx-1 h-8 w-px bg-slate-200"></div>

            <div className="group flex cursor-pointer items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="mb-1 text-sm font-semibold leading-none text-slate-800">{user?.name || "Admin User"}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{user?.role?.name || "Administrator"}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:bg-slate-100 group-hover:text-slate-900">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
