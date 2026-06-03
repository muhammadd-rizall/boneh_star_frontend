import type { Bus } from "@/features/admin/buses/types/Bus";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/Button";
import FleetCard from "@/features/public/fleet/components/FleetCard";

interface FeaturedFleetSectionProps {
  buses: Bus[];
  title?: string;
  subtitle?: string;
}

const MAX_PREVIEW = 6;

const DEFAULT_SUBTITLE =
  "Pilihan armada terbaik untuk menjamin kenyamanan perjalanan Anda.";

export default function FeaturedFleetSection({
  buses,
  title,
  subtitle,
}: FeaturedFleetSectionProps) {
  const { ref, inView } = useInView(0.05);

  if (buses.length === 0) {
    return (
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-lg font-medium text-slate-blue">
          Tidak ada armada yang sesuai dengan kriteria pencarian Anda.
        </p>
      </div>
    );
  }

  const preview = buses.slice(0, MAX_PREVIEW);
  const hasMore = buses.length > MAX_PREVIEW;
  const sectionSubtitle = subtitle ?? DEFAULT_SUBTITLE;

  return (
    <div ref={ref} className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            "mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between reveal " +
            (inView ? "in-view" : "")
          }
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
              <ShieldCheck size={14} />
              Armada Eksklusif
            </span>
            <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
              {title ? (
                title
              ) : (
                <>
                  Kenyamanan Premium{" "}
                  <br className="hidden sm:block" />
                  <span className="text-action-blue">Di Setiap Unit Kami.</span>
                </>
              )}
            </h2>
            <p className="mt-4 text-lg font-medium text-slate-blue opacity-80">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {preview.map((bus, i) => (
            <FleetCard key={bus.id} bus={bus} index={i} inView={inView} />
          ))}
        </div>

        <div className={"mt-16 flex justify-center reveal " + (inView ? "in-view" : "")} style={{ "--delay": "400ms" } as React.CSSProperties}>
          <Link to="/armada">
            <Button 
              variant="outline" 
              className="rounded-full px-10 h-14 font-bold border-platinum-tint shadow-sm hover:border-action-blue hover:text-action-blue transition-all"
            >
              {hasMore ? `Lihat Semua Armada (${buses.length} Unit)` : "Lihat Katalog Lengkap"}
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
