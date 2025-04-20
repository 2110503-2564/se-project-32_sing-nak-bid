"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import dayjs, { Dayjs } from "dayjs";

import DateReserve from "@/components/DateReserve";
import { Restaurant, ReservationsItem } from "../../../interfaces";
import { addReserve as reduxBooking } from "@/redux/features/reserveSlice";
import addReserve from "@/libs/addReserve";

import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";

export default function ReserveRestaurant() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch restaurant list
  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("http://localhost:5000/api/v1/restaurant");
      const data = await res.json();
      setRestaurants(data.data); // Make sure backend returns restaurant list in `data`
    };
    fetchRestaurants();
  }, []);

  const makeReservation = async () => {
    if (!session?.user?.token || !selectedRestaurantId || !reserveDate) {
      setShowErrorAlert(true);
      return;
    }

    const reservationItem = {
      reservationDateTime: dayjs(reserveDate).toISOString(),
      restaurant: selectedRestaurantId,
    };

    // Send API
    const success = await addReserve(
      reservationItem.reservationDateTime,
      "", // name is not used anymore
      selectedRestaurantId,
      session.user.token
    );

    // Dispatch to Redux if needed (optional)
    if (success) {
      dispatch(
        reduxBooking({
          _id: "", // backend will generate
          reservationDate: reservationItem.reservationDateTime,
          user: session.user._id,
          restaurant: restaurants.find(r => r._id === selectedRestaurantId)!,
          status: "pending",
          createdAt: new Date().toISOString(),
        })
      );
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    } else {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-[#F4ECDD] px-4">
      {showErrorAlert && <ErrorAlert message="Please fill out all fields" onClose={() => setShowErrorAlert(false)} />}
      {showSuccessAlert && <SuccessAlert message="Reservation successfully completed!" onClose={() => setShowSuccessAlert(false)} />}

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">New Restaurant Reservation</h2>
        <div className="border-b pb-4">
          <p className="text-gray-600 text-sm">Reserve Details</p>
        </div>

        {/* Restaurant Select */}
        <select
          className="w-full border rounded-md px-3 py-2"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        <DateReserve
          onDateChange={setReserveDate} onRestaurantChange={function (restaurant: Restaurant): void {
            throw new Error("Function not implemented.");
          } }        />

        <button
          className="w-full py-3 rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium shadow-md transition-transform duration-300 transform hover:scale-105"
          onClick={makeReservation}
        >
          Reserve Restaurant
        </button>
      </div>
    </main>
  );
}
