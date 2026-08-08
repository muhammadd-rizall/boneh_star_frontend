import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import { quotationService } from "../services/QuotationService";
import type { Quotation, QuotationFormData, QuotationStatus } from "../types/Quotation";
import { bookingService } from "@/features/admin/bookings/services/BookingService";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  FileText, 
  Banknote, 
  Calendar, 
  StickyNote, 
  Info,
  Save,
  MessageSquare,
  XCircle,
  ClipboardList
} from "lucide-react";

interface QuotationFormProps {
  quotation?: Quotation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuotationForm({ quotation, onSuccess, onCancel }: QuotationFormProps) {
  const isEdit = !!quotation;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split(' ')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {}
    return dateStr;
  };
  
  const getFutureDateStr = (daysAhead: number, departureDateStr?: string) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    if (departureDateStr) {
      try {
        const depDate = new Date(departureDateStr);
        depDate.setHours(0, 0, 0, 0);

        const hMinus1 = new Date(depDate);
        hMinus1.setDate(hMinus1.getDate() - 1);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Batasi tanggal maksimum penawaran ke H-1 keberangkatan (atau keberangkatan jika H-1 di masa lalu)
        const maxAllowed = hMinus1 >= today ? hMinus1 : depDate;

        if (targetDate > maxAllowed) {
          return maxAllowed.toISOString().split('T')[0];
        }
      } catch (e) {}
    }

