import { useState, useEffect, useMemo } from "react";
import { publicService } from "@/features/public/shared/services/publicService";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory";
import { Bus as BusIcon, Armchair, SlidersHorizontal, X, LayoutGrid, ChevronDown } from "lucide-react";
import Loader from "@/components/feedback/Loader";
import Search from "@/components/ui/Search";

export default function FleetCatalogFeature() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [categories, setCategories] = useState<BusCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minSeats, setMinSeats] = useState("");

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
      if (!isNaN(count) && count > 0) {
        result = result.filter((b) => b.seat_count >= count);
      }
    }

    return result;
  }, [buses, search, selectedCategory, minSeats]);

  const hasFilters = !!(search || selectedCategory || minSeats);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinSeats("");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <LayoutGrid size={12} />
            Katalog Armada
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl leading-[1.1]">
            Temukan Bus yang <br />
            <span className="text-orange-400">Tepat Untuk Anda.</span>
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-400 max-w-2xl leading-relaxed">
            Jelajahi koleksi armada premium kami. Gunakan filter untuk menemukan unit yang paling sesuai dengan kebutuhan perjalanan rombongan Anda.
          </p>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="flex-1">
              <Search 
                value={search} 
                onChange={setSearch} 
                placeholder="Cari nama bus, brand, atau plat nomor..." 
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all focus-within:border-orange-200 focus-within:bg-white min-w-[200px] flex-1 sm:flex-none relative group/select">
                <SlidersHorizontal size={18} className="text-slate-400" />
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">Kategori</span>
                  <div className="relative flex items-center">
                    <select
                      className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer w-full pr-6"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Semua</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none group-hover/select:text-orange-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all focus-within:border-orange-200 focus-within:bg-white min-w-[140px] flex-1 sm:flex-none">
                <Armchair size={18} className="text-slate-400" />
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">Min. Kursi</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none w-full"
                    value={minSeats}
                    onChange={(e) => setMinSeats(e.target.value)}
                  />
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center h-12 w-12 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90 border border-transparent hover:border-rose-100"
                  title="Reset Filter"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Unit</h2>
            <p className="text-sm font-bold text-slate-400 mt-1">
              Menampilkan {filtered.length} armada yang tersedia
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-slate-200 shadow-sm mb-6">
              <BusIcon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Unit Tidak Ditemukan</h3>
            <p className="text-base font-medium text-slate-400 max-w-sm mb-8">
              Maaf, tidak ada bus yang sesuai dengan kriteria filter Anda saat ini.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Hapus Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bus, i) => {
              const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
              const imageUrl = resolveMediaUrl(primaryImage?.url);
              const facilities = bus.facilities?.slice(0, 3) || [];

              return (
                <div
                  key={bus.id}
                  className="group flex flex-col rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: (i * 50) + "ms" }}
                >
                  <div className="relative aspect-[1.4] overflow-hidden m-3 rounded-[2rem]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={bus.name}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-200">
                        <BusIcon size={48} strokeWidth={1} />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-800 backdrop-blur-md shadow-sm border border-white/20">
                      {bus.category?.name || "Premium"}
                    </div>

                    <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-1.5 shadow-lg shadow-emerald-500/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Ready</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-8 pt-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                        {bus.name}
                      </h3>
                      {bus.brand && (
                        <p className="mt-1 text-sm font-bold text-slate-400 uppercase tracking-tighter">{bus.brand}</p>
                      )}

                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                          <Armchair size={15} className="text-orange-500" />
                          <span className="text-xs font-black">{bus.seat_count} Seats</span>
                        </div>
                        {bus.production_year && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                            <BusIcon size={15} className="text-orange-500" />
                            <span className="text-xs font-black">Gen {bus.production_year}</span>
                          </div>
                        )}
                      </div>

                      {facilities.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {facilities.map((f) => (
                            <span
                              key={f.id}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-500 shadow-sm"
                            >
                              {f.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
