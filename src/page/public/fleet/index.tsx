import { useState, useEffect, useMemo, useRef } from "react";
import PublicLayout from "@/layouts/public/PublicLayout";
import { useFleetData } from "@/features/public/fleet/hooks/useFleetData";
import {
  Bus as BusIcon,
  X,
  ChevronDown,
  ShieldCheck,
  Users,
  Phone,
  Sparkles,
  Search as SearchIcon
} from "lucide-react";
import { SkeletonFleet } from "@/components/feedback/Skeleton";
import { FleetCard, FleetDetailModal } from "@/features/public/fleet";
import type { Bus } from "@/features/admin/buses/types/Bus";
import { Button } from "@/components/ui/Button";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

const PER_PAGE = 9;

const sortOptions = [
  { value: "latest", label: "Terbaru" },
  { value: "seats-asc", label: "Kursi Terkecil" },
  { value: "seats-desc", label: "Kursi Terbesar" },
];

export default function FleetPage() {
  const { buses, categories, loading } = useFleetData();
  const { profile } = usePublicCompanyProfile();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = [...buses];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brand?.toLowerCase().includes(q) ||
          b.plat_number?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((b) => b.category?.name === selectedCategory);
    }

    // Sorting
    if (sortBy === "latest") {
      result.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    } else if (sortBy === "seats-asc") {
      result.sort((a, b) => a.seat_count - b.seat_count);
    } else if (sortBy === "seats-desc") {
      result.sort((a, b) => b.seat_count - a.seat_count);
    }

    return result;
  }, [buses, search, selectedCategory, sortBy]);

  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [search, selectedCategory, sortBy]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const visibleBuses = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const hasMore = remaining > 0;

  const hasFilters = !!(search || selectedCategory);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("latest");
  };

  const whatsappHref = profile.whatsapp?.[0]
    ? buildWhatsAppHref(profile.whatsapp[0], "Halo Admin Boneh Star, saya ingin tanya ketersediaan sewa armada.")
    : "#";

  if (loading) {
    return (
      <PublicLayout>
        <SkeletonFleet />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Text Column */}
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-action-blue mb-4 block">
                    Armada Kami
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-midnight-indigo leading-tight">
                    Armada Nyaman <br />
                    Untuk <span className="text-action-blue">Perjalanan Anda</span>
                  </h1>
                  <p className="mt-6 text-base sm:text-lg font-medium text-slate-blue leading-relaxed opacity-85">
                    Kami menyediakan berbagai pilihan armada terbaik dengan fasilitas lengkap untuk setiap kebutuhan perjalanan Anda.
                  </p>
                </div>

                {/* 3 highlights items */}
                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-action-blue/20 transition-colors">
                    <div className="text-action-blue">
                      <ShieldCheck size={20} strokeWidth={2} />
                    </div>
                    <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Aman & Terawat</h4>
                    <p className="text-[11px] font-medium text-slate-blue opacity-80 leading-normal">
                      Armada selalu dalam kondisi prima dan terawat.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-action-blue/20 transition-colors">
                    <div className="text-action-blue">
                      <Sparkles size={20} strokeWidth={2} />
                    </div>
                    <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Fasilitas Lengkap</h4>
                    <p className="text-[11px] font-medium text-slate-blue opacity-80 leading-normal">
                      Dilengkapi fasilitas terbaik untuk kenyamanan Anda.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-action-blue/20 transition-colors">
                    <div className="text-action-blue">
                      <Users size={20} strokeWidth={2} />
                    </div>
                    <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Driver Profesional</h4>
                    <p className="text-[11px] font-medium text-slate-blue opacity-80 leading-normal">
                      Pengemudi berpengalaman dan ramah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative">
                <div className="absolute inset-0 bg-action-blue/5 rounded-[36px] blur-3xl pointer-events-none -z-10" />
                <div className="rounded-[32px] overflow-hidden border border-slate-100 shadow-xl aspect-[16/10] bg-cloud-mist">
                  <img
                    src="public/images/image4.jpeg"
                    alt="Boneh Star Fleet Pariwisata"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Content section */}
        <section className="bg-slate-50/50 py-16 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Filter Bar (Card) */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

              {/* Category tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${selectedCategory === ""
                      ? "bg-action-blue text-white shadow-md shadow-action-blue/15"
                      : "text-slate-blue hover:text-action-blue bg-slate-50 hover:bg-slate-100"
                    }`}
                >
                  Semua Armada
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${selectedCategory === cat.name
                        ? "bg-action-blue text-white shadow-md shadow-action-blue/15"
                        : "text-slate-blue hover:text-action-blue bg-slate-50 hover:bg-slate-100"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search & Sort combo */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex items-center bg-slate-50 border border-slate-150 rounded-2xl px-4 py-2.5 focus-within:border-action-blue/50 focus-within:bg-white transition-all w-full sm:w-[240px]">
                  <SearchIcon size={14} className="text-slate-blue shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari armada..."
                    className="bg-transparent text-xs font-bold text-midnight-indigo placeholder:text-slate-blue/45 focus:outline-none w-full"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="text-slate-blue hover:text-action-blue">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div ref={sortRef} className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center justify-between bg-slate-50 border border-slate-150 hover:bg-slate-100/50 rounded-2xl px-4 py-2.5 w-full sm:w-auto min-w-[170px] text-xs font-bold text-midnight-indigo transition-all cursor-pointer text-left focus:outline-none"
                  >
                    <div className="flex items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-blue/60 mr-2 shrink-0">
                        Urutkan:
                      </span>
                      <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                    </div>
                    <ChevronDown size={13} className={`text-slate-blue transition-transform duration-200 shrink-0 ml-2 ${isSortOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full sm:w-[170px] bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${sortBy === opt.value
                              ? "bg-action-blue/10 text-action-blue"
                              : "text-slate-blue hover:bg-slate-50 hover:text-midnight-indigo"
                            }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && (
                            <span className="w-1.5 h-1.5 rounded-full bg-action-blue" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center h-10 w-10 rounded-2xl text-slate-blue hover:bg-slate-100 hover:text-action-blue transition-colors border border-slate-200"
                    title="Reset Filter"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Content Results */}
            <div className="mb-6 flex justify-between items-center px-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-blue/60">
                Menampilkan {visibleBuses.length} dari {filtered.length} armada
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-blue/30 mb-4 border border-slate-100 shadow-sm">
                  <BusIcon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-midnight-indigo mb-2">Unit Tidak Ditemukan</h3>
                <p className="text-xs font-medium text-slate-blue max-w-sm mb-6">
                  Tidak ada bus yang sesuai dengan kriteria filter Anda saat ini.
                </p>
                <Button onClick={clearFilters} className="rounded-full px-8 font-bold">
                  Hapus Semua Filter
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {visibleBuses.map((bus, i) => (
                    <FleetCard key={bus.id} bus={bus} index={i} inView onViewDetail={setSelectedBus} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
                      className="rounded-full px-10 h-12 text-xs font-bold border-slate-200 hover:border-action-blue hover:text-action-blue bg-white shadow-sm"
                    >
                      Muat Lebih Banyak ({remaining > PER_PAGE ? PER_PAGE : remaining} lagi)
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Bottom CTA Banner */}
            <div className="mt-20 relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0038a8] to-[#006bff] p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,107,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Section: Icon and Content */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full md:w-auto">
                {/* Icon Circle (Glassmorphism) */}
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 shadow-inner">
                  <Phone size={26} className="text-white" strokeWidth={1.8} />
                </div>

                {/* Text Content */}
                <div className="space-y-1.5">
                  <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Belum menemukan armada yang sesuai?
                  </h4>
                  <p className="text-sm md:text-base font-medium text-white/80 max-w-xl leading-relaxed">
                    Hubungi kami untuk konsultasi dan rekomendasi armada terbaik sesuai kebutuhan perjalanan Anda.
                  </p>
                </div>
              </div>

              {/* Right Section: Button */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-white hover:bg-white/95 px-8 text-sm font-bold text-[#006bff] shadow-lg active:scale-95 transition-all w-full sm:w-auto shrink-0 cursor-pointer"
              >
                Hubungi Kami
                <Phone size={16} strokeWidth={2.2} />
              </a>
            </div>

          </div>
        </section>
      </div>
      {selectedBus && (
        <FleetDetailModal bus={selectedBus} onClose={() => setSelectedBus(null)} />
      )}
    </PublicLayout>
  );
}
