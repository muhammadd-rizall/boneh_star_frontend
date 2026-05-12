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
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border border-slate-100 mb-5">
            <HelpCircle size={13} />
            Bantuan & FAQ
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Informasi Penting{" "}
            <br className="hidden sm:block" />
            <span className="text-slate-400">Untuk Perjalanan Anda.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-xl transition-all duration-400 border ${
                openIndex === index 
                  ? "border-orange-100 bg-orange-50/30 shadow-md shadow-orange-50" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left outline-none"
              >
                <span className={`text-sm sm:text-base font-bold pr-4 ${openIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                  {faq.question}
                </span>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  openIndex === index ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-400"
                }`}>
                  {openIndex === index ? <Minus size={15} /> : <Plus size={15} />}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-500 leading-relaxed font-medium text-sm">
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
