import * as React from "react"
import { ArrowUpDown, InboxIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { cn } from "@/lib/utils"

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
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Tidak ada data tersedia",
  onSort,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-[2rem] border border-slate-50 bg-white shadow-xl shadow-slate-200/40", className)}>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={cn(
                    "px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap h-auto border-none",
                    col.sortable ? "cursor-pointer select-none hover:text-slate-950 transition-colors" : "",
                    col.className
                  )}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown size={12} className="text-slate-300" strokeWidth={3} />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50 border-none">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse border-none hover:bg-transparent">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-6 py-5">
                      <div
                        className="h-4 rounded-xl bg-slate-50"
                        style={{ width: `${60 + Math.random() * 30}%` }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-50 text-slate-200 shadow-inner">
                      <InboxIcon size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950 uppercase tracking-widest">{emptyMessage}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">Data belum tersedia atau tidak ditemukan</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="transition-all hover:bg-slate-50/50 group cursor-default border-none"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="px-6 py-5 text-slate-700 text-sm font-bold h-auto"
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
    </div>
  )
}
