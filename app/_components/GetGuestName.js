"use client";
import { useAuth } from "./AuthContext";
import { getGuest } from "../_lib/data-service";
import { useState, useEffect } from "react";
export default function GetGuestName() {
  const { user, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function loadDisplayName() {
      if (!user?.email) return;

      const guest = await getGuest(user.email);

      if (guest?.fullName) {
        setDisplayName(guest.fullName);
      } else {
        setDisplayName(user.email);
      }
    }

    if (!authLoading && user) {
      loadDisplayName();
    }
  }, [user, authLoading]);
  return <>{displayName}</>;
}
