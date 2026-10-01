import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { bookingService } from "../services/BookingService";
import type { Booking, BookingBusFormData } from "../types/Booking";
import { busService } from "@/features/admin/buses/services/BusService";
import { driverService } from "@/features/admin/drivers/services/DriverService";
import { 
  Bus as BusIcon, 
  User as DriverIcon,
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  XCircle, 
  Calendar,
  Users,
  MapPin,
  StickyNote
} from "lucide-react";
import { formatDate } from "@/utils/formatter";

interface QuickAssignFormProps {
  booking: Booking;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuickAssignForm({ booking, onSuccess, onCancel }: QuickAssignFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableBuses, setAvailableBuses] = useState<{ label: string, value: string, seats: number }[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<{ label: string, value: string }[]>([]);
  const [preferredBusesText, setPreferredBusesText] = useState<string | null>(null);

  const [assignedBuses, setAssignedBuses] = useState<BookingBusFormData[]>([]);

  // Format date utility
  const formatIndoDate = (dateString: string) => {
    try {
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  // Load available buses and drivers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const [busesRes, driversRes] = await Promise.all([
          busService.getAll(),
          driverService.getAll(),
        ]);

        // Filter and map available buses (include the ones already assigned to this booking)
        setAvailableBuses(
          busesRes.buses
            .filter(b => b.status === 'available' || booking.booking_buses?.some(bb => bb.bus_id === b.id))
            .map(b => ({ label: `${b.name} (${b.plat_number}) - ${b.seat_count} Kursi`, value: b.id, seats: b.seat_count }))
        );

        // Filter and map available drivers (include the ones already assigned to this booking)
        setAvailableDrivers(
          driversRes.drivers
            .filter(d => d.status === 'available' || booking.booking_buses?.some(bb => bb.driver_id === d.id))
            .map(d => ({ label: d.name, value: d.id }))
        );
      } catch (err: any) {
        setError("Gagal memuat data armada atau supir.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [booking]);

  // Extract customer preferred buses
  useEffect(() => {
    if (booking) {
      const rawNotes = booking.special_notes || "";
      const match = rawNotes.match(/\[Armada Pilihan Customer: (.*?)\]/);
      const extractedPref = match ? match[1] : null;
      setPreferredBusesText(extractedPref);

      // Populate existing assignments
      setAssignedBuses(
        booking.booking_buses?.map(bb => ({
          bus_id: bb.bus_id,
          driver_id: bb.driver_id,
          seat_count: bb.seat_count,
          assignment_notes: bb.assignment_notes || ""
        })) || []
      );
    }
  }, [booking]);

  const handleAddBus = () => {
    setAssignedBuses([
      ...assignedBuses,
      { bus_id: "", driver_id: "", seat_count: 0, assignment_notes: "" }
    ]);
  };

  const handleRemoveBus = (index: number) => {
    const updated = [...assignedBuses];
    updated.splice(index, 1);
    setAssignedBuses(updated);
  };

  const handleBusChange = (index: number, field: keyof BookingBusFormData, value: any) => {
    const updated = [...assignedBuses];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'bus_id') {
      const selectedBus = availableBuses.find(b => b.value === value);
      if (selectedBus) {
        updated[index].seat_count = selectedBus.seats;
      }
    }
    
    setAssignedBuses(updated);
  };

  const handleAssignPreferredBuses = () => {
    if (!preferredBusesText) return;

    // Split by comma to get each selected bus
    const parts = preferredBusesText.split(',').map(p => p.trim());
    const matchedBuses: typeof availableBuses = [];

    parts.forEach(part => {
      const lastOpenParen = part.lastIndexOf('(');
      const lastCloseParen = part.lastIndexOf(')');
      if (lastOpenParen !== -1 && lastCloseParen > lastOpenParen) {
        const plat = part.substring(lastOpenParen + 1, lastCloseParen).trim().toLowerCase();
        const found = availableBuses.find(b => b.label.toLowerCase().includes(plat));
        if (found && !matchedBuses.some(mb => mb.value === found.value)) {
          matchedBuses.push(found);
        }
      } else {
        const found = availableBuses.find(b => b.label.toLowerCase().includes(part.toLowerCase()));
        if (found && !matchedBuses.some(mb => mb.value === found.value)) {
          matchedBuses.push(found);
        }
      }
    });

    if (matchedBuses.length > 0) {
      const newBuses = matchedBuses.map(b => ({
        bus_id: b.value,
        driver_id: "", // Admin selects driver manually
        seat_count: b.seats,
        assignment_notes: "Sesuai pilihan customer"
      }));

      setAssignedBuses(newBuses);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const hasEmptyFields = assignedBuses.some(ab => !ab.bus_id || !ab.driver_id || ab.seat_count <= 0);
    if (hasEmptyFields) {
      setError("Silakan pilih armada dan supir untuk setiap baris penugasan.");
      return;
    }

    // Check duplicate bus assignment
    const busIds = assignedBuses.map(ab => ab.bus_id);
    const hasDuplicateBuses = new Set(busIds).size !== busIds.length;
    if (hasDuplicateBuses) {
      setError("Tidak boleh menugaskan armada yang sama lebih dari satu kali.");
      return;
    }

    setLoading(true);
    try {
      // Re-construct complete booking form data to send to PUT update endpoint
      const payload = {
        customer_id: booking.customer_id,
        activity_id: booking.activity_id,
        route_type_id: booking.route_type_id,
        booking_code: booking.booking_code,
        departure_date: booking.departure_date ? booking.departure_date.split(' ')[0] : "",
        return_date: booking.return_date ? booking.return_date.split(' ')[0] : null,
        origin: booking.origin,
        full_route: booking.full_route || "",
        passenger_count: booking.passenger_count,
        bus_count_requested: booking.bus_count_requested,
        special_notes: booking.special_notes || "",
        status: booking.status,
        cancelled_by: booking.cancelled_by || null,
        cancelled_reason: booking.cancelled_reason || "",
        buses: assignedBuses.map(ab => ({
          bus_id: ab.bus_id,
          driver_id: ab.driver_id,
          seat_count: ab.seat_count,
          assignment_notes: ab.assignment_notes || ""
        }))
      };

      await bookingService.update(booking.id, payload);
      onSuccess();
    } catch (err: any) {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const errorMessage = Array.isArray(validationErrors[firstErrorKey]) 
          ? validationErrors[firstErrorKey][0] 
          : validationErrors[firstErrorKey];
        setError(errorMessage);
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan penugasan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const assignedCount = assignedBuses.length;
  const requestedCount = booking.bus_count_requested;
  const isCountMatch = assignedCount === requestedCount;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-midnight-indigo shadow-sm flex items-center gap-2 animate-in fade-in duration-300">
          <XCircle size={16} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Booking Overview Panel */}
      <div className="rounded-[20px] bg-slate-50 border border-slate-200/60 p-5 flex flex-col gap-4 text-xs font-semibold text-slate-700">
        {/* Top Grid: Info Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200/60 pb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kode Booking</p>
            <p className="text-sm font-black text-midnight-indigo mt-0.5">{booking.booking_code}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jadwal Sewa</p>
            <div className="flex items-center gap-1 text-midnight-indigo mt-0.5">
              <Calendar size={12} className="text-action-blue shrink-0" />
              <span>
                {formatIndoDate(booking.departure_date)} 
                {booking.return_date && ` - ${formatIndoDate(booking.return_date)}`}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kebutuhan Unit</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-black text-midnight-indigo">{requestedCount} Unit</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                (<Users size={12} className="text-slate-400 shrink-0" /> {booking.passenger_count} Penumpang)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Departure Point & Full Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Titik Keberangkatan (Asal)</p>
            <div className="flex items-start gap-1.5 text-midnight-indigo bg-white/60 rounded-xl border border-slate-200/40 px-3 py-2 h-full">
              <MapPin size={14} className="text-action-blue shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed break-words whitespace-normal font-bold">
                {booking.origin}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rute Perjalanan (Tujuan)</p>
            <div className="flex items-start gap-1.5 text-midnight-indigo bg-white/60 rounded-xl border border-slate-200/40 px-3 py-2 h-full">
              <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed break-words whitespace-normal font-semibold">
                {booking.full_route || "Tidak ada detail rute tambahan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferred Buses Widget */}
      {preferredBusesText && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100/60 text-amber-700">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800">Armada Pilihan Pelanggan</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                Pilihan: <span className="font-bold underline">{preferredBusesText}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAssignPreferredBuses}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap self-stretch sm:self-auto justify-center cursor-pointer"
          >
            <Check size={12} strokeWidth={3} />
            Tugaskan Pilihan
          </button>
        </div>
      )}

      {/* Assignment Summary Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Alokasi Unit Armada</h4>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            isCountMatch 
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
              : 'bg-amber-50 border border-amber-100 text-amber-600'
          }`}>
            {assignedCount} dari {requestedCount} Unit Terisi
          </span>
        </div>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          icon={Plus} 
          onClick={handleAddBus}
          className="rounded-xl font-bold"
        >
          Tambah Armada
        </Button>
      </div>

      {/* Assignment Inputs Container */}
      <div className="flex flex-col gap-5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin">
        {assignedBuses.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <BusIcon size={28} className="text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-500">Belum ada armada ditugaskan</p>
            <p className="text-[10px] text-slate-400 mt-1">Silakan klik "Tambah Armada" untuk memulai.</p>
          </div>
        ) : (
          assignedBuses.map((item, index) => (
            <div 
              key={index} 
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-action-blue/25 group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Trash button absolute top right */}
              <button 
                type="button" 
                onClick={() => handleRemoveBus(index)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all md:opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white shadow-sm z-10 cursor-pointer"
                title="Hapus Penugasan"
              >
                <Trash2 size={15} strokeWidth={2.5} />
              </button>

              {/* Grid 2-column: Bus and Driver */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Select
                  label="Pilih Armada"
                  options={availableBuses}
                  icon={BusIcon}
                  value={item.bus_id}
                  onChange={(val) => handleBusChange(index, 'bus_id', val)}
                  placeholder="Pilih unit armada"
                  required
                />
                
                <Select
                  label="Pilih Supir"
                  options={availableDrivers}
                  icon={DriverIcon}
                  value={item.driver_id}
                  onChange={(val) => handleBusChange(index, 'driver_id', val)}
                  placeholder="Pilih kru supir"
                  required
                />
              </div>

              {/* Grid 2-column: Seats count and Notes */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Input
                    label="Jumlah Kursi"
                    type="number"
                    min="1"
                    icon={Users}
                    value={item.seat_count.toString()}
                    onChange={(e) => handleBusChange(index, 'seat_count', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Catatan Khusus"
                    placeholder="Contoh: Unit cadangan, kru cadangan..."
                    icon={StickyNote}
                    value={item.assignment_notes || ""}
                    onChange={(e) => handleBusChange(index, 'assignment_notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DialogFooter className="mt-4 border-t border-slate-200 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl font-semibold"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading || fetchingData}
          disabled={loading || fetchingData}
          className="rounded-xl font-bold shadow-button"
        >
          Simpan Penugasan
        </Button>
      </DialogFooter>
    </form>
  );
}
