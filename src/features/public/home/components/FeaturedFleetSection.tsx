import type { Bus } from "@/features/admin/buses/types/Bus";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FleetCard from "@/features/public/fleet/components/FleetCard";
import { motion } from "motion/react";

interface FeaturedFleetSectionProps {
  buses: Bus[];
  title?: string;
  subtitle?: string;
  onViewDetail?: (bus: Bus) => void;
}

const MAX_PREVIEW = 3;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

export default function FeaturedFleetSection({
  buses,
  title,
  subtitle,
  onViewDetail,
}: FeaturedFleetSectionProps) {
  if (buses.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-lg font-medium text-gray-400">
          Tidak ada armada yang sesuai dengan kriteria pencarian Anda.
        </p>
      </div>
    );
  }

  const preview = buses.slice(0, MAX_PREVIEW);

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header row ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.2em] block mb-2">
              ARMADA UNGGULAN
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {title || "Armada Nyaman & Terawat"}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-400 font-medium">{subtitle}</p>
            )}
          </div>

          {/* Text link "Lihat Semua Armada →" — matches reference exactly */}
          <Link
            to="/armada"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors group shrink-0"
          >
            Lihat Semua Armada
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* ── Fleet cards grid ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {preview.map((bus) => (
            <FleetCard key={bus.id} bus={bus} onViewDetail={onViewDetail} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
