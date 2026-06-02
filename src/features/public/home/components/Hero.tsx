import { usePublicCompanyProfile } from '@/features/admin/company-profile/hooks/usePublicCompanyProfile';
import { Bus as BusIcon, Calendar, Users, ArrowRight, Play, CheckCircle2, XCircle, ChevronDown, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { BusCategory } from '@/features/admin/bus-categories/types/BusCategory';
import { cn } from '@/lib/utils';

interface HeroProps {
  categories: BusCategory[];
  allBuses: Bus[];
  onSearch: (results: Bus[]) => void;
}

export default function Hero({ categories, allBuses, onSearch }: HeroProps) {
  const { profile } = usePublicCompanyProfile();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: Bus[]; message: string; isSuggestion?: boolean } | null>(null);
  const [formData, setFormData] = useState({
    jenisBus: '',
    departureDate: '',
    returnDate: '',
    penumpang: ''
  });

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const availableBuses = allBuses.filter(b => b.status === 'available');
    const passengerCount = parseInt(formData.penumpang, 10);
    const hasPassengerFilter = !isNaN(passengerCount) && passengerCount > 0;
    let filtered = [...availableBuses];
    let message = '';
    let isSuggestion = false;
    
    if (hasPassengerFilter) {
      const canFit = availableBuses.filter(b => b.seat_count >= passengerCount);
      if (canFit.length > 0) {
        if (formData.jenisBus) {
          const categoryMatch = canFit.filter(b => b.category?.name === formData.jenisBus);
          if (categoryMatch.length > 0) {
            filtered = categoryMatch;
            message = filtered.length + ' unit armada ' + formData.jenisBus + ' tersedia!';
          } else {
            filtered = canFit.sort((a, b) => a.seat_count - b.seat_count).slice(0, 4);
            message = 'Tipe ' + formData.jenisBus + ' tidak cukup. Kami sarankan armada berikut.';
            isSuggestion = true;
          }
        } else {
          filtered = canFit;
          message = 'Ditemukan ' + filtered.length + ' armada yang sesuai.';
        }
      } else {
        filtered = availableBuses.sort((a, b) => b.seat_count - a.seat_count).slice(0, 3);
        message = 'Kapasitas grup melebihi unit tunggal. Perlu lebih dari satu armada.';
        isSuggestion = true;
      }
    } else if (formData.jenisBus) {
      filtered = availableBuses.filter(b => b.category?.name === formData.jenisBus);
      message = 'Menampilkan armada tipe ' + formData.jenisBus + '.';
    } else {
      message = 'Menampilkan armada yang siap untuk Anda.';
    }
    
    setResult({ available: filtered, message, isSuggestion });
    onSearch(filtered);
    setChecking(false);
    
    if (filtered.length > 0) {
      setTimeout(() => {
        document.getElementById('armada')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  };

  return (
    <section className='relative min-h-[95vh] w-full overflow-hidden flex flex-col bg-white pt-40 pb-28'>
      {/* Background Abstract Shapes */}
      <div className='absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-lavender-glow/5 rounded-full blur-[120px] animate-in fade-in duration-1000' />
      <div className='absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[700px] h-[700px] bg-skybound-blue/5 rounded-full blur-[120px] animate-in fade-in duration-1000' />

      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-10 inline-flex items-center gap-2 rounded-full bg-cloud-mist border border-platinum-tint px-5 py-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm'>
            <span className='flex h-2 w-2 rounded-full bg-action-blue shadow-[0_0_10px_rgba(0,107,255,0.6)] animate-pulse' />
            <span className='text-[12px] font-bold tracking-[0.2em] text-midnight-indigo uppercase'>Premium Charter Service</span>
          </div>
          
          <h1 className='text-display md:text-display-lg font-bold tracking-tight text-midnight-indigo leading-[1.05] mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
            Easy scheduling for your <br />
            <span className='text-action-blue'>Premium Journey.</span>
          </h1>
          
          <p className='mt-10 max-w-2xl mx-auto text-subheading font-medium leading-relaxed text-slate-blue animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
            {profile.description || 'Solusi transportasi rombongan terbaik dengan armada modern dan layanan profesional untuk kenyamanan maksimal Anda.'}
          </p>
          
          <div className='mt-14 flex flex-wrap items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300'>
            <Button size='lg' className='rounded-full px-12 h-16 text-lg font-bold shadow-button' onClick={() => document.getElementById('inquiry-bar')?.scrollIntoView({ behavior: 'smooth' })} suffix={ArrowRight}>
              Cek Ketersediaan
            </Button>
            <a href='#armada' className='group inline-flex items-center gap-4 text-lg font-bold text-midnight-indigo hover:text-action-blue transition-colors'>
              <span className='flex h-14 w-14 items-center justify-center rounded-full border-2 border-platinum-tint bg-white group-hover:border-action-blue group-hover:bg-cloud-mist transition-all duration-300 shadow-sm'>
                <Play size={18} className='ml-1 fill-midnight-indigo group-hover:fill-action-blue group-hover:text-action-blue transition-all' />
              </span>
              Lihat Armada
            </a>
          </div>
        </div>

        {/* Availability Bar */}
        <div className='mt-28 mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500'>
          <div className='rounded-3xl bg-white border border-platinum-tint shadow-card p-3'>
            <form id='inquiry-bar' onSubmit={handleCheckAvailability} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0'>
              <div className='flex items-center gap-4 px-8 py-6 hover:bg-cloud-mist transition-colors cursor-pointer lg:border-r lg:border-platinum-tint group rounded-l-2xl'>
                <BusIcon className='text-action-blue group-hover:scale-110 transition-transform' size={24} />
                <div className='flex flex-col text-left min-w-0 flex-1'>
                  <span className='text-[11px] font-bold uppercase tracking-widest text-slate-blue mb-1.5'>Tipe Bus</span>
                  <div className='relative flex items-center'>
                    <select className='bg-transparent text-[15px] font-bold text-midnight-indigo focus:outline-none w-full appearance-none cursor-pointer' value={formData.jenisBus} onChange={e => setFormData({...formData, jenisBus: e.target.value})}>
                      <option value=''>Semua Jenis</option>
                      {categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                    </select>
                    <ChevronDown className='absolute right-0 text-platinum-tint pointer-events-none' size={16} />
                  </div>
                </div>
              </div>
              
              <div className='flex items-center gap-4 px-8 py-6 hover:bg-cloud-mist transition-colors cursor-pointer lg:border-r lg:border-platinum-tint group'>
                <Calendar className='text-action-blue group-hover:scale-110 transition-transform' size={24} />
                <div className='flex flex-col text-left min-w-0 flex-1'>
                  <span className='text-[11px] font-bold uppercase tracking-widest text-slate-blue mb-1.5'>Pergi</span>
                  <input type='date' className='bg-transparent text-[15px] font-bold text-midnight-indigo focus:outline-none w-full cursor-pointer' value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} />
                </div>
              </div>
              
              <div className='flex items-center gap-4 px-8 py-6 hover:bg-cloud-mist transition-colors cursor-pointer lg:border-r lg:border-platinum-tint group'>
                <Calendar className='text-action-blue group-hover:scale-110 transition-transform' size={24} />
                <div className='flex flex-col text-left min-w-0 flex-1'>
                  <span className='text-[11px] font-bold uppercase tracking-widest text-slate-blue mb-1.5'>Pulang</span>
                  <input type='date' className='bg-transparent text-[15px] font-bold text-midnight-indigo focus:outline-none w-full cursor-pointer' value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} />
                </div>
              </div>
              
              <div className='flex items-center gap-4 px-8 py-6 hover:bg-cloud-mist transition-colors cursor-pointer lg:border-r lg:border-platinum-tint group'>
                <Users className='text-action-blue group-hover:scale-110 transition-transform' size={24} />
                <div className='flex flex-col text-left min-w-0 flex-1'>
                  <span className='text-[11px] font-bold uppercase tracking-widest text-slate-blue mb-1.5'>Kapasitas</span>
                  <input type='number' min='1' placeholder='Orang' className='bg-transparent text-[15px] font-bold text-midnight-indigo placeholder:text-platinum-tint focus:outline-none w-full' value={formData.penumpang} onChange={e => setFormData({...formData, penumpang: e.target.value})} />
                </div>
              </div>
              
              <div className='p-3'>
                <button type='submit' disabled={checking} className='h-full w-full rounded-2xl bg-action-blue hover:bg-action-blue/90 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-button active:scale-[0.98] text-base'>
                  {checking ? (<div className='h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin' />) : (<><Search size={20} /><span>Cari Armada</span></>)}
                </button>
              </div>
            </form>
            
            {result && (
              <div className={cn('mt-5 mx-3 mb-3 flex items-center gap-6 rounded-2xl px-8 py-5 border animate-in slide-in-from-top-4 duration-300 shadow-sm', result.isSuggestion ? 'bg-sunset-gold/5 border-sunset-gold/20 text-sunset-gold' : (result.available.length > 0 ? 'bg-glacier-blue/5 border-glacier-blue/20 text-glacier-blue' : 'bg-red-500/5 border-red-500/20 text-red-600'))}>
                <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm', result.isSuggestion ? 'bg-sunset-gold/10' : (result.available.length > 0 ? 'bg-glacier-blue/10' : 'bg-red-500/10'))}>
                  {result.isSuggestion ? <AlertCircle size={28} /> : (result.available.length > 0 ? <CheckCircle2 size={28} /> : <XCircle size={28} />)}
                </div>
                <div className='text-left flex-1'>
                  <h4 className='font-bold text-lg mb-1'>{result.isSuggestion ? 'Saran Armada' : (result.available.length > 0 ? 'Armada Tersedia' : 'Pencarian Gagal')}</h4>
                  <p className='text-base font-medium opacity-90'>{result.message}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className='mt-14 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700'>
            <div className='flex items-center gap-3'><CheckCircle2 size={18} className='text-action-blue' /><span className='text-[12px] font-bold tracking-widest uppercase text-midnight-indigo'>Trusted Service</span></div>
            <div className='flex items-center gap-3'><CheckCircle2 size={18} className='text-action-blue' /><span className='text-[12px] font-bold tracking-widest uppercase text-midnight-indigo'>Safe & Secure</span></div>
            <div className='flex items-center gap-3'><CheckCircle2 size={18} className='text-action-blue' /><span className='text-[12px] font-bold tracking-widest uppercase text-midnight-indigo'>24/7 Support</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
