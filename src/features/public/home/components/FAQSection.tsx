import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

const faqs = [
  {
    question: "Bagaimana cara melakukan pemesanan bus?",
    answer: "Pemesanan bus dapat dilakukan secara online dengan membuat akun customer terlebih dahulu, kemudian memilih tanggal, tipe bus, dan melengkapi data perjalanan. Anda juga bisa menghubungi tim marketing kami langsung via WhatsApp untuk dipandu."
  },
  {
    question: "Apakah bisa membatalkan atau reschedule pemesanan?",
    answer: "Ya, pembatalan atau perubahan jadwal (reschedule) dapat dilakukan dengan menghubungi admin kami. Ketentuan mengenai pengembalian dana (refund) atau pemindahan tanggal disesuaikan dengan kebijakan waktu pembatalan."
  },
  {
    question: "Apakah tersedia layanan untuk luar kota atau luar pulau?",
    answer: "Tentu saja. Boneh Star menyediakan layanan sewa bus pariwisata baik untuk perjalanan dalam kota, luar kota, antar kota antar provinsi (AKAP), hingga perjalanan lintas pulau sesuai kebutuhan agenda perjalanan Anda."
  },
  {
    question: "Berapa hari sebelumnya pemesanan harus dilakukan?",
    answer: "Kami merekomendasikan pemesanan dilakukan paling lambat 7 hingga 14 hari sebelum tanggal keberangkatan. Untuk peak season (musim liburan/hari raya), disarankan memesan jauh-jauh hari agar ketersediaan armada terjamin."
  },
  {
    question: "Apakah harga sudah termasuk driver dan BBM?",
    answer: "Ya, tarif yang kami tawarkan sudah termasuk jasa pengemudi (driver) profesional dan biaya bahan bakar (BBM). Biaya parkir, tol, penyeberangan kapal, serta tips & uang makan driver biasanya ditanggung oleh pihak penyewa."
  },
  {
    question: "Apakah tersedia diskon untuk rombongan besar?",
    answer: "Kami menawarkan harga khusus atau potongan harga menarik untuk pemesanan rombongan besar, instansi sekolah/perusahaan, atau penyewaan lebih dari satu unit bus. Hubungi admin kami untuk penawaran terbaik."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView(0.1);

  // Split FAQs evenly into 2 columns
  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

  const renderFaqItem = (faq: typeof faqs[0], actualIndex: number) => {
    const isOpen = openIndex === actualIndex;
    return (
      <div
        key={actualIndex}
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? "border-action-blue/20 bg-slate-50/30 shadow-sm"
            : "border-slate-100 bg-white hover:border-action-blue/20"
        }`}
      >
        {/* Trigger Button */}
        <button
          onClick={() => setOpenIndex(isOpen ? null : actualIndex)}
          className="flex w-full items-center justify-between p-5 text-left outline-none group cursor-pointer"
        >
          <span className={`text-[14.5px] font-bold pr-4 transition-colors duration-300 ${
            isOpen ? "text-action-blue" : "text-midnight-indigo group-hover:text-action-blue"
          }`}>
            {faq.question}
          </span>
          <div className="shrink-0 text-slate-400 group-hover:text-action-blue transition-colors duration-300">
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-action-blue" : "rotate-0"}`} 
            />
          </div>
        </button>

        {/* Expandable Panel */}
        <div className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}>
          <div className="overflow-hidden">
            <div className="px-5 pb-5 text-[13px] leading-relaxed text-slate-blue/80 font-medium pt-1 border-t border-slate-50/50">
              {faq.answer}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`mb-16 text-center flex flex-col items-center reveal ${inView ? "in-view" : ""}`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006bff] mb-3 block">
            PERTANYAAN YANG SERING DIAJUKAN &gt;
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight-indigo">
            FAQ
          </h2>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className={`grid gap-6 md:grid-cols-2 md:items-start reveal ${inView ? "in-view" : ""}`}>
          
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {leftFaqs.map((faq, index) => renderFaqItem(faq, index))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {rightFaqs.map((faq, index) => renderFaqItem(faq, half + index))}
          </div>

        </div>

      </div>
    </section>
  );
}
