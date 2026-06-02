import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

const faqs = [
  {
    question: "Bagaimana cara memesan bus di Boneh Star?",
    answer: "Anda dapat memesan melalui formulir 'Pesan Perjalanan' di dashboard customer, atau langsung menghubungi admin kami melalui tombol WhatsApp yang tersedia. Kami akan memberikan penawaran harga resmi dalam waktu singkat."
  },
  {
    question: "Apakah harga sewa sudah termasuk BBM dan supir?",
    answer: "Ya, seluruh penawaran harga kami sudah termasuk biaya bahan bakar (BBM) dan jasa pengemudi (supir) yang profesional. Biaya tol dan parkir biasanya disesuaikan dengan rute perjalanan Anda."
  },
  {
    question: "Berapa kapasitas penumpang maksimal yang tersedia?",
    answer: "Kami memiliki berbagai kategori armada, mulai dari Micro Bus (15-19 kursi), Medium Bus (31-35 kursi), hingga Big Bus Executive (45-59 kursi) dengan konfigurasi yang bisa disesuaikan."
  },
  {
    question: "Apakah ada asuransi untuk setiap perjalanan?",
    answer: "Tentu. Keamanan adalah prioritas kami. Setiap penumpang dan kru di dalam armada Boneh Star dilindungi oleh asuransi perjalanan resmi selama masa sewa berlangsung."
  },
  {
    question: "Bagaimana jika saya ingin membatalkan pesanan?",
    answer: "Pembatalan dapat dilakukan melalui dashboard Anda. Kebijakan pengembalian dana (refund) akan disesuaikan dengan jangka waktu pembatalan sebelum tanggal keberangkatan yang telah disepakati."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className={"mb-16 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cloud-mist text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
            <HelpCircle size={14} />
            Bantuan & FAQ
          </span>
          <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
            Informasi Penting{" "}
            <br className="hidden sm:block" />
            <span className="text-action-blue">Untuk Perjalanan Anda.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={"rounded-xl transition-all duration-300 border reveal " + (inView ? "in-view " : "") + (
                openIndex === index
                  ? "border-action-blue/30 bg-cloud-mist shadow-sm"
                  : "border-platinum-tint bg-white hover:border-action-blue/50"
              )}
              style={{ "--delay": (index * 60) + "ms" } as React.CSSProperties}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left outline-none group"
              >
                <span className={`text-base sm:text-lg font-bold pr-4 transition-colors ${openIndex === index ? "text-midnight-indigo" : "text-slate-blue group-hover:text-midnight-indigo"}`}>
                  {faq.question}
                </span>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 shadow-sm ${
                  openIndex === index ? "bg-action-blue text-white rotate-0" : "bg-cloud-mist text-slate-blue group-hover:bg-platinum-tint"
                }`}>
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === index ? "300px" : "0px",
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6">
                  <p className="text-slate-blue leading-relaxed font-medium">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
