import React from "react"
import { List, Trash2 } from "lucide-react"
import { Button } from "./Button"
import Search from "./Search"

// ─── PageHeader ────────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        {badge && (
          <span className="mb-2 inline-block w-fit rounded-lg bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl">{title}</h1>
        {subtitle && <p className="text-sm font-semibold text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
type StatColor = "default" | "emerald" | "blue" | "amber" | "rose" | "violet"

interface StatCardProps {
  label: string
  value: string | number
  note?: string
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  loading?: boolean
  color?: StatColor
}

const colorMap: Record<StatColor, string> = {
  default: "bg-slate-50 text-slate-400",
  emerald: "bg-emerald-50 text-emerald-600",
  blue:    "bg-blue-50    text-blue-600",
  amber:   "bg-orange-50  text-orange-600",
  rose:    "bg-rose-50   text-rose-600",
  violet:  "bg-violet-50 text-violet-600",
}

export function StatCard({ label, value, note, icon: Icon, loading, color = "default" }: StatCardProps) {
  return (
    <div className="rounded-[2rem] border-none bg-white p-8 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl hover:shadow-slate-200/60 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[color]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
      </div>
      <p className="mt-6 text-4xl font-black tracking-tighter text-slate-950">
        {loading ? (
          <span className="inline-block h-10 w-24 animate-pulse rounded-xl bg-slate-50" />
        ) : (
          value
        )}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      {note && <p className="mt-3 text-[11px] font-bold text-slate-300 italic">{note}</p>}
    </div>
  )
}

// ─── StatGrid ─────────────────────────────────────────────────────────────────
interface StatGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}

const gridCols: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {children}
    </div>
  )
}

interface ViewToggleProps {
  view: "active" | "trash"
  onViewChange: (view: "active" | "trash") => void
  activeLabel?: string
  trashLabel?: string
}

export function ViewToggle({
  view,
  onViewChange,
  activeLabel = "Data Aktif",
  trashLabel = "Tong Sampah",
}: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 shadow-inner">
      <button
        onClick={() => onViewChange("active")}
        className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${
          view === "active"
            ? "bg-white text-slate-950 shadow-md"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <List size={14} strokeWidth={2.5} />
        {activeLabel}
      </button>
      <button
        onClick={() => onViewChange("trash")}
        className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${
          view === "trash"
            ? "bg-rose-500 text-white shadow-md shadow-rose-200"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Trash2 size={14} strokeWidth={2.5} />
        {trashLabel}
      </button>
    </div>
  )
}

// ─── PageToolbar ───────────────────────────────────────────────────────────────
interface PageToolbarProps {
  searchValue: string
  onSearchChange: (v: string) => void
  searchPlaceholder?: string
  onRefresh?: () => void
  refreshLoading?: boolean
  onCreate?: () => void
  createLabel?: string
  createIcon?: React.ComponentType<{ size?: number; className?: string }>
  extraActions?: React.ReactNode
}

export function PageToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onCreate,
  createLabel = "Tambah",
  createIcon,
  extraActions,
}: PageToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[300px]">
        <Search value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} className="rounded-2xl" />
      </div>
      <div className="flex items-center gap-3">
        {extraActions}
        {onCreate && (
          <Button variant="primary" icon={createIcon} onClick={onCreate} className="rounded-2xl shadow-lg shadow-slate-200">
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── ErrorBanner ─────────────────────────────────────────────────────────────
interface ErrorBannerProps {
  error: string
  onRetry?: () => void
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-[2rem] border border-rose-100 bg-rose-50/30 p-6 animate-in shake duration-500">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <Trash2 size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black uppercase tracking-widest text-rose-900">Terjadi Kesalahan</p>
          <p className="mt-0.5 text-sm font-semibold text-rose-500 leading-relaxed">{error}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="danger" onClick={onRetry} className="rounded-xl">
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Layout Components ───────────────────────────────────────────────────────

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative ${className}`}>
      {children}
    </section>
  )
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
