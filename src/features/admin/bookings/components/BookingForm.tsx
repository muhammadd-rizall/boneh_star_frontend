import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { bookingService } from "../services/BookingService";
import type { Booking, BookingFormData, BookingStatus, CancelledBy } from "../types/Booking";
import { customerService } from "@/features/admin/customers/services/CustomerService";
import { activityTypeService } from "@/features/admin/activity-types/services/ActivityTypeService";
import { routeTypeService } from "@/features/admin/route-types/services/RouteTypeService";
import { 
  Hash, 
  User as UserIcon, 
  Activity, 
  Map as MapIcon, 
  Calendar, 
  MapPin, 
  Users, 
  Bus, 
  StickyNote, 
  Info,
  XCircle,
  Save
} from "lucide-react";

interface BookingFormProps {
  booking?: Booking | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingForm({ booking, onSuccess, onCancel }: BookingFormProps) {
  const isEdit = !!booking;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<{label: string, value: string}[]>([]);
  const [activities, setActivities] = useState<{label: string, value: string}[]>([]);
  const [routeTypes, setRouteTypes] = useState<{label: string, value: string}[]>([]);

  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: "",
    activity_id: "",
    route_type_id: "",
    booking_code: "",
    departure_date: "",
    return_date: "",
    origin: "",
    full_route: "",
    passenger_count: 1,
    bus_count_requested: 1,
    special_notes: "",
    status: "pending",
    cancelled_by: null,
    cancelled_reason: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const [customersRes, activitiesRes, routeTypesRes] = await Promise.all([
          customerService.getAll(),
          activityTypeService.getAll(),
          routeTypeService.getAll(),
        ]);

        setCustomers(customersRes.customers.map(c => ({ label: c.name, value: c.id })));
        setActivities(activitiesRes.activityTypes.map(a => ({ label: a.name, value: a.id })));
        setRouteTypes(routeTypesRes.routeTypes.map(r => ({ label: r.name, value: r.id })));
      } catch (err: any) {
        setError("Failed to fetch required data.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (booking) {
      setFormData({
        customer_id: booking.customer_id,
        activity_id: booking.activity_id,
        route_type_id: booking.route_type_id,
        booking_code: booking.booking_code,
        departure_date: booking.departure_date ? booking.departure_date.split(' ')[0] : "",
        return_date: booking.return_date ? booking.return_date.split(' ')[0] : "",
        origin: booking.origin,
        full_route: booking.full_route || "",
        passenger_count: booking.passenger_count,
        bus_count_requested: booking.bus_count_requested,
        special_notes: booking.special_notes || "",
        status: booking.status,
        cancelled_by: booking.cancelled_by || null,
        cancelled_reason: booking.cancelled_reason || "",
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        return_date: formData.return_date || null,
        full_route: formData.full_route || null,
        special_notes: formData.special_notes || null,
        cancelled_by: formData.status === 'cancelled' ? formData.cancelled_by : null,
        cancelled_reason: formData.status === 'cancelled' ? formData.cancelled_reason : null,
      };

      if (isEdit && booking) {
        await bookingService.update(booking.id, dataToSubmit);
      } else {
        await bookingService.create(dataToSubmit);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Quoted", value: "quoted" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const cancelledByOptions = [
    { label: "Customer", value: "customer" },
    { label: "Admin", value: "admin" },
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
          label="Booking Code"
          placeholder="e.g. BOK-2023001"
          icon={Hash}
          value={formData.booking_code}
          onChange={(e) => setFormData({ ...formData, booking_code: e.target.value })}
          required
        />

        <Select
          label="Customer"
          options={customers}
          icon={UserIcon}
          value={formData.customer_id}
          onChange={(value) => setFormData({ ...formData, customer_id: value })}
          placeholder={fetchingData ? "Loading customers..." : "Select customer"}
          required
        />

        <Select
          label="Activity Type"
          options={activities}
          icon={Activity}
          value={formData.activity_id}
          onChange={(value) => setFormData({ ...formData, activity_id: value })}
          placeholder={fetchingData ? "Loading activities..." : "Select activity type"}
          required
        />

        <Select
          label="Route Type"
          options={routeTypes}
          icon={MapIcon}
          value={formData.route_type_id}
          onChange={(value) => setFormData({ ...formData, route_type_id: value })}
          placeholder={fetchingData ? "Loading route types..." : "Select route type"}
          required
        />

        <Input
          label="Departure Date"
          type="date"
          icon={Calendar}
          value={formData.departure_date}
          onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
          required
        />

        <Input
          label="Return Date (Optional)"
          type="date"
          icon={Calendar}
          value={formData.return_date || ""}
          onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
        />

        <Input
          label="Origin"
          placeholder="e.g. Jakarta"
          icon={MapPin}
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          required
        />

        <Input
          label="Full Route"
          placeholder="e.g. Jakarta - Bandung - Jakarta"
          icon={MapPin}
          value={formData.full_route || ""}
          onChange={(e) => setFormData({ ...formData, full_route: e.target.value })}
        />

        <Input
          label="Passenger Count"
          type="number"
          min="1"
          icon={Users}
          value={formData.passenger_count.toString()}
          onChange={(e) => setFormData({ ...formData, passenger_count: parseInt(e.target.value) })}
          required
        />

        <Input
          label="Bus Count Requested"
          type="number"
          min="1"
          icon={Bus}
          value={formData.bus_count_requested.toString()}
          onChange={(e) => setFormData({ ...formData, bus_count_requested: parseInt(e.target.value) })}
          required
        />

        <Select
          label="Booking Status"
          options={statusOptions}
          icon={Info}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as BookingStatus })}
          required
        />
      </div>

      <Textarea
        label="Special Notes"
        placeholder="Any special requirements..."
        icon={StickyNote}
        value={formData.special_notes || ""}
        onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
      />

      {formData.status === 'cancelled' && (
        <div className="grid gap-5 rounded-[24px] border border-rose-100 bg-rose-50/50 p-5 md:grid-cols-2">
          <Select
            label="Cancelled By"
            options={cancelledByOptions}
            icon={XCircle}
            value={formData.cancelled_by || ""}
            onChange={(value) => setFormData({ ...formData, cancelled_by: value as CancelledBy })}
            required
          />
          <Input
            label="Cancellation Reason"
            placeholder="Reason for cancellation"
            icon={StickyNote}
            value={formData.cancelled_reason || ""}
            onChange={(e) => setFormData({ ...formData, cancelled_reason: e.target.value })}
            required
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Booking" : "Create Booking"}
        </Button>
      </div>
    </form>
  );
}
