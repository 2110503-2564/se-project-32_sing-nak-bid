"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateReserve from "@/libs/updateReserve";

export default function UpdateReservationPage() {
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [reservationDate, setReservationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!session?.user?.token || !reservationDate) {
      setMessage("Please select a reservation date.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await updateReserve(id, reservationDate, session.user.token);
      setMessage("Reservation updated successfully!");
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      console.error("Failed to update reservation:", error);
      setMessage("Failed to update reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Reservation</h1>
      <label className="block mb-2 text-lg font-medium">
        Select New Reservation Date
      </label>
      <input
        type="date"
        value={reservationDate}
        onChange={(e) => setReservationDate(e.target.value)}
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
