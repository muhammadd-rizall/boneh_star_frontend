import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { transactionService } from "../services/TransactionService";
import type { Transaction, TransactionFormData, TransactionStatus } from "../types/Transaction";
import { bookingService } from "@/features/admin/bookings/services/BookingService";
import { quotationService } from "@/features/admin/quotations/services/QuotationService";
import { 
  FileText, 
  Banknote, 
  Receipt,
  Info,
  Save,
  Calculator,
  XCircle,
  ClipboardList
} from "lucide-react";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const isEdit = !!transaction;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<{label: string, value: string}[]>([]);
  const [quotations, setQuotations] = useState<{label: string, value: string, price: number}[]>([]);

  const [formData, setFormData] = useState<TransactionFormData>({
    booking_id: "",
    quotation_id: "",
    invoice_number: "",
    total_amount: 0,
    dp_paid: 0,
    remaining_amount: 0,
    status: "waiting",
  });

  useEffect(() => {
    const fetchData = async ( ) => {
      try {
        setFetchingData(true);
        const [bookingsRes, quotationsRes] = await Promise.all([
          bookingService.getAll(),
          quotationService.getAll(),
        ]);

        setBookings(bookingsRes.bookings.map(b => ({ 
          label: `${b.booking_code} - ${b.customer?.name}`, 
          value: b.id 
        })));
        
        setQuotations(quotationsRes.quotations.map(q => ({ 
          label: `QTN-${q.booking?.booking_code} (${new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(q.proposed_price)})`, 
          value: q.id,
          price: q.proposed_price
        })));
      } catch (err: any) {
        setError("Gagal mengambil data pendukung.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData({
        booking_id: transaction.booking_id,
        quotation_id: transaction.quotation_id,
        invoice_number: transaction.invoice_number,
        total_amount: transaction.total_amount,
        dp_paid: transaction.dp_paid,
        remaining_amount: transaction.remaining_amount,
        status: transaction.status,
      });
    }
  }, [transaction]);

  const handleQuotationChange = (val: string) => {
    const selected = quotations.find(q => q.value === val);
    if (selected) {
      const remaining = selected.price - formData.dp_paid;
      setFormData({
        ...formData,
        quotation_id: val,
        total_amount: selected.price,
        remaining_amount: remaining > 0 ? remaining : 0
      });
    } else {
      setFormData({ ...formData, quotation_id: val });
    }
  };

  useEffect(() => {
    const remaining = formData.total_amount - formData.dp_paid;
    setFormData(prev => ({
      ...prev,
      remaining_amount: remaining > 0 ? remaining : 0
    }));
  }, [formData.dp_paid, formData.total_amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && transaction) {
        await transactionService.update(transaction.id, formData);
      } else {
        await transactionService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Menunggu Pembayaran", value: "waiting" },
    { label: "DP Dibayar", value: "dp_paid" },
    { label: "Lunas", value: "fully_paid" },
    { label: "Terlambat", value: "overdue" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <ClipboardList size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Detail Transaksi</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Kelola rincian tagihan dan status pembayaran</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nomor Invoice (Opsional)"
            placeholder="Otomatis jika dikosongkan"
            icon={Receipt}
            value={formData.invoice_number}
            onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
          />

          <Select
            label="Pesanan (Booking)"
            options={bookings}
            icon={FileText}
            value={formData.booking_id}
            onChange={(value) => setFormData({ ...formData, booking_id: value })}
            placeholder={fetchingData ? "Memuat..." : "Pilih pesanan"}
            required
          />

          <Select
            label="Referensi Penawaran"
            options={quotations}
            icon={Calculator}
            value={formData.quotation_id}
            onChange={handleQuotationChange}
            placeholder={fetchingData ? "Memuat..." : "Pilih penawaran"}
            required
          />

          <Select
            label="Status Transaksi"
            options={statusOptions}
            icon={Info}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as TransactionStatus })}
            required
          />

          <Input
            label="Total Tagihan (Rp)"
            type="number"
            min="0"
            icon={Banknote}
            value={formData.total_amount.toString()}
            onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
            required
          />

          <Input
            label="DP Dibayarkan (Rp)"
            type="number"
            min="0"
            icon={Banknote}
            value={formData.dp_paid.toString()}
            onChange={(e) => setFormData({ ...formData, dp_paid: parseFloat(e.target.value) })}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Sisa Tagihan (Rp)"
              type="number"
              icon={Banknote}
              value={formData.remaining_amount.toString()}
              disabled
              className="bg-cloud-mist/50 font-bold text-midnight-indigo"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="outline" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo h-14">Batal</Button>
        <Button type="submit" variant="primary" className="sm:flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Perbarui Transaksi" : "Terbitkan Invoice"}
        </Button>
      </DialogFooter>
    </form>
  );
}
