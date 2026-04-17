import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { bookingService } from "../services/BookingService";
import type { Booking, BookingFormData, BookingStatus, CancelledBy, BookingBusFormData } from "../types/Booking";
import { customerService } from "@/features/admin/customers/services/CustomerService";
import { activityTypeService } from "@/features/admin/activity-types/services/ActivityTypeService";
import { routeTypeService } from "@/features/admin/route-types/services/RouteTypeService";
import { busService } from "@/features/admin/buses/services/BusService";
import { driverService } from "@/features/admin/drivers/services/DriverService";
import { 
  Hash, 
  User as UserIcon, 
  Activity, 
  Map as MapIcon, 
  Calendar, 
  MapPin, 
  Users, 
  Bus as BusIcon, 
  StickyNote, 
  Info,
  XCircle,
  Save,
  Plus,
  Trash2,
  Contact
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
  const [availableBuses, setAvailableBuses] = useState<{label: string, value: string, seats: number}[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<{label: string, value: string}[]>([]);

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
    buses: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const [customersRes, activitiesRes, routeTypesRes, busesRes, driversRes] = await Promise.all([
          customerService.getAll(),
          activityTypeService.getAll(),
          routeTypeService.getAll(),
          busService.getAll(),
          driverService.getAll(),
        ]);

        setCustomers(customersRes.customers.map(c => ({ label: c.name, value: c.id })));
        setActivities(activitiesRes.activityTypes.map(a => ({ label: a.name, value: a.id })));
        setRouteTypes(routeTypesRes.routeTypes.map(r => ({ label: r.name, value: r.id })));
        setAvailableBuses(busesRes.buses
          .filter(b => b.status === 'available' || (isEdit && booking?.booking_buses?.some(bb => bb.bus_id === b.id)))
          .map(b => ({ label: `${b.name} (${b.plat_number}) - ${b.seat_count} seats`, value: b.id, seats: b.seat_count })));
        setAvailableDrivers(driversRes.drivers
          .filter(d => d.status === 'available' || (isEdit && booking?.booking_buses?.some(bb => bb.driver_id === d.id)))
          .map(d => ({ label: d.name, value: d.id })));
      } catch (err: any) {
        setError("Failed to fetch required data.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [isEdit, booking]);

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
        buses: booking.booking_buses?.map(bb => ({
          bus_id: bb.bus_id,
          driver_id: bb.driver_id,
          seat_count: bb.seat_count,
          assignment_notes: bb.assignment_notes || ""
        })) || [],
      });
    }
  }, [booking]);

  const handleAddBus = () => {
    setFormData({
      ...formData,
      buses: [
        ...(formData.buses || []),
        { bus_id: "", driver_id: "", seat_count: 0, assignment_notes: "" }
      ]
    });
  };

  const handleRemoveBus = (index: number) => {
    const updatedBuses = [...(formData.buses || [])];
    updatedBuses.splice(index, 1);
    setFormData({ ...formData, buses: updatedBuses });
  };

  const handleBusChange = (index: number, field: keyof BookingBusFormData, value: any) => {
    const updatedBuses = [...(formData.buses || [])];
    updatedBuses[index] = { ...updatedBuses[index], [field]: value };
    
    // Auto-fill seat count if bus is selected
    if (field === 'bus_id') {
      const selectedBus = availableBuses.find(b => b.value === value);
      if (selectedBus) {
        updatedBuses[index].seat_count = selectedBus.seats;
      }
    }
    
    setFormData({ ...formData, buses: updatedBuses });
  };

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Main Information Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Info size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Booking Information</h3>
        </div>

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
            placeholder={fetchingData ? "Loading..." : "Select customer"}
            required
          />

          <Select
            label="Activity Type"
            options={activities}
            icon={Activity}
            value={formData.activity_id}
            onChange={(value) => setFormData({ ...formData, activity_id: value })}
            placeholder={fetchingData ? "Loading..." : "Select activity type"}
            required
          />

          <Select
            label="Route Type"
            options={routeTypes}
            icon={MapIcon}
            value={formData.route_type_id}
            onChange={(value) => setFormData({ ...formData, route_type_id: value })}
            placeholder={fetchingData ? "Loading..." : "Select route type"}
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
            icon={BusIcon}
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
      </section>

      {/* Bus Assignments Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <BusIcon size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Bus & Driver Assignments</h3>
          </div>
          <Button type="button" size="sm" variant="outline" icon={Plus} onClick={handleAddBus}>
            Add Assignment
          </Button>
        </div>

        {(!formData.buses || formData.buses.length === 0) ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 p-8 text-center text-slate-400 bg-slate-50/50">
            No buses assigned yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {formData.buses.map((bus, index) => (
              <div key={index} className="relative rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <button 
                  type="button" 
                  onClick={() => handleRemoveBus(index)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <Select
                    label="Bus"
                    options={availableBuses}
                    icon={BusIcon}
                    value={bus.bus_id}
                    onChange={(value) => handleBusChange(index, 'bus_id', value)}
                    placeholder="Select Bus"
                    required
                  />
                  <Select
                    label="Driver"
                    options={availableDrivers}
                    icon={Contact}
                    value={bus.driver_id}
                    onChange={(value) => handleBusChange(index, 'driver_id', value)}
                    placeholder="Select Driver"
                    required
                  />
                  <Input
                    label="Seat Count"
                    type="number"
                    min="1"
                    icon={Users}
                    value={bus.seat_count.toString()}
                    onChange={(e) => handleBusChange(index, 'seat_count', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Assignment Notes"
                    placeholder="e.g. Backup bus, specific requirement..."
                    icon={StickyNote}
                    value={bus.assignment_notes || ""}
                    onChange={(e) => handleBusChange(index, 'assignment_notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cancellation Section */}
      {formData.status === 'cancelled' && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
              <XCircle size={18} />
            </div>
            <h3 className="text-lg font-bold text-rose-800 tracking-tight">Cancellation Details</h3>
          </div>
          <div className="grid gap-5 rounded-[24px] border border-rose-100 bg-rose-50/50 p-6 md:grid-cols-2">
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
        </section>
      )}

      {/* Special Notes Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <StickyNote size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Additional Notes</h3>
        </div>
        <Textarea
          label="Special Requirements"
          placeholder="Enter any special requests or notes..."
          icon={StickyNote}
          value={formData.special_notes || ""}
          onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
        />
      </section>

      {/* Form Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-8">
        <Button type="button" variant="ghost" className="flex-1 rounded-[20px] py-4" onClick={onCancel}>
          Discard Changes
        </Button>
        <Button type="submit" variant="primary" className="flex-1 rounded-[20px] py-4 shadow-lg shadow-slate-200" loading={loading} icon={Save}>
          {isEdit ? "Update Booking" : "Finalize Booking"}
        </Button>
      </div>
    </form>
  );
}
