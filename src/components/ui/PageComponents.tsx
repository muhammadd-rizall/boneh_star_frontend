import { List, Trash2 } from "lucide-react"
import React from "react"
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
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div className="flex flex-col gap-1.5">
        {badge && (
          <span className="mb-1 inline-block w-fit rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
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

const colorMap: Record<StatColor, { icon: string; dot: string }> = {
  default: { icon: "bg-slate-100 text-slate-500",  dot: "bg-slate-300" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" },
  blue:    { icon: "bg-blue-50 text-blue-600",       dot: "bg-blue-400" },
  amber:   { icon: "bg-amber-50 text-amber-600",     dot: "bg-amber-400" },
  rose:    { icon: "bg-rose-50 text-rose-500",       dot: "bg-rose-400" },
  violet:  { icon: "bg-violet-50 text-violet-600",   dot: "bg-violet-400" },
}

export function StatCard({ label, value, note, icon: Icon, loading, color = "default" }: StatCardProps) {
  const { icon: iconCls, dot: dotCls } = colorMap[color]
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconCls}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className={`mt-1 h-1.5 w-1.5 rounded-full ${dotCls}`} />
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        {loading ? (
          <span className="inline-block h-8 w-28 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          value
        )}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {note && <p className="mt-2 text-[11px] text-slate-400">{note}</p>}
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
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {children}
    </div>
  )
}

// ─── ViewToggle ───────────────────────────────────────────────────────────────
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
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => onViewChange("active")}
        className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
          view === "active"
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <List size={13} strokeWidth={2} />
        {activeLabel}
      </button>
      <button
        onClick={() => onViewChange("trash")}
        className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
          view === "trash"
            ? "bg-rose-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Trash2 size={13} strokeWidth={2} />
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
  createIcon: CreateIcon,
  extraActions,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Search area */}
      <div className="flex-1 min-w-0 sm:max-w-xl lg:max-w-2xl">
        <Search value={searchValue} onChange={onSearchChange} className="[&_input]:h-10" placeholder={searchPlaceholder} />
      </div>

      {/* Actions area */}
      <div className="flex items-center gap-2 shrink-0">
        {extraActions}
        {onCreate && (
          <Button
            variant="default"
            icon={CreateIcon}
            onClick={onCreate}
            className="h-10 rounded-lg px-5 text-sm font-medium shadow-sm"
          >
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
    <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
          <Trash2 size={16} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-rose-800">Terjadi Kesalahan</p>
          <p className="mt-0.5 text-sm text-rose-500">{error}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="danger" onClick={onRetry} className="rounded-lg shrink-0">
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
