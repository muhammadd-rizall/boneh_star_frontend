import { useState } from 'react';
import PublicLayout from "@/layouts/public/PublicLayout";
import { 
  Hero, 
  ActivityTypesSection, 
  AboutSnippet,
  FeaturedFleetSection, 
  WorkingProcessSection,
  TestimonialsSection, 
  FAQSection,
  useHomeData
} from "@/features/public/home";
import CTABanner from "./CTABanner";
import { SkeletonHome } from '@/components/feedback/Skeleton';
import { RotateCcw } from 'lucide-react';
import type { Bus } from '@/features/admin/buses/types/Bus';
import { Button } from '@/components/ui/Button';
import { FleetDetailModal } from "@/features/public/fleet";

export default function HomePage() {
  const { activityTypes, featuredBuses, allBuses, categories, reviews, loading } = useHomeData();
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const visibleBuses = isFiltered ? displayedBuses : featuredBuses;

  const handleSearchResults = (results: Bus[]) => {
    setDisplayedBuses(results);
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setDisplayedBuses([]);
    setIsFiltered(false);
  };

  if (loading) {
    return (
      <PublicLayout isLoading={true}>
        <SkeletonHome />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className='flex flex-col gap-0 overflow-hidden'>
        <Hero categories={categories} allBuses={allBuses} onSearch={handleSearchResults} />
        
        <ActivityTypesSection activityTypes={activityTypes} />

        <AboutSnippet />
        
        <section id='armada' className='bg-white py-24 scroll-mt-24'>
          {isFiltered && (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-end'>
              <Button variant='outline' onClick={handleResetFilter} className='rounded-full px-8 h-12 font-bold shadow-sm' icon={RotateCcw}>
                Reset Filter
              </Button>
            </div>
          )}
          <FeaturedFleetSection
            buses={visibleBuses}
            title={isFiltered ? 'Hasil Pencarian Armada' : undefined}
            subtitle={
              isFiltered
                ? `Menampilkan ${visibleBuses.length} armada yang sesuai dengan kriteria Anda.`
                : undefined
            }
            onViewDetail={setSelectedBus}
            isFiltered={isFiltered}
          />
        </section>

        <WorkingProcessSection />

        <div id='testimonials' className='bg-white scroll-mt-24'>
          <TestimonialsSection reviews={reviews} />
        </div>

        <div className='bg-white'>
          <FAQSection />
        </div>

        <CTABanner />
      </div>
      {selectedBus && (
        <FleetDetailModal bus={selectedBus} onClose={() => setSelectedBus(null)} />
      )}
    </PublicLayout>
  );
}
