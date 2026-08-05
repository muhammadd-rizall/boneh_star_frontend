import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { publicService } from '@/features/public/shared/services/publicService';
import {
  ArrowLeft, ArrowRight, Compass, Bus as BusIcon, Users, FileText,
  Calendar, MapPin, AlertCircle, Shield, CheckCircle2,
  CircleDollarSign, Minus, Plus, Check, Info as InfoIcon,
  Sparkles, Activity, X
} from 'lucide-react';
import type { ActivityType, RouteType, BusCategory, Bus } from '@/types/Database';
import { useToastStore } from '@/store/useToastStore';
import { formatDateDMY, formatCurrency } from '@/utils/formatter';

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Detail & Rute',   icon: Compass },
  { id: 2, label: 'Pilih Armada',    icon: BusIcon },
  { id: 3, label: 'Konfirmasi & S&K', icon: CheckCircle2 },
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

  // Selection mode: manual bus selection vs admin recommendation
  const [isManualBusSelection, setIsManualBusSelection] = React.useState<boolean>(
    initialBusId ? true : false
  );


  // Terms and conditions agreement in step 3
  const [agreeTerms, setAgreeTerms] = React.useState<boolean>(false);

  // Category Filter for Step 2
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>('all');

  // Menjaga sinkronisasi: jika jumlah bus yang diminta diperkecil, kurangi pilihan bus dari belakang
  React.useEffect(() => {
    if (selectedBusIds.length > formData.bus_count_requested) {
      setSelectedBusIds(prev => prev.slice(0, formData.bus_count_requested));
    }
  }, [formData.bus_count_requested, selectedBusIds.length]);

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
      if (!formData.origin.trim()) {
        setError('Silakan masukkan lokasi keberangkatan.');
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
      const today = new Date().toISOString().split('T')[0];
      if (formData.departure_date < today) {
        setError('Tanggal berangkat tidak boleh di masa lalu. Silakan pilih tanggal yang akan datang.');
        return false;
      }
      if (formData.return_date && formData.return_date < formData.departure_date) {
        setError('Tanggal kembali tidak boleh sebelum tanggal berangkat. Silakan periksa kembali.');
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
    if (step === 2) {
      if (isManualBusSelection && selectedBusIds.length === 0) {
        setError('Silakan pilih minimal 1 armada, atau ubah pilihan ke "Gunakan Rekomendasi Admin".');
        return false;
      }
    }
    if (step === 3) {
      if (!agreeTerms) {
        setError('Anda harus menyetujui syarat & ketentuan sebelum mengirim permintaan.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSelectionModeChange = (manual: boolean) => {
    setIsManualBusSelection(manual);
    if (!manual) {
      setSelectedBusIds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    if (!validateStep(2)) return;
    if (!validateStep(3)) return;
    
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

  // Durasi perjalanan dalam hari — dipakai di estimasi harga dan kartu bus
  const tripDays = React.useMemo(() => {
    if (formData.departure_date && formData.return_date) {
      const dep = new Date(formData.departure_date);
      const ret = new Date(formData.return_date);
      if (!isNaN(dep.getTime()) && !isNaN(ret.getTime())) {
        const diffTime = Math.abs(ret.getTime() - dep.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return 1;
  }, [formData.departure_date, formData.return_date]);

  const estimatedPrice = React.useMemo(() => {
    // Hanya tampilkan estimasi saat armada sudah dipilih secara manual
    if (!isManualBusSelection || selectedBusIds.length === 0 || chosenBuses.length === 0) return null;

    const selectedRoute = routeTypes.find(r => r.id === formData.route_type_id);
    if (!selectedRoute) return null;

    const isInside = selectedRoute.scope === 'inside';
    const days = tripDays;

    // Hitung harga HANYA berdasarkan bus yang benar-benar dipilih
    const categories: BusCategory[] = [];
    chosenBuses.forEach(bus => {
      const cat = busCategories.find(c => c.id === bus.bus_category_id);
      if (cat) categories.push(cat);
    });

    if (categories.length === 0) return null;

    let minTotal = 0, maxTotal = 0, hasRange = false;
    categories.forEach(cat => {
      if (isInside) {
        const lo = cat.price_inside_min ?? 0;
        const hi = cat.price_inside_max ?? 0;
        minTotal += lo;
        maxTotal += hi;
        if (lo !== hi) hasRange = true;
      } else {
        const p = (cat.price_outside ?? 0) * days;
        minTotal += p;
        maxTotal += p;
      }
    });

    if (minTotal === 0 && maxTotal === 0) return null;
    return { minTotal, maxTotal, hasRange, days };
  }, [formData, isManualBusSelection, selectedBusIds, chosenBuses, busCategories, routeTypes, tripDays]);

  const adjustCount = (field: 'passenger_count' | 'bus_count_requested', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(1, prev[field] + delta),
    }));
  };

  const toggleBusSelection = (busId: string) => {
    setSelectedBusIds(prev => {
      const exists = prev.includes(busId);
      const next = exists ? prev.filter(id => id !== busId) : [...prev, busId];
      
      // Sinkronkan bus_count_requested HANYA saat ada bus yang dipilih
      // Jika semua bus di-deselect, pertahankan nilai yang sudah diisi user
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

  const maxBusCapacity = React.useMemo(() => {
    if (busCategories.length === 0) return 59; // fallback
    return Math.max(...busCategories.map(c => c.max_capacity));
  }, [busCategories]);

  const recommendationText = React.useMemo(() => {
    const pc = formData.passenger_count;
    if (pc <= 0 || busCategories.length === 0) return null;
    
    // Sort categories by capacity ascending
    const sortedCategories = [...busCategories].sort((a, b) => a.max_capacity - b.max_capacity);
    
    // Find first category that can fit all passengers in 1 unit
    const fitCategory = sortedCategories.find(cat => pc <= cat.max_capacity);
    
    if (fitCategory) {
      return {
        text: `Saran: 1 unit ${fitCategory.name} (~${fitCategory.max_capacity} kursi)`,
        count: 1
      };
    }
    
    // If no single category fits, use the largest category and calculate units needed
    const largestCategory = sortedCategories[sortedCategories.length - 1];
    if (largestCategory) {
      const units = Math.ceil(pc / largestCategory.max_capacity);
      return {
        text: `Saran: minimal ${units} unit ${largestCategory.name} (~${largestCategory.max_capacity} kursi)`,
        count: units
      };
    }
    
    return null;
  }, [formData.passenger_count, busCategories]);

  const totalSelectedSeats = React.useMemo(() => {
    return chosenBuses.reduce((acc, bus) => acc + (bus.seat_count || 0), 0);
  }, [chosenBuses]);

  const todayDate = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Auto-pilih bus dengan kombinasi optimal & proteksi browser freeze
  const autoSelectBuses = () => {
    if (buses.length === 0) return;

    const target = formData.passenger_count;
    const sortedBuses = [...buses].sort((a, b) => (b.seat_count || 0) - (a.seat_count || 0));

    // Jika jumlah armada tersedia sedikit (<= 12), gunakan backtracking untuk alokasi 100% optimal
    // Jika jumlah armada banyak (> 12), gunakan Greedy algorithm untuk mencegah browser tab membeku (freeze)
    if (sortedBuses.length <= 12) {
      let bestSubset: Bus[] = [];
      let bestCost = Infinity;
      const BUS_OVERHEAD_PENALTY = 15;

      const backtrack = (index: number, currentSubset: Bus[], currentSeats: number) => {
        if (currentSeats >= target) {
          const cost = currentSeats + (currentSubset.length * BUS_OVERHEAD_PENALTY);
          if (cost < bestCost) {
            bestCost = cost;
            bestSubset = [...currentSubset];
          } else if (cost === bestCost) {
            if (currentSubset.length < bestSubset.length) {
              bestSubset = [...currentSubset];
            }
          }
          return;
        }

        if (index >= sortedBuses.length) return;

        const currentMinCost = currentSeats + (currentSubset.length * BUS_OVERHEAD_PENALTY);
        if (currentMinCost >= bestCost) return;

        currentSubset.push(sortedBuses[index]);
        backtrack(index + 1, currentSubset, currentSeats + (sortedBuses[index].seat_count || 0));
        currentSubset.pop();

        backtrack(index + 1, currentSubset, currentSeats);
      };

      backtrack(0, [], 0);

      if (bestSubset.length > 0) {
        const selectedIds = bestSubset.map(b => b.id);
        setSelectedBusIds(selectedIds);
        setFormData(f => ({ ...f, bus_count_requested: selectedIds.length }));
        return;
      }
    }

    // Pendekatan Greedy (Safeguard untuk data besar > 12 bus)
    let remaining = target;
    const selectedIds: string[] = [];
    const pool = [...sortedBuses];

    while (remaining > 0 && pool.length > 0) {
      pool.sort((a, b) => (a.seat_count || 0) - (b.seat_count || 0));
      const fitIndex = pool.findIndex(bus => (bus.seat_count || 0) >= remaining);
      
      if (fitIndex !== -1) {
        const chosen = pool.splice(fitIndex, 1)[0];
        selectedIds.push(chosen.id);
        break;
      } else {
        const chosen = pool.pop()!;
        selectedIds.push(chosen.id);
        remaining -= (chosen.seat_count || 0);
      }
    }

    if (selectedIds.length === 0) {
      setSelectedBusIds([sortedBuses[0].id]);
      setFormData(f => ({ ...f, bus_count_requested: 1 }));
    } else {
      setSelectedBusIds(selectedIds);
      setFormData(f => ({ ...f, bus_count_requested: selectedIds.length }));
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-screen-xl mx-auto">

        {/* ── Page title ── */}
        <div className="mb-5">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-action-blue transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft size={13} />
            Kembali ke Pemesanan
          </button>
          <h1 className="text-2xl font-bold text-midnight-indigo">Buat Pemesanan</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Lengkapi informasi perjalanan Anda untuk memulai pemesanan.</p>
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
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`flex h-8 w-8 min-w-8 min-h-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-action-blue text-white shadow-sm' 
                        : isCompleted
                        ? 'bg-action-blue/15 text-action-blue'
                        : 'bg-cloud-mist text-slate-400 border border-slate-200'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={2.5} /> : step.id}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-action-blue' : isCompleted ? 'text-action-blue/80' : 'text-slate-500'}`}>
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
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-4 text-rose-700 border border-rose-200 shadow-md">
            <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800">Ada yang perlu diperbaiki</p>
              <p className="text-xs font-medium text-rose-700 mt-0.5 leading-relaxed">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer mt-0.5"
              aria-label="Tutup pesan error"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <form onSubmit={e => e.preventDefault()}>
          {/* ── Grid layout: form left, sidebar right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

            {/* ── Left: Form Step Contents ── */}
            <div className="flex flex-col gap-5 min-w-0">

              {/* STEP 1: DETAIL PERJALANAN & RUTE */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-bold text-midnight-indigo">Detail Perjalanan &amp; Rute</h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Tentukan rute, tanggal, dan kapasitas rombongan Anda.</p>
                  </div>

                  {/* Jenis Kegiatan */}
                  <FormGroup label="Jenis Kegiatan" required>
                    {activities.length === 0 ? (
                      <div className="h-10 animate-pulse bg-cloud-mist rounded-xl border border-pale-gray" />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activities.map(a => {
                          const isSelected = formData.activity_id === a.id;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, activity_id: a.id })}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue text-action-blue font-semibold shadow-sm'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 font-medium'
                              }`}
                            >
                              <Activity size={18} className={isSelected ? 'text-action-blue' : 'text-slate-400'} />
                              <span className="text-xs mt-1.5 block">{a.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </FormGroup>

                  {/* Tipe Rute */}
                  <FormGroup label="Tipe Rute" required>
                    {routeTypes.length === 0 ? (
                      <div className="h-14 animate-pulse bg-cloud-mist rounded-xl border border-pale-gray" />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {routeTypes.map(r => {
                          const isSelected = formData.route_type_id === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, route_type_id: r.id })}
                              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue text-action-blue font-semibold shadow-sm'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 font-medium'
                              }`}
                            >
                              <Compass size={18} className={`shrink-0 mt-0.5 ${isSelected ? 'text-action-blue' : 'text-slate-400'}`} />
                              <div>
                                <span className="text-xs font-bold block text-midnight-indigo">{r.name}</span>
                                <span className="text-xs font-normal text-slate-600 mt-0.5 block leading-relaxed">
                                  {r.scope === 'inside' 
                                    ? 'Rute seputar dalam area kota asal / tanpa menginap.'
                                    : 'Rute perjalanan ke luar daerah / luar kota / menginap.'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </FormGroup>

                  {/* Visual Timeline Rute */}
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-700 block">Rute Perjalanan</span>
                    
                    <div className="relative flex flex-col gap-4 pl-6 border-l border-dashed border-slate-300 ml-3">
                      {/* Keberangkatan */}
                      <div className="relative">
                        <div className="absolute -left-[30.5px] top-4.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10" />
                        <FormGroup label="Asal Keberangkatan" required>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              className={`${inputClass} pl-9`}
                              placeholder="Contoh: Padang, Bukittinggi, Payakumbuh"
                              value={formData.origin}
                              onChange={e => setFormData({ ...formData, origin: e.target.value })}
                              required
                            />
                          </div>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <InfoIcon size={11} className="text-slate-400 shrink-0" />
                            Tulis nama kota asal atau titik penjemputan utama rombongan Anda di Sumatera Barat.
                          </p>
                        </FormGroup>
                      </div>

                      {/* Tujuan */}
                      <div className="relative">
                        <div className="absolute -left-[30.5px] top-4.5 h-2.5 w-2.5 rounded-full bg-action-blue ring-4 ring-action-blue/10 z-10" />
                        <FormGroup label="Tujuan / Rute Perjalanan" required>
                          <div className="relative">
                            <Compass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              className={`${inputClass} pl-9`}
                              placeholder="Contoh: Padang → Bukittinggi → Jam Gadang"
                              value={formData.full_route}
                              onChange={e => setFormData({ ...formData, full_route: e.target.value })}
                              required
                            />
                          </div>
                          <div className="bg-action-blue/5 border border-action-blue/10 rounded-lg px-3 py-2 mt-1.5">
                            <p className="text-xs font-bold text-action-blue mb-1 flex items-center gap-1">
                              <InfoIcon size={11} className="shrink-0" />
                              Panduan Pengisian:
                            </p>
                            <ul className="text-xs text-slate-600 space-y-0.5 font-medium">
                              <li>• <strong>Kota saja:</strong> "Bukittinggi" atau "Solok"</li>
                              <li>• <strong>Beberapa lokasi:</strong> "Padang → Mandeh → Pariaman"</li>
                              <li>• <strong>Belum pasti:</strong> tulis tujuan utamanya, detail bisa dibahas dengan admin</li>
                            </ul>
                          </div>
                        </FormGroup>
                      </div>
                    </div>
                  </div>

                  {/* Tanggal Berangkat + Kembali */}
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormGroup label="Tanggal Berangkat" required>
                        <div className="relative min-h-[42px]">
                          <input
                            type="date"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                            value={formData.departure_date}
                            min={todayDate}
                            onChange={e => {
                              const newDep = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                departure_date: newDep,
                                // Reset tanggal kembali jika sekarang lebih awal dari tanggal berangkat baru
                                return_date: prev.return_date && prev.return_date < newDep ? '' : prev.return_date,
                              }));
                            }}
                            onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                            required
                          />
                          <div className="pointer-events-none w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-semibold text-gray-800 transition-all flex items-center min-h-[42px] peer-focus:border-action-blue peer-focus:ring-2 peer-focus:ring-action-blue/10 hover:border-slate-300">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <span className={formData.departure_date ? "text-gray-800" : "text-slate-400 font-normal"}>
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
                            min={formData.departure_date || todayDate}
                            onChange={e => setFormData({ ...formData, return_date: e.target.value })}
                            onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                          />
                          <div className="pointer-events-none w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-semibold text-gray-800 transition-all flex items-center min-h-[42px] peer-focus:border-action-blue peer-focus:ring-2 peer-focus:ring-action-blue/10 hover:border-slate-300">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <span className={formData.return_date ? "text-gray-800" : "text-slate-400 font-normal"}>
                              {formData.return_date ? formatDateDMY(formData.return_date) : "Pilih tanggal"}
                            </span>
                          </div>
                        </div>
                      </FormGroup>
                    </div>

                    {/* Duration badge */}
                    {formData.departure_date && formData.return_date && (
                      <div className="bg-action-blue/5 border border-action-blue/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-action-blue flex items-center gap-1.5 self-start shadow-sm">
                        <Calendar size={13} />
                        <span>Durasi sewa terhitung: <strong className="font-bold text-glacier-blue">{tripDays} Hari</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Jumlah Peserta + Jumlah Bus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormGroup label="Jumlah Rombongan (Peserta)" required>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustCount('passenger_count', -1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Minus size={14} className="text-slate-600" />
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
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Plus size={14} className="text-slate-600" />
                        </button>
                      </div>
                      {recommendationText && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData(f => ({ ...f, bus_count_requested: recommendationText.count }))}
                            className="text-xs text-action-blue hover:text-glacier-blue font-semibold flex items-center gap-1.5 bg-action-blue/5 border border-action-blue/10 px-2.5 py-1 rounded-xl transition-all cursor-pointer hover:bg-action-blue/10"
                            title="Klik untuk menerapkan jumlah bus yang disarankan"
                          >
                            <Sparkles size={11} className="shrink-0 text-action-blue" />
                            <span>{recommendationText.text}</span>
                            <span className="bg-action-blue text-white px-1.5 py-0.5 rounded-lg text-[9px] font-bold ml-1">Terapkan</span>
                          </button>
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup label="Kebutuhan Unit Bus" required>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustCount('bus_count_requested', -1)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Minus size={14} className="text-slate-600" />
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
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Plus size={14} className="text-slate-600" />
                        </button>
                      </div>
                      {formData.passenger_count > 0 && formData.bus_count_requested > 0 && (() => {
                        const avg = Math.ceil(formData.passenger_count / formData.bus_count_requested);
                        const isOverloaded = avg > maxBusCapacity;
                        return isOverloaded ? (
                          <div className="mt-1.5 p-2 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-700 flex items-start gap-1.5 animate-pulse">
                            <AlertCircle size={13} className="shrink-0 text-rose-500 mt-0.5" />
                            <p>
                              Rata-rata: {avg} orang / bus. (Jumlah unit bus kurang! Rata-rata melebihi kapasitas bus terbesar yang tersedia).
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600 mt-1.5 font-semibold flex items-center gap-1">
                            <Users size={11} className="shrink-0 text-slate-400" />
                            <span>Rata-rata: {avg} orang / bus (Kapasitas ideal).</span>
                          </p>
                        );
                      })()}
                    </FormGroup>
                  </div>

                  {/* Permintaan Khusus — always visible */}
                  <div className="border-t border-slate-200 pt-4 mt-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <FileText size={14} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">
                        Permintaan Khusus
                        <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                      </span>
                    </div>
                    <textarea
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-gray-800 placeholder:text-slate-400 focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all resize-none font-medium"
                      rows={3}
                      placeholder="Contoh: butuh AC double, ada kursi roda dalam rombongan, titik jemput di gang sempit, fasilitas karaoke, dll..."
                      value={formData.special_notes}
                      onChange={e => setFormData({ ...formData, special_notes: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                      <InfoIcon size={11} className="text-slate-400 shrink-0" />
                      Informasi ini membantu admin menyiapkan armada yang paling sesuai kebutuhan Anda.
                    </p>
                  </div>

                </div>
              )}

              {/* STEP 2: PILIH ARMADA (FLEET SELECTION) */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-bold text-midnight-indigo">Pilihan Armada Perjalanan</h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Pilih tipe penentuan armada bus yang Anda inginkan.
                    </p>
                  </div>

                  {/* Mode Selector Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Admin Recommendation */}
                    <div
                      onClick={() => handleSelectionModeChange(false)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex gap-3.5 relative overflow-hidden ${
                        !isManualBusSelection
                          ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        !isManualBusSelection ? 'bg-action-blue text-white' : 'bg-cloud-mist text-slate-400 border border-slate-200'
                      }`}>
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">Gunakan Rekomendasi Admin</h3>
                        <p className="text-xs font-normal text-slate-600 mt-1 leading-normal">
                          Praktis &amp; cepat. Admin kami akan menjadwalkan tipe bus terbaik sesuai kapasitas rombongan Anda.
                        </p>
                      </div>
                      {!isManualBusSelection && (
                        <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-action-blue text-white flex items-center justify-center shadow-md">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Manual Selection */}
                    <div
                      onClick={() => handleSelectionModeChange(true)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex gap-3.5 relative overflow-hidden ${
                        isManualBusSelection
                          ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isManualBusSelection ? 'bg-action-blue text-white' : 'bg-cloud-mist text-slate-400 border border-slate-200'
                      }`}>
                        <BusIcon size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">Pilih Armada Sendiri</h3>
                        <p className="text-xs font-normal text-slate-600 mt-1 leading-normal">
                          Bebas melihat foto unit bus, plat nomor, fasilitas, dan memilih armada spesifik dari katalog.
                        </p>
                      </div>
                      {isManualBusSelection && (
                        <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-action-blue text-white flex items-center justify-center shadow-md">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>

                  {!isManualBusSelection ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mt-1">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Opsi Rekomendasi Terpilih</p>
                        <p className="text-xs text-emerald-700 leading-relaxed mt-0.5 font-medium">
                          Anda tidak perlu pusing memilih unit bus. Kami akan otomatis mencarikan bus terbaik yang muat untuk rombongan <strong className="font-bold">{formData.passenger_count} orang</strong> Anda pada tanggal keberangkatan.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 animate-fadeIn">

                      {/* Smart Recommendation Card */}
                      <div className="bg-action-blue/5 border border-action-blue/15 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-action-blue flex items-center gap-1.5">
                              <Sparkles size={13} />
                              Panduan Kapasitas Armada
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 font-medium">
                              Rombongan Anda berjumlah <strong className="text-midnight-indigo">{formData.passenger_count} orang</strong>. Pilih bus yang kapasitasnya mencukupi.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={autoSelectBuses}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-action-blue text-white text-xs font-bold hover:bg-glacier-blue transition-all cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            <Sparkles size={11} />
                            Pilih Otomatis
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                          {busCategories.map((cat, idx) => {
                            const colors = [
                              { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
                              { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
                              { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                              { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                              { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
                            ];
                            const color = colors[idx % colors.length];
                            const capText = cat.min_capacity === cat.max_capacity
                              ? `± ${cat.min_capacity} kursi`
                              : `${cat.min_capacity} - ${cat.max_capacity} kursi`;

                            return (
                              <div key={cat.id} className={`border rounded-lg px-4 py-2.5 text-center flex-1 min-w-[130px] max-w-[180px] ${color.bg} ${color.border} ${color.text}`}>
                                <p className="font-bold text-xs">{cat.name}</p>
                                <p className="text-[10px] font-medium mt-0.5 opacity-80">{capText}</p>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <InfoIcon size={11} className="shrink-0 text-slate-400" />
                          Gunakan tombol <strong className="text-action-blue">"Pilih Otomatis"</strong> agar sistem memilihkan bus yang paling sesuai kapasitas rombongan Anda.
                        </p>
                      </div>

                      {/* Capacity Indicator Bar */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-bold text-midnight-indigo">
                          <span>Kapasitas Kursi Terpenuhi</span>
                          <span className={totalSelectedSeats >= formData.passenger_count ? "text-emerald-600" : "text-amber-500"}>
                            {totalSelectedSeats} / {formData.passenger_count} Kursi
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              totalSelectedSeats >= formData.passenger_count ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, (totalSelectedSeats / formData.passenger_count) * 100)}%` }}
                          />
                        </div>

                        {/* Capacity helpers */}
                        <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                          <InfoIcon size={12} className="shrink-0 text-slate-400" />
                          <span>
                            {totalSelectedSeats === 0 ? (
                              'Silakan pilih bus di bawah ini.'
                            ) : totalSelectedSeats < formData.passenger_count ? (
                              `Kapasitas masih kurang ${formData.passenger_count - totalSelectedSeats} kursi. Pilih unit tambahan.`
                            ) : (
                              'Kapasitas sudah terpenuhi secara ideal! ✅'
                            )}
                          </span>
                        </p>
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-200 pb-3">
                        <button
                          type="button"
                          onClick={() => setActiveCategoryFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeCategoryFilter === 'all'
                              ? 'bg-action-blue text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Semua Kategori
                        </button>
                        {busCategories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCategoryFilter(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              activeCategoryFilter === cat.id
                                ? 'bg-action-blue text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      {/* Buses Grid */}
                      {filteredBuses.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                          <BusIcon size={24} className="text-slate-400 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-semibold text-slate-500">Tidak ada armada yang tersedia.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredBuses.map(bus => {
                            const isSelected = selectedBusIds.includes(bus.id);
                            // Cek kecocokan kapasitas
                            const fitsPerfect = bus.seat_count >= formData.passenger_count && bus.seat_count - formData.passenger_count <= 15;
                            
                            return (
                              <div
                                key={bus.id}
                                onClick={() => toggleBusSelection(bus.id)}
                                className={`relative border rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-action-blue bg-action-blue/[0.02] ring-1 ring-action-blue shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                                }`}
                              >
                                {/* Selected Badge */}
                                {isSelected && (
                                  <div className="absolute top-3 right-3 z-10 h-5 w-5 rounded-full bg-action-blue text-white flex items-center justify-center shadow-md">
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                )}

                                {/* Bus Thumbnail */}
                                <div className="h-36 w-full bg-slate-50 border-b border-slate-200/50 relative overflow-hidden flex items-center justify-center">
                                  {(() => {
                                    const primaryImg = bus.images?.find(img => img.is_primary) || bus.images?.[0];
                                    return primaryImg ? (
                                      <img
                                        src={primaryImg.url}
                                        alt={bus.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <BusIcon size={32} className="text-slate-400 opacity-45" />
                                    );
                                  })()}
                                  <div className="absolute bottom-2 left-2 bg-gray-900/70 backdrop-blur-[2px] px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide">
                                    {bus.plat_number}
                                  </div>
                                </div>

                                {/* Bus Details */}
                                <div className="p-4 flex flex-col gap-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div>
                                      <span className="text-[10px] font-bold text-action-blue uppercase tracking-wider">
                                        {bus.category?.name || 'Armada'}
                                      </span>
                                      <h3 className="font-bold text-gray-900 text-xs mt-0.5">{bus.name}</h3>
                                    </div>
                                    {fitsPerfect && (
                                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                        <Sparkles size={8} />
                                        Muat Pas
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Users size={12} className="text-slate-400 shrink-0" />
                                      <span>{bus.seat_count} Kursi</span>
                                    </div>
                                    {bus.brand && (
                                      <div className="flex items-center gap-1">
                                        <BusIcon size={12} className="text-slate-400 shrink-0" />
                                        <span className="truncate">{bus.brand}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Facilities */}
                                  {bus.facilities && bus.facilities.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-200">
                                      {bus.facilities.slice(0, 3).map(fac => (
                                        <span
                                          key={fac.id}
                                          className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                                        >
                                          {fac.name}
                                        </span>
                                      ))}
                                      {bus.facilities.length > 3 && (
                                        <span className="text-[10px] font-medium text-slate-500 px-1 py-0.5">
                                          +{bus.facilities.length - 3} lainnya
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Harga Sewa */}
                                  {(() => {
                                    const cat = busCategories.find(c => c.id === bus.bus_category_id);
                                    if (!cat) return null;
                                    const isInside = selectedRoute?.scope === 'inside';
                                    if (isInside && cat.price_inside_min) {
                                      const lo = cat.price_inside_min;
                                      const hi = cat.price_inside_max;
                                      return (
                                        <div className="mt-2 pt-2 border-t border-slate-200">
                                          <p className="text-[10px] text-slate-500 font-medium">Harga Sewa</p>
                                          <p className="text-xs font-bold text-action-blue mt-0.5">
                                            {hi && hi !== lo
                                              ? `${formatCurrency(lo)} - ${formatCurrency(hi)}`
                                              : formatCurrency(lo)}
                                          </p>
                                        </div>
                                      );
                                    }
                                    if (!isInside && cat.price_outside) {
                                      const totalPerBus = cat.price_outside * tripDays;
                                      return (
                                        <div className="mt-2 pt-2 border-t border-slate-200">
                                          <p className="text-[10px] text-slate-500 font-medium">
                                            {tripDays > 1
                                              ? `Harga Sewa (${tripDays} hari)`
                                              : 'Harga Sewa / Hari'}
                                          </p>
                                          <p className="text-xs font-bold text-action-blue mt-0.5">
                                            {formatCurrency(totalPerBus)}
                                          </p>
                                          {tripDays > 1 && (
                                            <p className="text-[10px] text-slate-500 mt-0.5">
                                              {formatCurrency(cat.price_outside)} × {tripDays} hari
                                            </p>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: KONFIRMASI & S&K */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-bold text-midnight-indigo">Konfirmasi &amp; Ketentuan</h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Tinjau kembali data perjalanan Anda sebelum mengirim permintaan penawaran.</p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                    <div className="px-4 py-3 bg-slate-100/50 border-b border-slate-200">
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
                      <ConfItem 
                        label="Estimasi Harga" 
                        value={
                          !isManualBusSelection 
                            ? 'Admin akan mencarikan harga penawaran terbaik'
                            : estimatedPrice 
                              ? estimatedPrice.hasRange
                                ? `${formatCurrency(estimatedPrice.minTotal)} - ${formatCurrency(estimatedPrice.maxTotal)}`
                                : formatCurrency(estimatedPrice.minTotal)
                              : '—'
                        } 
                      />
                      
                      <div className="col-span-1 sm:col-span-2 pt-2.5 border-t border-slate-200">
                        <p className="font-semibold text-slate-700 mb-1">Armada Pilihan Anda</p>
                        <p className="text-slate-900 leading-relaxed font-bold">
                          {isManualBusSelection && chosenBuses.length > 0 
                            ? chosenBuses.map(b => `${b.name} (${b.plat_number})`).join(', ')
                            : 'Gunakan Rekomendasi Otomatis (Admin akan menjadwalkan unit terbaik)'}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 pt-2.5 border-t border-slate-200">
                        <p className="font-semibold text-slate-700 mb-1">Catatan Khusus</p>
                        <p className="text-slate-800 italic whitespace-pre-line leading-relaxed font-medium">
                          {formData.special_notes.trim() || 'Tidak ada catatan khusus.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Syarat & Ketentuan Sewa Bus */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/30 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 border-b border-slate-200 pb-2">
                      <InfoIcon size={15} className="text-action-blue shrink-0" />
                      <span>Ringkasan Syarat &amp; Ketentuan Sewa Bus</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Inclusions / Exclusions */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-sm">
                        <span className="font-bold text-action-blue">Fasilitas Tarif</span>
                        <p className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-700">✓ Termasuk:</strong> Bus, Driver, BBM.<br />
                          <strong className="text-rose-600">✕ Tidak Termasuk:</strong> Tol, Parkir, Tips Driver, Penyeberangan Ferry.
                        </p>
                      </div>

                      {/* DP & Pelunasan */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-sm">
                        <span className="font-bold text-action-blue">DP &amp; Pelunasan</span>
                        <p className="text-slate-700 leading-relaxed">
                          • DP Minimal <strong>30%</strong> setelah penawaran disetujui.<br />
                          • Sisa pelunasan <strong>70%</strong> maksimal <strong>H-3</strong> (Dalam Kota) atau <strong>H-7</strong> (Luar Kota).
                        </p>
                      </div>

                      {/* Kebijakan Pembatalan / Refund */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-sm">
                        <span className="font-bold text-action-blue">Kebijakan Refund</span>
                        <p className="text-slate-700 leading-relaxed">
                          • Pembatalan &ge; H-7: Refund <strong>100%</strong>.<br />
                          • Pembatalan H-6 s/d H-1: Refund <strong>50%</strong>.<br />
                          • Pembatalan Hari H: <strong>Hangus (0%)</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                    <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Sistem Pengiriman Aman</p>
                      <p className="text-xs text-emerald-700 leading-relaxed mt-0.5 font-medium">
                        Permintaan Anda akan langsung diteruskan ke admin Boneh Star. Admin akan mengirim penawaran harga terbaik dalam waktu kurang dari 24 jam.
                      </p>
                    </div>
                  </div>

                  {/* Persetujuan Checkbox */}
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={e => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-action-blue focus:ring-action-blue/20 cursor-pointer h-4.5 w-4.5 shrink-0"
                      />
                      <span className="text-xs font-semibold text-slate-700 leading-normal">
                        Saya menyetujui ringkasan Syarat &amp; Ketentuan sewa bus di atas dan menyatakan data rute perjalanan yang saya isi adalah benar.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Bottom action controls */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-pale-gray shadow-sm px-5 py-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Sebelumnya
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/customer/bookings')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Batalkan
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-action-blue text-white text-xs font-bold hover:bg-glacier-blue transition-all cursor-pointer shadow-md shadow-action-blue/20"
                  >
                    Selanjutnya
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !agreeTerms}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-action-blue text-white text-xs font-bold hover:bg-glacier-blue transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-action-blue/20"
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
                  <h3 className="text-xs font-bold text-midnight-indigo tracking-wide">Ringkasan Pemesanan</h3>
                  <div className="h-0.5 w-6 bg-action-blue mt-1 rounded-full" />
                </div>

                {/* Preferred Fleet header */}
                <div className="flex flex-col items-center justify-center py-5 px-4 bg-slate-50 border-b border-pale-gray text-center">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-sm">
                    <BusIcon size={18} className={isManualBusSelection && chosenBuses.length > 0 ? 'text-action-blue' : 'text-slate-400'} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {isManualBusSelection && chosenBuses.length > 0 
                      ? `${chosenBuses.length} Armada Terpilih` 
                      : 'Rekomendasi Otomatis'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-[200px] truncate font-medium">
                    {isManualBusSelection && chosenBuses.length > 0
                      ? chosenBuses.map(b => b.name).join(', ')
                      : 'Admin menjadwalkan tipe bus terbaik.'}
                  </p>
                </div>

                {/* Summary fields */}
                <div className="px-4 py-4 flex flex-col gap-3">
                  <SummaryRow icon={Compass}          label="Jenis Kegiatan"    value={selectedActivity?.name} />
                  <SummaryRow icon={Calendar}          label="Tanggal Berangkat" value={formData.departure_date ? formatDateDMY(formData.departure_date) : undefined} />
                  {selectedRoute && (
                    <SummaryRow icon={FileText}        label="Tipe Rute"         value={selectedRoute.name} />
                  )}
                  <SummaryRow icon={MapPin}            label="Tujuan / Rute"     value={formData.full_route} />
                  <SummaryRow icon={Users}             label="Jumlah Peserta"    value={formData.passenger_count ? `${formData.passenger_count} orang` : undefined} />
                  <SummaryRow icon={BusIcon}           label="Jumlah Bus"        value={formData.bus_count_requested ? `${formData.bus_count_requested} unit` : undefined} />
                  {isManualBusSelection && estimatedPrice && (
                    <SummaryRow
                      icon={CircleDollarSign}
                      label="Estimasi Harga"
                      value={
                        estimatedPrice.hasRange
                          ? `${formatCurrency(estimatedPrice.minTotal)} - ${formatCurrency(estimatedPrice.maxTotal)}`
                          : formatCurrency(estimatedPrice.minTotal)
                      }
                    />
                  )}
                </div>
              </div>

              {/* Aman & Terpercaya */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50 border border-emerald-200 shrink-0">
                    <Shield size={14} className="text-emerald-700" />
                  </div>
                  <p className="text-xs font-bold text-emerald-800">Aman &amp; Terpercaya</p>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed font-medium">
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
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-gray-800 placeholder:text-slate-400 focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all";

// ── FormGroup ─────────────────────────────────────────────────────────────────
function FormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── SummaryRow ────────────────────────────────────────────────────────────────
function SummaryRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs leading-tight">
      <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
        <Icon size={12} className="text-slate-400 shrink-0" />
        <span>{label}</span>
      </div>
      <span className={`font-semibold text-right break-words max-w-[120px] ${!value ? 'text-slate-400' : 'text-slate-800'}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

// ── ConfItem ──────────────────────────────────────────────────────────────────
function ConfItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="font-bold text-midnight-indigo">{value || '—'}</span>
    </div>
  );
}
