// app/_components/EditDateSelector.js
"use client";
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function EditDateSelector({
  settings,
  cabin,
  bookedDates,
  initialRange,
  onDateChange,
}) {
  const [range, setRange] = useState({ from: undefined, to: undefined });

  // 只在组件挂载时设置一次初始值，之后不再响应 initialRange 变化
  useEffect(() => {
    if (initialRange?.from && initialRange?.to && !range.from && !range.to) {
      setRange(initialRange);
    }
  }, []); // 空依赖，只执行一次

  const handleSelect = (newRange) => {
    setRange(newRange);
    if (onDateChange) {
      onDateChange(newRange);
    }
  };

  if (!cabin || !settings) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const regularPrice = cabin.regularPrice;
  const discount = cabin.discount;
  const finalPrice = regularPrice - discount;
  const numNights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const totalPrice = numNights * finalPrice;

  const disabledDays = [{ before: new Date() }, ...(bookedDates || [])];

  return (
    <div className="flex flex-col">
      <DayPicker
        mode="range"
        onSelect={handleSelect}
        selected={range}
        disabled={disabledDays}
        min={settings.minBookingLength + 1}
        max={settings.maxBookingLength}
        fromMonth={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        className="[&_.rdp-months]:!flex [&_.rdp-months]:!flex-row [&_.rdp-months]:!flex-nowrap [&_.rdp-month]:!max-w-[240px]"
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px] mt-4">
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
                &times; {numNights}
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${totalPrice}</span>
              </p>
            </>
          )}
        </div>

        {(range.from || range.to) && (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => {
              setRange({ from: undefined, to: undefined });
              if (onDateChange) {
                onDateChange({ from: undefined, to: undefined });
              }
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default EditDateSelector;
