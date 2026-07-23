import { usePublicCompanyProfile } from '@/features/admin/company-profile/hooks/usePublicCompanyProfile';
import { Bus as BusIcon, Calendar, Users, ShieldCheck, User, Search, ChevronDown, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { BusCategory } from '@/features/admin/bus-categories/types/BusCategory';
import { cn } from '@/lib/utils';
import { formatDateDMY } from '@/utils/formatter';

interface HeroProps {
  categories: BusCategory[];
  allBuses: Bus[];
  onSearch: (results: Bus[]) => void;
}

// Cinematic hero background image showing scenic road
const HERO_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop";

export default function Hero({ categories, allBuses, onSearch }: HeroProps) {
  const { profile } = usePublicCompanyProfile();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: Bus[]; message: string; isSuggestion?: boolean } | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    jenisBus: '',
    departureDate: '',
    returnDate: '',
    penumpang: ''
  });

  const [isBusDropdownOpen, setIsBusDropdownOpen] = useState(false);
  const busDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (busDropdownRef.current && !busDropdownRef.current.contains(target)) {
        setIsBusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));

    const availableBuses = allBuses.filter(b => b.status === 'available');

    // Parse passenger capacity
    const passengerCount = parseInt(formData.penumpang, 10) || 0;

    let filtered = availableBuses.filter(b => {
      // Category filter
      if (formData.jenisBus && b.category?.name !== formData.jenisBus) return false;
      // Capacity filter: seat count must be at least passengerCount
      if (passengerCount > 0 && b.seat_count < passengerCount) return false;
      return true;
    });

    let message = '';
    let isSuggestion = false;

    if (filtered.length > 0) {
      message = `Ditemukan ${filtered.length} armada yang sesuai dengan kriteria pencarian Anda.`;
    } else {
      // Suggestion: fallback to top available buses
      filtered = availableBuses.slice(0, 3);
      message = 'Tidak ada armada yang sesuai persis. Kami sarankan alternatif berikut.';
      isSuggestion = true;
    }

    setResult({ available: filtered, message, isSuggestion });
    onSearch(filtered);
    setChecking(false);

    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    resultTimeoutRef.current = setTimeout(() => {
      setResult(null);
    }, 5000);

    if (filtered.length > 0) {
      setTimeout(() => {
        document.getElementById('armada')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  };

  return (
    <section className='relative min-h-[92vh] w-full flex flex-col justify-center bg-midnight-indigo pt-32 pb-24'>
      {/* Background Image & Overlay */}
      <div className='absolute inset-0 z-0'>
        <img 
          src={HERO_BACKGROUND_IMAGE} 
          alt="Boneh Star Premium Bus Background" 
          className="w-full h-full object-cover"
          style={{ objectPosition: '80% 50%' }}
        />
        <div className="absolute inset-0 bg-black/45 z-10" />
      </div>

      <div className='relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-6 lg:mt-10'>
        {/* Center Content */}
        <div className='text-center max-w-3xl flex flex-col items-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-750'>
            Perjalanan Nyaman,<br />Kenangan Terbaik
          </h1>
          
          <p className='text-base sm:text-lg font-medium leading-relaxed text-white/85 mb-9 animate-in fade-in slide-in-from-bottom-8 duration-750 delay-100 max-w-2xl mx-auto'>
            {profile.description || 'Armada modern, fasilitas lengkap, dan pelayanan profesional untuk pengalaman perjalanan yang berkesan.'}
          </p>
          
          {/* Action Buttons (System Colors: Blue & Outline, No Yellow) */}
          <div className='flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-750 delay-200'>
            <Button 
              size='lg' 
              className='rounded-xl px-8 py-3.5 h-auto text-sm font-bold bg-[#006bff] hover:bg-[#0056cc] text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95' 
              onClick={() => {
                const el = document.getElementById('inquiry-bar');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 150;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              icon={Calendar}
            >
              Cek Ketersediaan
            </Button>
            
            <a 
              href='#armada' 
              className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 active:scale-95'
            >
              <BusIcon size={16} />
              Lihat Armada
            </a>
          </div>

          {/* Badges / Features list below buttons */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/90 text-[13px] font-bold animate-in fade-in slide-in-from-bottom-11 duration-750 delay-300">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#006bff]" />
              <span>Aman & Terpercaya</span>
            </div>
            <div className="flex items-center gap-2">
              <BusIcon size={16} className="text-[#006bff]" />
              <span>Armada Terawat</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#006bff]" />
              <span>Driver Profesional</span>
            </div>
          </div>
        </div>

        {/* Availability Bar / Search Card */}
        <div className='mt-14 w-full max-w-[1100px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 relative z-30 px-2 sm:px-0'>
          <div className='bg-white rounded-3xl lg:rounded-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.08)] border border-slate-100 p-3'>
            <form id='inquiry-bar' onSubmit={handleCheckAvailability} className='grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 lg:gap-0 items-center w-full'>
              
              {/* Dropdown 1: Jenis Bus */}
              <div 
                ref={busDropdownRef}
                className='relative flex items-center gap-3.5 px-6 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer rounded-2xl lg:rounded-none lg:border-r lg:border-slate-100 w-full text-left group'
                onClick={() => {
                  setIsBusDropdownOpen(!isBusDropdownOpen);
                }}
              >
                <BusIcon size={20} className='text-[#006bff] shrink-0 group-hover:scale-110 transition-transform duration-300' />
                <div className='flex flex-col flex-1 min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-blue/60 mb-0.5'>Jenis Bus</span>
                  <div className='flex items-center justify-between gap-1.5'>
                    <span className='text-[14px] font-bold text-midnight-indigo truncate'>
                      {formData.jenisBus || 'Semua Jenis'}
                    </span>
                    <ChevronDown size={14} className={cn('text-slate-400 shrink-0 transition-transform duration-300', isBusDropdownOpen && 'rotate-180')} />
                  </div>
                </div>

                {isBusDropdownOpen && (
                  <div className='absolute top-[105%] left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='py-1.5 max-h-[220px] overflow-y-auto'>
                      <div 
                        className={cn('px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-slate-50 cursor-pointer flex items-center justify-between', !formData.jenisBus ? 'text-[#006bff] bg-blue-50/40' : 'text-slate-blue')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, jenisBus: ''});
                          setIsBusDropdownOpen(false);
                        }}
                      >
                        Semua Jenis
                        {!formData.jenisBus && <CheckCircle2 size={14} className="text-[#006bff]" />}
                      </div>
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className={cn('px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-slate-50 cursor-pointer flex items-center justify-between', formData.jenisBus === cat.name ? 'text-[#006bff] bg-blue-50/40' : 'text-slate-blue')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({...formData, jenisBus: cat.name});
                            setIsBusDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                          {formData.jenisBus === cat.name && <CheckCircle2 size={14} className="text-[#006bff]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Date Input 2: Tanggal Berangkat */}
              <div className="relative flex items-center gap-3.5 px-6 py-4 hover:bg-slate-50/60 transition-colors lg:border-r lg:border-slate-100 w-full text-left group min-h-[80px]">
                <input 
                  type="date" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                  value={formData.departureDate}
                  onChange={e => setFormData({...formData, departureDate: e.target.value})}
                  onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                />
                <Calendar size={20} className='text-[#006bff] shrink-0 group-hover:scale-110 transition-transform duration-300' />
                <div className='flex flex-col flex-1 min-w-0 pointer-events-none'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-blue/60 mb-0.5'>Tanggal Berangkat</span>
                  <span className={cn('text-[14px] font-bold', formData.departureDate ? 'text-midnight-indigo' : 'text-slate-400 font-normal')}>
                    {formData.departureDate ? formatDateDMY(formData.departureDate) : 'Pilih tanggal'}
                  </span>
                </div>
              </div>

              {/* Date Input 3: Tanggal Pulang */}
              <div className="relative flex items-center gap-3.5 px-6 py-4 hover:bg-slate-50/60 transition-colors lg:border-r lg:border-slate-100 w-full text-left group min-h-[80px]">
                <input 
                  type="date" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                  value={formData.returnDate}
                  onChange={e => setFormData({...formData, returnDate: e.target.value})}
                  onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                />
                <Calendar size={20} className='text-[#006bff] shrink-0 group-hover:scale-110 transition-transform duration-300' />
                <div className='flex flex-col flex-1 min-w-0 pointer-events-none'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-blue/60 mb-0.5'>Tanggal Pulang</span>
                  <span className={cn('text-[14px] font-bold', formData.returnDate ? 'text-midnight-indigo' : 'text-slate-400 font-normal')}>
                    {formData.returnDate ? formatDateDMY(formData.returnDate) : 'Pilih tanggal'}
                  </span>
                </div>
              </div>
              
              {/* Input 4: Jumlah Peserta */}
              <label 
                className='flex items-center gap-3.5 px-6 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer w-full text-left group'
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    input.focus();
                  }
                }}
              >
                <Users size={20} className='text-[#006bff] shrink-0 group-hover:scale-110 transition-transform duration-300' />
                <div className='flex flex-col flex-1 min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-blue/60 mb-0.5'>Jumlah Peserta</span>
                  <input 
                    type='number' 
                    min='1'
                    placeholder='Masukkan jumlah'
                    className='bg-transparent text-[14px] font-bold text-midnight-indigo focus:outline-none w-full cursor-pointer placeholder:font-bold placeholder:text-midnight-indigo [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                    value={formData.penumpang} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, penumpang: val});
                    }} 
                  />
                </div>
              </label>
              
              {/* Submit Button */}
              <div className='w-full lg:w-auto px-4 lg:pl-6 lg:pr-4 lg:shrink-0 flex justify-center py-2 lg:py-0'>
                <Button 
                  type='submit' 
                  loading={checking} 
                  icon={Search}
                  className='h-12 w-full lg:w-[170px] justify-center rounded-xl bg-[#0038a8] hover:bg-[#002d87] text-white font-bold shadow-button text-[14px] transition-all hover:scale-[1.02] active:scale-[0.98]'
                >
                  Cari Armada
                </Button>
              </div>
            </form>
            
            {result && (
              <div className={cn('mt-5 mx-3 mb-3 flex items-center gap-6 rounded-2xl px-8 py-5 border animate-in slide-in-from-top-4 duration-300 shadow-sm', result.isSuggestion ? 'bg-sunset-gold/5 border-sunset-gold/20 text-sunset-gold' : (result.available.length > 0 ? 'bg-action-blue/5 border-action-blue/20 text-action-blue' : 'bg-red-500/5 border-red-500/20 text-red-600'))}>
                <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm', result.isSuggestion ? 'bg-sunset-gold/10' : (result.available.length > 0 ? 'bg-action-blue/10' : 'bg-red-500/10'))}>
                  {result.isSuggestion ? <AlertCircle size={28} /> : (result.available.length > 0 ? <CheckCircle2 size={28} /> : <XCircle size={28} />)}
                </div>
                <div className='text-left flex-1'>
                  <h4 className='font-bold text-lg mb-1'>{result.isSuggestion ? 'Saran Armada' : (result.available.length > 0 ? 'Armada Tersedia' : 'Pencarian Gagal')}</h4>
                  <p className='text-base font-medium opacity-90'>{result.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
