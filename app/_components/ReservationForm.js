"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useReservation } from "./ReservationContext";
import { format, differenceInDays } from "date-fns";
import { createBooking, getGuest, createGuest } from "../_lib/data-service";
import GetGuestName from "./GetGuestName";

export default function ReservationForm({ cabin, children }) {
  const { range, resetRange } = useReservation();
  const { user } = useAuth();
  const [numGuests, setNumGuests] = useState("");
  const [observations, setObservations] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !range?.from || !range?.to || !numGuests) return;

    setIsLoading(true);
    try {
      // 获取 guest
      let guest = await getGuest(user.email);
      let guestId;

      if (!guest) {
        const newGuest = await createGuest({
          email: user.email,
          fullName: user.user_metadata?.fullName || "",
        });
        guestId = newGuest[0].id;
      } else {
        guestId = guest.id;
      }

      // 创建预订
      await createBooking({
        cabinId: cabin.id,
        guestId: guestId,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
        numNights: differenceInDays(range.to, range.from),
        numGuests: Number(numGuests),
        cabinPrice: cabin.regularPrice - cabin.discount,
        totalPrice:
          (cabin.regularPrice - cabin.discount) *
          differenceInDays(range.to, range.from),
        status: "unconfirmed",
        observations: observations,
      });

      alert("预订成功！");
      resetRange();
      setNumGuests("");
      setObservations("");
    } catch (err) {
      alert("预订失败：" + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="bg-primary-800 p-8">{children}</div>;
  }

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as {<GetGuestName />}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label>Selected dates</label>
          <div className="px-5 py-3 bg-primary-200 text-primary-800 rounded-sm">
            {range?.from && range?.to
              ? `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd")} (${differenceInDays(range.to, range.from)} nights)`
              : "No dates selected"}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            id="numGuests"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="">Select number of guests...</option>
            {Array.from({ length: cabin.maxCapacity }, (_, i) => i + 1).map(
              (x) => (
                <option value={x} key={x}>
                  {x} {x === 1 ? "guest" : "guests"}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
            rows={3}
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">
            {range?.from &&
              range?.to &&
              `Total: $${(cabin.regularPrice - cabin.discount) * differenceInDays(range.to, range.from)}`}
          </p>

          <button
            type="submit"
            disabled={isLoading || !range?.from || !range?.to || !numGuests}
            className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
          >
            {isLoading ? "Creating..." : "Reserve now"}
          </button>
        </div>
      </form>
    </div>
  );
}
