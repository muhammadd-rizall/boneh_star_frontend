import { useState, useEffect, useMemo } from "react";
import { publicService } from "@/features/public/shared/services/publicService";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory";
import { Bus as BusIcon, Armchair, Calendar, Search, SlidersHorizontal, X } from "lucide-react";
import Loader from "@/components/feedback/Loader";

export default function FleetCatalogFeature() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [categories, setCategories] = useState<BusCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
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

  const hasFilters = search || selectedCategory || minSeats;

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
      {/* Page Header */}
      <div className="bg-slate-950 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500 mb-3">Katalog Armada</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Temukan Bus yang{" "}
            <span className="text-orange-400">Tepat Untuk Anda.</span>
          </h1>
          <p className="mt-4 text-base font-medium text-slate-400 max-w-xl leading-relaxed">
            Jelajahi seluruh koleksi armada kami. Filter berdasarkan kategori, kapasitas, atau nama untuk menemukan unit yang sesuai.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[68px] z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2.5 flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:border-orange-200 focus-within:bg-white transition-all">
              <Search size={16} className="text-slate-300 shrink-0" />
              <input
                type="text"
                placeholder="Cari nama, brand, atau plat..."
                className="bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:border-orange-200 focus-within:bg-white transition-all">
              <SlidersHorizontal size={16} className="text-slate-300 shrink-0" />
              <select
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none appearance-none pr-4"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Seats Filter */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:border-orange-200 focus-within:bg-white transition-all w-full sm:w-44">
              <Armchair size={16} className="text-slate-300 shrink-0" />
              <input
                type="number"
                placeholder="Min. kursi"
                className="bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none w-full"
                value={minSeats}
                onChange={(e) => setMinSeats(e.target.value)}
              />
            </div>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
              >
                <X size={14} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Results count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-400">
            Menampilkan <span className="text-slate-900">{filtered.length}</span> dari {buses.length} unit
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-5">
              <BusIcon size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tidak Ada Hasil</h3>
            <p className="text-sm font-medium text-slate-400 max-w-sm">
              Tidak ditemukan bus yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bus, i) => {
              const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
              const imageUrl = resolveMediaUrl(primaryImage?.url);
              const facilities = bus.facilities?.slice(0, 3) || [];

              return (
                <div
                  key={bus.id}
                  className="group flex flex-col rounded-2xl bg-white border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={bus.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-200">
                        <BusIcon size={48} strokeWidth={1} />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md shadow-sm">
                      {bus.category?.name || "Premium"}
                    </div>

                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-2.5 py-1 backdrop-blur-md">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tersedia</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                      {bus.name}
                    </h3>
                    {bus.brand && (
                      <p className="mt-0.5 text-xs font-medium text-slate-400">{bus.brand}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Armchair size={14} className="text-slate-300" />
                        <span className="text-xs font-semibold">{bus.seat_count} Kursi</span>
                      </div>
                      {bus.production_year && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar size={14} className="text-slate-300" />
                          <span className="text-xs font-semibold">{bus.production_year}</span>
                        </div>
                      )}
                    </div>

                    {facilities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {facilities.map((f) => (
                          <span
                            key={f.id}
                            className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500 border border-slate-100"
                          >
                            {f.name}
                          </span>
                        ))}
                        {(bus.facilities?.length || 0) > 3 && (
                          <span className="inline-flex rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-500 border border-orange-100">
                            +{(bus.facilities?.length || 0) - 3} lagi
                          </span>
                        )}
                      </div>
                    )}
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
