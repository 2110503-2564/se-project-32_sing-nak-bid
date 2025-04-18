"use client";
import DateReserve from "@/components/DateReserve";
import { authOptions } from "@/libs/auth";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking as reduxBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "../../../interfaces";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import { useSession } from "next-auth/react";
import addBooking from "@/libs/addBooking";

export default function Booking() {
  const dispatch = useDispatch<AppDispatch>();

  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [nameLastname, setNameLastname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [hotel, setHotel] = useState<string>("");
  const [night, setNight] = useState<number>(0);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { data: session } = useSession();

  const makeBooking = async () => {
    if (!session?.user?.token) {
      setShowErrorAlert(true);
      return;
    }

    if (nameLastname && contactNumber && hotel && reserveDate) {
      const item: BookingItem = {
        nameLastname,
        tel: contactNumber,
        hotel,
        bookDate: dayjs(reserveDate).format("YYYY/MM/DD"),
        night,
      };
      dispatch(reduxBooking(item));
      addBooking(night, dayjs(reserveDate).format("YYYY-MM-DD"), nameLastname, hotel, session?.user.token);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    } else {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Alert Messages */}
      {showErrorAlert && <ErrorAlert message="Please fill out all fields" onClose={() => setShowErrorAlert(false)} />}
      {showSuccessAlert && <SuccessAlert message="Booking successfully completed!" onClose={() => setShowSuccessAlert(false)} />}

      {/* Booking Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">New Booking</h2>

        <div className="border-b pb-4">
          <p className="text-gray-600 text-sm">Booking Details</p>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <DateReserve
            onHotelChange={setHotel}
            onNameChange={setNameLastname}
            onNumberChange={setContactNumber}
            onDateChange={setReserveDate}
            onNightChange={setNight}
          />
        </div>

        {/* Book Button */}
        <button
          className="w-full py-3 rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium shadow-md transition-transform duration-300 transform hover:scale-105"
          onClick={makeBooking}
        >
          Book Hotel
        </button>
      </div>
    </main>
  );
}
