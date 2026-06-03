import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { historyService } from '@/features/customer/bookings/services/HistoryService';
import BookingTimeline from '@/features/customer/bookings/components/BookingTimeline';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
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

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      </CustomerLayout>
    );
  }

  if (error || !data) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <ErrorState message={error || 'Detail tidak ditemukan'} onRetry={fetchData} />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button 
          onClick={() => navigate('/customer/bookings')} 
          className="group flex items-center gap-2 text-sm font-bold text-slate-blue hover:text-midnight-indigo transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
          Kembali ke Riwayat
        </button>
        <Button 
          variant="outline" 
          size="sm" 
          icon={FileDown} 
          onClick={handleDownloadInvoice}
          className="rounded-xl font-bold border-platinum-tint hover:bg-cloud-mist text-slate-blue hover:text-midnight-indigo"
        >
          Download Invoice
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <Card className="border border-platinum-tint shadow-sm rounded-[16px]">
          <div className="flex flex-col gap-8 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-midnight-indigo">#{data.booking.booking_code}</h1>
                <p className="text-sm font-semibold text-slate-blue/70 mt-1">Dibuat pada {formatDate(data.booking.created_at)}</p>
              </div>
              <BookingStatusBadge status={data.booking.status} />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 border-t border-platinum-tint/50 pt-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-slate-blue">
                  <Calendar size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 mb-0.5">Jadwal Perjalanan</p>
                  <p className="text-sm font-bold text-midnight-indigo">{formatDate(data.booking.departure_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-slate-blue">
                  <MapPin size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 mb-0.5">Rute Perjalanan</p>
                  <p className="text-sm font-bold text-midnight-indigo">{data.booking.origin} • {data.booking.full_route}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Timeline & Status Perjalanan</h3>
          <Card className="border border-platinum-tint shadow-sm p-8 sm:p-12 rounded-[16px]">
            <BookingTimeline timeline={data.timeline} />
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
