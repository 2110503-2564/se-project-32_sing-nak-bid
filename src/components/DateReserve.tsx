"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider as MUILocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import getRestaurants from "@/libs/getRestaurants";
import { Restaurant, RestaurantJson } from "../../interfaces";

export default function DateReserve({
  onRestaurantChange,
  onDateChange,
}: {
  onRestaurantChange: (restaurant: Restaurant) => void;
  onDateChange: (date: Dayjs | null) => void;
}) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [restaurantResponse, setRestaurantResponse] = useState<RestaurantJson | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const restaurants = await getRestaurants();
      setRestaurantResponse(restaurants);
    };
    fetchData();
  }, []);

  const sortedRestaurants = restaurantResponse?.data.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const handleRestaurantChange = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    const selectedRestaurant = restaurantResponse?.data.find((r) => r._id === restaurantId);
    if (selectedRestaurant) {
      onRestaurantChange(selectedRestaurant);
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg px-10 py-5 flex flex-col space-y-4">
      <label htmlFor="restaurant">Select Restaurant</label>
      <Select
        variant="standard"
        name="restaurant"
        id="restaurant"
        className="h-[2em] w-[250px]"
        value={selectedRestaurantId}
        onChange={(e) => handleRestaurantChange(e.target.value)}
      >
        {sortedRestaurants?.map((restaurant) => (
          <MenuItem key={restaurant._id} value={restaurant._id}>
            {restaurant.name}
          </MenuItem>
        ))}
      </Select>

      <div className="flex flex-col items-start space-y-2">
        <label htmlFor="date">Select Date</label>
        <MUILocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="bg-white"
            value={date}
            onChange={(value) => {
              setDate(value);
              onDateChange(value);
            }}
          />
        </MUILocalizationProvider>
      </div>
    </div>
  );
}
