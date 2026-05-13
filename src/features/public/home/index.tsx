import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import ActivityTypesSection from './components/ActivityTypesSection';
import FeaturedFleetSection from './components/FeaturedFleetSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import { useHomeData } from './hooks/useHomeData';
import Loader from '@/components/feedback/Loader';
import { ShieldCheck, Zap, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import type { Bus } from '@/features/admin/buses/types/Bus';
import { Button } from '@/components/ui/Button';

export default function HomeFeature() {
  const { stats, activityTypes, featuredBuses, allBuses, categories, reviews, loading } = useHomeData();
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    if (featuredBuses.length > 0 && !isFiltered) {
      setDisplayedBuses(featuredBuses);
    }
  }, [featuredBuses, isFiltered]);

  const handleSearchResults = (results: Bus[]) => {
    setDisplayedBuses(results);
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setDisplayedBuses(featuredBuses);
    setIsFiltered(false);
  };

  if (loading) {
    return (
      <div className='flex h-[80vh] items-center justify-center bg-white'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Hero categories={categories} allBuses={allBuses} onSearch={handleSearchResults} />
      <div className='bg-white border-b border-slate-50'><StatsSection stats={stats} /></div>
      <div id='services' className='relative bg-white py-4'><ActivityTypesSection activityTypes={activityTypes} /></div>
      <section id='armada' className='bg-slate-50/60 py-12 rounded-3xl mx-4 lg:mx-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900'>{isFiltered ? 'Hasil Pencarian Armada' : 'Armada Unggulan Kami'}</h2>
            <p className='text-slate-500 mt-2'>{isFiltered ? 'Menampilkan ' + displayedBuses.length + ' armada yang sesuai dengan kriteria Anda.' : 'Pilihan armada terbaik untuk menjamin kenyamanan perjalanan Anda.'}</p>
          </div>
          {isFiltered && <Button variant='outline' onClick={handleResetFilter} className='rounded-full border-slate-200 hover:bg-slate-100' icon={RotateCcw}>Reset Filter</Button>}
        </div>
        <FeaturedFleetSection buses={displayedBuses} />
      </section>
      <section id='features' className='relative bg-white py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-16 lg:grid-cols-2 lg:items-center'>
            <div className='flex flex-col gap-8'>
              <div>
                <span className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border border-slate-100 mb-5'><ShieldCheck size={13} />Komitmen Kami</span>
                <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight'>Standar Baru dalam <br className='hidden sm:block' /><span className='text-orange-500'>Perjalanan Anda.</span></h2>
                <p className='mt-5 text-base font-medium text-slate-400 leading-relaxed max-w-lg'>Lebih dari sekadar transportasi, kami memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin.</p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-3 p-6 rounded-xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 group'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300'><Zap size={18} /></div>
                  <h4 className='text-sm font-bold text-slate-900'>Armada Modern</h4>
                  <p className='text-xs font-medium text-slate-400 leading-relaxed'>Seleksi unit terbaru dengan fitur kenyamanan premium.</p>
                </div>
                <div className='flex flex-col gap-3 p-6 rounded-xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 group'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300'><CheckCircle2 size={18} /></div>
                  <h4 className='text-sm font-bold text-slate-900'>Driver Ahli</h4>
                  <p className='text-xs font-medium text-slate-400 leading-relaxed'>Kru profesional dengan sertifikasi dan jam terbang tinggi.</p>
                </div>
                <div className='flex flex-col gap-3 p-6 rounded-xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 group'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300'><ShieldCheck size={18} /></div>
                  <h4 className='text-sm font-bold text-slate-900'>Harga Jujur</h4>
                  <p className='text-xs font-medium text-slate-400 leading-relaxed'>Transparansi biaya tanpa biaya tambahan tersembunyi.</p>
                </div>
                <div className='flex flex-col gap-3 p-6 rounded-xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 group'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300'><Clock size={18} /></div>
                  <h4 className='text-sm font-bold text-slate-900'>24/7 Siaga</h4>
                  <p className='text-xs font-medium text-slate-400 leading-relaxed'>Dukungan operasional penuh di setiap rute perjalanan.</p>
                </div>
              </div>
            </div>
            <div className='relative'>
              <div className='relative bg-slate-900 rounded-3xl p-12 shadow-2xl overflow-hidden group border border-slate-800'>
                <div className='absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent' />
                <div className='relative z-10 text-center'>
                  <div className='inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6 transition-transform group-hover:scale-110 duration-500'><span className='text-3xl'>⭐</span></div>
                  <p className='text-6xl sm:text-7xl font-extrabold tracking-tighter text-orange-500 mb-3'>98%</p>
                  <h3 className='text-xl font-bold text-white mb-3'>Customer Trust</h3>
                  <p className='text-sm font-medium text-slate-400 leading-relaxed max-w-sm mx-auto'>Indeks kepuasan pelanggan kami mencerminkan komitmen terhadap kualitas layanan di setiap perjalanan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id='testimonials'><TestimonialsSection reviews={reviews} /></div>
      <FAQSection />
    </>
  );
}
