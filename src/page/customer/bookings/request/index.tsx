import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { activityTypeService } from '@/features/admin/activity-types/services/ActivityTypeService';
import { routeTypeService } from '@/features/admin/route-types/services/RouteTypeService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import FormField from '@/components/form/FormField';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Send, Compass, MapPin, Users, Info } from 'lucide-react';
import type { ActivityType, RouteType } from '@/types/Database';

export default function BookingRequestPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = React.useState<ActivityType[]>([]);
  const [routeTypes, setRouteTypes] = React.useState<RouteType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    activity_id: '',
    route_type_id: '',
    departure_date: '',
    return_date: '',
    origin: '',
    full_route: '',
    passenger_count: 1,
    bus_count_requested: 1,
    special_notes: '',
  });

  React.useEffect(() => {
    Promise.all([
      activityTypeService.getAll(),
      routeTypeService.getAll(),
    ]).then(([actData, routeData]) => {
      setActivities(actData.activityTypes);
      setRouteTypes(routeData.routeTypes);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await bookingService.create(formData as any);
      navigate(`/customer/bookings/${result.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <button 
        onClick={() => navigate('/customer/bookings')} 
        className="mb-8 group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-950 transition-colors"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Kembali
      </button>

      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl">
          Pesan <span className="text-orange-500">Perjalanan</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 max-w-2xl">
          Lengkapi formulir di bawah ini dengan detail perjalanan Anda. Tim kami akan segera meninjau dan mengirimkan penawaran harga terbaik.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <Card className="border-none shadow-2xl shadow-slate-100/60 p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            {/* Section: Basic Info */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Compass size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">1. Detail Rencana Kegiatan</h3>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Kegiatan</label>
                  <select 
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                    required
                    value={formData.activity_id}
                    onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
                  >
                    <option value="">Pilih Jenis Kegiatan</option>
                    {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Rute</label>
                  <select 
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                    required
                    value={formData.route_type_id}
                    onChange={(e) => setFormData({ ...formData, route_type_id: e.target.value })}
                  >
                    <option value="">Pilih Cakupan Rute</option>
                    {routeTypes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>

                <FormField label="Tanggal Keberangkatan" type="date" value={formData.departure_date} onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })} className="rounded-2xl border-slate-100" />
                <FormField label="Estimasi Tanggal Kembali" type="date" value={formData.return_date} onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} className="rounded-2xl border-slate-100" />
              </div>
            </div>

            {/* Section: Route Info */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">2. Lokasi & Destinasi</h3>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Titik Penjemputan Spesifik" placeholder="Contoh: Gedung Sate, Bandung" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="rounded-2xl border-slate-100" />
                <FormField label="Rute & Kota Tujuan" placeholder="Contoh: Bandung - Jakarta - Anyer" value={formData.full_route} onChange={(e) => setFormData({ ...formData, full_route: e.target.value })} className="rounded-2xl border-slate-100" />
              </div>
            </div>

            {/* Section: Capacity */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">3. Kapasitas Rombongan</h3>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Estimasi Jumlah Penumpang" type="number" value={formData.passenger_count.toString()} onChange={(e) => setFormData({ ...formData, passenger_count: Number(e.target.value) })} className="rounded-2xl border-slate-100" />
                <FormField label="Jumlah Unit Bus (Opsional)" type="number" placeholder="Bisa dikosongkan" value={formData.bus_count_requested.toString()} onChange={(e) => setFormData({ ...formData, bus_count_requested: Number(e.target.value) })} className="rounded-2xl border-slate-100" />
              </div>
            </div>

            {/* Section: Notes */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Info size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">4. Informasi Tambahan</h3>
              </div>
              <Textarea 
                label="Catatan Khusus (Opsional)" 
                placeholder="Misal: Permintaan fasilitas karaoke, kursi roda, atau rincian jadwal lainnya..."
                value={formData.special_notes} 
                onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })} 
                className="rounded-2xl border-slate-100 h-32"
              />
            </div>

            <div className="border-t border-slate-100 pt-10">
              <Button type="submit" loading={loading} className="w-full h-16 text-base font-black shadow-2xl shadow-orange-500/20" icon={Send}>
                Kirim Permintaan Penawaran
              </Button>
              <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Admin akan meninjau permintaan Anda dalam waktu maksimal 24 jam.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </CustomerLayout>
  );
}
