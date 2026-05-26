import * as React from "react"
import { ArrowUpDown, InboxIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onSort?: (columnIndex: number) => void
  className?: string
  /** Enable built-in client-side pagination */
  paginated?: boolean
  /** Default page size. Default: 10 */
  defaultPageSize?: number
}

// ─── Pagination UI ────────────────────────────────────────────────────────────

interface PaginationBarProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

function PaginationBar({ page, totalPages, onPageChange }: PaginationBarProps) {
  // Generate page numbers to show (max 5 visible, sliding window)
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [page - 2, page - 1, page, page + 1, page + 2]
  }

  return (
    <div className="flex items-center justify-center gap-1 border-t border-slate-100 px-5 py-3">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
        title="Halaman pertama"
      >
        <ChevronsLeft size={13} strokeWidth={2} />
      </button>

      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
        title="Sebelumnya"
      >
        <ChevronLeft size={13} strokeWidth={2} />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-0.5">
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors",
              p === page
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
        title="Berikutnya"
      >
        <ChevronRight size={13} strokeWidth={2} />
      </button>

      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
        title="Halaman terakhir"
      >
        <ChevronsRight size={13} strokeWidth={2} />
      </button>
    </div>
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Tidak ada data tersedia",
  onSort,
  className,
  paginated = false,
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1)
  const pageSize = defaultPageSize

  // Reset to page 1 whenever data changes (e.g. after search/filter)
  React.useEffect(() => { setPage(1) }, [data])

  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Clamp page if data shrinks
  const safePage = Math.min(page, totalPages)
  const displayData = paginated
    ? data.slice((safePage - 1) * pageSize, safePage * pageSize)
    : data

  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-100">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={cn(
                    "px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap h-auto border-none",
                    col.sortable ? "cursor-pointer select-none hover:text-slate-700 transition-colors" : "",
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown size={11} className="text-slate-300" strokeWidth={2.5} />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 border-none">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} className="animate-pulse border-none hover:bg-transparent">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-5 py-4">
                      <div
                        className="h-3.5 rounded-md bg-slate-100"
                        style={{ width: `${55 + Math.random() * 30}%` }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                      <InboxIcon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                      <p className="mt-0.5 text-xs text-slate-400">Data belum tersedia atau tidak ditemukan</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="transition-colors hover:bg-slate-50/60 cursor-default border-none"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="px-5 py-3.5 text-slate-700 text-sm h-auto"
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && !loading && totalPages > 1 && (
        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
