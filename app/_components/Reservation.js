// app/_components/Reservation.js (服务端组件，无 'use client')
import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { getSettings, getBookedDatesByCabinId } from "../_lib/data-service";
import LoginMessage from "./LoginMessage";
import ReservationClient from "./ReservationClient";  // 新建客户端组件

export default async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id)
  ]);

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector 
        settings={settings} 
        bookedDates={bookedDates} 
        cabin={cabin}
      />
      <ReservationClient cabin={cabin}>
        <LoginMessage />
      </ReservationClient>
    </div>
  );
}