"use client";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider as MUILocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { Restaurant } from "../../interfaces";

export default function DateReserve({
  restaurants,
  selectedRestaurantId,
  onRestaurantChange,
  onDateChange,
}: {
  restaurants: Restaurant[];
  selectedRestaurantId: string;
  onRestaurantChange: (id: string) => void;
  onDateChange: (date: Dayjs | null) => void;
}) {
  const [date, setDate] = useState<Dayjs | null>(null);

  return (
    <div className="space-y-4 w-full">
      {/* Restaurant Dropdown */}
      <select
        value={selectedRestaurantId}
        onChange={(e) => onRestaurantChange(e.target.value)}
      >
        <option value="">Select a restaurant</option>
        {restaurants.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Date Picker */}
      <MUILocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          className="bg-white w-full"
          value={date}
          onChange={(value) => {
            setDate(value);
            onDateChange(value);
          }}
        />
      </MUILocalizationProvider>
    </div>
  );
}
