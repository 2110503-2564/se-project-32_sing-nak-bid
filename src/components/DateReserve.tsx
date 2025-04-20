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
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Select a restaurant
          </label>
          <select
            value={selectedRestaurantId}
            onChange={(e) => onRestaurantChange(e.target.value)}
            className="block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#ed8265] focus:ring-0 transition duration-150"
          >
            <option value="" disabled>
              -- Choose a restaurant --
            </option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Picker */}
      <MUILocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={date}
          onChange={(value) => {
            setDate(value);
            onDateChange(value);
          }}
          slotProps={{
            textField: {
              variant: "outlined",
              fullWidth: true,
              InputProps: {
                className: "bg-white",
              },
              InputLabelProps: {
                shrink: true,
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  fontSize: "1rem",
                  color: "#374151", // text-gray-700
                  borderRadius: "0.375rem", // rounded-md
                  "& fieldset": {
                    borderColor: "#D1D5DB", // border-gray-300
                  },
                  "&:hover fieldset": {
                    borderColor: "#ED8265",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ED8265",
                    boxShadow: "none",
                  },
                },
              },
            },
          }}
        />
      </MUILocalizationProvider>
    </div>
  );
}
