// app/_components/ReservationClient.js (客户端组件)
'use client';

import ReservationForm from "./ReservationForm";
import { useReservation } from "./ReservationContext";

export default function ReservationClient({ cabin, children }) {
  const { range } = useReservation();  // 这里可以用客户端 Hook
  
  // 把 range 传给 ReservationForm
  return <ReservationForm cabin={cabin} range={range}>
    {children}
  </ReservationForm>;
}