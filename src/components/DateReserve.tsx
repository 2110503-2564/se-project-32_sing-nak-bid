'use client';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem } from "@mui/material";
import { TextField } from "@mui/material";
import  React, { useState } from  "react";
import { Dayjs } from 'dayjs';

export default function DateReserve() {

  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [location,setLocation] = useState("Spark");
  const [NameLastname,setNameLastname] = useState<string>("")
  const [telephoneNum,setTelphone] = useState<string>("")
 

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setNameLastname(event.target.value);
  }
  const handleTelchange = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setTelphone(event.target.value);
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-100">
      <div className="rounded-lg space-y-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-10 py-5 flex flex-col items-center">
        <form className="space-y-4 p-[10px] w-full">
          <div className="text-lg text-red-800 font-semibold">
            Insert your Name and Lastname:
            <div>
              <TextField
                className="p-[20px] w-full"
                name="Name-Lastname"
                label="Name-Lastname"
                variant="standard"
                value={NameLastname}
                onChange={handleNameChange}
              />
            </div>
          </div>

          <div className="text-lg text-red-800 font-semibold">
            Insert your Contact Number:
            <div>
              <TextField
                className="p-[20px] w-full"
                name="Contact-Number"
                label="Contact-Number"
                variant="standard"
                value={telephoneNum}
                onChange={handleTelchange}
              />
            </div>
          </div>

          <div className="text-lg text-red-800 font-semibold">
            Date that you want to reserve:
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="bg-white p-[20px] w-full"
                value={reserveDate}
                onChange={(value)=>setReserveDate(value)} />
              </LocalizationProvider>
            </div>
          </div>

          <div className="text-lg text-red-800 font-semibold">
            The room you want to reserve:
            <div>
              <Select
                variant="standard"
                name="venue"
                id="venue"
                className="h-[2em] w-full p-[20px]"
                value={location}
                onChange={(e)=>setLocation(e.target.value)}
              >
                <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                <MenuItem value="Spark">Spark Space</MenuItem>
                <MenuItem value="GrandTable">The Grand Table</MenuItem>
              </Select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
