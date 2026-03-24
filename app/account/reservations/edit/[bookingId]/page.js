// app/account/reservations/edit/[bookingId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";
import EditDateSelector from "@/app/_components/EditDateSelector";
import {
  getBooking,
  updateBooking,
  getCabin,
  getGuest,
  getSettings,
  getBookedDatesByCabinId,
} from "@/app/_lib/data-service";
import { format, differenceInDays } from "date-fns";

export default function EditBookingPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [booking, setBooking] = useState(null);
  const [cabin, setCabin] = useState(null);
  const [settings, setSettings] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const [selectedRange, setSelectedRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [formData, setFormData] = useState({
    numGuests: "",
    observations: "",
  });

  useEffect(() => {
    async function loadBooking() {
      if (!user) return;

      try {
        const guest = await getGuest(user.email);

        if (!guest) {
          setError("Guest profile not found");
          setLoading(false);
          return;
        }

        const bookingData = await getBooking(bookingId);

        if (bookingData.guestId !== guest.id) {
          setError("You do not have permission to edit this booking");
          setLoading(false);
          return;
        }

        setBooking(bookingData);
        setFormData({
          numGuests: bookingData.numGuests,
          observations: bookingData.observations || "",
        });

        // 设置初始日期范围
        setSelectedRange({
          from: new Date(bookingData.startDate),
          to: new Date(bookingData.endDate),
        });

        const cabinData = await getCabin(bookingData.cabinId);
        setCabin(cabinData);

        const settingsData = await getSettings();
        setSettings(settingsData);

        // 获取该 cabin 的所有已预订日期
        const allBooked = await getBookedDatesByCabinId(bookingData.cabinId);

        // 排除当前订单的原始日期范围
        const originalStart = new Date(bookingData.startDate).getTime();
        const originalEnd = new Date(bookingData.endDate).getTime();

        const filteredBooked = allBooked.filter((bookedDate) => {
          const bookedTime = bookedDate.getTime();
          // 只保留不在当前订单日期范围内的日期
          return bookedTime < originalStart || bookedTime > originalEnd;
        });

        setBookedDates(filteredBooked);
      } catch (err) {
        console.error("Error loading booking:", err);
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadBooking();
    }
  }, [bookingId, user]);

  const handleDateChange = (newRange) => {
    setSelectedRange(newRange);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const numNights =
        selectedRange?.from && selectedRange?.to
          ? differenceInDays(selectedRange.to, selectedRange.from)
          : booking?.numNights;

      const finalPrice = cabin?.regularPrice - cabin?.discount || 0;
      const totalPrice = numNights * finalPrice;

      await updateBooking(bookingId, {
        numGuests: parseInt(formData.numGuests),
        observations: formData.observations,
        startDate: selectedRange?.from?.toISOString(),
        endDate: selectedRange?.to?.toISOString(),
        numNights: numNights,
        totalPrice: totalPrice,
      });
      router.push(`/account/reservations?t=${Date.now()}`);
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-accent-400 mb-6">
          Edit Reservation
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-accent-400 mb-6">
          Edit Reservation
        </h1>
        <p className="text-red-500">{error}</p>
        <a
          href="/account/reservations"
          className="text-accent-500 underline inline-block mt-4"
        >
          Back to reservations
        </a>
      </div>
    );
  }

  const numNights =
    selectedRange?.from && selectedRange?.to
      ? differenceInDays(selectedRange.to, selectedRange.from)
      : booking?.numNights || 0;
  const finalPrice = cabin?.regularPrice - cabin?.discount || 0;
  const totalPrice = numNights * finalPrice;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-accent-400 mb-6">
        Edit Reservation
      </h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <EditDateSelector
            settings={settings}
            cabin={cabin}
            bookedDates={bookedDates}
            initialRange={selectedRange}
            onDateChange={handleDateChange}
          />
        </div>

        <div>
          <div className="bg-primary-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Cabin {cabin?.name}</h2>
            <p className="text-primary-300">
              Original: {format(new Date(booking.startDate), "MMM dd, yyyy")} —{" "}
              {format(new Date(booking.endDate), "MMM dd, yyyy")}
            </p>
            <p className="text-primary-300">
              Original total: ${booking.totalPrice}
            </p>
            {selectedRange?.from && selectedRange?.to && (
              <p className="text-accent-400 mt-2 font-semibold">
                New: {format(selectedRange.from, "MMM dd")} —{" "}
                {format(selectedRange.to, "MMM dd")}
                <br />
                {numNights} nights, ${totalPrice}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-primary-900 p-6 rounded-lg space-y-4"
          >
            <div>
              <label className="block mb-2">Number of guests</label>
              <select
                value={formData.numGuests}
                onChange={(e) =>
                  setFormData({ ...formData, numGuests: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary-800 rounded"
                disabled={updating}
              >
                {[...Array(cabin?.maxCapacity || 1)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Special requests</label>
              <textarea
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary-800 rounded"
                rows="3"
                disabled={updating}
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updating}
                className="bg-accent-500 text-primary-800 px-6 py-2 rounded hover:bg-accent-600 disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <a
                href="/account/reservations"
                className="bg-primary-700 text-primary-300 px-6 py-2 rounded hover:bg-primary-600"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
