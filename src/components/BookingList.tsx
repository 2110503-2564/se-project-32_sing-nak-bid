"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationsItem, ReservationJson } from "../../interfaces";
import getReserves from "@/libs/getReserves";
import deleteReserve from "@/libs/deleteReserve"; 

export default function BookingList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservationsItems, setReservationsItems] = useState<ReservationsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveBooking = async (id: string) => {
    if (!session?.user?.token) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to remove this booking?"
    );
    if (!isConfirmed) return;

    try {
      await deleteReserve(id, session.user.token);
      setReservationsItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.token) return;
      try {
        setLoading(true);
        const reservations: ReservationJson = await getReserves(session.user.token);
        setReservationsItems(reservations.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchBookings();
    }
  }, [session?.user?.token]);

  if (status === "loading" || loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="p-4">
      {reservationsItems.length > 0 ? (
        reservationsItems.map((reservationsItem, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg mb-4 p-6">
            <div className="text-lg text-gray-600 mb-4">
              <span className="font-medium">Restaurant:</span>{" "}
              {reservationsItem.restaurant.name}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              <span className="font-medium">Reservation Date:</span>{" "}
              {reservationsItem.reservationDate}
            </div>
            {/* <div className="text-lg text-gray-600 mb-4">
              <span className="font-medium">Nights:</span> {reservationsItem.}
            </div> */}
            <div className="flex space-x-2">
              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-red-500 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-red-300 hover:text-black"
                onClick={() => handleRemoveBooking(reservationsItem._id)}
              >
                <span className="relative z-10">Remove Booking</span>
              </button>

              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-blue-300 hover:text-black"
                onClick={() => router.push(`/update/${reservationsItem._id}`)}
              >
                Update
              </button>

              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-blue-300 hover:text-black"
                onClick={() => router.push(`/order/${reservationsItem._id}`)}
              >
                Order
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-xl text-center text-gray-600">
          No Hotel Booking Available.
        </div>
      )}
    </div>
  );
}
