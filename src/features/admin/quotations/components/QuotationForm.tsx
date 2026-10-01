import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import { formatNumberWithDots, parseDotsToNumber } from "@/utils/formatter";
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
  ClipboardList,
  Sparkles
} from "lucide-react";

interface QuotationFormProps {
  quotation?: Quotation | null;
  bookingId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuotationForm({ quotation, bookingId, onSuccess, onCancel }: QuotationFormProps) {
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

        // Pre-select booking if bookingId is passed
        if (bookingId && !isEdit) {
          const matchedBooking = rawList.find(b => b.id === bookingId);
          if (matchedBooking) {
            const calculatedPrice = calculateEstimatedPrice(matchedBooking);
            const calculatedDp = Math.round(calculatedPrice * 0.3);
            setFormData(prev => ({
              ...prev,
              booking_id: bookingId,
              proposed_price: calculatedPrice,
              dp_amount: calculatedDp
            }));
          }
        }
      } catch (err: any) {
        setError("Gagal mengambil data pesanan.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchBookings();
  }, [bookingId]);

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
  
  const getPriceRecommendation = (booking: any) => {
    if (!booking) return null;

    const depStr = booking.departure_date;
    const retStr = booking.return_date;
    let duration = 1;
    if (depStr) {
      try {
        const dep = new Date(depStr.split(' ')[0] || depStr.split('T')[0]);
        dep.setHours(0, 0, 0, 0);
        if (retStr) {
          const ret = new Date(retStr.split(' ')[0] || retStr.split('T')[0]);
          ret.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(ret.getTime() - dep.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          duration = diffDays || 1;
        }
      } catch (e) {}
    }

    const scope = booking.route_type?.scope; // 'inside' or 'outside'
    let minPerDay = 0;
    let maxPerDay = 0;
    let hasRange = false;

    if (booking.booking_buses && booking.booking_buses.length > 0) {
      booking.booking_buses.forEach((bb: any) => {
        const bus = bb.bus;
        if (bus && bus.category) {
          const category = bus.category;
          if (scope === 'outside') {
            const p = Number(category.price_outside) || 0;
            minPerDay += p;
            maxPerDay += p;
          } else {
            const lo = Number(category.price_inside_min) || 0;
            const hi = Number(category.price_inside_max) || 0;
            minPerDay += lo;
            maxPerDay += hi;
            if (lo !== hi) hasRange = true;
          }
        }
      });
    }

    const categoryCounts: { [key: string]: number } = {};
    if (booking.booking_buses && booking.booking_buses.length > 0) {
      booking.booking_buses.forEach((bb: any) => {
        const bus = bb.bus;
        if (bus && bus.category) {
          categoryCounts[bus.category.name] = (categoryCounts[bus.category.name] || 0) + 1;
        }
      });
    }
    const categoriesFormatted = Object.entries(categoryCounts)
      .map(([name, count]) => `${count}x ${name}`)
      .join(', ');

    const minTotal = minPerDay * duration;
    const maxTotal = maxPerDay * duration;

    return { 
      minPerDay, 
      maxPerDay, 
      minTotal, 
      maxTotal, 
      hasRange, 
      scope, 
      duration, 
      busCount: booking.booking_buses?.length || 0,
      categoriesFormatted
    };
  };

  const priceRecommendation = getPriceRecommendation(selectedBooking);

  // Otomatis batasi valid_until agar tidak melebihi H-1 keberangkatan pesanan yang dipilih
  useEffect(() => {
    if (selectedBooking?.departure_date && formData.valid_until) {
      const maxAllowedStr = getHMinus1DateStr(selectedBooking.departure_date);
      if (formData.valid_until > maxAllowedStr) {
        setFormData(prev => ({ ...prev, valid_until: maxAllowedStr }));
      }
    }
  }, [formData.booking_id, selectedBooking?.departure_date]);

  const calculateEstimatedPrice = (booking: any) => {
    if (!booking) return 0;
    
    const depStr = booking.departure_date;
    const retStr = booking.return_date;
    let duration = 1;
    if (depStr) {
      try {
        const dep = new Date(depStr.split(' ')[0] || depStr.split('T')[0]);
        dep.setHours(0, 0, 0, 0);
        if (retStr) {
          const ret = new Date(retStr.split(' ')[0] || retStr.split('T')[0]);
          ret.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(ret.getTime() - dep.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          duration = diffDays || 1;
        }
      } catch (e) {
        console.error("Error calculating duration:", e);
      }
    }
    
    const scope = booking.route_type?.scope; // 'inside' or 'outside'
    let total = 0;
    
    if (booking.booking_buses && booking.booking_buses.length > 0) {
      booking.booking_buses.forEach((bb: any) => {
        const bus = bb.bus;
        if (bus && bus.category) {
          const category = bus.category;
          let dailyRate = 0;
          if (scope === 'outside') {
            dailyRate = Number(category.price_outside) || 0;
          } else {
            dailyRate = Number(category.price_inside_max) || Number(category.price_inside_min) || 0;
          }
          total += dailyRate * duration;
        }
      });
    }
    
    return total;
  };

  const handleBookingChange = (value: string) => {
    const booking = rawBookings.find(b => b.id === value);
    let calculatedPrice = 0;
    let calculatedDp = 0;

    if (booking) {
      calculatedPrice = calculateEstimatedPrice(booking);
      calculatedDp = Math.round(calculatedPrice * 0.3);
    }

    setFormData(prev => ({
      ...prev,
      booking_id: value,
      proposed_price: calculatedPrice > 0 ? calculatedPrice : prev.proposed_price,
      dp_amount: calculatedPrice > 0 ? calculatedDp : prev.dp_amount,
    }));
  };

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
          {/* Baris 1: Pilihan Pesanan & Status */}
          <Select
            label="Pesanan (Booking)"
            options={bookings}
            icon={FileText}
            value={formData.booking_id}
            onChange={handleBookingChange}
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

          {/* Baris 2: Rekomendasi Tarif (Full-width agar tidak merusak keselarasan grid kolom input) */}
          {priceRecommendation && (
            <div className="col-span-1 md:col-span-2">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 text-xs font-semibold text-slate-600 flex flex-col gap-3.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                    <Sparkles size={13} className="animate-pulse" />
                    Rekomendasi Tarif Panduan
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/50 text-indigo-700">
                    {priceRecommendation.scope === 'inside' ? 'Dalam Kota' : 'Luar Kota'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estimasi Harga Berdasarkan Unit</p>
                  <p className="text-sm font-black text-midnight-indigo">
                    {priceRecommendation.scope === 'inside' ? (
                      <>
                        Rp{" "}
                        <span className="text-indigo-600 font-black">
                          {priceRecommendation.hasRange
                            ? `${formatNumberWithDots(priceRecommendation.minTotal)} - Rp ${formatNumberWithDots(priceRecommendation.maxTotal)}`
                            : formatNumberWithDots(priceRecommendation.minTotal)}
                        </span>
                      </>
                    ) : (
                      <>
                        Rp <span className="text-indigo-600 font-black">{formatNumberWithDots(priceRecommendation.minTotal)}</span>
                      </>
                    )}
                  </p>
                  
                  {/* Perhitungan Detail / Breakdown */}
                  <div className="rounded-2xl bg-slate-100/60 p-3.5 border border-slate-200/40 text-[11px] text-slate-500 font-semibold mt-2.5 flex flex-col gap-2 shadow-sm shadow-slate-100/50">
                    <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest pb-1 border-b border-slate-200/50">Rincian Perhitungan Tarif</span>
                    
                    <div className="flex justify-between items-start gap-4 py-0.5">
                      <span className="text-slate-400">Daftar Armada:</span>
                      <span className="font-bold text-slate-700 text-right">
                        {priceRecommendation.busCount} unit {priceRecommendation.categoriesFormatted && `(${priceRecommendation.categoriesFormatted})`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-dashed border-slate-200/50 pt-1.5">
                      <span className="text-slate-400">Tarif Harian Total:</span>
                      <span className="font-bold text-slate-700">
                        {priceRecommendation.scope === 'inside' ? (
                          priceRecommendation.hasRange
                            ? `Rp ${formatNumberWithDots(priceRecommendation.minPerDay)} - Rp ${formatNumberWithDots(priceRecommendation.maxPerDay)}`
                            : `Rp ${formatNumberWithDots(priceRecommendation.minPerDay)}`
                        ) : (
                          `Rp ${formatNumberWithDots(priceRecommendation.minPerDay)}`
                        )}
                        {" / hari"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-dashed border-slate-200/50 pt-1.5">
                      <span className="text-slate-400">Durasi Sewa:</span>
                      <span className="font-bold text-slate-700">{priceRecommendation.duration} hari</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-slate-600">
                      <span>Total Estimasi:</span>
                      <span className="text-right text-indigo-600 font-black">
                        {priceRecommendation.scope === 'inside' && priceRecommendation.hasRange
                          ? `(Rp ${formatNumberWithDots(priceRecommendation.minPerDay)} - Rp ${formatNumberWithDots(priceRecommendation.maxPerDay)}) × ${priceRecommendation.duration} hari`
                          : `Rp ${formatNumberWithDots(priceRecommendation.minPerDay)} × ${priceRecommendation.duration} hari`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Terapkan Langsung:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          proposed_price: priceRecommendation.minTotal,
                          dp_amount: Math.round(priceRecommendation.minTotal * 0.3)
                        }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                    >
                      Batas Min
                    </button>
                    {priceRecommendation.hasRange && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            proposed_price: priceRecommendation.maxTotal,
                            dp_amount: Math.round(priceRecommendation.maxTotal * 0.3)
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        Batas Max
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Baris 3: Input Nominal Sewa & Uang Muka */}
          <Input
            label="Harga Penawaran (Rp)"
            type="text"
            icon={Banknote}
            value={formatNumberWithDots(formData.proposed_price)}
            onChange={(e) => {
              const price = parseDotsToNumber(e.target.value);
              setFormData({ 
                ...formData, 
                proposed_price: price,
                dp_amount: Math.round(price * 0.3)
              });
            }}
            placeholder="Contoh: 1.000.000"
            required
          />

          <Input
            label="Jumlah DP (Rp)"
            type="text"
            icon={Banknote}
            value={formatNumberWithDots(formData.dp_amount)}
            onChange={(e) => setFormData({ ...formData, dp_amount: parseDotsToNumber(e.target.value) })}
            placeholder="Contoh: 300.000"
            required
          />

          {/* Baris 4: Masa Berlaku Penawaran (Full-width agar simetris) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
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
