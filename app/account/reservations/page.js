"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/_components/AuthContext";
import { getGuest, getBookings } from "@/app/_lib/data-service";
import ReservationCard from "@/app/_components/ReservationCard";

export default function Page() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const guest = await getGuest(user.email);

        if (guest) {
          const bookingsData = await getBookings(guest.id);
          setBookings(bookingsData || []);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, [user]);

  if (isLoading) {
    return (
      <div>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Your reservations
        </h2>
        <p className="text-lg">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <ReservationCard booking={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
