import { usePublicCompanyProfile } from '@/features/admin/company-profile/hooks/usePublicCompanyProfile';
import { Bus as BusIcon, Calendar, Users, ArrowRight, Play, CheckCircle2, XCircle, ChevronDown, AlertCircle, Search } from 'lucide-react';
import heroImage from '@/assets/hero.png';
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
            message = filtered.length + ' unit armada ' + formData.jenisBus + ' tersedia untuk ' + passengerCount + ' orang!';
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
    <section className='relative min-h-[95vh] w-full overflow-hidden flex flex-col'>
      <div className='absolute inset-0'>
        <img src={heroImage} alt='Premium Bus' className='h-full w-full object-cover object-center scale-105' />
        <div className='absolute inset-0 bg-slate-950/60' />
        <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent' />
      </div>
      <div className='relative z-10 mx-auto flex flex-1 w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl pt-20 pb-48 md:pt-24 md:pb-32'>
          <div className='mb-8 inline-flex items-center gap-2.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <span className='flex h-2 w-2 rounded-full bg-orange-500 animate-pulse' />
            <span className='text-[10px] md:text-xs font-bold tracking-widest text-orange-400 uppercase'>Premium Charter Service</span>
          </div>
          <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>Elevate Your <br /><span className='text-orange-500'>Journey.</span></h1>
          <p className='mt-8 max-w-xl text-lg sm:text-xl font-medium leading-relaxed text-slate-300 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200'>{profile.description || 'Solusi transportasi rombongan terbaik.'}</p>
          <div className='mt-12 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300'>
            <Button size='lg' className='rounded-full px-10 h-14 text-base font-bold shadow-2xl bg-orange-500 hover:bg-orange-600 border-none text-white transition-all hover:scale-105 active:scale-95' onClick={() => document.getElementById('inquiry-bar')?.scrollIntoView({ behavior: 'smooth' })} suffix={ArrowRight}>Cek Ketersediaan</Button>
            <a href='#armada' className='group inline-flex items-center gap-4 text-base font-bold text-white/80 hover:text-white transition-all'><span className='flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md group-hover:bg-white/10 transition-all'><Play size={16} className='ml-1 fill-white' /></span>Lihat Armada</a>
          </div>
        </div>

        <div className='absolute bottom-12 inset-x-0 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500'>
          <div className='mx-auto max-w-7xl'>
            <div className='relative group/search'>
              <div className='absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-2xl opacity-0 group-hover/search:opacity-100 transition-opacity duration-500' />
              <form id='inquiry-bar' onSubmit={handleCheckAvailability} className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 p-2 rounded-[2rem] bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)]'>
                <div className='flex items-center gap-4 px-8 py-5 hover:bg-white/5 transition-all group cursor-pointer lg:border-r lg:border-white/5'>
                  <BusIcon className='text-orange-500 shrink-0' size={22} />
                  <div className='flex flex-col min-w-0 flex-1'><span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1'>Tipe Bus</span><div className='relative flex items-center'><select className='bg-transparent text-sm font-extrabold text-white focus:outline-none w-full appearance-none cursor-pointer' value={formData.jenisBus} onChange={e => setFormData({...formData, jenisBus: e.target.value})}><option value='' className='text-slate-900'>Semua Jenis</option>{categories.map(cat => (<option key={cat.id} value={cat.name} className='text-slate-900'>{cat.name}</option>))}</select><ChevronDown className='absolute right-0 text-slate-600 pointer-events-none' size={14} /></div></div>
                </div>
                <div className='flex items-center gap-4 px-8 py-5 hover:bg-white/5 transition-all group cursor-pointer lg:border-r lg:border-white/5'>
                  <Calendar className='text-orange-500 shrink-0' size={22} />
                  <div className='flex flex-col min-w-0 flex-1'><span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1'>Pergi</span><input type='date' className='bg-transparent text-sm font-extrabold text-white focus:outline-none w-full [color-scheme:dark] cursor-pointer' value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} /></div>
                </div>

                <div className='flex items-center gap-4 px-8 py-5 hover:bg-white/5 transition-all group cursor-pointer lg:border-r lg:border-white/5'>
                  <Calendar className='text-orange-500 shrink-0' size={22} />
                  <div className='flex flex-col min-w-0 flex-1'><span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1'>Pulang</span><input type='date' className='bg-transparent text-sm font-extrabold text-white focus:outline-none w-full [color-scheme:dark] cursor-pointer' value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} /></div>
                </div>
                <div className='flex items-center gap-4 px-8 py-5 hover:bg-white/5 transition-all group cursor-pointer lg:border-r lg:border-white/5'>
                  <Users className='text-orange-500 shrink-0' size={22} />
                  <div className='flex flex-col min-w-0 flex-1'><span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1'>Kapasitas</span><input type='number' min='1' placeholder='Orang' className='bg-transparent text-sm font-extrabold text-white placeholder:text-slate-700 focus:outline-none w-full' value={formData.penumpang} onChange={e => setFormData({...formData, penumpang: e.target.value})} /></div>
                </div>
                <div className='p-2'><button type='submit' disabled={checking} className='h-full w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)]'>{checking ? (<div className='h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />) : (<><Search size={20} /><span className='uppercase tracking-widest text-xs'>Cari Armada</span></>)}</button></div>
              </form>
              {result && (
                <div className={cn('mt-6 mx-auto max-w-2xl flex items-center gap-5 rounded-2xl px-8 py-5 backdrop-blur-3xl border animate-in fade-in slide-in-from-top-6 duration-700', result.isSuggestion ? 'bg-orange-500/15 border-orange-500/20 text-orange-400' : (result.available.length > 0 ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' : 'bg-red-500/15 border-red-500/20 text-red-400'))}>
                  <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full', result.isSuggestion ? 'bg-orange-500/20' : (result.available.length > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'))}>{result.isSuggestion ? <AlertCircle size={24} /> : (result.available.length > 0 ? <CheckCircle2 size={24} /> : <XCircle size={24} />)}</div>
                  <div className='flex-1'><h4 className='font-black text-sm uppercase tracking-wider mb-0.5'>{result.isSuggestion ? 'Saran Armada' : (result.available.length > 0 ? 'Armada Tersedia' : 'Pencarian Gagal')}</h4><p className='text-sm font-bold opacity-90 leading-tight'>{result.message}</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
