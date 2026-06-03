import { useState, useEffect, useMemo } from "react";
import PublicLayout from "@/layouts/public/PublicLayout";
import { useFleetData } from "@/features/public/fleet/hooks/useFleetData";
import { Bus as BusIcon, Armchair, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Loader from "@/components/feedback/Loader";
import Search from "@/components/ui/Search";
import { FleetCard } from "@/features/public/fleet";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 9;

export default function FleetPage() {
  const { buses, categories, loading } = useFleetData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const filtered = useMemo(() => {
    let result = [...buses];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brand?.toLowerCase().includes(q) ||
          b.plat_number?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((b) => b.category?.name === selectedCategory);
    }
    if (minSeats) {
      const count = parseInt(minSeats, 10);
      if (!isNaN(count) && count > 0) result = result.filter((b) => b.seat_count >= count);
    }
    return result;
  }, [buses, search, selectedCategory, minSeats]);

  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [search, selectedCategory, minSeats]);

  const visibleBuses = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const hasMore = remaining > 0;

  const hasFilters = !!(search || selectedCategory || minSeats);
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinSeats("");
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex h-[60vh] items-center justify-center bg-white">
          <Loader />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-cloud-mist/40 border-b border-platinum-tint/50">
          <div className="mx-auto max-w-7xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
              Katalog Armada
            </span>
            <h1 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
              Jelajahi Armada <span className="text-action-blue">Premium Kami.</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-blue max-w-xl opacity-80">
              Gunakan filter untuk menemukan unit yang sesuai dengan kebutuhan perjalanan Anda.
            </p>
          </div>
        </div>

        <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-xl border-b border-platinum-tint">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="flex-1">
                <Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Cari nama bus, brand, atau plat nomor..."
                />
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-cloud-mist border border-platinum-tint hover:border-action-blue/30 transition-colors focus-within:border-action-blue/50 min-w-[170px] flex-1 sm:flex-none relative">
                  <SlidersHorizontal size={15} className="text-action-blue shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-blue leading-none mb-0.5">
                      Kategori
                    </span>
                    <div className="relative flex items-center">
                      <select
                        className="bg-transparent text-sm font-bold text-midnight-indigo focus:outline-none appearance-none cursor-pointer w-full pr-5"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Semua</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-0 text-slate-blue pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-cloud-mist border border-platinum-tint hover:border-action-blue/30 transition-colors focus-within:border-action-blue/50 min-w-[120px] flex-1 sm:flex-none">
                  <Armchair size={15} className="text-action-blue shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-blue leading-none mb-0.5">
                      Min. Kursi
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-sm font-bold text-midnight-indigo placeholder:text-platinum-tint focus:outline-none w-full"
                      value={minSeats}
                      onChange={(e) => setMinSeats(e.target.value)}
                    />
                  </div>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center h-10 w-10 rounded-xl text-slate-blue hover:bg-cloud-mist hover:text-action-blue transition-colors border border-platinum-tint"
                    title="Reset Filter"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm font-medium text-slate-blue mb-6">
            Menampilkan {visibleBuses.length} dari {filtered.length} armada
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-cloud-mist/50 rounded-2xl border border-dashed border-platinum-tint">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-blue/30 mb-4 border border-platinum-tint shadow-sm">
                <BusIcon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-midnight-indigo mb-2">Unit Tidak Ditemukan</h3>
              <p className="text-sm font-medium text-slate-blue max-w-sm mb-6">
                Tidak ada bus yang sesuai dengan filter Anda.
              </p>
              <Button onClick={clearFilters} className="rounded-full px-8 font-bold">
                Hapus Semua Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {visibleBuses.map((bus, i) => (
                  <FleetCard key={bus.id} bus={bus} index={i} inView />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
                    className="rounded-full px-10 h-12 font-bold border-platinum-tint hover:border-action-blue hover:text-action-blue"
                  >
                    Muat Lebih Banyak ({remaining > PER_PAGE ? PER_PAGE : remaining} lagi)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
