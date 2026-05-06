import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { 
  MapPin,
  Bus as BusIcon,
  Calendar,
  Users,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useState, useEffect } from "react";
import { publicService } from "@/features/public/services/publicService";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";
import Button from "@/components/ui/Button";

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
    <section className="relative min-h-screen w-full overflow-hidden bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Content Left */}
          <div className="flex flex-col animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-100 px-4 py-1.5 w-fit">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Premium Charter Service
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-slate-950 sm:text-7xl leading-[0.95]">
              Perjalanan Nyaman <br />
              <span className="text-orange-500">Tanpa Batas.</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-500">
              {profile.description ||
                "Solusi transportasi rombongan dengan standar layanan terbaik. Aman, nyaman, dan profesional untuk setiap momen berharga Anda."}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full shadow-xl shadow-slate-200" onClick={handleSendInquiry} suffix={ArrowRight}>
                Pesan Sekarang
              </Button>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-950 text-white flex items-center justify-center text-[10px] font-bold">
                  +2k
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400">Dipercaya oleh ribuan pelanggan</p>
            </div>
          </div>

          {/* Visual Right */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Premium Bus"
                className="w-full h-auto drop-shadow-2xl"
              />
              
              {/* Minimalist Floating Cards */}
              <div className="absolute -top-10 -right-10 hidden xl:block animate-bounce-slow">
                <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-200 border border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <BusIcon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950">40+ Armada</p>
                      <p className="text-[10px] font-bold text-slate-400">Unit Terbaru</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Inquiry Bar */}
        <div className="mt-20">
          <form 
            onSubmit={handleSendInquiry}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 rounded-[2.5rem] bg-white p-4 shadow-2xl shadow-slate-200/60 border border-slate-50"
          >
            <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] hover:bg-slate-50 transition-colors">
              <MapPin className="text-orange-500" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destinasi</span>
                <input
                  type="text"
                  placeholder="Mau kemana?"
                  className="bg-transparent text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none w-full"
                  value={formData.tujuan}
                  onChange={e => setFormData({...formData, tujuan: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] hover:bg-slate-50 transition-colors">
              <BusIcon className="text-orange-500" size={20} />
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Armada</span>
                <select
                  className="bg-transparent text-sm font-bold text-slate-950 focus:outline-none w-full appearance-none"
                  value={formData.jenisBus}
                  onChange={e => setFormData({...formData, jenisBus: e.target.value})}
                >
                  <option value="">Pilih Jenis</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] hover:bg-slate-50 transition-colors">
              <Calendar className="text-orange-500" size={20} />
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durasi</span>
                <select
                  className="bg-transparent text-sm font-bold text-slate-950 focus:outline-none w-full appearance-none"
                  value={formData.durasi}
                  onChange={e => setFormData({...formData, durasi: e.target.value})}
                >
                  <option value="">Berapa lama?</option>
                  {[1,2,3,4,5].map(d => (
                    <option key={d} value={d}>{d} Hari</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] hover:bg-slate-50 transition-colors">
              <Users className="text-orange-500" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kapasitas</span>
                <input
                  type="number"
                  placeholder="Jumlah orang"
                  className="bg-transparent text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none w-full"
                  value={formData.penumpang}
                  onChange={e => setFormData({...formData, penumpang: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="h-full rounded-[2rem] shadow-lg shadow-orange-500/20" size="lg">
              Cek Harga
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
