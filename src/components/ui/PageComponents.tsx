import React from "react"
import { List, Trash2 } from "lucide-react"
import Button from "./Button"
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
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            {badge}
          </span>
        )}
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
type StatColor = "default" | "emerald" | "blue" | "amber" | "rose" | "violet"

interface StatCardProps {
  label: string
  value: string | number
  note?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  loading?: boolean
  color?: StatColor
}

const colorMap: Record<StatColor, string> = {
  default: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue:    "bg-sky-50    text-sky-600",
  amber:   "bg-amber-50  text-amber-600",
  rose:    "bg-rose-50   text-rose-600",
  violet:  "bg-violet-50 text-violet-600",
}

export function StatCard({ label, value, note, icon: Icon, loading, color = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon size={17} />
        </div>
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {loading ? (
          <span className="inline-block h-7 w-16 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          value
        )}
      </p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
      {note && <p className="mt-1 text-[11px] text-slate-400">{note}</p>}
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
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  return (
    <div className={`grid gap-3 ${gridCols[columns]}`}>
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
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
      <button
        onClick={() => onViewChange("active")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
          view === "active"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <List size={13} />
        {activeLabel}
      </button>
      <button
        onClick={() => onViewChange("trash")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
          view === "trash"
            ? "bg-rose-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Trash2 size={13} />
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
    <div className="flex flex-wrap items-center gap-2">
      <Search value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
      {extraActions}
      {onCreate && (
        <Button variant="primary" icon={createIcon} onClick={onCreate} size="sm">
          {createLabel}
        </Button>
      )}
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
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <div className="h-4 w-4 rounded-full bg-rose-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-rose-800">Terjadi Kesalahan</p>
          <p className="mt-0.5 text-xs text-rose-600 leading-relaxed">{error}</p>
        </div>
        {onRetry && (
          <Button size="xs" variant="danger" onClick={onRetry}>
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
