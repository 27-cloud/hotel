"use client";
import { useState } from "react";
import { isWithinInterval, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  if (!range?.from || !range?.to || !datesArr?.length) {
    return false;
  }

  try {
    return datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to }),
    );
  } catch (error) {
    console.error("Error in isAlreadyBooked:", error);
    return false;
  }
}

function DateSelector({ settings, cabin, bookedDates }) {
  // 从 ReservationContext 获取选中的日期范围
  const { range, setRange, resetRange } = useReservation();

  // 添加安全检查
  if (!cabin || !settings) {
    return <div className="p-8 text-center">Loading date selector...</div>;
  }

  // 确保 range 对象有正确的结构
  const safeRange = {
    from: range?.from || undefined,
    to: range?.to || undefined,
  };

  const regularPrice = cabin.regularPrice;
  const discount = cabin.discount;
  const finalPrice = regularPrice - discount;

  const numNights =
    safeRange.from && safeRange.to
      ? differenceInDays(safeRange.to, safeRange.from)
      : 0;

  const cabinPrice = numNights * finalPrice;
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between w-full">
      <DayPicker
        className="pt-12 place-self-center
          w-auto
          [&_.rdp-months]:!flex 
          [&_.rdp-months]:!flex-row 
          [&_.rdp-months]:!flex-nowrap 
          [&_.rdp-month]:!max-w-[240px] 
          [&_.rdp-month]:!w-auto"
        mode="range"
        onSelect={setRange}
        selected={safeRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={[
          // 添加 disabled 属性来处理已预订日期
          bookedDates?.length > 0 ? bookedDates : [],
          //过去的日期
          { before: new Date() },
        ]}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${finalPrice}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>

          {numNights > 0 && (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          )}
        </div>

        {(safeRange.from || safeRange.to) && (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => resetRange()}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
