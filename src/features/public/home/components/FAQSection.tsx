import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

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

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
            <HelpCircle size={14} />
            Bantuan & FAQ
          </span>
          <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[1.1]">
            Informasi Penting <br />
            <span className="text-slate-400 italic">Untuk Perjalanan Anda.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-[2.5rem] transition-all duration-500 border ${
                openIndex === index 
                  ? "border-orange-100 bg-orange-50/20 shadow-xl shadow-orange-100/30" 
                  : "border-slate-50 bg-white hover:border-slate-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-8 text-left outline-none"
              >
                <span className={`text-lg font-black tracking-tight ${openIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                  {faq.question}
                </span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                  openIndex === index ? "bg-orange-600 text-white rotate-180" : "bg-slate-50 text-slate-400"
                }`}>
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="text-slate-500 leading-relaxed font-semibold text-sm">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
