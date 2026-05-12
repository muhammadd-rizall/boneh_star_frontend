import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollTo = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("article")?.offsetWidth || 280;
    el.scrollBy({ left: dir === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (activityTypes.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = el.querySelector("article")?.offsetWidth || 280;
        el.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activityTypes.length, isPaused]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, activityTypes]);

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-14 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-semibold uppercase tracking-wider border border-orange-100 mb-5">
            <Compass size={13} />
            Layanan Unggulan
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Eksplorasi Tanpa Batas{" "}
            <br className="hidden sm:block" />
            <span className="text-orange-500">Untuk Setiap Momen.</span>
          </h2>
          <p className="mt-5 text-base font-medium text-slate-400 leading-relaxed max-w-xl">
            Solusi transportasi yang dipersonalisasi untuk memastikan setiap perjalanan Anda menjadi pengalaman tak terlupakan.
          </p>
        </div>

        {/* Carousel arrows */}
        <div className="mt-6 flex items-center gap-2 sm:mt-0">
          <button
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {activityTypes.map((item, i) => (
            <article
              key={item.id}
              className="group relative flex w-72 flex-shrink-0 snap-start flex-col p-7 rounded-2xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-lg hover:shadow-orange-50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex-1">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <Compass size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold tracking-tight text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-400">
                  {item.description || "Layanan transportasi prima untuk kenyamanan perjalanan rombongan Anda."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
