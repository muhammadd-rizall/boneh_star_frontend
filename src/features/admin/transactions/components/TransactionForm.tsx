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
  Calculator
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
        setError("Failed to fetch required data.");
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

  // Handle Quotation Selection and auto-fill total amount
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

  // Recalculate remaining amount when DP changes
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
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Waiting Payment", value: "waiting" },
    { label: "DP Paid", value: "dp_paid" },
    { label: "Fully Paid", value: "fully_paid" },
    { label: "Overdue", value: "overdue" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Invoice Number (Optional)"
          placeholder="Auto-generated if left empty"
          icon={Receipt}
          value={formData.invoice_number}
          onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
        />

        <Select
          label="Booking"
          options={bookings}
          icon={FileText}
          value={formData.booking_id}
          onChange={(value) => setFormData({ ...formData, booking_id: value })}
          placeholder={fetchingData ? "Loading..." : "Select booking"}
          required
        />

        <Select
          label="Quotation Reference"
          options={quotations}
          icon={Calculator}
          value={formData.quotation_id}
          onChange={handleQuotationChange}
          placeholder={fetchingData ? "Loading..." : "Select quotation"}
          required
        />

        <Select
          label="Transaction Status"
          options={statusOptions}
          icon={Info}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as TransactionStatus })}
          required
        />

        <Input
          label="Total Amount (IDR)"
          type="number"
          min="0"
          icon={Banknote}
          value={formData.total_amount.toString()}
          onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
          required
        />

        <Input
          label="DP Paid (IDR)"
          type="number"
          min="0"
          icon={Banknote}
          value={formData.dp_paid.toString()}
          onChange={(e) => setFormData({ ...formData, dp_paid: parseFloat(e.target.value) })}
          required
        />

        <Input
          label="Remaining Amount (IDR)"
          type="number"
          icon={Banknote}
          value={formData.remaining_amount.toString()}
          disabled
          className="bg-slate-50 opacity-80"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Transaction" : "Create Invoice"}
        </Button>
      </DialogFooter>
    </form>
  );
}
