import { useState } from "react";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

const faqs = [
  {
    question: "Bagaimana cara memesan bus di Boneh Star?",
    answer: "Anda dapat memesan melalui formulir 'Pesan Perjalanan' di dashboard customer setelah membuat akun, atau langsung menghubungi admin kami melalui WhatsApp. Kami akan menghitung estimasi biaya dan memberikan penawaran harga resmi dalam waktu singkat."
  },
  {
    question: "Apakah harga sewa sudah termasuk BBM dan supir?",
    answer: "Ya, seluruh penawaran harga kami sudah termasuk biaya bahan bakar (BBM) dan jasa pengemudi (supir) profesional. Biaya eksternal seperti tol, parkir, penyeberangan kapal (jika ada), serta akomodasi supir disesuaikan dengan rute perjalanan Anda."
  },
  {
    question: "Berapa kapasitas penumpang maksimal yang tersedia?",
    answer: "Kami menyediakan berbagai pilihan kapasitas armada: Micro Bus (15-19 kursi), Medium Bus (31-35 kursi), hingga Big Bus Executive dengan kapasitas 45 sampai 59 kursi yang dapat Anda pilih sesuai kebutuhan rombongan."
  },
  {
    question: "Apakah ada asuransi untuk setiap perjalanan?",
    answer: "Tentu. Keselamatan dan ketenangan Anda adalah prioritas utama. Setiap penumpang dan kru armada Boneh Star dilindungi oleh asuransi perjalanan resmi selama masa sewa berlangsung."
  },
  {
    question: "Bagaimana kebijakan pembatalan pemesanan?",
    answer: "Pembatalan dapat diajukan melalui sistem dashboard customer atau dengan menghubungi admin. Kebijakan pengembalian dana (refund) akan disesuaikan dengan jangka waktu pembatalan sebelum tanggal keberangkatan yang telah disepakati."
  },
  {
    question: "Bisakah memilih titik jemput dan drop off?",
    answer: "Tentu saja. Anda bebas menentukan titik lokasi penjemputan dan penurunan (drop off) sesuai dengan kebutuhan agenda perjalanan Anda, selama akses jalan dapat dilalui armada bus dengan aman."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView(0.1);

  // Divide FAQs into two lists for 2-column layout to prevent row-stretching
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
            ? "border-action-blue/20 bg-slate-50/40 shadow-sm"
            : "border-slate-100 bg-white hover:border-action-blue/20"
        }`}
      >
        {/* Trigger Button */}
        <button
          onClick={() => setOpenIndex(isOpen ? null : actualIndex)}
          className="flex w-full items-center justify-between p-5 text-left outline-none group cursor-pointer"
        >
          <span className={`text-sm font-bold pr-4 transition-colors duration-300 ${
            isOpen ? "text-action-blue" : "text-midnight-indigo group-hover:text-action-blue"
          }`}>
            {faq.question}
          </span>
          <div className="shrink-0 text-slate-400 group-hover:text-action-blue transition-colors duration-300">
            <ChevronRight 
              size={16} 
              className={`transition-transform duration-300 ${isOpen ? "rotate-90 text-action-blue" : "rotate-0"}`} 
            />
          </div>
        </button>

        {/* Expandable Panel */}
        <div className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}>
          <div className="overflow-hidden">
            <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-blue/80 font-medium pt-1 border-t border-slate-50/50">
              {faq.answer}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={"mb-12 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue mb-3">
            INFORMASI PENTING
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo">
            Pertanyaan yang Sering Diajukan
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
