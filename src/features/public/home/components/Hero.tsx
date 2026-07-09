import { usePublicCompanyProfile } from '@/features/admin/company-profile/hooks/usePublicCompanyProfile';
import { Bus as BusIcon, Calendar, Users, ArrowRight, Play, CheckCircle2, XCircle, ChevronDown, AlertCircle, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { BusCategory } from '@/features/admin/bus-categories/types/BusCategory';
import { cn } from '@/lib/utils';

interface HeroProps {
  categories: BusCategory[];
  allBuses: Bus[];
  onSearch: (results: Bus[]) => void;
}

// GANTI NILAI INI DENGAN PATH GAMBAR LOKAL ANDA NANTI (contoh: '/assets/images/hero-bg.jpg')
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    resultTimeoutRef.current = setTimeout(() => {
      setResult(null);
    }, 4000);
    
    if (filtered.length > 0) {
      setTimeout(() => {
        document.getElementById('armada')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  };

  return (
    <section className='relative min-h-[95vh] w-full flex flex-col justify-center bg-midnight-indigo pt-48 lg:pt-56 pb-28'>
      {/* Full Background Image */}
      <div className='absolute inset-0 z-0'>
        <img 
          src={HERO_BACKGROUND_IMAGE} 
          alt="Boneh Star Premium Bus Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
      </div>

      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-8 lg:mt-12'>
        {/* Center Content */}
        <div className='text-center max-w-3xl flex flex-col items-center'>
          <div className='mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm'>
            <span className='flex h-2 w-2 rounded-full bg-action-blue shadow-[0_0_10px_rgba(0,107,255,0.6)] animate-pulse' />
            <span className='text-[12px] font-bold tracking-[0.2em] text-white uppercase'>Premium Charter Service</span>
          </div>
          
          <h1 className='text-5xl lg:text-[64px] font-bold tracking-tight text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
            Kemudahan Reservasi untuk <br />
            <span className='text-action-blue'>Perjalanan Premium Anda.</span>
          </h1>
          
          <p className='text-lg font-medium leading-relaxed text-white/80 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 max-w-2xl mx-auto'>
            {profile.description || 'Solusi transportasi rombongan terbaik dengan armada modern dan layanan profesional untuk kenyamanan maksimal Anda.'}
          </p>
          
          <div className='flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300'>
            <Button 
              size='lg' 
              className='rounded-full px-10 py-4 h-auto text-lg font-bold bg-action-blue text-white shadow-lg shadow-action-blue/30 ring-4 ring-action-blue/10 transition-all hover:scale-[1.03] hover:shadow-action-blue/40 active:scale-95' 
              onClick={() => {
                const el = document.getElementById('inquiry-bar');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 150;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              suffix={ArrowRight}
            >
              Cek Ketersediaan
            </Button>
            <a href='#armada' className='group inline-flex items-center gap-3 text-lg font-bold text-white hover:text-action-blue transition-colors'>
              <span className='flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm group-hover:border-action-blue group-hover:bg-action-blue/20 transition-all duration-300 shadow-sm'>
                <Play size={18} className='ml-1 fill-white group-hover:fill-action-blue transition-all' />
              </span>
              Lihat Armada
            </a>
          </div>
        </div>

        {/* Availability Bar */}
        <div className='mt-12 mx-auto max-w-[1000px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 relative z-30'>
          <div className='bg-white rounded-[32px] lg:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-platinum-tint p-2'>
            <form id='inquiry-bar' onSubmit={handleCheckAvailability} className='flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-platinum-tint/60 w-full'>
              
              <div 
                ref={dropdownRef}
                className='relative flex items-center gap-3 px-6 py-3.5 hover:bg-cloud-mist/50 transition-colors cursor-pointer rounded-t-[24px] lg:rounded-l-full lg:rounded-tr-none w-full lg:w-auto flex-1 group'
                onClick={() => setIsBusDropdownOpen(!isBusDropdownOpen)}
              >
                <BusIcon className='text-action-blue shrink-0 group-hover:scale-110 transition-transform' size={20} />
                <div className='flex flex-col text-left w-full min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-widest text-slate-blue mb-0.5'>Tipe Bus</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-[14px] font-bold text-midnight-indigo truncate'>
                      {formData.jenisBus || 'Semua Jenis'}
                    </span>
                    <ChevronDown className={cn('text-platinum-tint shrink-0 transition-transform duration-300', isBusDropdownOpen && 'rotate-180')} size={16} />
                  </div>
                </div>

                {isBusDropdownOpen && (
                  <div className='absolute top-full left-0 mt-3 w-[240px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-platinum-tint/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='py-2 max-h-[180px] overflow-y-auto'>
                      <div 
                        className={cn('px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-cloud-mist/60 cursor-pointer flex items-center justify-between', !formData.jenisBus ? 'text-action-blue bg-action-blue/5' : 'text-slate-blue')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, jenisBus: ''});
                          setIsBusDropdownOpen(false);
                        }}
                      >
                        Semua Jenis
                        {!formData.jenisBus && <CheckCircle2 size={16} className="text-action-blue" />}
                      </div>
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className={cn('px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-cloud-mist/60 cursor-pointer flex items-center justify-between', formData.jenisBus === cat.name ? 'text-action-blue bg-action-blue/5' : 'text-slate-blue')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({...formData, jenisBus: cat.name});
                            setIsBusDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                          {formData.jenisBus === cat.name && <CheckCircle2 size={16} className="text-action-blue" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <label 
                className='flex items-center gap-3 px-6 py-3.5 hover:bg-cloud-mist/50 transition-colors cursor-pointer w-full lg:w-auto flex-1 group'
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    if (input.type !== 'date') input.type = 'date';
                    try { input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <Calendar className='text-action-blue shrink-0 group-hover:scale-110 transition-transform' size={20} />
                <div className='flex flex-col text-left w-full min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-widest text-slate-blue mb-0.5'>Pergi</span>
                  <input 
                    type='text' 
                    onFocus={(e) => { e.target.type = 'date'; }}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    placeholder='Pilih Tanggal'
                    className='bg-transparent text-[14px] font-bold text-midnight-indigo focus:outline-none w-full cursor-pointer placeholder:font-medium placeholder:text-platinum-tint' 
                    value={formData.departureDate} 
                    onChange={e => setFormData({...formData, departureDate: e.target.value})} 
                  />
                </div>
              </label>
              
              <label 
                className='flex items-center gap-3 px-6 py-3.5 hover:bg-cloud-mist/50 transition-colors cursor-pointer w-full lg:w-auto flex-1 group'
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    if (input.type !== 'date') input.type = 'date';
                    try { input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <Calendar className='text-action-blue shrink-0 group-hover:scale-110 transition-transform' size={20} />
                <div className='flex flex-col text-left w-full min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-widest text-slate-blue mb-0.5'>Pulang</span>
                  <input 
                    type='text' 
                    onFocus={(e) => { e.target.type = 'date'; }}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    placeholder='Pilih Tanggal'
                    className='bg-transparent text-[14px] font-bold text-midnight-indigo focus:outline-none w-full cursor-pointer placeholder:font-medium placeholder:text-platinum-tint' 
                    value={formData.returnDate} 
                    onChange={e => setFormData({...formData, returnDate: e.target.value})} 
                  />
                </div>
              </label>
              
              <label className='flex items-center gap-3 px-6 py-3.5 hover:bg-cloud-mist/50 transition-colors cursor-pointer w-full lg:w-auto flex-1 group'>
                <Users className='text-action-blue shrink-0 group-hover:scale-110 transition-transform' size={20} />
                <div className='flex flex-col text-left w-full min-w-0'>
                  <span className='text-[10px] font-bold uppercase tracking-widest text-slate-blue mb-0.5'>Kapasitas</span>
                  <input type='number' min='1' placeholder='Jumlah Orang' className='bg-transparent text-[14px] font-bold text-midnight-indigo placeholder:text-platinum-tint placeholder:font-medium focus:outline-none w-full' value={formData.penumpang} onChange={e => setFormData({...formData, penumpang: e.target.value})} />
                </div>
              </label>
              
              <div className='p-2 w-full lg:w-auto lg:shrink-0'>
                <Button 
                  type='submit' 
                  loading={checking} 
                  icon={Search}
                  className='h-[54px] w-full lg:w-auto px-10 rounded-[24px] lg:rounded-full bg-action-blue text-white font-bold shadow-button text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98]'
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
          {/* Removed checklist elements to reduce visual clutter and make the homepage cleaner */}
        </div>
      </div>
    </section>
  );
}
