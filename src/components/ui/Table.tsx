import React from "react"
import { ArrowUpDown } from "lucide-react"

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
  emptyMessage = "No data available",
  onSort,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEADER */}
          <thead className="border-b border-slate-200/80 bg-slate-50/85">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={`
                    px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400
                    ${col.sortable ? "cursor-pointer select-none transition-colors hover:text-slate-700" : ""}
                    ${col.className || ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && <ArrowUpDown size={12} className="text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-slate-700"></div>
                    <span className="mt-2 text-xs font-medium tracking-wide">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <div className="h-[2px] w-6 bg-slate-300"></div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-slate-100/90 transition-colors last:border-0 hover:bg-slate-50/70"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 font-medium text-slate-600">
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

export default Table;
