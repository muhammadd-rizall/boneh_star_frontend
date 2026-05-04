import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { 
  MapPin,
  Bus as BusIcon,
  Calendar,
  Users,
  Search
} from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useState, useEffect } from "react";
import { publicService } from "@/features/public/services/publicService";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

interface HeroCategoryOption {
  id: string;
  name: string;
}

export default function Hero() {
  const { profile } = usePublicCompanyProfile();
  const [categories, setCategories] = useState<HeroCategoryOption[]>([]);
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
        const mappedCategories: HeroCategoryOption[] = Array.from(
          new Map<string, HeroCategoryOption>(
            (buses || [])
              .filter((bus: any) => bus?.bus_category?.id && bus?.bus_category?.name)
              .map((bus: any) => [
                String(bus.bus_category.id),
                { id: String(bus.bus_category.id), name: bus.bus_category.name },
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

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = profile.whatsapp?.[0] || "";
    const text = `Halo ${profile.company_name}, saya ingin menanyakan penawaran bus:
- Tujuan: ${formData.tujuan || "-"}
- Jenis Bus: ${formData.jenisBus || "-"}
- Durasi: ${formData.durasi || "-"} hari
- Jumlah Penumpang: ${formData.penumpang || "-"} orang

Mohon informasinya, terima kasih.`;
    
    const waLink = buildWhatsAppHref(whatsappNumber) + `&text=${encodeURIComponent(text)}`;
    window.open(waLink, "_blank");
  };

  return (
    <section className="relative min-h-[95vh] w-full overflow-hidden bg-white pt-24">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-2/3 bg-orange-50/50 [clip-path:ellipse(80%_60%_at_0%_0%)]" />
      <div className="absolute bottom-0 right-0 -z-10 h-1/2 w-1/3 bg-slate-50/50 [clip-path:circle(60%_at_100%_100%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center py-12 lg:py-20">
          {/* Visual Left */}
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <img
                src={heroImage}
                alt="Premium Bus"
                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 rounded-3xl bg-white p-6 shadow-2xl shadow-orange-600/10 animate-bounce-slow">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <BusIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">40+ Armada Aktif</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Siap Melayani Anda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Right */}
          <div className="flex flex-col order-1 lg:order-2 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                Premium Transport Service
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.05]">
              Nikmati <br />
              <span className="text-orange-500">Perjalanan</span> Terbaik.
            </h1>

            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-500">
              {profile.description ||
                "Solusi transportasi rombongan dengan standar layanan kelas dunia. Aman, nyaman, dan tepat waktu untuk setiap momen berharga Anda."}
            </p>

            <div className="mt-10 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">24/7</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Support</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">4.9/5</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trusted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Search Bar Bottom */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 w-full max-w-5xl px-4 z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <form 
            onSubmit={handleSendInquiry}
            className="flex flex-col lg:flex-row items-center gap-1 rounded-[32px] bg-white/70 p-2 shadow-2xl shadow-slate-200/50 backdrop-blur-3xl border border-white"
          >
            {/* Field: Tujuan */}
            <div className="flex w-full items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 rounded-[24px]">
              <MapPin className="text-orange-500 shrink-0" size={20} />
              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destinasi</label>
                <input
                  type="text"
                  placeholder="Kemana tujuan Anda?"
                  className="bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
                  value={formData.tujuan}
                  onChange={e => setFormData({...formData, tujuan: e.target.value})}
                />
              </div>
            </div>

            <div className="hidden lg:block h-10 w-px bg-slate-100" />

            {/* Field: Jenis Bus */}
            <div className="flex w-full items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 rounded-[24px]">
              <BusIcon className="text-orange-500 shrink-0" size={20} />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jenis Bus</label>
                <select
                  className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none w-full appearance-none cursor-pointer"
                  value={formData.jenisBus}
                  onChange={e => setFormData({...formData, jenisBus: e.target.value})}
                >
                  <option value="">Pilih Armada</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden lg:block h-10 w-px bg-slate-100" />

            {/* Field: Durasi */}
            <div className="flex w-full items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 rounded-[24px]">
              <Calendar className="text-orange-500 shrink-0" size={20} />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durasi</label>
                <select
                  className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none w-full appearance-none cursor-pointer"
                  value={formData.durasi}
                  onChange={e => setFormData({...formData, durasi: e.target.value})}
                >
                  <option value="">Waktu Sewa</option>
                  {[1,2,3,4,5].map(d => (
                    <option key={d} value={d}>{d} Hari</option>
                  ))}
                  <option value="5+">Lebih dari 5 Hari</option>
                </select>
              </div>
            </div>

            <div className="hidden lg:block h-10 w-px bg-slate-100" />

            {/* Field: Penumpang */}
            <div className="flex w-full items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 rounded-[24px]">
              <Users className="text-orange-500 shrink-0" size={20} />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kapasitas</label>
                <input
                  type="number"
                  placeholder="Jumlah Orang"
                  className="bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
                  value={formData.penumpang}
                  onChange={e => setFormData({...formData, penumpang: e.target.value})}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="group flex h-14 w-full lg:w-14 items-center justify-center rounded-[24px] bg-orange-600 text-white shadow-xl shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-95 lg:shrink-0"
            >
              <Search className="hidden lg:block transition-transform group-hover:scale-110" size={24} />
              <span className="lg:hidden text-sm font-bold flex items-center gap-2">
                <Search size={18} />
                Cek Penawaran
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
