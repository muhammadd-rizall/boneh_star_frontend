import React from 'react';
import type { CustomerTransaction } from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { CreditCard, Upload, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';
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
      case 'verified': return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 size={12} /> TERVERIFIKASI</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600"><XCircle size={12} /> DITOLAK</span>;
      default: return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><Clock size={12} /> MENUNGGU</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Bank Accounts */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Rekening Tujuan</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} padding="sm" className="bg-slate-50 border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">{method.bank_name}</p>
              <p className="mt-1 text-lg font-black text-slate-900">{method.account_number}</p>
              <p className="text-xs font-bold text-slate-500">a.n {method.account_name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Riwayat Pembayaran</h3>
          <Button size="xs" icon={Upload} onClick={() => setIsUploading(true)} disabled={transaction.status === 'fully_paid'}>
            Unggah Bukti
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {transaction.payments?.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center">
              <p className="text-xs font-medium text-slate-400">Belum ada pembayaran yang diunggah</p>
            </div>
          ) : (
            transaction.payments?.map((payment) => (
              <Card key={payment.id} padding="sm" className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {payment.payment_type.toUpperCase()} • {formatDate(payment.payment_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {getStatusBadge(payment.status)}
                    {payment.rejection_reason && <p className="mt-0.5 text-[10px] text-rose-500">{payment.rejection_reason}</p>}
                  </div>
                  <a 
                    href={resolveMediaUrl(payment.transfer_proof)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal Content (Simplified as a section if visible) */}
      {isUploading && (
        <Card className="border-orange-200 bg-orange-50/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Form Unggah Bukti Pembayaran</h4>
              <button type="button" onClick={() => setIsUploading(false)} className="text-xs font-bold text-rose-600">Batal</button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Rekening Tujuan</label>
                <select 
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                  required
                  value={formData.payment_method_id}
                  onChange={(e) => setFormData({ ...formData, payment_method_id: e.target.value })}
                >
                  <option value="">-- Pilih Rekening --</option>
                  {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.bank_name} - {m.account_number}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Jumlah Transfer</label>
                <input 
                  type="number" 
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Jenis Pembayaran</label>
                <select 
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                  required
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                >
                  <option value="dp">Uang Muka (DP)</option>
                  <option value="settlement">Pelunasan</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Tanggal Transfer</label>
                <input 
                  type="date" 
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                  required
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Bukti Transfer (Gambar)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                  required
                  onChange={(e) => setFormData({ ...formData, transfer_proof: e.target.files?.[0] || null })}
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Kirim Bukti Pembayaran
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
