import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import { bookingService } from "../services/BookingService";
import type { Booking, BookingFormData, BookingStatus, CancelledBy, BookingBusFormData } from "../types/Booking";
import { customerService } from "@/features/admin/customers/services/CustomerService";
import { activityTypeService } from "@/features/admin/activity-types/services/ActivityTypeService";
import { routeTypeService } from "@/features/admin/route-types/services/RouteTypeService";
import { busService } from "@/features/admin/buses/services/BusService";
import { driverService } from "@/features/admin/drivers/services/DriverService";
import { 
  Hash, 
  User as UserIcon, 
  Activity, 
  Map as MapIcon, 
  Calendar, 
  MapPin, 
  Users, 
  Bus as BusIcon, 
  StickyNote, 
  Info,
  XCircle,
  Save,
  Plus,
  Trash2,
  Contact,
  ClipboardList,
  Sparkles,
  Check
} from "lucide-react";

interface BookingFormProps {
  booking?: Booking | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingForm({ booking, onSuccess, onCancel }: BookingFormProps) {
  const isEdit = !!booking;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferredBusesText, setPreferredBusesText] = useState<string | null>(null);

  const [customers, setCustomers] = useState<{label: string, value: string}[]>([]);
  const [activities, setActivities] = useState<{label: string, value: string}[]>([]);
  const [routeTypes, setRouteTypes] = useState<{label: string, value: string}[]>([]);
  const [availableBuses, setAvailableBuses] = useState<{label: string, value: string, seats: number}[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<{label: string, value: string}[]>([]);

  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: "",
    activity_id: "",
    route_type_id: "",
    booking_code: "",
    departure_date: "",
    return_date: "",
    origin: "",
    full_route: "",
    passenger_count: 1,
    bus_count_requested: 1,
    special_notes: "",
    status: "pending",
    cancelled_by: null,
    cancelled_reason: "",
    buses: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const [customersRes, activitiesRes, routeTypesRes, busesRes, driversRes] = await Promise.all([
          customerService.getAll(),
          activityTypeService.getAll(),
          routeTypeService.getAll(),
          busService.getAll(),
          driverService.getAll(),
        ]);

        setCustomers(customersRes.customers.map(c => ({ label: c.name, value: c.id })));
        setActivities(activitiesRes.activityTypes.map(a => ({ label: a.name, value: a.id })));
        setRouteTypes(routeTypesRes.routeTypes.map(r => ({ label: r.name, value: r.id })));
        setAvailableBuses(busesRes.buses
          .filter(b => b.status === 'available' || (isEdit && booking?.booking_buses?.some(bb => bb.bus_id === b.id)))
          .map(b => ({ label: `${b.name} (${b.plat_number})`, value: b.id, seats: b.seat_count })));
        setAvailableDrivers(driversRes.drivers
          .filter(d => d.status === 'available' || (isEdit && booking?.booking_buses?.some(bb => bb.driver_id === d.id)))
          .map(d => ({ label: d.name, value: d.id })));
      } catch (err: any) {
        setError("Failed to fetch required data.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [isEdit, booking]);

  useEffect(() => {
    if (booking) {
      const rawNotes = booking.special_notes || "";
      const match = rawNotes.match(/\[Armada Pilihan Customer: (.*?)\]/);
      const extractedPref = match ? match[1] : null;
      setPreferredBusesText(extractedPref);

      setFormData({
        customer_id: booking.customer_id,
        activity_id: booking.activity_id,
        route_type_id: booking.route_type_id,
        booking_code: booking.booking_code,
        departure_date: booking.departure_date ? booking.departure_date.split(' ')[0] : "",
        return_date: booking.return_date ? booking.return_date.split(' ')[0] : "",
        origin: booking.origin,
        full_route: booking.full_route || "",
        passenger_count: booking.passenger_count,
        bus_count_requested: booking.bus_count_requested,
        special_notes: match ? rawNotes.replace(/\[Armada Pilihan Customer: .*?\]/, '').trim() : rawNotes,
        status: booking.status,
        cancelled_by: booking.cancelled_by || null,
        cancelled_reason: booking.cancelled_reason || "",
        buses: booking.booking_buses?.map(bb => ({
          bus_id: bb.bus_id,
          driver_id: bb.driver_id,
          seat_count: bb.seat_count,
          assignment_notes: bb.assignment_notes || ""
        })) || [],
      });
    }
  }, [booking]);

  const handleAddBus = () => {
    setFormData({
      ...formData,
      buses: [
        ...(formData.buses || []),
        { bus_id: "", driver_id: "", seat_count: 0, assignment_notes: "" }
      ]
    });
  };

  const handleRemoveBus = (index: number) => {
    const updatedBuses = [...(formData.buses || [])];
    updatedBuses.splice(index, 1);
    setFormData({ ...formData, buses: updatedBuses });
  };

  const handleBusChange = (index: number, field: keyof BookingBusFormData, value: any) => {
    const updatedBuses = [...(formData.buses || [])];
    updatedBuses[index] = { ...updatedBuses[index], [field]: value };
    
    if (field === 'bus_id') {
      const selectedBus = availableBuses.find(b => b.value === value);
      if (selectedBus) {
        updatedBuses[index].seat_count = selectedBus.seats;
      }
    }
    
    setFormData({ ...formData, buses: updatedBuses });
  };

  const handleAssignPreferredBuses = () => {
    if (!preferredBusesText) return;

    // Ambil plat nomor di dalam tanda kurung ()
    const matches = [...preferredBusesText.matchAll(/\((.*?)\)/g)].map(m => m[1].trim().toLowerCase());
    const matchedBuses: typeof availableBuses = [];

    if (matches.length > 0) {
      matches.forEach(plat => {
        const found = availableBuses.find(b => b.label.toLowerCase().includes(plat));
        if (found) matchedBuses.push(found);
      });
    } else {
      // Fallback mencocokkan nama
      const parts = preferredBusesText.split(',').map(p => p.trim().toLowerCase());
      parts.forEach(part => {
        const found = availableBuses.find(b => b.label.toLowerCase().includes(part));
        if (found) matchedBuses.push(found);
      });
    }

    if (matchedBuses.length > 0) {
      const newBuses = matchedBuses.map(b => ({
        bus_id: b.value,
        driver_id: "", // Admin memilih supir secara manual
        seat_count: b.seats,
        assignment_notes: "Sesuai pilihan customer"
      }));

      setFormData(prev => ({
        ...prev,
        buses: newBuses
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const rawNotes = formData.special_notes || "";
      const finalNotes = preferredBusesText
        ? `[Armada Pilihan Customer: ${preferredBusesText}]\n${rawNotes}`.trim()
        : rawNotes || null;

      const dataToSubmit = {
        ...formData,
        return_date: formData.return_date || null,
        full_route: formData.full_route || null,
        special_notes: finalNotes,
        cancelled_by: formData.status === 'cancelled' ? formData.cancelled_by : null,
        cancelled_reason: formData.status === 'cancelled' ? formData.cancelled_reason : null,
      };

      if (isEdit && booking) {
        await bookingService.update(booking.id, dataToSubmit);
      } else {
        await bookingService.create(dataToSubmit);
      }
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
        setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Tertunda", value: "pending" },
    { label: "Ditawarkan", value: "quoted" },
    { label: "Dikonfirmasi", value: "confirmed" },
    { label: "Sedang Jalan", value: "ongoing" },
    { label: "Selesai", value: "completed" },
    { label: "Dibatalkan", value: "cancelled" },
  ];

  const cancelledByOptions = [
    { label: "Pelanggan", value: "customer" },
    { label: "Admin", value: "admin" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-midnight-indigo shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <ClipboardList size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Informasi Pesanan</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Detail utama mengenai perjalanan customer</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Kode Booking (Opsional)"
            placeholder="Otomatis jika dikosongkan"
            icon={Hash}
            value={formData.booking_code}
            onChange={(e) => setFormData({ ...formData, booking_code: e.target.value })}
          />

          <Select
            label="Pelanggan"
            options={customers}
            icon={UserIcon}
            value={formData.customer_id}
            onChange={(value) => setFormData({ ...formData, customer_id: value })}
            placeholder={fetchingData ? "Memuat..." : "Pilih pelanggan"}
            required
          />

          <Select
            label="Jenis Aktivitas"
            options={activities}
            icon={Activity}
            value={formData.activity_id}
            onChange={(value) => setFormData({ ...formData, activity_id: value })}
            placeholder={fetchingData ? "Memuat..." : "Pilih jenis aktivitas"}
            required
          />

          <Select
            label="Jenis Rute"
            options={routeTypes}
            icon={MapIcon}
            value={formData.route_type_id}
            onChange={(value) => setFormData({ ...formData, route_type_id: value })}
            placeholder={fetchingData ? "Memuat..." : "Pilih jenis rute"}
            required
          />

          <Input
            label="Tanggal Keberangkatan"
            type="date"
            icon={Calendar}
            value={formData.departure_date}
            onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
            required
          />

          <Input
            label="Tanggal Pulang (Opsional)"
            type="date"
            icon={Calendar}
            value={formData.return_date || ""}
            onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
          />

          <Input
            label="Titik Penjemputan"
            placeholder="Contoh: Padang"
            icon={MapPin}
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            required
          />

          <Input
            label="Rute Lengkap"
            placeholder="Contoh: Padang - Bukittinggi - Padang"
            icon={MapPin}
            value={formData.full_route || ""}
            onChange={(e) => setFormData({ ...formData, full_route: e.target.value })}
          />

          <Input
            label="Jumlah Penumpang"
            type="number"
            min="1"
            icon={Users}
            value={formData.passenger_count.toString()}
            onChange={(e) => setFormData({ ...formData, passenger_count: parseInt(e.target.value) })}
            required
          />

          <Input
            label="Jumlah Bus Diminta"
            type="number"
            min="1"
            icon={BusIcon}
            value={formData.bus_count_requested.toString()}
            onChange={(e) => setFormData({ ...formData, bus_count_requested: parseInt(e.target.value) })}
            required
          />

          <Select
            label="Status Pesanan"
            options={statusOptions}
            icon={Info}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as BookingStatus })}
            required
          />
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-platinum-tint/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
              <BusIcon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Penugasan Bus & Supir</h3>
              <p className="text-xs font-medium text-slate-blue opacity-70">Alokasikan unit dan kru untuk pesanan ini</p>
            </div>
          </div>
          <Button 
            type="button" 
            size="md" 
            variant="primary" 
            icon={Plus} 
            onClick={handleAddBus}
            className="rounded-xl font-semibold shadow-button"
          >
            Tambah Penugasan
          </Button>
        </div>

        {preferredBusesText && (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/60 text-amber-700">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Preferensi Armada Customer</p>
                <p className="text-xs text-amber-700 mt-1 font-semibold leading-relaxed">
                  Customer memesan unit spesifik: <span className="font-bold underline">{preferredBusesText}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAssignPreferredBuses}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-all cursor-pointer shadow-md shadow-amber-600/10 whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <Check size={13} strokeWidth={3} />
              Tugaskan Pilihan Customer
            </button>
          </div>
        )}

        {(!formData.buses || formData.buses.length === 0) ? (
          <div className="rounded-[24px] border border-dashed border-platinum-tint p-12 text-center text-slate-blue bg-cloud-mist/30 transition-all hover:bg-cloud-mist/50">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-platinum-tint/50">
                <BusIcon size={32} className="text-platinum-tint" />
              </div>
              <div>
                <p className="text-base font-semibold text-midnight-indigo">Belum ada armada yang ditugaskan.</p>
                <p className="text-sm font-medium opacity-60">Klik tombol di atas untuk menambah penugasan unit.</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddBus}
                className="text-sm font-bold text-action-blue hover:text-glacier-blue transition-colors uppercase tracking-widest mt-2 px-6 py-2 rounded-lg hover:bg-action-blue/5"
              >
                Tugaskan Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {formData.buses.map((bus, index) => (
              <div key={index} className="relative rounded-[24px] border border-platinum-tint bg-white p-8 shadow-sm transition-all hover:shadow-card hover:border-action-blue/20 group">
                <button 
                  type="button" 
                  onClick={() => handleRemoveBus(index)}
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white shadow-sm z-10"
                  title="Hapus Penugasan"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Select
                    label="Unit Bus"
                    options={availableBuses}
                    icon={BusIcon}
                    value={bus.bus_id}
                    onChange={(value) => handleBusChange(index, 'bus_id', value)}
                    placeholder="Pilih unit armada"
                    required
                  />
                  <Select
                    label="Pilih Supir"
                    options={availableDrivers}
                    icon={Contact}
                    value={bus.driver_id}
                    onChange={(value) => handleBusChange(index, 'driver_id', value)}
                    placeholder="Pilih kru supir"
                    required
                  />
                  <Input
                    label="Jumlah Kursi"
                    type="number"
                    min="1"
                    icon={Users}
                    value={bus.seat_count.toString()}
                    onChange={(e) => handleBusChange(index, 'seat_count', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="mt-6">
                  <Input
                    label="Catatan Penugasan"
                    placeholder="Contoh: Unit cadangan, permintaan spesifik kru..."
                    icon={StickyNote}
                    value={bus.assignment_notes || ""}
                    onChange={(e) => handleBusChange(index, 'assignment_notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {formData.status === 'cancelled' && (
        <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 border-b border-red-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm">
              <XCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700 tracking-tight">Detail Pembatalan</h3>
              <p className="text-xs font-medium text-red-600/70">Alasan dan pihak yang melakukan pembatalan</p>
            </div>
          </div>
          <div className="grid gap-6 rounded-[24px] border border-red-100 bg-red-50/20 p-8 md:grid-cols-2 shadow-sm">
            <Select
              label="Dibatalkan Oleh"
              options={cancelledByOptions}
              icon={XCircle}
              value={formData.cancelled_by || ""}
              onChange={(value) => setFormData({ ...formData, cancelled_by: value as CancelledBy })}
              required
            />
            <Input
              label="Alasan Pembatalan"
              placeholder="Berikan alasan yang jelas..."
              icon={StickyNote}
              value={formData.cancelled_reason || ""}
              onChange={(e) => setFormData({ ...formData, cancelled_reason: e.target.value })}
              required
            />
          </div>
        </section>
      )}

      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <StickyNote size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Catatan Tambahan</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Permintaan khusus atau detail lainnya</p>
          </div>
        </div>
        <Textarea
          label="Persyaratan Khusus"
          placeholder="Tuliskan permintaan khusus atau catatan lainnya di sini..."
          icon={StickyNote}
          value={formData.special_notes || ""}
          onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
        />
      </section>

      <DialogFooter className="mt-6 border-t border-platinum-tint/40 pt-8">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel} 
          className="px-10 font-semibold text-slate-blue hover:text-midnight-indigo transition-all"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="flex-1 font-semibold h-14 rounded-xl shadow-button" 
          loading={loading} 
          icon={Save}
        >
          {isEdit ? "Perbarui Pesanan" : "Simpan Pesanan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