    return targetDate.toISOString().split('T')[0];
  };

  const getHMinus1DateStr = (departureDateStr: string) => {
    try {
      const depDate = new Date(departureDateStr);
      depDate.setHours(0, 0, 0, 0);

      const hMinus1 = new Date(depDate);
      hMinus1.setDate(hMinus1.getDate() - 1);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = hMinus1 >= today ? hMinus1 : depDate;
      return result.toISOString().split('T')[0];
    } catch (e) {
      return getFutureDateStr(3);
    }
  };

  const user = useAuthStore((state) => state.user);

  const [bookings, setBookings] = useState<{label: string, value: string}[]>([]);
  const [rawBookings, setRawBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setFetchingData(true);
        const { bookings: rawList } = await bookingService.getAll();
        setRawBookings(rawList);
        setBookings(rawList.map(b => ({ 
          label: `${b.booking_code} - ${b.customer?.name} (${b.origin})`, 
          value: b.id 
        })));
      } catch (err: any) {
        setError("Gagal mengambil data pesanan.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (quotation) {
      setFormData({
        booking_id: quotation.booking_id,
        user_id: quotation.user_id,
        proposed_price: quotation.proposed_price,
        dp_amount: quotation.dp_amount,
        note_to_customer: quotation.note_to_customer,
        // Jika status penawaran sebelumnya 'revision', otomatis ubah ke 'sent' agar customer dapat langsung merespons
        status: quotation.status === 'revision' ? 'sent' : quotation.status,
        valid_until: quotation.valid_until ? quotation.valid_until.split(' ')[0] : getFutureDateStr(3),
        revision_note: quotation.revision_note || "",
      });
    }
  }, [quotation]);

  const [formData, setFormData] = useState<QuotationFormData>({
    booking_id: "",
    user_id: user?.id || "",
    proposed_price: 0,
    dp_amount: 0,
    note_to_customer: "",
    status: "sent",
    valid_until: getFutureDateStr(3),
    revision_note: "",
  });

  const selectedBooking = rawBookings.find(b => b.id === formData.booking_id);

  // Otomatis batasi valid_until agar tidak melebihi H-1 keberangkatan pesanan yang dipilih
  useEffect(() => {
    if (selectedBooking?.departure_date && formData.valid_until) {
      const maxAllowedStr = getHMinus1DateStr(selectedBooking.departure_date);
      if (formData.valid_until > maxAllowedStr) {
        setFormData(prev => ({ ...prev, valid_until: maxAllowedStr }));
      }
    }
  }, [formData.booking_id, selectedBooking?.departure_date]);

  const parsedRevision = (() => {
    if (!formData.revision_note) return null;
    try {
      const parsed = JSON.parse(formData.revision_note);
      if (parsed && typeof parsed === 'object' && ('proposed_price' in parsed || 'note' in parsed)) {
        return parsed as { proposed_price?: number; note?: string };
      }
    } catch (e) {
      // Fallback
    }
    return null;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = { ...formData };
    // If admin is transitioning status out of revision, auto-clear the revision_note
    if (formData.status !== 'revision' && quotation?.status === 'revision') {
      submitData.revision_note = "";
    }

    try {
      if (isEdit && quotation) {
        await quotationService.update(quotation.id, submitData);
      } else {
        await quotationService.create(submitData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Terkirim", value: "sent" },
    { label: "Diterima", value: "accepted" },
    { label: "Revisi", value: "revision" },
    { label: "Kedaluwarsa", value: "expired" },
    { label: "Ditolak", value: "rejected" },
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
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Detail Penawaran</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Atur rincian harga dan validitas penawaran</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Select
            label="Pesanan (Booking)"
            options={bookings}
            icon={FileText}
            value={formData.booking_id}
            onChange={(value) => setFormData({ ...formData, booking_id: value })}
            placeholder={fetchingData ? "Memuat data pesanan..." : "Pilih pesanan"}
            required
          />

          <div className="flex flex-col gap-1">
            <Select
              label="Status Penawaran"
              options={statusOptions}
              icon={Info}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as QuotationStatus })}
              required
            />
            {quotation?.status === 'revision' && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5 mt-1">
                <Info size={12} className="shrink-0" />
                Status otomatis diset ke "Terkirim" agar pelanggan dapat langsung menyetujui atau menawar kembali.
              </p>
            )}
          </div>

          <Input
            label="Harga Penawaran (Rp)"
            type="number"
            min="0"
            icon={Banknote}
            value={formData.proposed_price.toString()}
            onChange={(e) => setFormData({ ...formData, proposed_price: parseFloat(e.target.value) })}
            required
          />

          <Input
            label="Jumlah DP (Rp)"
            type="number"
            min="0"
            icon={Banknote}
            value={formData.dp_amount.toString()}
            onChange={(e) => setFormData({ ...formData, dp_amount: parseFloat(e.target.value) })}
            required
          />

          <div className="flex flex-col gap-2">
            <Input
              label="Masa Berlaku Penawaran (Berlaku Hingga)"
              type="date"
              icon={Calendar}
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              hint="Batas waktu bagi pelanggan untuk menyetujui penawaran ini."
              required
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-steel-gray">Pilihan Cepat:</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, valid_until: getFutureDateStr(3, selectedBooking?.departure_date) }))}
                className="px-2.5 py-1 rounded-lg bg-cloud-mist hover:bg-pale-gray text-midnight-indigo border border-pale-gray text-[11px] font-bold transition-all cursor-pointer"
              >
                +3 Hari
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, valid_until: getFutureDateStr(7, selectedBooking?.departure_date) }))}
                className="px-2.5 py-1 rounded-lg bg-cloud-mist hover:bg-pale-gray text-midnight-indigo border border-pale-gray text-[11px] font-bold transition-all cursor-pointer"
              >
                +7 Hari
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, valid_until: getFutureDateStr(14, selectedBooking?.departure_date) }))}
                className="px-2.5 py-1 rounded-lg bg-cloud-mist hover:bg-pale-gray text-midnight-indigo border border-pale-gray text-[11px] font-bold transition-all cursor-pointer"
              >
                +14 Hari
              </button>
              {selectedBooking?.departure_date && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, valid_until: getHMinus1DateStr(selectedBooking.departure_date) }))}
                  className="px-2.5 py-1 rounded-lg bg-action-blue/10 hover:bg-action-blue/20 text-action-blue border border-action-blue/20 text-[11px] font-bold transition-all cursor-pointer"
                >
                  H-1 Keberangkatan
                </button>
              )}
            </div>
            {selectedBooking?.departure_date && (
              <p className="text-[11px] font-semibold text-action-blue flex items-start gap-1.5 mt-1 bg-action-blue/5 p-2.5 rounded-lg border border-action-blue/10">
                <Info size={13} className="shrink-0 mt-0.5" />
                <span>
                  Batas akhir persetujuan penawaran adalah H-1 sebelum keberangkatan. (Batas Maksimal: <strong>{formatDateIndo(getHMinus1DateStr(selectedBooking.departure_date))}</strong>, Tanggal Berangkat: <strong>{formatDateIndo(selectedBooking.departure_date)}</strong>).
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <MessageSquare size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Pesan &amp; Catatan</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Informasi tambahan untuk pelanggan</p>
          </div>
        </div>

        {parsedRevision && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2">
              <MessageSquare className="text-amber-600" size={16} />
              <h4 className="text-sm font-bold text-amber-900">Pengajuan Negosiasi Pelanggan</h4>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700/80">Harga yang Ditawarkan Pelanggan</span>
                <p className="text-lg font-black text-amber-950 mt-0.5">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parsedRevision.proposed_price || 0)}
                </p>
              </div>
              <div className="flex sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 text-xs font-bold py-2 px-4 rounded-xl shadow-sm cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      proposed_price: parsedRevision.proposed_price || prev.proposed_price,
                      dp_amount: Math.round((parsedRevision.proposed_price || 0) * 0.3),
                      status: 'sent',
                    }));
                  }}
                >
                  Terapkan Harga &amp; Set "Terkirim"
                </Button>
              </div>
            </div>

            {parsedRevision.note && (
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700/80">Catatan Pelanggan</span>
                <p className="text-xs font-medium text-amber-950 mt-1 italic leading-relaxed bg-white/60 p-3 rounded-xl border border-amber-200/30">
                  "{parsedRevision.note}"
                </p>
              </div>
            )}
          </div>
        )}

        <Textarea
          label="Catatan untuk Pelanggan"
          placeholder="Jelaskan detail harga, fasilitas yang termasuk, dsb."
          icon={MessageSquare}
          value={formData.note_to_customer}
          onChange={(e) => setFormData({ ...formData, note_to_customer: e.target.value })}
          required
          rows={4}
        />

        {(formData.status === 'revision' || isEdit) && !parsedRevision && (
          <Textarea
            label="Catatan Revisi"
            placeholder="Alasan revisi atau catatan penolakan..."
            icon={StickyNote}
            value={formData.revision_note || ""}
            onChange={(e) => setFormData({ ...formData, revision_note: e.target.value })}
            rows={3}
          />
        )}
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="outline" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo h-14">Batal</Button>
        <Button type="submit" variant="primary" className="sm:flex-1 font-bold h-14 rounded-xl shadow-button cursor-pointer" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Buat Penawaran"}
        </Button>
      </DialogFooter>
    </form>
  );
}
