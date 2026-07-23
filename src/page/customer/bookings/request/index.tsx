import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { publicService } from '@/features/public/shared/services/publicService';
import {
  ArrowLeft, ArrowRight, Compass, Bus as BusIcon, Users, FileText,
  Calendar, MapPin, AlertCircle, Shield, CheckCircle2,
  CircleDollarSign, Minus, Plus, Check, Info as InfoIcon
} from 'lucide-react';
import type { ActivityType, RouteType, BusCategory, Bus } from '@/types/Database';
import { useToastStore } from '@/store/useToastStore';
import { formatDateDMY } from '@/utils/formatter';

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Detail Perjalanan',   icon: Compass },
  { id: 2, label: 'Pilih Armada',        icon: BusIcon },
  { id: 3, label: 'Informasi Tambahan',  icon: FileText },
  { id: 4, label: 'Konfirmasi',          icon: CheckCircle2 },
] as const;

export default function BookingRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialBusId = searchParams.get('bus_id');

  const { showSuccess, showError } = useToastStore();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [activities, setActivities] = React.useState<ActivityType[]>([]);
  const [routeTypes, setRouteTypes] = React.useState<RouteType[]>([]);
  const [busCategories, setBusCategories] = React.useState<BusCategory[]>([]);
  const [buses, setBuses] = React.useState<Bus[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    activity_id: '',
    route_type_id: '',
    departure_date: '',
    return_date: '',
    origin: '',
    full_route: '',
    passenger_count: 1,
    bus_count_requested: initialBusId ? 1 : 1,
    special_notes: '',
  });

  // Selected Bus IDs
  const [selectedBusIds, setSelectedBusIds] = React.useState<string[]>(
    initialBusId ? [initialBusId] : []
  );
  // Category Filter for Step 2
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>('all');

  React.useEffect(() => {
    Promise.all([
      publicService.getActivityTypes(),
      publicService.getRouteTypes(),
      publicService.getBusCategories(),
      publicService.getBuses(),
    ]).then(([actData, routeData, catData, busData]) => {
      setActivities(actData.filter(a => !a.deleted_at));
      setRouteTypes(routeData.filter(r => !r.deleted_at));
      setBusCategories(catData.filter(c => !c.deleted_at));
      // Only show available buses
      setBuses(busData.filter(b => !b.deleted_at && b.status === 'available'));
    }).catch(err => {
      console.error("Error fetching request page metadata: ", err);
    });
  }, []);

  // Form Validation per step
  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.activity_id) {
        setError('Silakan pilih jenis kegiatan.');
        return false;
      }
      if (!formData.route_type_id) {
        setError('Silakan pilih tipe rute.');
        return false;
      }
      if (!formData.full_route.trim()) {
        setError('Silakan masukkan tujuan / rute perjalanan.');
        return false;
      }
      if (!formData.departure_date) {
        setError('Silakan masukkan tanggal berangkat.');
        return false;
      }
      if (!formData.origin.trim()) {
        setError('Silakan masukkan lokasi keberangkatan.');
        return false;
      }
      if (formData.passenger_count <= 0) {
        setError('Jumlah peserta harus minimal 1 orang.');
        return false;
      }
      if (formData.bus_count_requested <= 0) {
        setError('Jumlah bus harus minimal 1 unit.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    
    setLoading(true);
    setError(null);
    try {
      const chosenBuses = buses.filter(b => selectedBusIds.includes(b.id));
      let notes = formData.special_notes;
      if (chosenBuses.length > 0) {
        const busNames = chosenBuses.map(b => `${b.name} (${b.plat_number})`).join(', ');
        notes = `[Armada Pilihan Customer: ${busNames}]\n${notes}`.trim();
      }

      // Sync the bus count requested with selected buses if selected
      const finalBusCount = chosenBuses.length > 0 ? chosenBuses.length : formData.bus_count_requested;

      const payload = {
        ...formData,
        bus_count_requested: finalBusCount,
        special_notes: notes,
      };

      const result = await bookingService.create(payload as any);
      showSuccess('Pemesanan berhasil dibuat');
      navigate(`/customer/bookings/${result.id}`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Gagal mengirim permintaan. Pastikan semua data terisi dengan benar.';
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const selectedActivity = activities.find(a => a.id === formData.activity_id);
  const selectedRoute = routeTypes.find(r => r.id === formData.route_type_id);
  const chosenBuses = buses.filter(b => selectedBusIds.includes(b.id));

  const adjustCount = (field: 'passenger_count' | 'bus_count_requested', delta: number) => {
    setFormData(prev => {
      const newVal = Math.max(1, prev[field] + delta);
      // If we adjust bus count, and we have selected buses, let the user know they are choosing buses manually
      if (field === 'bus_count_requested' && selectedBusIds.length > 0) {
        // Clear bus selection if they manually modify count to avoid mismatched selections
        setSelectedBusIds([]);
      }
      return {
        ...prev,
        [field]: newVal,
      };
    });
  };

  const toggleBusSelection = (busId: string) => {
    setSelectedBusIds(prev => {
      const exists = prev.includes(busId);
      const next = exists ? prev.filter(id => id !== busId) : [...prev, busId];
      
      // Auto-update bus count requested to match chosen buses count
      if (next.length > 0) {
        setFormData(f => ({ ...f, bus_count_requested: next.length }));
      }
      return next;
    });
  };

  const filteredBuses = buses.filter(bus => {
    if (activeCategoryFilter === 'all') return true;
    return bus.bus_category_id === activeCategoryFilter;
  });

  return (
    <CustomerLayout>
      <div className="max-w-screen-xl mx-auto">

        {/* ── Page title ── */}
        <div className="mb-5">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-blue hover:text-action-blue transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft size={13} />
            Kembali ke Pemesanan
          </button>
          <h1 className="text-2xl font-black text-gray-900">Buat Pemesanan</h1>
          <p className="text-sm text-slate-blue mt-0.5 font-medium">Lengkapi informasi perjalanan Anda untuk memulai pemesanan.</p>
        </div>

        {/* ── Step indicator ── */}
        <div className="bg-white rounded-2xl border border-pale-gray shadow-sm mb-5 px-5 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                      isActive 
                        ? 'bg-action-blue text-white shadow-sm' 
                        : isCompleted
                        ? 'bg-action-blue/10 text-action-blue'
                        : 'bg-cloud-mist text-steel-gray'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`text-xs font-bold hidden sm:block ${isActive ? 'text-action-blue' : isCompleted ? 'text-action-blue/80' : 'text-steel-gray'}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 mx-3 h-0.5 rounded transition-all ${isCompleted ? 'bg-action-blue/30' : 'bg-pale-gray'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-100">
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={e => e.preventDefault()}>
          {/* ── Grid layout: form left, sidebar right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

            {/* ── Left: Form Step Contents ── */}
            <div className="flex flex-col gap-5 min-w-0">

              {/* STEP 1: DETAIL PERJALANAN */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Detail Perjalanan</h2>
                    <p className="text-xs text-slate-blue mt-0.5">Tentukan rute, tanggal, dan kapasitas rombongan Anda.</p>
                  </div>

                  {/* Jenis Kegiatan + Tipe Rute */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormGroup label="Jenis Kegiatan" required>
                      <select
                        className={selectClass}
                        required
                        value={formData.activity_id}
                        onChange={e => setFormData({ ...formData, activity_id: e.target.value })}
                      >
                        <option value="">Pilih jenis kegiatan</option>
                        {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </FormGroup>

                    <FormGroup label="Tipe Rute" required>
                      <select
                        className={selectClass}
                        required
                        value={formData.route_type_id}
                        onChange={e => setFormData({ ...formData, route_type_id: e.target.value })}
                      >
                        <option value="">Pilih tipe rute</option>
                        {routeTypes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </FormGroup>
                  </div>

                  {/* Tujuan / Rute */}
                  <FormGroup label="Tujuan / Rute Perjalanan" required>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-gray pointer-events-none" />
                      <input
                        type="text"
                        className={`${inputClass} pl-9`}
                        placeholder="Masukkan tujuan atau rute perjalanan"
                        value={formData.full_route}
                        onChange={e => setFormData({ ...formData, full_route: e.target.value })}
                        required
                      />
                    </div>
                  </FormGroup>

                  {/* Tanggal Berangkat + Kembali */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormGroup label="Tanggal Berangkat" required>
                      <div className="relative min-h-[42px]">
                        <input
                          type="date"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                          value={formData.departure_date}
                          onChange={e => setFormData({ ...formData, departure_date: e.target.value })}
                          onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                          required
                        />
                        <div className="pointer-events-none w-full rounded-xl border border-pale-gray bg-white py-2.5 pl-9 pr-4 text-xs font-bold text-gray-800 transition-all flex items-center min-h-[42px] peer-focus:border-action-blue peer-focus:ring-2 peer-focus:ring-action-blue/10 hover:border-slate-300">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-gray" />
                          <span className={formData.departure_date ? "text-gray-800" : "text-gray-400 font-normal"}>
                            {formData.departure_date ? formatDateDMY(formData.departure_date) : "Pilih tanggal"}
                          </span>
                        </div>
                      </div>
                    </FormGroup>

                    <FormGroup label="Tanggal Kembali (Opsional)">
                      <div className="relative min-h-[42px]">
                        <input
                          type="date"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                          value={formData.return_date}
                          onChange={e => setFormData({ ...formData, return_date: e.target.value })}
                          onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                        />
                        <div className="pointer-events-none w-full rounded-xl border border-pale-gray bg-white py-2.5 pl-9 pr-4 text-xs font-bold text-gray-800 transition-all flex items-center min-h-[42px] peer-focus:border-action-blue peer-focus:ring-2 peer-focus:ring-action-blue/10 hover:border-slate-300">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-gray" />
                          <span className={formData.return_date ? "text-gray-800" : "text-gray-400 font-normal"}>
                            {formData.return_date ? formatDateDMY(formData.return_date) : "Pilih tanggal"}
                          </span>
                        </div>
                      </div>
                    </FormGroup>
                  </div>

                  {/* Keberangkatan */}
                  <FormGroup label="Keberangkatan" required>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-gray pointer-events-none" />
                      <input
                        type="text"
                        className={`${inputClass} pl-9`}
                        placeholder="Masukkan lokasi keberangkatan"
                        value={formData.origin}
                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                        required
                      />
                    </div>
                  </FormGroup>

                  {/* Jumlah Peserta + Jumlah Bus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormGroup label="Jumlah Peserta" required>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustCount('passenger_count', -1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pale-gray bg-cloud-mist hover:bg-pale-gray transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          className={`${inputClass} text-center flex-1`}
                          value={formData.passenger_count}
                          onChange={e => setFormData({ ...formData, passenger_count: Math.max(1, Number(e.target.value)) })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => adjustCount('passenger_count', 1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pale-gray bg-cloud-mist hover:bg-pale-gray transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-blue mt-1">
                        <Users size={10} className="inline mr-1" />
                        Membantu merekomendasikan kapasitas armada yang tepat.
                      </p>
                    </FormGroup>

                    <FormGroup label="Jumlah Bus" required>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustCount('bus_count_requested', -1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pale-gray bg-cloud-mist hover:bg-pale-gray transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          className={`${inputClass} text-center flex-1`}
                          value={formData.bus_count_requested}
                          onChange={e => setFormData({ ...formData, bus_count_requested: Math.max(1, Number(e.target.value)) })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => adjustCount('bus_count_requested', 1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pale-gray bg-cloud-mist hover:bg-pale-gray transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {formData.passenger_count > 0 && formData.bus_count_requested > 0 && (
                        <p className="text-[11px] text-slate-blue mt-1 font-medium">
                          <BusIcon size={10} className="inline mr-1" />
                          Rata-rata: {Math.ceil(formData.passenger_count / formData.bus_count_requested)} penumpang / bus
                        </p>
                      )}
                    </FormGroup>
                  </div>
                </div>
              )}

              {/* STEP 2: PILIH ARMADA (CUSTOMER CHOOSES ACTUAL BUSES) */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Pilih Armada Perjalanan</h2>
                    <p className="text-xs text-slate-blue mt-0.5">
                      Pilih unit armada bus yang Anda inginkan. Anda dapat memilih beberapa unit secara langsung.
                    </p>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-action-blue/5 rounded-2xl p-4 border border-action-blue/10 flex items-start gap-3">
                    <InfoIcon size={16} className="text-action-blue shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-blue leading-relaxed">
                      Pilihan armada spesifik di bawah ini bersifat opsional. Jika Anda tidak memilih unit tertentu, admin kami akan otomatis merekomendasikan dan menjadwalkan armada terbaik sesuai dengan rute Anda.
                    </p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'all'
                          ? 'bg-action-blue text-white shadow-sm'
                          : 'bg-cloud-mist text-steel-gray hover:bg-pale-gray'
                      }`}
                    >
                      Semua Armada
                    </button>
                    {busCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeCategoryFilter === cat.id
                            ? 'bg-action-blue text-white shadow-sm'
                            : 'bg-cloud-mist text-steel-gray hover:bg-pale-gray'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Buses Grid */}
                  {filteredBuses.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-pale-gray rounded-2xl bg-cloud-mist/20">
                      <BusIcon size={24} className="text-steel-gray mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-slate-blue">Tidak ada armada yang tersedia untuk kategori ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredBuses.map(bus => {
                        const isSelected = selectedBusIds.includes(bus.id);
                        return (
                          <div
                            key={bus.id}
                            onClick={() => toggleBusSelection(bus.id)}
                            className={`relative border rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue shadow-sm'
                                : 'border-pale-gray hover:border-steel-gray bg-white'
                            }`}
                          >
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-3 right-3 z-10 h-5 w-5 rounded-full bg-action-blue text-white flex items-center justify-center shadow-md">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}

                            {/* Bus Thumbnail */}
                            <div className="h-36 w-full bg-cloud-mist border-b border-pale-gray/50 relative overflow-hidden flex items-center justify-center">
                              {bus.images && bus.images.length > 0 ? (
                                <img
                                  src={bus.images[0].url}
                                  alt={bus.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <BusIcon size={32} className="text-steel-gray opacity-45" />
                              )}
                              <div className="absolute bottom-2 left-2 bg-gray-900/70 backdrop-blur-[2px] px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide">
                                {bus.plat_number}
                              </div>
                            </div>

                            {/* Bus Details */}
                            <div className="p-4 flex flex-col gap-2">
                              <div>
                                <span className="text-[10px] font-bold text-action-blue uppercase tracking-wider">
                                  {bus.category?.name || 'Armada'}
                                </span>
                                <h3 className="font-black text-gray-900 text-sm mt-0.5">{bus.name}</h3>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-blue mt-1">
                                <div className="flex items-center gap-1">
                                  <Users size={12} className="text-steel-gray shrink-0" />
                                  <span>{bus.seat_count} Kursi</span>
                                </div>
                                {bus.brand && (
                                  <div className="flex items-center gap-1">
                                    <BusIcon size={12} className="text-steel-gray shrink-0" />
                                    <span className="truncate">{bus.brand}</span>
                                  </div>
                                )}
                              </div>

                              {/* Facilities */}
                              {bus.facilities && bus.facilities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-pale-gray/50">
                                  {bus.facilities.slice(0, 3).map(fac => (
                                    <span
                                      key={fac.id}
                                      className="bg-cloud-mist border border-pale-gray text-slate-blue text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                                    >
                                      {fac.name}
                                    </span>
                                  ))}
                                  {bus.facilities.length > 3 && (
                                    <span className="text-[9px] font-bold text-steel-gray px-1 py-0.5">
                                      +{bus.facilities.length - 3} lainnya
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: INFORMASI TAMBAHAN */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Informasi Tambahan</h2>
                    <p className="text-xs text-slate-blue mt-0.5">Tambahkan catatan khusus untuk menunjang kenyamanan rombongan Anda.</p>
                  </div>

                  <FormGroup label="Catatan Khusus (Opsional)">
                    <textarea
                      className="w-full rounded-xl border border-pale-gray bg-cloud-mist px-4 py-3 text-sm text-gray-800 placeholder:text-steel-gray focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all resize-none"
                      rows={5}
                      placeholder="Contoh: Permintaan fasilitas khusus (karaoke, charger HP), instruksi titik penjemputan detail, atau rincian jadwal lainnya..."
                      value={formData.special_notes}
                      onChange={e => setFormData({ ...formData, special_notes: e.target.value })}
                    />
                  </FormGroup>
                </div>
              )}

              {/* STEP 4: KONFIRMASI */}
              {currentStep === 4 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Konfirmasi Permintaan</h2>
                    <p className="text-xs text-slate-blue mt-0.5">Tinjau kembali data perjalanan Anda sebelum mengirim permintaan penawaran.</p>
                  </div>

                  <div className="border border-pale-gray rounded-2xl overflow-hidden bg-cloud-mist/30">
                    <div className="px-4 py-3 bg-cloud-mist border-b border-pale-gray">
                      <p className="text-xs font-bold text-gray-900">Ringkasan Data Pemesanan</p>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                      <ConfItem label="Jenis Kegiatan" value={selectedActivity?.name} />
                      <ConfItem label="Tipe Rute" value={selectedRoute?.name} />
                      <ConfItem label="Tujuan / Rute" value={formData.full_route} />
                      <ConfItem label="Keberangkatan" value={formData.origin} />
                      <ConfItem label="Tanggal Berangkat" value={formData.departure_date ? formatDateDMY(formData.departure_date) : ''} />
                      <ConfItem label="Tanggal Kembali" value={formData.return_date ? formatDateDMY(formData.return_date) : '—'} />
                      <ConfItem label="Jumlah Peserta" value={`${formData.passenger_count} Orang`} />
                      <ConfItem label="Jumlah Bus" value={`${formData.bus_count_requested} Unit`} />
                      
                      <div className="col-span-1 sm:col-span-2 pt-2 border-t border-pale-gray/60">
                        <p className="font-bold text-gray-700 mb-1">Armada Pilihan Anda</p>
                        <p className="text-slate-blue leading-relaxed font-semibold">
                          {chosenBuses.length > 0 
                            ? chosenBuses.map(b => `${b.name} (${b.plat_number})`).join(', ')
                            : 'Belum memilih armada spesifik (Admin akan merekomendasikan unit terbaik)'}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 pt-2 border-t border-pale-gray/60">
                        <p className="font-bold text-gray-700 mb-1">Catatan Khusus</p>
                        <p className="text-slate-blue italic whitespace-pre-line leading-relaxed">
                          {formData.special_notes.trim() || 'Tidak ada catatan khusus.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Syarat & Ketentuan Sewa Bus */}
                  <div className="border border-pale-gray rounded-2xl p-4 bg-cloud-mist/20 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 border-b border-pale-gray pb-2">
                      <InfoIcon size={15} className="text-action-blue shrink-0" />
                      <span>Ringkasan Syarat &amp; Ketentuan Sewa Bus</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                      {/* Inclusions / Exclusions */}
                      <div className="bg-white p-3 rounded-xl border border-pale-gray flex flex-col gap-1">
                        <span className="font-bold text-action-blue">Fasilitas Tarif</span>
                        <p className="text-gray-700 leading-tight">
                          <strong className="text-emerald-600">✓ Sudah termasuk:</strong> Bus, Driver &amp; BBM.<br />
                          <strong className="text-rose-500">✕ Belum termasuk:</strong> Tol, Parkir, Tiket Wisata/Ferry &amp; Tips Driver.
                        </p>
                      </div>

                      {/* DP & Pelunasan */}
                      <div className="bg-white p-3 rounded-xl border border-pale-gray flex flex-col gap-1">
                        <span className="font-bold text-action-blue">Ketentuan DP &amp; Pelunasan</span>
                        <p className="text-gray-700 leading-tight">
                          • DP Min. <strong>30%</strong> dari total sewa disetujui.<br />
                          • Pelunasan sisa <strong>70%</strong> maksimal <strong>H-3</strong> sebelum keberangkatan.
                        </p>
                      </div>

                      {/* Kebijakan Pembatalan / Refund */}
                      <div className="bg-white p-3 rounded-xl border border-pale-gray flex flex-col gap-1">
                        <span className="font-bold text-action-blue">Kebijakan Pembatalan / Refund</span>
                        <p className="text-gray-700 leading-tight">
                          • Pembatalan &ge; H-7: Refund <strong>50% DP</strong>.<br />
                          • Pembatalan H-3 s/d H-6: DP <strong>hangus (0%)</strong>.<br />
                          • Reschedule gratis jika diajukan &ge; H-7.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                    <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Sistem Pengiriman Aman</p>
                      <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                        Permintaan Anda akan langsung diteruskan ke sistem admin Boneh Star. Admin kami akan mengirimkan penawaran harga terbaik dalam waktu kurang dari 24 jam.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom action controls */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-pale-gray shadow-sm px-5 py-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-pale-gray text-sm font-semibold text-slate-blue hover:border-steel-gray hover:text-gray-800 transition-all cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Sebelumnya
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/customer/bookings')}
                    className="px-5 py-2.5 rounded-xl border border-pale-gray text-sm font-semibold text-slate-blue hover:border-steel-gray hover:text-gray-800 transition-all cursor-pointer"
                  >
                    Batalkan
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-action-blue text-white text-sm font-bold hover:bg-glacier-blue transition-all cursor-pointer shadow-md shadow-action-blue/20"
                  >
                    Selanjutnya
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-action-blue text-white text-sm font-bold hover:bg-glacier-blue transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-action-blue/20"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Permintaan
                        <CheckCircle2 size={15} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

            {/* ── Right: Summary sidebar ── */}
            <div className="flex flex-col gap-4 w-full shrink-0 lg:sticky lg:top-28">

              {/* Ringkasan Pemesanan */}
              <div className="bg-white rounded-2xl border border-pale-gray shadow-sm overflow-hidden w-full">
                <div className="px-4 py-3 border-b border-pale-gray">
                  <h3 className="text-xs font-bold text-gray-900 tracking-wide">Ringkasan Pemesanan</h3>
                  <div className="h-0.5 w-6 bg-action-blue mt-1 rounded-full" />
                </div>

                {/* Preferred Fleet header */}
                <div className="flex flex-col items-center justify-center py-5 px-4 bg-cloud-mist border-b border-pale-gray text-center">
                  <div className="h-10 w-10 rounded-xl bg-white border border-pale-gray flex items-center justify-center mb-1.5 shadow-sm">
                    <BusIcon size={18} className={chosenBuses.length > 0 ? 'text-action-blue' : 'text-steel-gray'} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {chosenBuses.length > 0 
                      ? `${chosenBuses.length} Armada Terpilih` 
                      : 'Belum memilih armada'}
                  </p>
                  <p className="text-[10px] text-slate-blue mt-0.5 leading-relaxed max-w-[200px] truncate">
                    {chosenBuses.length > 0
                      ? chosenBuses.map(b => b.name).join(', ')
                      : 'Lengkapi data perjalanan untuk rekomendasi armada.'}
                  </p>
                </div>

                {/* Summary fields */}
                <div className="px-4 py-4 flex flex-col gap-3">
                  <SummaryRow icon={Compass}          label="Jenis Kegiatan"    value={selectedActivity?.name} />
                  <SummaryRow icon={Calendar}          label="Tanggal Berangkat" value={formData.departure_date ? formatDateDMY(formData.departure_date) : undefined} />
                  <SummaryRow icon={MapPin}            label="Tujuan / Rute"     value={formData.full_route} />
                  <SummaryRow icon={Users}             label="Jumlah Peserta"    value={formData.passenger_count ? `${formData.passenger_count} orang` : undefined} />
                  <SummaryRow icon={BusIcon}           label="Jumlah Bus"        value={formData.bus_count_requested ? `${formData.bus_count_requested} unit` : undefined} />
                  <SummaryRow icon={CircleDollarSign}  label="Estimasi Harga"    value={undefined} />
                  {selectedRoute && (
                    <SummaryRow icon={FileText}        label="Tipe Rute"         value={selectedRoute.name} />
                  )}
                </div>
              </div>

              {/* Aman & Terpercaya */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
                    <Shield size={14} className="text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-emerald-800">Aman &amp; Terpercaya</p>
                </div>
                <p className="text-[10px] text-emerald-700 leading-relaxed">
                  Data perjalanan dan privasi Anda terjamin aman di platform kami.
                </p>
              </div>

            </div>

          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-pale-gray bg-cloud-mist px-4 py-2.5 text-sm text-gray-800 placeholder:text-steel-gray focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all";
const selectClass = "w-full rounded-xl border border-pale-gray bg-cloud-mist px-4 py-2.5 text-sm text-gray-800 focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all appearance-none cursor-pointer";

// ── FormGroup ─────────────────────────────────────────────────────────────────
function FormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── SummaryRow ────────────────────────────────────────────────────────────────
function SummaryRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[11px] leading-tight">
      <div className="flex items-center gap-1.5 text-slate-blue shrink-0">
        <Icon size={12} className="text-steel-gray shrink-0" />
        <span>{label}</span>
      </div>
      <span className={`font-semibold text-right break-words max-w-[120px] ${!value ? 'text-steel-gray' : 'text-gray-900'}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

// ── ConfItem ──────────────────────────────────────────────────────────────────
function ConfItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-steel-gray uppercase tracking-wider">{label}</span>
      <span className="font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );
}
