import React from 'react';
import type { CustomerTransaction } from '../types/Booking';
import type { PaymentMethod } from '@/types/Database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { formatCurrency, formatDate, formatDateDMY, formatNumberWithDots } from '@/utils/formatter';
import { CreditCard, Upload, ExternalLink, Clock, CheckCircle2, XCircle, Landmark, Copy, Check } from 'lucide-react';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';

interface Props {
  transaction: CustomerTransaction;
  paymentMethods: PaymentMethod[];
  departureDate: string;
  requiredDp?: number;
  onUpload: (data: any) => Promise<void>;
}

export default function PaymentSection({ transaction, paymentMethods, departureDate, requiredDp, onUpload }: Props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Calculate max date (departure date - 1 day)
  // Ambil hanya bagian tanggal (YYYY-MM-DD) untuk menghindari bug timezone UTC vs lokal
  const maxDate = React.useMemo(() => {
    const dateStr = departureDate.slice(0, 10); // "2026-08-21"
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d); // local date, no UTC shift
    date.setDate(date.getDate() - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, [departureDate]);

  const isPastPaymentLimit = React.useMemo(() => {
    if (!departureDate) return false;
    const dateStr = departureDate.slice(0, 10); // "2026-08-21"
    const [y, m, d] = dateStr.split('-').map(Number);
    const departure = new Date(y, m - 1, d); // local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today >= departure;
  }, [departureDate]);

  const pendingPaymentsSum = React.useMemo(() => {
    return transaction.payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  }, [transaction.payments]);

  const effectiveRemaining = Math.max(0, Number(transaction.remaining_amount) - pendingPaymentsSum);

  const dpPaymentStatus = React.useMemo(() => {
    if (Number(transaction.dp_paid) > 0 || transaction.status === 'dp_paid') {
      return 'verified';
    }
    const dpPayment = transaction.payments?.find(p => p.payment_type === 'dp');
    return dpPayment?.status || null; // 'pending' | 'rejected' | null
  }, [transaction.dp_paid, transaction.status, transaction.payments]);

  const settlementPaymentStatus = React.useMemo(() => {
    if (transaction.status === 'fully_paid') {
      return 'verified';
    }
    const settlementPayment = transaction.payments?.find(p => p.payment_type === 'settlement');
    return settlementPayment?.status || null; // 'pending' | 'rejected' | null
  }, [transaction.status, transaction.payments]);

  const hasPaidOrPendingDp = dpPaymentStatus === 'verified' || dpPaymentStatus === 'pending';
  const hasPaidOrPendingSettlement = settlementPaymentStatus === 'verified' || settlementPaymentStatus === 'pending';

  const defaultPaymentType = hasPaidOrPendingDp ? 'settlement' : 'dp';
  // Pastikan requiredDp selalu number (API mengembalikan string decimal "840000.00")
  const requiredDpNum = Number(requiredDp) || 0;
  const defaultAmount = defaultPaymentType === 'dp' 
    ? (requiredDpNum || Math.round(Number(transaction.total_amount) * 0.3)) 
    : Number(transaction.remaining_amount);

  const [formData, setFormData] = React.useState({
    payment_method_id: '',
    amount: defaultAmount as number | string,
    payment_type: defaultPaymentType as 'dp' | 'settlement',
    payment_date: new Date().toISOString().split('T')[0] > maxDate ? maxDate : new Date().toISOString().split('T')[0],
    transfer_proof: null as File | null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selectedMethod = React.useMemo(() => {
    return paymentMethods.find(m => String(m.id) === String(formData.payment_method_id));
  }, [paymentMethods, formData.payment_method_id]);

  // Sync default type and amount if transaction changes or type changes
  React.useEffect(() => {
    const dpNum = Number(requiredDp) || 0;
    setFormData(prev => ({
      ...prev,
      amount: prev.payment_type === 'dp' 
        ? (dpNum || Math.round(Number(transaction.total_amount) * 0.3)) 
        : Number(transaction.remaining_amount)
    }));
  }, [formData.payment_type, transaction.total_amount, transaction.remaining_amount, requiredDp]);

  const handleCopy = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payment_method_id || !formData.transfer_proof) return;
    
    setLoading(true);
    setError(null);
    
    const amountNum = Number(formData.amount);
    
    // Frontend Validations
    if (formData.payment_type === 'dp') {
      // Konversi ke number — API mengembalikan dp_amount sebagai string "840000.00"
      const minDp = Number(requiredDp) || Math.round(Number(transaction.total_amount) * 0.3);
      if (Math.abs(amountNum - minDp) > 0.01) {
        setError(`Jumlah pembayaran uang muka (DP) harus tepat sebesar Rp ${new Intl.NumberFormat('id-ID').format(minDp)}.`);
        setLoading(false);
        return;
      }
    } else if (formData.payment_type === 'settlement') {
      const remaining = Number(transaction.remaining_amount);
      if (Math.abs(amountNum - remaining) > 0.01) {
        setError(`Jumlah pembayaran pelunasan harus tepat sebesar sisa tagihan (Rp ${new Intl.NumberFormat('id-ID').format(remaining)}).`);
        setLoading(false);
        return;
      }
    }

    try {
      await onUpload({
        ...formData,
        amount: amountNum
      });
      setIsUploading(false);
    } catch (err: any) {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const errorMessage = Array.isArray(validationErrors[firstErrorKey]) 
          ? validationErrors[firstErrorKey][0] 
          : validationErrors[firstErrorKey];
        setError(errorMessage);
      } else {
        setError(err.response?.data?.message || "Gagal mengirim konfirmasi pembayaran.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={12} strokeWidth={3} /> Terverifikasi</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest"><XCircle size={12} strokeWidth={3} /> Ditolak</span>;
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
            <Card key={method.id} padding="sm" className="bg-white border border-pale-gray/80 shadow-sm rounded-2xl flex flex-col gap-4 group hover:border-action-blue/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-action-blue/10 text-action-blue shadow-sm">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-midnight-indigo">{method.bank_name}</p>
                    <p className="text-[10px] font-bold text-slate-blue/60 uppercase tracking-widest mt-0.5">a.n {method.account_name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-cloud-mist/50 p-3 rounded-xl border border-pale-gray/30">
                <span className="text-lg font-black tracking-tight text-midnight-indigo tabular-nums">{method.account_number}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(method.account_number, method.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-platinum-tint text-slate-blue hover:text-action-blue hover:border-action-blue/50 transition-all cursor-pointer shadow-sm"
                >
                  {copiedId === method.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  <span>{copiedId === method.id ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Riwayat Pembayaran</h3>
          {!isPastPaymentLimit && (
            <Button 
              size="sm" 
              variant="primary"
              icon={Upload} 
              onClick={() => { setIsUploading(true); setError(null); }} 
              disabled={transaction.status === 'fully_paid' || effectiveRemaining <= 0 || hasPaidOrPendingSettlement}
              className="rounded-xl font-bold bg-action-blue hover:bg-glacier-blue text-white shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Konfirmasi Bayar
            </Button>
          )}
        </div>

        {/* Payment Limit Reached Warning */}
        {isPastPaymentLimit && transaction.status !== 'fully_paid' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm flex items-center gap-2 animate-in fade-in duration-300">
            <XCircle size={16} className="text-red-500 shrink-0" />
            <span>Batas waktu pembayaran telah habis (harus dilakukan sebelum hari keberangkatan).</span>
          </div>
        )}

        {/* Pending Verification Notice */}
        {effectiveRemaining <= 0 && transaction.status !== 'fully_paid' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 text-xs font-semibold text-amber-700 shadow-sm flex items-center gap-2 animate-in fade-in duration-300">
            <Clock size={16} className="text-amber-500 shrink-0 animate-pulse" />
            <span>Pembayaran Anda sedang dalam proses verifikasi oleh Admin. Silakan tunggu verifikasi selesai.</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {transaction.payments?.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">Belum ada pembayaran yang tercatat</p>
            </div>
          ) : (
            transaction.payments?.map((payment) => (
              <Card key={payment.id} padding="sm" className="flex items-center justify-between border border-pale-gray/50 shadow-sm bg-white rounded-2xl hover:border-slate-300 transition-all">
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
                        {payment.payment_type === 'dp' ? 'Uang Muka (DP)' : 'Pelunasan'} • {formatDate(payment.payment_date)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {getStatusBadge(payment.status)}
                    {payment.rejection_reason && <p className="mt-1 text-[10px] font-bold text-rose-450 italic">"{payment.rejection_reason}"</p>}
                  </div>
                  <a 
                    href={resolveMediaUrl(payment.transfer_proof)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm border border-pale-gray/40"
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
        <Card padding="none" className="border border-platinum-tint shadow-lg bg-white rounded-[24px] p-8 sm:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-pale-gray pb-4">
              <div className="flex items-center gap-3 text-action-blue">
                <Upload size={20} strokeWidth={2.5} />
                <h4 className="text-sm font-black uppercase tracking-widest text-midnight-indigo">Konfirmasi Pembayaran</h4>
              </div>
              <button type="button" onClick={() => { setIsUploading(false); setError(null); }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors cursor-pointer">Batal</button>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-sm flex items-center gap-2">
                <XCircle size={16} className="text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rekening Tujuan</label>
                <Select
                  value={formData.payment_method_id}
                  onValueChange={(val) => setFormData({ ...formData, payment_method_id: val || "" })}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-white p-4 h-auto text-sm font-bold text-slate-700 hover:border-slate-350 focus-visible:border-action-blue focus-visible:ring-4 focus-visible:ring-action-blue/10">
                    <SelectValue placeholder="Pilih Rekening">
                      {selectedMethod ? `${selectedMethod.bank_name} - ${selectedMethod.account_number}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-[--anchor-width] min-w-[200px] bg-white border border-platinum-tint shadow-lg rounded-xl z-50">
                    <SelectGroup>
                      {paymentMethods.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.bank_name} - {m.account_number}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Bayar</label>
                <div className="grid grid-cols-2 gap-3 h-full">
                  {/* Uang Muka (DP) Radio */}
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    formData.payment_type === 'dp'
                      ? 'border-action-blue bg-action-blue/5 text-action-blue'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  } ${(dpPaymentStatus === 'verified' || dpPaymentStatus === 'pending') ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}>
                    <input
                      type="radio"
                      name="payment_type"
                      value="dp"
                      disabled={dpPaymentStatus === 'verified' || dpPaymentStatus === 'pending'}
                      checked={formData.payment_type === 'dp'}
                      onChange={() => setFormData({ ...formData, payment_type: 'dp' })}
                      className="accent-action-blue h-4 w-4 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold leading-none">Uang Muka (DP)</span>
                      {(dpPaymentStatus === 'verified' || dpPaymentStatus === 'pending') && (
                        <span className="text-[8px] font-extrabold uppercase tracking-wider mt-1 text-slate-blue">
                          {dpPaymentStatus === 'verified' ? 'Terverifikasi' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Pelunasan Radio */}
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    formData.payment_type === 'settlement'
                      ? 'border-action-blue bg-action-blue/5 text-action-blue'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  } ${(settlementPaymentStatus === 'verified' || settlementPaymentStatus === 'pending') ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}>
                    <input
                      type="radio"
                      name="payment_type"
                      value="settlement"
                      disabled={settlementPaymentStatus === 'verified' || settlementPaymentStatus === 'pending'}
                      checked={formData.payment_type === 'settlement'}
                      onChange={() => setFormData({ ...formData, payment_type: 'settlement' })}
                      className="accent-action-blue h-4 w-4 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold leading-none">Pelunasan</span>
                      {(settlementPaymentStatus === 'verified' || settlementPaymentStatus === 'pending') && (
                        <span className="text-[8px] font-extrabold uppercase tracking-wider mt-1 text-slate-blue">
                          {settlementPaymentStatus === 'verified' ? 'Terverifikasi' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Jumlah Transfer (Terkunci)
                </label>
                <input 
                  type="text" 
                  className="rounded-2xl border border-slate-200 bg-slate-100/60 p-4 text-sm font-bold text-slate-400 outline-none transition-all cursor-not-allowed"
                  required
                  readOnly={true}
                  value={formatNumberWithDots(formData.amount)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Transfer</label>
                <div className="relative min-h-[54px]">
                  <input 
                    type="date" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                    required
                    max={maxDate}
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                  />
                  <div className="pointer-events-none w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 transition-all flex items-center min-h-[54px] peer-focus:border-action-blue peer-focus:ring-2 peer-focus:ring-action-blue/10 hover:border-slate-300">
                    <span>
                      {formData.payment_date ? formatDateDMY(formData.payment_date) : "Pilih tanggal"}
                    </span>
                  </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 ml-1 italic">* Maksimal H-1 sebelum keberangkatan</p>
              </div>

              <div className="flex flex-col gap-2.5 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bukti Transfer (JPG/PNG)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-action-blue/50 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    required
                    onChange={(e) => setFormData({ ...formData, transfer_proof: e.target.files?.[0] || null })}
                  />
                  <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-action-blue transition-colors shadow-sm">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {formData.transfer_proof ? formData.transfer_proof.name : 'Pilih File atau seret foto ke sini'}
                      </p>
                      <p className="text-[10px] font-medium text-slate-blue/60 mt-0.5">
                        {formData.transfer_proof ? `${(formData.transfer_proof.size / 1024 / 1024).toFixed(2)} MB` : 'Maksimal ukuran file 2MB (JPG, PNG)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full bg-action-blue hover:bg-glacier-blue text-white font-bold h-14 rounded-xl shadow-xl shadow-blue-500/10 text-xs sm:text-sm whitespace-normal px-4 sm:px-8 cursor-pointer mt-2"
            >
              Kirim Konfirmasi Pembayaran
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
