import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { historyService } from '@/features/customer/bookings/services/HistoryService';
import BookingTimeline from '@/features/customer/bookings/components/BookingTimeline';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Section, Container } from '@/components/ui/PageComponents';
import { ArrowLeft, FileDown, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await historyService.getDetail(id!);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail riwayat');
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadInvoice = async () => {
    const blob = await historyService.downloadInvoice(id!);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${data.booking.booking_code}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><Loader /></div></PublicLayout>;
  if (error || !data) return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><ErrorState message={error || 'Detail tidak ditemukan'} onRetry={fetchData} /></div></PublicLayout>;

  return (
    <PublicLayout>
      <Section className="pt-32 pb-20">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={() => navigate('/customer/bookings')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Kembali ke Riwayat
            </button>
            <Button variant="outline" size="sm" icon={FileDown} onClick={handleDownloadInvoice}>
              Download Invoice
            </Button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-8">
              <Card>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900">#{data.booking.booking_code}</h1>
                      <p className="text-sm font-medium text-slate-500">Pemesanan dibuat pada {formatDate(data.booking.created_at)}</p>
                    </div>
                    <BookingStatusBadge status={data.booking.status} />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Calendar size={18} /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jadwal</p>
                        <p className="text-sm font-bold text-slate-700">{formatDate(data.booking.departure_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><MapPin size={18} /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rute</p>
                        <p className="text-sm font-bold text-slate-700">{data.booking.origin} - {data.booking.full_route}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="mb-8 text-sm font-bold uppercase tracking-wider text-slate-400">Timeline Perjalanan</h3>
                <BookingTimeline timeline={data.timeline} />
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
