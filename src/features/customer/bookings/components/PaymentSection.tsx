import React from 'react';
import type { CustomerTransaction } from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { CreditCard, Upload, ExternalLink, Clock, CheckCircle2, XCircle, Landmark } from 'lucide-react';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';

interface Props {
  transaction: CustomerTransaction;
  paymentMethods: PaymentMethod[];
  onUpload: (data: any) => Promise<void>;
}

export default function PaymentSection({ transaction, paymentMethods, onUpload }: Props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    payment_method_id: '',
    amount: transaction.remaining_amount,
    payment_type: 'dp',
    payment_date: new Date().toISOString().split('T')[0],
    transfer_proof: null as File | null,
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payment_method_id || !formData.transfer_proof) return;
    setLoading(true);
    try {
      await onUpload(formData);
      setIsUploading(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={12} strokeWidth={3} /> Verified</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest"><XCircle size={12} strokeWidth={3} /> Rejected</span>;
      default: return <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest"><Clock size={12} strokeWidth={3} /> Pending</span>;
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Bank Accounts */}
      <div className="flex flex-col gap-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Rekening Pembayaran</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} padding="sm" className="bg-slate-50 border-none shadow-sm shadow-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Landmark size={20} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">{method.bank_name}</p>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-950">{method.account_number}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">a.n {method.account_name}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Riwayat Pembayaran</h3>
          <Button 
            size="sm" 
            variant="outline"
            icon={Upload} 
            onClick={() => setIsUploading(true)} 
            disabled={transaction.status === 'fully_paid'}
            className="rounded-xl border-slate-100 font-bold"
          >
            Konfirmasi Bayar
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {transaction.payments?.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">Belum ada pembayaran yang tercatat</p>
            </div>
          ) : (
            transaction.payments?.map((payment) => (
              <Card key={payment.id} padding="sm" className="flex items-center justify-between border-none shadow-md shadow-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    payment.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-base font-black tracking-tight text-slate-950">{formatCurrency(payment.amount)}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {payment.payment_type} • {formatDate(payment.payment_date)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {getStatusBadge(payment.status)}
                    {payment.rejection_reason && <p className="mt-1 text-[10px] font-bold text-rose-400 italic">"{payment.rejection_reason}"</p>}
                  </div>
                  <a 
                    href={resolveMediaUrl(payment.transfer_proof)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Upload Form */}
      {isUploading && (
        <Card className="border-none shadow-2xl shadow-orange-100/50 bg-orange-50/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-orange-100/50 pb-4">
              <div className="flex items-center gap-3 text-orange-600">
                <Upload size={20} strokeWidth={2.5} />
                <h4 className="text-sm font-black uppercase tracking-widest">Konfirmasi Pembayaran</h4>
              </div>
              <button type="button" onClick={() => setIsUploading(false)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors">Batal</button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rekening Tujuan</label>
                <select 
                  className="rounded-2xl border border-slate-100 bg-white p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                  required
                  value={formData.payment_method_id}
                  onChange={(e) => setFormData({ ...formData, payment_method_id: e.target.value })}
                >
                  <option value="">Pilih Rekening</option>
                  {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.bank_name} - {m.account_number}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Jumlah Transfer</label>
                <input 
                  type="number" 
                  className="rounded-2xl border border-slate-100 bg-white p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Bayar</label>
                <select 
                  className="rounded-2xl border border-slate-100 bg-white p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                  required
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                >
                  <option value="dp">Uang Muka (DP)</option>
                  <option value="settlement">Pelunasan</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Transfer</label>
                <input 
                  type="date" 
                  className="rounded-2xl border border-slate-100 bg-white p-3.5 text-sm font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  required
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bukti Transfer (JPG/PNG)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-orange-600 file:text-white hover:file:bg-orange-700 file:cursor-pointer transition-all"
                    required
                    onChange={(e) => setFormData({ ...formData, transfer_proof: e.target.files?.[0] || null })}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full shadow-xl shadow-orange-600/20" size="lg">
              Kirim Konfirmasi Pembayaran
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
