import React from "react"
import { ArrowUpDown, InboxIcon } from "lucide-react"

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
  sortable?: boolean
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onSort?: (columnIndex: number) => void
}

function Table<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Tidak ada data tersedia",
  onSort,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-50 bg-white shadow-xl shadow-slate-200/40">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={[
                    "px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap",
                    col.sortable ? "cursor-pointer select-none hover:text-slate-950 transition-colors" : "",
                    col.className || "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown size={12} className="text-slate-300" strokeWidth={3} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-5">
                      <div
                        className="h-4 rounded-xl bg-slate-50"
                        style={{ width: `${60 + Math.random() * 30}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-50 text-slate-200 shadow-inner">
                      <InboxIcon size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950 uppercase tracking-widest">{emptyMessage}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">Data belum tersedia atau tidak ditemukan</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-all hover:bg-slate-50/50 group cursor-default"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-5 text-slate-700 text-sm font-bold"
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default Table
