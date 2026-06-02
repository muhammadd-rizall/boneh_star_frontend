import { useState, useEffect, useMemo } from "react";
import { publicService } from "@/features/public/shared/services/publicService";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory";
import { Bus as BusIcon, Armchair, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Loader from "@/components/feedback/Loader";
import Search from "@/components/ui/Search";

const PER_PAGE = 9;

export default function FleetCatalogFeature() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [categories, setCategories] = useState<BusCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  useEffect(() => {
    const load = async () => {
      try {
        const [busData, catData] = await Promise.all([
          publicService.getBuses(),
          publicService.getBusCategories(),
        ]);
        setBuses(busData.filter((b) => b.status === "available"));
        setCategories(catData);
      } catch (err) {
        console.error("Failed to load fleet data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...buses];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.brand?.toLowerCase().includes(q) || b.plat_number?.toLowerCase().includes(q)
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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [search, selectedCategory, minSeats]);

  const visibleBuses = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const hasMore = remaining > 0;

  const hasFilters = !!(search || selectedCategory || minSeats);
  const clearFilters = () => { setSearch(""); setSelectedCategory(""); setMinSeats(""); };

  if (loading) return <div className="flex h-[60vh] items-center justify-center bg-white"><Loader /></div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header — clean, no hero */}
      <div className="pt-28 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Katalog Armada
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Jelajahi koleksi armada premium kami. Gunakan filter untuk menemukan unit yang sesuai dengan kebutuhan Anda.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[52px] z-30 bg-white/90 backdrop-blur-xl border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="flex-1">
              <Search value={search} onChange={setSearch} placeholder="Cari nama bus, brand, atau plat nomor..." />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors focus-within:border-slate-300 min-w-[170px] flex-1 sm:flex-none relative">
                <SlidersHorizontal size={15} className="text-slate-400" />
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400 leading-none mb-0.5">Kategori</span>
                  <div className="relative flex items-center">
                    <select className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none appearance-none cursor-pointer w-full pr-5" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="">Semua</option>
                      {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                    </select>
                    <ChevronDown size={12} className="absolute right-0 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors focus-within:border-slate-300 min-w-[120px] flex-1 sm:flex-none">
                <Armchair size={15} className="text-slate-400" />
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400 leading-none mb-0.5">Min. Kursi</span>
                  <input type="number" placeholder="0" className="bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none w-full" value={minSeats} onChange={(e) => setMinSeats(e.target.value)} />
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors" title="Reset Filter"><X size={16} /></button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs text-slate-400 mb-6">
          Menampilkan {visibleBuses.length} dari {filtered.length} armada
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-200 mb-4"><BusIcon size={24} strokeWidth={1.5} /></div>
            <h3 className="text-base font-medium text-slate-900 mb-1">Unit Tidak Ditemukan</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-5">Tidak ada bus yang sesuai dengan filter Anda.</p>
            <button onClick={clearFilters} className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">Hapus Semua Filter</button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBuses.map((bus) => {
                const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
                const imageUrl = resolveMediaUrl(primaryImage?.url);
                const facilities = bus.facilities?.slice(0, 3) || [];
                return (
                  <div key={bus.id} className="group flex flex-col rounded-xl bg-white border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300">
                    <div className="relative aspect-[1.4] overflow-hidden">
                      {imageUrl ? (<img src={imageUrl} alt={bus.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />) : (<div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-200"><BusIcon size={48} strokeWidth={1} /></div>)}
                      <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-600 backdrop-blur-sm">{bus.category?.name || "Premium"}</div>
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-emerald-500/90 px-2 py-1 backdrop-blur-sm"><div className="h-1.5 w-1.5 rounded-full bg-white" /><span className="text-[10px] font-medium text-white uppercase tracking-wider">Ready</span></div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-medium text-slate-900">{bus.name}</h3>
                      {bus.brand && <p className="mt-0.5 text-xs text-slate-400">{bus.brand}</p>}
                      <div className="mt-3.5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-500"><Armchair size={14} className="text-slate-300" /><span className="text-xs font-medium">{bus.seat_count} Seats</span></div>
                        {bus.production_year && (<div className="flex items-center gap-1.5 text-slate-500"><BusIcon size={14} className="text-slate-300" /><span className="text-xs font-medium">{bus.production_year}</span></div>)}
                      </div>
                      {facilities.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {facilities.map((f) => (<span key={f.id} className="px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-medium text-slate-500">{f.name}</span>))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Muat Lebih Banyak ({remaining > PER_PAGE ? PER_PAGE : remaining} lagi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
