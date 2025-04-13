"use client"
import { useState } from "react"
import { DatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import { Select, MenuItem } from "@mui/material"
import { Dayjs } from "dayjs"

export default function LocationDateReserve({onDateChange, onLocationChange}
    :{onDateChange:Function, onLocationChange:Function} ) {

    const [reserveDate, setReserveDate] = useState<Dayjs|null>(null)
    const [location, setLocation] = useState('BB')

    return (
        <div className="bg-slate-100 rounded-lg 
        w-fit px-10 py-10  ">

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="text-xl text-blue-700 font-semibold " > 
                    Select Reservation Date : 
                    <div className="p-6">
                <DatePicker className="bg-white"
                value={reserveDate} 
                onChange={(value)=>{setReserveDate(value); onDateChange(value)}}
                /></div>
                </div>
            </LocalizationProvider>
<div className="text-xl text-blue-700 font-semibold" > 
    Select Restaurant to reserve : 
    <div className="m-5"> 
            <Select variant="standard" 
            name="location" id="location" value={location}
            onChange={(e)=>{setLocation(e.target.value); onLocationChange(e.target.value);}}
            className="h-[2em] w-[200px]">
                <MenuItem value="BB">Bangkok Breeze</MenuItem>
                <MenuItem value="BLB">Bistro Le Bonheur</MenuItem>
                <MenuItem value="KBBQ">KoreanBBQ</MenuItem>
                <MenuItem value="MI">Maeim</MenuItem>
                <MenuItem value="MM">Mystic Masala</MenuItem>
                <MenuItem value="RBG">Red Bamboo Garden</MenuItem>
                <MenuItem value="SS">SiamSpice</MenuItem>
                <MenuItem value="TOG">The Olive Grove</MenuItem>
                <MenuItem value="ZZU">Zen & Zushi</MenuItem>
            </Select>
            </div>
            </div>
        </div>
    )
}
