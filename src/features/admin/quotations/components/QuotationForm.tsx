import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
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
  MessageSquare
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
  
  const user = useAuthStore((state) => state.user);

  const [bookings, setBookings] = useState<{label: string, value: string}[]>([]);

  const [formData, setFormData] = useState<QuotationFormData>({
    booking_id: "",
    user_id: user?.id || "",
    proposed_price: 0,
    dp_amount: 0,
    note_to_customer: "",
    status: "draft",
    valid_until: "",
    revision_note: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setFetchingData(true);
        const { bookings } = await bookingService.getAll();
        setBookings(bookings.map(b => ({ 
          label: `${b.booking_code} - ${b.customer?.name} (${b.origin})`, 
          value: b.id 
        })));
      } catch (err: any) {
        setError("Failed to fetch bookings.");
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
        status: quotation.status,
        valid_until: quotation.valid_until ? quotation.valid_until.split(' ')[0] : "",
        revision_note: quotation.revision_note || "",
      });
    }
  }, [quotation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && quotation) {
        await quotationService.update(quotation.id, formData);
      } else {
        await quotationService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Sent", value: "sent" },
    { label: "Accepted", value: "accepted" },
    { label: "Revision", value: "revision" },
    { label: "Expired", value: "expired" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label="Booking"
          options={bookings}
          icon={FileText}
          value={formData.booking_id}
          onChange={(value) => setFormData({ ...formData, booking_id: value })}
          placeholder={fetchingData ? "Loading bookings..." : "Select booking"}
          required
        />

        <Select
          label="Quotation Status"
          options={statusOptions}
          icon={Info}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as QuotationStatus })}
          required
        />

        <Input
          label="Proposed Price (IDR)"
          type="number"
          min="0"
          icon={Banknote}
          value={formData.proposed_price.toString()}
          onChange={(e) => setFormData({ ...formData, proposed_price: parseFloat(e.target.value) })}
          required
        />

        <Input
          label="DP Amount (IDR)"
          type="number"
          min="0"
          icon={Banknote}
          value={formData.dp_amount.toString()}
          onChange={(e) => setFormData({ ...formData, dp_amount: parseFloat(e.target.value) })}
          required
        />

        <Input
          label="Valid Until"
          type="date"
          icon={Calendar}
          value={formData.valid_until}
          onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
          required
        />
      </div>

      <Textarea
        label="Note to Customer"
        placeholder="Detailed explanation of the price, facilities included, etc."
        icon={MessageSquare}
        value={formData.note_to_customer}
        onChange={(e) => setFormData({ ...formData, note_to_customer: e.target.value })}
        required
      />

      {(formData.status === 'revision' || isEdit) && (
        <Textarea
          label="Revision Note"
          placeholder="Reason for revision or rejected note..."
          icon={StickyNote}
          value={formData.revision_note || ""}
          onChange={(e) => setFormData({ ...formData, revision_note: e.target.value })}
        />
      )}

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Quotation" : "Create Quotation"}
        </Button>
      </div>
    </form>
  );
}
