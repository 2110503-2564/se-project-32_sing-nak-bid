"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateBooking from "@/libs/updateBooking";

export default function UpdateBookingPage() {
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!session?.user?.token || !bookingDate) {
      setMessage("Please select a booking date.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await updateBooking(id, bookingDate, session.user.token);
      setMessage("Booking updated successfully!");
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      console.error("Failed to update booking:", error);
      setMessage("Failed to update booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Booking</h1>

      <label className="block mb-2 text-lg font-medium">
        Select New Booking Date
      </label>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        className="border p-2 rounded w-full mb-4 bg-white text-black focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleUpdate}
        className={`relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black py-2 px-4 rounded-lg transition-colors duration-500 
              ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-300 hover:text-black"
              }`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
