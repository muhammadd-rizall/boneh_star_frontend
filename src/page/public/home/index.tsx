import { useState, useEffect } from 'react';
import PublicLayout from "@/layouts/public/PublicLayout";
import { 
  Hero, 
  StatsSection, 
  ActivityTypesSection, 
  FeaturedFleetSection, 
  TestimonialsSection, 
  FAQSection,
  WorkingProcessSection,
  useHomeData
} from "@/features/public/home";
import Loader from '@/components/feedback/Loader';
import { ShieldCheck, Zap, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import type { Bus } from '@/features/admin/buses/types/Bus';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useAnimations';

export default function HomePage() {
  const { stats, activityTypes, featuredBuses, allBuses, categories, reviews, loading } = useHomeData();
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { ref: featuresRef, inView: featuresInView } = useInView(0.1);

  useEffect(() => {
    if (!isFiltered) {
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

  const featureItems = [
    { icon: Zap, title: 'Armada Modern', desc: 'Seleksi unit terbaru dengan fitur kenyamanan premium.' },
    { icon: CheckCircle2, title: 'Driver Ahli', desc: 'Kru profesional dengan sertifikasi dan jam terbang tinggi.' },
    { icon: ShieldCheck, title: 'Harga Jujur', desc: 'Transparansi biaya tanpa biaya tambahan tersembunyi.' },
    { icon: Clock, title: '24/7 Siaga', desc: 'Dukungan operasional penuh di setiap rute perjalanan.' },
  ];

  if (loading) {
    return (
      <PublicLayout>
        <div className='flex h-[80vh] items-center justify-center bg-white'>
          <Loader />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className='flex flex-col gap-0 overflow-hidden'>
        <Hero categories={categories} allBuses={allBuses} onSearch={handleSearchResults} />
        
        <StatsSection stats={stats} />
        
        <ActivityTypesSection activityTypes={activityTypes} />

        <div className='bg-white'>
          <WorkingProcessSection />
        </div>
        
        <section id='armada' className='bg-cloud-mist py-24 rounded-[48px] mx-4 lg:mx-8 mb-12 border border-platinum-tint/50 shadow-sm scroll-mt-24'>
          {isFiltered && (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-end'>
              <Button variant='outline' onClick={handleResetFilter} className='rounded-full px-8 h-12 font-bold shadow-sm' icon={RotateCcw}>
                Reset Filter
              </Button>
            </div>
          )}
          <FeaturedFleetSection
            buses={displayedBuses}
            title={isFiltered ? 'Hasil Pencarian Armada' : undefined}
            subtitle={
              isFiltered
                ? `Menampilkan ${displayedBuses.length} armada yang sesuai dengan kriteria Anda.`
                : undefined
            }
          />
        </section>

        <section id='features' ref={featuresRef} className='relative bg-white py-32 scroll-mt-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid gap-20 lg:grid-cols-2 lg:items-center'>
              <div className='flex flex-col gap-12'>
                <div className={"reveal " + (featuresInView ? "in-view" : "")}>
                  <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cloud-mist text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-8 shadow-sm'><ShieldCheck size={14} />Komitmen Kami</span>
                  <h2 className='text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight'>Standar Baru dalam <br className='hidden sm:block' /><span className='text-action-blue'>Perjalanan Anda.</span></h2>
                  <p className='mt-8 text-lg font-medium text-slate-blue leading-relaxed max-w-lg'>Lebih dari sekadar transportasi, kami memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin.</p>
                </div>
                
                <div className='grid gap-6 sm:grid-cols-2'>
                  {featureItems.map((item, i) => (
                    <div
                      key={i}
                      className={"flex flex-col gap-4 p-8 rounded-2xl bg-white border border-platinum-tint hover:border-action-blue/30 hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 group reveal " + (featuresInView ? "in-view" : "")}
                      style={{ "--delay": (100 + i * 80) + "ms" } as any}
                    >
                      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud-mist text-action-blue group-hover:bg-action-blue group-hover:text-white transition-all duration-300 shadow-sm'><item.icon size={24} /></div>
                      <h4 className='text-lg font-bold text-midnight-indigo'>{item.title}</h4>
                      <p className='text-sm font-medium text-slate-blue leading-relaxed opacity-80'>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={"relative reveal " + (featuresInView ? "in-view" : "")} style={{ "--delay": "200ms" } as any}>
                <div className='relative bg-midnight-indigo rounded-[48px] p-20 overflow-hidden border border-platinum-tint/10 group shadow-card'>
                  <div className='absolute top-0 right-0 w-80 h-80 bg-action-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse' />
                  <div className='absolute bottom-0 left-0 w-80 h-80 bg-lavender-glow/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse' />
                  
                  <div className='relative z-10 text-center'>
                    <div className='inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 mb-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-2xl'><span className='text-4xl'>⭐</span></div>
                    <p className='text-7xl sm:text-8xl font-bold tracking-tighter text-white mb-6'>98%</p>
                    <h3 className='text-2xl font-bold text-white mb-6 tracking-tight'>Customer Trust</h3>
                    <p className='text-lg font-medium text-slate-blue leading-relaxed max-w-sm mx-auto opacity-80'>Indeks kepuasan pelanggan kami mencerminkan komitmen terhadap kualitas layanan di setiap perjalanan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id='testimonials' className='bg-cloud-mist py-32 rounded-t-[48px] border-t border-platinum-tint/50 scroll-mt-24'>
          <TestimonialsSection reviews={reviews} />
        </div>
        
        <div className='bg-white'>
          <FAQSection />
        </div>
      </div>
    </PublicLayout>
  );
}
