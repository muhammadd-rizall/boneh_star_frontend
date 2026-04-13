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
  UserCircle
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
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}
    `}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className="font-semibold text-sm">{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
    { to: "/admin/users", icon: Users, label: "User Management" },
    { to: "/admin/roles", icon: ShieldCheck, label: "Roles & Permissions" },
    { to: "/admin/settings", icon: Settings, label: "System Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3 mb-10 px-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
              <BusFront className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Boneh <span className="text-indigo-600">Star</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
            {menuItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </nav>

          {/* Footer Sidebar / Logout */}
          <div className="mt-auto pt-6 border-t border-slate-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold text-sm group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium font-sans">Monitoring & system control</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name || "Admin User"}</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{user?.role?.name || "Administrator"}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
