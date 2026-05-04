import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { activityTypeService } from '@/features/admin/activity-types/services/ActivityTypeService';
import { routeTypeService } from '@/features/admin/route-types/services/RouteTypeService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Section, Container } from '@/components/ui/PageComponents';
import FormField from '@/components/form/FormField';
import Textarea from '@/components/ui/Textarea';
import { ArrowLeft, Send } from 'lucide-react';
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
    <PublicLayout>
      <Section className="pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <button onClick={() => navigate('/customer/bookings')} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>

            <div className="mb-10 flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Form Permintaan <span className="text-orange-600">Booking</span>
              </h1>
              <p className="text-lg font-medium text-slate-500">
                Lengkapi detail perjalanan Anda untuk mendapatkan penawaran harga terbaik.
              </p>
            </div>

            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Section: Basic Info */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">1. Detail Perjalanan</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Tujuan Kegiatan</label>
                      <select 
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                        required
                        value={formData.activity_id}
                        onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
                      >
                        <option value="">-- Pilih Kegiatan --</option>
                        {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Tipe Rute</label>
                      <select 
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                        required
                        value={formData.route_type_id}
                        onChange={(e) => setFormData({ ...formData, route_type_id: e.target.value })}
                      >
                        <option value="">-- Pilih Rute --</option>
                        {routeTypes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>

                    <FormField label="Tanggal Keberangkatan" type="date" value={formData.departure_date} onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })} />
                    <FormField label="Tanggal Kepulangan" type="date" value={formData.return_date} onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} />
                  </div>
                </div>

                {/* Section: Route Info */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">2. Lokasi & Rute</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Titik Penjemputan" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} />
                    <FormField label="Rute Perjalanan (Kota)" value={formData.full_route} onChange={(e) => setFormData({ ...formData, full_route: e.target.value })} />
                  </div>
                </div>

                {/* Section: Capacity */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">3. Kapasitas & Armada</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Jumlah Penumpang" type="number" value={formData.passenger_count.toString()} onChange={(e) => setFormData({ ...formData, passenger_count: Number(e.target.value) })} />
                    <FormField label="Jumlah Bus (Opsional)" type="number" value={formData.bus_count_requested.toString()} onChange={(e) => setFormData({ ...formData, bus_count_requested: Number(e.target.value) })} />
                  </div>
                </div>

                {/* Section: Notes */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">4. Tambahan</h3>
                  <Textarea label="Catatan Khusus (Permintaan Fasilitas, dll)" value={formData.special_notes} onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })} />
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <Button type="submit" loading={loading} className="w-full h-14 text-lg" icon={Send}>
                    Kirim Permintaan Booking
                  </Button>
                  <p className="mt-4 text-center text-xs font-medium text-slate-400 leading-relaxed">
                    Dengan mengirim form ini, admin akan segera meninjau dan mengirimkan penawaran harga melalui dashboard Anda.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
