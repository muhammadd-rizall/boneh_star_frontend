import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User as UserIcon, Mail, Lock, Phone, MapPin, Save } from "lucide-react";
import type { Customer, CustomerFormData } from "../types/Customer";
import { customerService } from "../services/CustomerService";

interface CustomerFormProps {
  customer?: Customer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const isEdit = !!customer;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        is_active: customer.is_active,
        password: "",
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      if (isEdit && customer) {
        await customerService.update(customer.id, submitData);
      } else {
        await customerService.create(submitData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="Enter customer name"
          icon={UserIcon}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="customer@example.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label={isEdit ? "Password (Leave blank to keep current)" : "Password"}
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEdit}
        />

        <Input
          label="Phone Number"
          placeholder="e.g. 08123456789"
          icon={Phone}
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="w-full">
        <label className="ml-1 mb-1.5 block text-sm font-medium text-slate-700">Address</label>
        <div className="relative group">
          <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <MapPin size={18} />
          </div>
          <textarea
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 min-h-[100px]"
            placeholder="Enter customer address"
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <label htmlFor="is_active" className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id="is_active"
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">Customer is active</span>
            <span className="text-sm text-slate-500">Customer can access the platform and make bookings.</span>
          </span>
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
