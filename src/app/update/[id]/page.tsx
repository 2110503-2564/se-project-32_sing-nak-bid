"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateReserve from "@/libs/updateReserve";
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function UpdateReservationPage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const handleUpdate = async () => {
    if (!session?.user?.token) {
      setMessage("You must be logged in to update a reservation.");
      setMessageType("error");
      return;
    }

    if (!reservationDate) {
      setMessage("Please select a reservation date.");
      setMessageType("error");
      return;
    }

    if (!reservationTime) {
      setMessage("Please select a reservation time.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // Combine date and time for the API
      const reservationDateTime = `${reservationDate}T${reservationTime}`;
      await updateReserve(id, reservationDateTime, session.user.token);
      setMessage("Reservation updated successfully!");
      setMessageType("success");
      setTimeout(() => router.push("/myreservation"), 1500);
    } catch (error) {
      console.error("Failed to update reservation:", error);
      setMessage("Failed to update reservation. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-100 p-5 border-b border-orange-200">
          <h1 className="text-2xl font-bold text-gray-800">Update Your Reservation</h1>
          <p className="text-gray-600 mt-1">Change the date or time of your restaurant visit</p>
        </div>

        <div className="p-6">
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-700 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
              Select New Date
            </label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              min={today}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-200"
            />
          </div>
          
          {/* Time Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-700 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-orange-500" />
              Select New Time
            </label>
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-200"
            />
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`p-4 mb-6 rounded-lg flex items-center ${
              messageType === "success" ? "bg-green-100 text-green-700" : 
              messageType === "error" ? "bg-red-100 text-red-700" : ""
            }`}>
              {messageType === "success" ? (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              ) : messageType === "error" ? (
                <XCircleIcon className="h-5 w-5 mr-2" />
              ) : null}
              <span>{message}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleUpdate}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Reservation"}
            </button>
            
            <button
              onClick={() => router.push("/myreservation")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}