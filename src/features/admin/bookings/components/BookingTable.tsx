import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Booking } from "@/features/admin/bookings/types/Booking"
import { Edit, Trash2, Calendar, MapPin, Users, Bus, RotateCcw, Phone, Banknote } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModulePermission } from "@/hooks/useModulePermission"

interface BookingTableProps {
  data: Booking[]
  onDelete: (booking: Booking) => void
  onEdit: (booking: Booking) => void
  onAssignBus?: (booking: Booking) => void
  onCreateQuotation?: (booking: Booking) => void
  onViewDetail?: (booking: Booking) => void
  onRestore?: (booking: Booking) => void
  onForceDelete?: (booking: Booking) => void
  loading?: boolean
  isTrash?: boolean
  isTrashed?: boolean
}

export default function BookingTable({ 
  data, 
  onDelete, 
  onEdit, 
  onAssignBus,
  onCreateQuotation,
  onViewDetail: _onViewDetail,
  onRestore, 
  onForceDelete, 
  loading, 
  isTrash = false,
  isTrashed = false
}: BookingTableProps) {
  const isTrashView = isTrash || isTrashed
  const { canUpdate, canDelete } = useModulePermission("bookings")

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Tertunda', color: 'border-amber-200 bg-amber-50 text-amber-700' };
      case 'quoted': return { label: 'Ditawarkan', color: 'border-blue-200 bg-blue-50 text-blue-700' };
      case 'confirmed': return { label: 'Dikonfirmasi', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
      case 'ongoing': return { label: 'Sedang Jalan', color: 'border-indigo-200 bg-indigo-50 text-indigo-700' };
      case 'completed': return { label: 'Selesai', color: 'border-slate-200 bg-slate-50 text-slate-700' };
      case 'cancelled': return { label: 'Dibatalkan', color: 'border-rose-200 bg-rose-50 text-rose-700' };
      default: return { label: status, color: 'border-slate-200 bg-slate-100 text-slate-500' };
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "Pelanggan & Booking",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-left py-1">
          <span className="font-bold text-sm text-midnight-indigo tracking-tight">
            {row.customer?.name || 'Pelanggan'}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Kode:</span>
            <span className="text-action-blue font-bold">{row.booking_code}</span>
          </div>
          {row.customer?.phone && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
              <Phone size={12} className="text-emerald-500 shrink-0" />
              <span>{row.customer.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: "Rute & Aktivitas",
      accessor: (row) => (
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-midnight-indigo opacity-95">
            <MapPin size={12} className="text-action-blue" />
            <span>{row.origin}</span>
            {row.route_type?.name && (
              <span className="rounded-lg bg-cloud-mist border border-platinum-tint/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-blue">
                {row.route_type.name}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-blue opacity-70 line-clamp-1">{row.activity?.name || 'Aktivitas'}</span>
        </div>
      )
    },
    {
      header: "Jadwal",
      accessor: (row) => {
        const calculateDuration = (start: string, end?: string | null) => {
          if (!end) return '1 Hari';
          try {
            const s = new Date(start.split(' ')[0]);
            const e = new Date(end.split(' ')[0]);
            const diffTime = Math.abs(e.getTime() - s.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return `${diffDays} Hari`;
          } catch {
            return '1 Hari';
          }
        };

        const duration = calculateDuration(row.departure_date, row.return_date);

        return (
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-midnight-indigo">
              <Calendar size={13} className="text-action-blue shrink-0" />
              <span>{formatDate(row.departure_date)}</span>
            </div>
            {row.return_date && (
              <div className="text-xs font-bold text-slate-700 ml-4 flex items-center gap-1">
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">s/d</span>
                <span>{formatDate(row.return_date)}</span>
              </div>
            )}
            <span className="text-[10px] font-bold text-action-blue ml-4">
              ({duration})
            </span>
          </div>
        );
      }
    },
    {
      header: "Kapasitas",
      accessor: (row) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-blue opacity-85" title="Penumpang">
            <Users size={14} className="text-action-blue" />
            <span>{row.passenger_count}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-blue opacity-85" title="Bus (Ditugaskan / Diminta)">
            <Bus size={14} className="text-action-blue" />
            <span>
              <span className={(row.booking_buses?.length || 0) === row.bus_count_requested ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                {row.booking_buses?.length || 0}
              </span>
              <span className="text-platinum-tint mx-1">/</span>
              <span>{row.bus_count_requested}</span>
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const cfg = getStatusConfig(row.status);
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] border shadow-sm",
            cfg.color
          )}>
            {cfg.label}
          </span>
        );
      }
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrashView ? (
            <>
              {canUpdate && (
                <Button 
                  size="icon-sm" 
                  variant="outline" 
                  icon={RotateCcw} 
                  className="h-9 w-9 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-500" 
                  onClick={() => onRestore?.(row)}
                  title="Pulihkan Pesanan" 
                />
              )}
              {canDelete && (
                <Button 
                  size="icon-sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-xl shadow-sm" 
                  onClick={() => onForceDelete?.(row)}
                  title="Hapus Permanen"
                />
              )}
            </>
          ) : (
            <>
              {canUpdate && (
                <>
                  {row.status === 'pending' && (
                    <Button 
                      size="icon-sm" 
                      variant="outline" 
                      icon={Banknote} 
                      className="h-9 w-9 rounded-xl shadow-sm hover:border-amber-500 hover:text-amber-500" 
                      onClick={() => onCreateQuotation?.(row)}
                      title="Buat Penawaran Harga" 
                    />
                  )}
                  <Button 
                    size="icon-sm" 
                    variant="outline" 
                    icon={Bus} 
                    className="h-9 w-9 rounded-xl shadow-sm hover:border-emerald-500 hover:text-emerald-500" 
                    onClick={() => onAssignBus?.(row)}
                    title="Tugaskan Armada & Supir" 
                  />
                  <Button 
                    size="icon-sm" 
                    variant="outline" 
                    icon={Edit} 
                    className="h-9 w-9 rounded-xl shadow-sm hover:border-action-blue hover:text-action-blue" 
                    onClick={() => onEdit(row)}
                    title="Edit Pesanan" 
                  />
                </>
              )}
              {canDelete && (
                <Button 
                  size="icon-sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-xl shadow-sm" 
                  onClick={() => onDelete(row)}
                  title="Hapus Pesanan"
                />
              )}
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
