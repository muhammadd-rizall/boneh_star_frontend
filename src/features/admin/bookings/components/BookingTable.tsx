import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Booking } from "@/features/admin/bookings/types/Booking"
import { Edit, Trash2, Calendar, MapPin, Users, Bus } from "lucide-react"

interface BookingTableProps {
  data: Booking[]
  onDelete: (booking: Booking) => void
  onEdit: (booking: Booking) => void
  loading?: boolean
}

export default function BookingTable({ data, onDelete, onEdit, loading }: BookingTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'quoted': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'confirmed': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'ongoing': return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      case 'completed': return 'border-slate-200 bg-slate-50 text-slate-700';
      case 'cancelled': return 'border-rose-200 bg-rose-50 text-rose-700';
      default: return 'border-slate-200 bg-slate-100 text-slate-500';
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "Booking Info",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <span className="font-bold text-slate-900 tracking-tight">{row.booking_code}</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users size={12} />
            <span>{row.customer?.name || 'Unknown Customer'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Route & Activity",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <MapPin size={12} className="text-slate-400" />
            <span>{row.origin}</span>
            {row.route_type?.name && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {row.route_type.name}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.activity?.name || 'No Activity Type'}</span>
        </div>
      )
    },
    {
      header: "Schedule",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Calendar size={12} className="text-slate-400" />
            <span>{formatDate(row.departure_date)}</span>
          </div>
          {row.return_date && (
            <div className="text-[10px] text-slate-400 ml-4">
              to {formatDate(row.return_date)}
            </div>
          )}
        </div>
      )
    },
    {
      header: "Capacity",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600" title="Passengers">
            <Users size={14} className="text-slate-400" />
            <span>{row.passenger_count}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600" title="Buses (Assigned / Requested)">
            <Bus size={14} className="text-slate-400" />
            <span>
              <span className={row.booking_buses?.length === row.bus_count_requested ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                {row.booking_buses?.length || 0}
              </span>
              <span className="text-slate-300 mx-1">/</span>
              <span>{row.bus_count_requested}</span>
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] border ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            icon={Edit} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onEdit(row)}
            title="Edit Booking" 
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onDelete(row)}
            title="Delete Booking"
          />
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
