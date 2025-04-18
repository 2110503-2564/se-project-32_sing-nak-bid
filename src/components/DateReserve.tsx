"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider as MUILocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import getHotels from "@/libs/getHotels";
import { HotelItem, HotelJson } from "../../interfaces";

export default function LocalizationProvider({
  onHotelChange,
  onNameChange,
  onNumberChange,
  onDateChange,
  onNightChange,
}: {
  onHotelChange: Function;
  onNameChange: Function;
  onNumberChange: Function;
  onDateChange: Function;
  onNightChange: Function;
}) {
  const [hotel, setHotel] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [night, setNight] = useState<number>(0);

  const [hotelResponse, setHotelResponse] = useState<HotelJson | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const hotels = await getHotels();
      setHotelResponse(hotels);
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

  const sortedHotels = hotelResponse?.data.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
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
      <label htmlFor="hotel">Select Hotel</label>
      <Select
        variant="standard"
        name="hotel"
        id="hotel"
        className="h-[2em] w-[200px]"
        value={hotel}
        onChange={(e) => {
          setHotel(e.target.value);
          onHotelChange(e.target.value);
        }}
      >
        {sortedHotels?.map((hotelItem: HotelItem) => (
          <MenuItem key={hotelItem.id} value={hotelItem.id}>
            {hotelItem.name}
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
