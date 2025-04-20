"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider as MUILocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import getRestaurants from "@/libs/getRestaurants";
import { ReservationsItem, ReservationJson } from "../../interfaces";

export default function LocalizationProvider({
  onRestaurantChange,
  onNameChange,
  onNumberChange,
  onDateChange,
  onNightChange,
}: {
  onRestaurantChange: Function;
  onNameChange: Function;
  onNumberChange: Function;
  onDateChange: Function;
  onNightChange: Function;
}) {
  const [reserve, setReserve] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [night, setNight] = useState<number>(0);

  const [reserveResponse, setReserveResponse] = useState<ReservationJson | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const reserves = await getRestaurants();
      setReserveResponse(reserves);
    };
    fetchData();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
    setName(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNumberChange(e.target.value);
    setNumber(e.target.value);
  };

  const sortedReserves = reserveResponse?.data.sort((a, b) => {
    if (a.restaurant.name.toLowerCase() < b.restaurant.name.toLowerCase()) return -1;
    if (a.restaurant.name.toLowerCase() > b.restaurant.name.toLowerCase()) return 1;
    return 0;
  });

  const handleNightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value <= 3) {
      setNight(value);
      onNightChange(value);
    } else {
      setNight(3);
      onNightChange(3);
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-fit px-10 py-5 flex flex-col">
      <label htmlFor="Name-Lastname">Name-Lastname</label>
      <TextField
        name="Name-Lastname"
        id="Name-Lastname"
        variant="standard"
        value={name}
        onChange={handleNameChange}
      />
      <label htmlFor="Contact-Number">Contact-Number</label>
      <TextField
        name="Contact-Number"
        id="Contact-Number"
        variant="standard"
        value={number}
        onChange={handleNumberChange}
      />
      <label htmlFor="reserve">Select Reserve</label>
      <Select
        variant="standard"
        name="reserve"
        id="reserve"
        className="h-[2em] w-[200px]"
        value={reserve}
        onChange={(e) => {
          setReserve(e.target.value);
          onRestaurantChange(e.target.value);
        }}
      >
        {sortedReserves?.map((reserveItem: ReservationsItem) => (
          <MenuItem key={reserveItem.restaurant._id} value={reserveItem.restaurant._id}>
            {reserveItem.restaurant.name}
          </MenuItem>
        ))}
      </Select>
      <div className="flex flex-row justify-center space-x-5">
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
      <div className="flex flex-col items-center space-y-2">
        <label htmlFor="night" className="text-gray-700 font-medium">
          Select Amount of Days
        </label>
        <input
          id="night"
          type="number"
          value={night}
          onChange={handleNightChange}
          min={1}
          max={3}
          className="w-24 p-2 border border-gray-300 rounded-md text-center text-gray-700 shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               transition-all duration-300"
        />
      </div>
    </div>
  );
}
