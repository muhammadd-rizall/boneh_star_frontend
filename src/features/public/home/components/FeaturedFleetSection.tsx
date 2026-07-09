import type { Bus } from "@/features/admin/buses/types/Bus";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/Button";
import FleetCard from "@/features/public/fleet/components/FleetCard";

interface FeaturedFleetSectionProps {
  buses: Bus[];
  title?: string;
  subtitle?: string;
  onViewDetail?: (bus: Bus) => void;
}

const MAX_PREVIEW = 3; // Show 3 buses as in the screenshot

export default function FeaturedFleetSection({
  buses,
  title,
  subtitle,
  onViewDetail,
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

  return (
    <div ref={ref} className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            "mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between reveal " +
            (inView ? "in-view" : "")
          }
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue">
              ARMADA UNGGULAN KAMI
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-midnight-indigo sm:text-3xl">
              {title || "Armada Nyaman & Terawat"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/armada">
              <Button 
                variant="outline" 
                className="rounded-full px-5 h-11 text-xs font-bold border-slate-200 text-slate-700 shadow-sm hover:border-action-blue hover:text-action-blue transition-all flex items-center gap-2"
              >
                Lihat Semua Armada
                <ArrowRight size={14} />
              </Button>
            </Link>
            <div className="hidden sm:flex gap-2">
              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-action-blue hover:text-action-blue transition-all bg-white shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-action-blue hover:text-action-blue transition-all bg-white shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {preview.map((bus, i) => (
            <FleetCard key={bus.id} bus={bus} index={i} inView={inView} onViewDetail={onViewDetail} />
          ))}
        </div>

        {/* Banner call to action */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-midnight-indigo to-action-blue p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Siap Memulai Perjalanan Anda?
              </h3>
              <p className="mt-1.5 text-sm text-white/90 font-medium">
                Pesan sekarang dan dapatkan pengalaman perjalanan terbaik bersama Boneh Star Pariwisata.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="shrink-0 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-action-blue hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02]"
          >
            Pesan Sekarang
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
