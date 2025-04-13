"use client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { addReservation } from "@/libs/addReservations";
import { getReservations } from "@/libs/getReservations";


const ReservationDetails = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    const name = decodeURIComponent(searchParams.get("name") || "");

    const { data: session } = useSession();
    const userToken = session?.user?.token;
    const userId = session?.user?.id;

    const [reservationDate, setReservationDate] = useState("");

    const handleAddReservation = async () => {
        if (!reservationDate) {
            alert("Please select a date!");
            return;
        }

        if (!userToken) {
            alert("You must be logged in to make a reservation.");
            return;
        }

        // Fetch current reservations
        const reservationsResponse = await getReservations(userToken);

        // Check if the user already has 3 or more reservations
        if (reservationsResponse.count >= 3) {
            alert("You already have 3 reservations.");
            return;
        }

        // Proceed with adding the reservation
        const response = await addReservation(id, userToken, reservationDate);
        if (response.success) {
            alert("Reservation added successfully!");
            setReservationDate(""); // Clear input after success
        } else {
            alert("Failed to add reservation.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage : "url('/img/bg3.jpg')"}}>
        <div className="p-6 items-center justify-center bg-slate-100  bg-gray-200 rounded-lg w-fit px-10 py-10 shadow-lg">
          <h1 className="my-5 text-4xl font-bold text-yellow-700 font-serif text-center p-5">Reservation Details</h1>
      
          <div className="bg-white text-xl text-blue-700 mt-4 border-gray-600 border-2 p-4 rounded-lg shadow">
            <p><strong>Restaurant Name:</strong> {name}</p>
          </div>
      
          <div className="flex items-center justify-center mt-4">
            {/* Reservation Date Input */}
            <div className="mt-4">
              <label className="text-xl text-blue-700 font-semibold ">Select Date:</label>
              <input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="text-xl text-blue-700 border p-2 rounded mt-1 w-full border-black border-2"
              />
            </div>
          </div>
      
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={handleAddReservation}
              className="flex items-center justify-center my-6 bg-red-800 border-2 border-red-800 text-white font-semibold py-3 px-4 text-md rounded-full hover:bg-yellow-600 hover:text-white hover:border-yellow-600 transition-all duration-300 ease-in-out font-serif shadow-xl mx-3 text-xl"
            >
              Add Reservation
            </button>
          </div>
        </div>
      </div>
      
    );
};

export default ReservationDetails;
