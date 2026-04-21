import React from "react"
import { ArrowUpDown } from "lucide-react"
import { InboxIcon } from "lucide-react"

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={[
                    "px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap",
                    col.sortable ? "cursor-pointer select-none hover:text-slate-800 transition-colors" : "",
                    col.className || "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown size={11} className="text-slate-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div
                        className="h-4 rounded-md bg-slate-100"
                        style={{ width: `${60 + Math.random() * 30}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <InboxIcon size={22} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                    <p className="text-xs text-slate-400">Data belum tersedia atau tidak ditemukan</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-slate-50/80 group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-slate-700 text-sm"
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
