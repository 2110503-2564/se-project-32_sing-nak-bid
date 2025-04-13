"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { updateReservation } from "@/libs/updateReservations";// Import the server-side functions
import { deleteReservation } from "@/libs/deleteReservations";
export default function DeleteEditBooking({
  reservationId,
  restaurantId,
  reservationDate,
}: {
  reservationId: string;
  restaurantId: string;
  reservationDate: string;
}) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDate, setUpdatedDate] = useState(reservationDate);
  const [updatedRestaurant, setUpdatedRestaurant] = useState(restaurantId);

  if (!session) return null;

  const handleEdit = async () => {
    const updateData = {
      reservationDate: updatedDate,
      restaurant: updatedRestaurant,
    };

    const result = await updateReservation(session?.user.token, reservationId, updateData);
    if (result.success) {
      alert("Reservation updated!");
      setIsEditing(false); // Hide edit form
    } else {
      alert("Failed to update reservation");
    }
  };

  const handleDelete = async () => {
    const result = await deleteReservation(session?.user.token, reservationId);
    if (result.success) {
      alert("Reservation deleted!");
      // You might want to refresh the list after deleting
    } else {
      alert("Failed to delete reservation");
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="bg-yellow-600 mt-2 text-white text-base hover:bg-red-500 bg-[#a19589] border-none px-3 py-1 rounded"
      >
        Remove Reservation
      </button>

      <button
        onClick={() => setIsEditing(true)}
        className="bg-yellow-600 mx-4 mt-2 text-white text-base hover:bg-red-500 bg-[#a19589] border-none px-3 py-1 rounded"
      >
        Edit Reservation
      </button>

      {isEditing && (
        <div className="text-blue-700 px-5">
          <label>
            Reservation Date:
            <input
              type="date"
              value={updatedDate}
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
          </label>
          <button
              onClick={handleEdit}
              className="bg-green-600 mx-4 mt-2 text-white text-base hover:bg-red-500 bg-[#a19589] border-none px-3 py-1 rounded">
              Submit Edit
            </button>

        
          
        </div>
      )}
    </div>
  );
}
