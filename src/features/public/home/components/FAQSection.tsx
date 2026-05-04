import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Bagaimana cara memesan bus di Boneh Star?",
    answer: "Anda dapat memesan melalui formulir 'Cek Harga Cepat' di bagian atas halaman ini, atau langsung menghubungi admin kami melalui tombol WhatsApp yang tersedia. Kami akan memberikan penawaran harga resmi dalam waktu singkat."
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
    answer: "Pembatalan dapat dilakukan dengan menghubungi admin kami. Kebijakan pengembalian dana (refund) akan disesuaikan dengan jangka waktu pembatalan sebelum tanggal keberangkatan yang telah disepakati."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600 mb-4">Paling Sering Ditanyakan</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Informasi Tambahan.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-[32px] border transition-all duration-300 ${
                openIndex === index 
                  ? "border-orange-200 bg-orange-50/30" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-8 text-left"
              >
                <span className={`text-lg font-bold ${openIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                  {faq.question}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  openIndex === index ? "bg-orange-500 text-white rotate-180" : "bg-slate-100 text-slate-400"
                }`}>
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-500 leading-relaxed font-medium">
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
