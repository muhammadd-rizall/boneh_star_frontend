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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEADER */}
          <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && onSort?.(index)}
                  className={`
                    text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]
                    ${col.sortable ? "cursor-pointer select-none hover:text-indigo-600 transition-colors" : ""}
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
                <td colSpan={columns.length} className="text-center py-20 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="font-medium text-xs mt-2 tracking-wide">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-20 text-slate-400">
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-2">
                      <div className="w-6 h-[2px] bg-slate-200"></div>
                    </div>
                    <span className="font-semibold text-xs tracking-wide uppercase">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-slate-600 font-medium">
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