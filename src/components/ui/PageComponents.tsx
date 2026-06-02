import { List, Trash2, AlertCircle, RefreshCcw, Plus } from "lucide-react"
import React from "react"
import { Button } from "./Button"
import Search from "./Search"
import { cn } from "@/lib/utils"

// ─── PageHeader ────────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="flex flex-col gap-2">
        {badge && (
          <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-cloud-mist border border-platinum-tint px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-action-blue shadow-sm animate-in fade-in slide-in-from-left-2 duration-500">
            <div className="h-1.5 w-1.5 rounded-full bg-action-blue animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-midnight-indigo sm:text-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">{title}</h1>
        {subtitle && <p className="text-base font-medium text-slate-blue opacity-70 animate-in fade-in slide-in-from-bottom-4 duration-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-700">{actions}</div>}
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

const colorMap: Record<StatColor, { icon: string; bg: string; glow: string; dot: string; border: string }> = {
  default: {
    icon: "text-midnight-indigo",
    bg: "bg-cloud-mist",
    glow: "bg-action-blue",
    dot: "bg-midnight-indigo",
    border: "group-hover:border-action-blue/30",
  },
  emerald: {
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
    glow: "bg-emerald-400",
    dot: "bg-emerald-500",
    border: "group-hover:border-emerald-200",
  },
  blue: {
    icon: "text-action-blue",
    bg: "bg-blue-50",
    glow: "bg-action-blue",
    dot: "bg-action-blue",
    border: "group-hover:border-action-blue/30",
  },
  amber: {
    icon: "text-amber-600",
    bg: "bg-amber-50",
    glow: "bg-sunset-gold",
    dot: "bg-sunset-gold",
    border: "group-hover:border-sunset-gold/30",
  },
  rose: {
    icon: "text-red-500",
    bg: "bg-red-50",
    glow: "bg-red-400",
    dot: "bg-red-500",
    border: "group-hover:border-red-200",
  },
  violet: {
    icon: "text-royal-amethyst",
    bg: "bg-violet-50",
    glow: "bg-royal-amethyst",
    dot: "bg-royal-amethyst",
    border: "group-hover:border-royal-amethyst/25",
  },
}

export function StatCard({ label, value, note, icon: Icon, loading, color = "default" }: StatCardProps) {
  const { icon: iconCls, bg: bgCls, glow, dot, border } = colorMap[color]
  return (
    <div className={cn(
      "group relative h-full min-h-[160px] overflow-hidden rounded-2xl border border-platinum-tint/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-button sm:p-6",
      border
    )}>
      <div className={cn("absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.06] blur-3xl transition-opacity duration-200 group-hover:opacity-10", glow)} />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 transition-colors duration-200", bgCls, iconCls)}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full ring-4 ring-cloud-mist", dot)} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-blue/60">{label}</p>
          {loading ? (
            <div className="h-9 w-32 max-w-full animate-pulse rounded-xl bg-cloud-mist" />
          ) : (
            <p className="break-words text-[clamp(1.4rem,2vw,1.8rem)] font-bold leading-tight tracking-tight text-midnight-indigo tabular-nums">{value}</p>
          )}
        </div>

        {note && <p className="mt-5 border-t border-platinum-tint/35 pt-3 text-xs font-medium leading-relaxed text-slate-blue/65">{note}</p>}
      </div>
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
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4",
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  return (
    <div className={cn("grid gap-4 lg:gap-5", gridCols[columns])}>
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
  activeLabel = "Aktif",
  trashLabel = "Tong Sampah",
}: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-platinum-tint bg-white p-1.5 shadow-sm">
      <button
        onClick={() => onViewChange("active")}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-all",
          view === "active"
            ? "bg-midnight-indigo text-white shadow-button"
            : "text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo"
        )}
      >
        <List size={14} strokeWidth={3} />
        {activeLabel}
      </button>
      <button
        onClick={() => onViewChange("trash")}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-all",
          view === "trash"
            ? "bg-red-500 text-white shadow-button"
            : "text-slate-blue hover:bg-red-50 hover:text-red-600"
        )}
      >
        <Trash2 size={14} strokeWidth={3} />
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
  searchPlaceholder = "Cari data...",
  onCreate,
  createLabel = "Tambah Baru",
  createIcon: CreateIcon = Plus,
  extraActions,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="flex-1 min-w-0 sm:max-w-xl">
        <Search 
          value={searchValue} 
          onChange={onSearchChange} 
          className="[&_input]:h-12" 
          placeholder={searchPlaceholder} 
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {extraActions}
        {onCreate && (
          <Button
            variant="primary"
            icon={CreateIcon}
            onClick={onCreate}
            size="lg"
            className="rounded-xl font-medium shadow-button px-8"
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
    <div className="rounded-[24px] border border-red-200 bg-red-50/50 p-8 shadow-sm animate-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500 shadow-sm border border-red-200/50">
          <AlertCircle size={32} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-lg font-bold text-red-700 tracking-tight">Terjadi Kesalahan Sistem</p>
          <p className="mt-1 text-sm font-medium text-red-600/70 max-w-md">{error}</p>
        </div>
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry} 
            className="rounded-xl border-red-200 text-red-700 hover:bg-red-50 font-medium px-8 mt-2"
            icon={RefreshCcw}
          >
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Simple Layout Helpers ──────────────────────────────────────────────────

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  )
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}
