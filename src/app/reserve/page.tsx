"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import dayjs, { Dayjs } from "dayjs";

import DateReserve from "@/components/DateReserve";
import { Restaurant } from "../../../interfaces";
import { addReserve as reduxBooking } from "@/redux/features/reserveSlice";
import addReserve from "@/libs/addReserve";
import getRestaurants from "@/libs/getRestaurants";

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

  // Fetch restaurants using the helper function
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const result = await getRestaurants();
        console.log("Fetched Restaurants:", result); // Check the data structure here
        setRestaurants(result.data); // Assuming 'data' contains the array of restaurants
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);
  

  const makeReservation = async () => {
    console.log("Session Token:", session?.user?.token);
    console.log("Selected Restaurant ID:", selectedRestaurantId);
    console.log("Reserve Date:", reserveDate);
  
    if (!session?.user?.token || !selectedRestaurantId || !reserveDate) {
      setShowErrorAlert(true);
      return;
    }
  
    const reservationItem = {
      reservationDateTime: dayjs(reserveDate).toISOString(),
      restaurant: selectedRestaurantId,
    };
  
    const success = await addReserve(
      reservationItem.reservationDateTime,
      "pending",
      selectedRestaurantId,
      session.user.token
    );
  
    if (success) {
      dispatch(
        reduxBooking({
          _id: "",
          reservationDate: reservationItem.reservationDateTime,
          user: session.user._id,
          restaurant: restaurants.find((r) => r._id === selectedRestaurantId)!,
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
      {showErrorAlert && (
        <ErrorAlert
          message="Please fill out all fields"
          onClose={() => setShowErrorAlert(false)}
        />
      )}
      {showSuccessAlert && (
        <SuccessAlert
          message="Reservation successfully completed!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          New Restaurant Reservation
        </h2>
        <div className="border-b pb-4">
          <p className="text-gray-600 text-sm">Reserve Details</p>
        </div>

        <DateReserve
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onRestaurantChange={(id: string) => setSelectedRestaurantId(id)}
          onDateChange={setReserveDate}
        />

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
