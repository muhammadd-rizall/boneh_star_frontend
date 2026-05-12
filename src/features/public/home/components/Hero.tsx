import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { 
  MapPin,
  Bus as BusIcon,
  Calendar,
  Users,
  ArrowRight,
  Play,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useState, useEffect } from "react";
import { publicService } from "@/features/public/shared/services/publicService";
import { Button } from "@/components/ui/Button";
import type { Bus } from "@/features/admin/buses/types/Bus";

interface HeroCategoryOption {
  id: string;
  name: string;
}

export default function Hero() {
  const { profile } = usePublicCompanyProfile();
  const [categories, setCategories] = useState<HeroCategoryOption[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: Bus[]; message: string } | null>(null);
  const [formData, setFormData] = useState({
    tujuan: "",
    jenisBus: "",
    durasi: "",
    penumpang: ""
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const buses = await publicService.getBuses();
        setAllBuses(buses.filter((b) => b.status === "available"));
        const mappedCategories: HeroCategoryOption[] = Array.from(
          new Map<string, HeroCategoryOption>(
            (buses || [])
              .filter((bus: any) => bus?.category?.id && bus?.category?.name)
              .map((bus: any) => [
                String(bus.category.id),
                { id: String(bus.category.id), name: bus.category.name },
              ]),
          ).values(),
        );

        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to load bus categories for hero form:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);

    // Small delay to show loading state
    await new Promise((r) => setTimeout(r, 500));

    let filtered = [...allBuses];

    // Filter by category
    if (formData.jenisBus) {
      filtered = filtered.filter(
        (b) => b.category?.name === formData.jenisBus
      );
    }

    // Filter by passenger count (bus seat_count must be >= requested)
    if (formData.penumpang) {
      const count = parseInt(formData.penumpang, 10);
      if (!isNaN(count) && count > 0) {
        filtered = filtered.filter((b) => b.seat_count >= count);
      }
    }

    const message =
      filtered.length > 0
        ? `${filtered.length} unit bus tersedia untuk perjalanan Anda!`
        : "Maaf, tidak ada bus yang sesuai dengan kriteria Anda saat ini.";

    setResult({ available: filtered, message });
    setChecking(false);

    // Scroll to armada section to show available buses
    if (filtered.length > 0) {
      setTimeout(() => {
        document.getElementById("armada")?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  };

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium Bus Fleet"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl pt-24 pb-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white/80">
              Premium Charter Service
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Perjalanan Nyaman{" "}
            <br className="hidden sm:block" />
            <span className="text-orange-400">Tanpa Batas.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-base sm:text-lg font-medium leading-relaxed text-white/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {profile.description ||
              "Solusi transportasi rombongan dengan standar layanan terbaik. Aman, nyaman, dan profesional untuk setiap momen berharga Anda."}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-bold shadow-xl shadow-orange-600/20 bg-orange-500 hover:bg-orange-600 border-orange-500 text-white"
              onClick={() => document.getElementById('inquiry-bar')?.scrollIntoView({ behavior: 'smooth' })}
              suffix={ArrowRight}
            >
              Cek Ketersediaan
            </Button>
            <a
              href="#armada"
              className="group inline-flex items-center gap-3 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                <Play size={14} className="ml-0.5" />
              </span>
              Lihat Armada
            </a>
          </div>
        </div>

        {/* Inquiry Bar — Floating at bottom */}
        <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
          <div className="mx-auto max-w-7xl">
            <form
              id="inquiry-bar"
              onSubmit={handleCheckAvailability}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 rounded-2xl bg-white/10 backdrop-blur-xl p-3 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <MapPin className="text-orange-400 shrink-0" size={18} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Destinasi</span>
                  <input
                    type="text"
                    placeholder="Mau kemana?"
                    className="bg-transparent text-sm font-semibold text-white placeholder:text-white/25 focus:outline-none w-full"
                    value={formData.tujuan}
                    onChange={e => setFormData({...formData, tujuan: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <BusIcon className="text-orange-400 shrink-0" size={18} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Armada</span>
                  <select
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none w-full appearance-none"
                    value={formData.jenisBus}
                    onChange={e => setFormData({...formData, jenisBus: e.target.value})}
                  >
                    <option value="" className="text-slate-900">Pilih Jenis</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} className="text-slate-900">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Calendar className="text-orange-400 shrink-0" size={18} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Durasi</span>
                  <select
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none w-full appearance-none"
                    value={formData.durasi}
                    onChange={e => setFormData({...formData, durasi: e.target.value})}
                  >
                    <option value="" className="text-slate-900">Berapa lama?</option>
                    {[1,2,3,4,5].map(d => (
                      <option key={d} value={d} className="text-slate-900">{d} Hari</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Users className="text-orange-400 shrink-0" size={18} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Kapasitas</span>
                  <input
                    type="number"
                    placeholder="Jumlah orang"
                    className="bg-transparent text-sm font-semibold text-white placeholder:text-white/25 focus:outline-none w-full"
                    value={formData.penumpang}
                    onChange={e => setFormData({...formData, penumpang: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" loading={checking} className="h-full rounded-xl bg-orange-500 hover:bg-orange-600 border-orange-500 text-white font-bold shadow-lg shadow-orange-500/20" size="lg">
                {checking ? "Mengecek..." : "Cek Ketersediaan"}
              </Button>
            </form>

            {/* Result notification */}
            {result && (
              <div className={`mt-3 flex items-center gap-3 rounded-xl px-5 py-3 backdrop-blur-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                result.available.length > 0
                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
                  : "bg-red-500/15 border-red-500/20 text-red-300"
              }`}>
                {result.available.length > 0 ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <XCircle size={16} className="shrink-0" />
                )}
                <span className="text-sm font-semibold">{result.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
