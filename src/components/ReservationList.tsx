"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationsItem, ReservationJson } from "../../interfaces";
import { Restaurant } from "../../interfaces";
import getReserves from "@/libs/getReserves";
import deleteReserve from "@/libs/deleteReserve";
import styles from "../app/myreservation/myreservation.module.css"

export default function ReservationList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservationsItems, setReservationsItems] = useState<
    ReservationsItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveReservation = async (id: string) => {
    if (!session?.user?.token) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to remove this Reservation?"
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
    const fetchReservations = async () => {
      if (!session?.user?.token) return;
      try {
        setLoading(true);
        const reservations: ReservationJson = await getReserves(
          session.user.token
        );
        console.log(reservations)
        setReservationsItems(reservations.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        new Promise((res) => setTimeout(res, 1000));
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchReservations();
    }
  }, [session?.user?.token]);

  if (status === "loading" || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.progress}>
          <div className={styles.inner}></div>
        </div>
      </div>
    );
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
              {reservationsItem.reservationDateTime}
            </div>
            <div className="flex space-x-2">
              <button
                className="relative inline-block w-60 h-12 text-[17px] font-medium border-2 border-black bg-red-500 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-red-300 hover:text-black"
                onClick={() => handleRemoveReservation(reservationsItem._id)}
              >
                <span className="relative z-10">Remove Reservation</span>
              </button>

              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-green-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-green-300 hover:text-black"
                onClick={() => router.push(`/update/${reservationsItem._id}`)}
              >
                Update
              </button>
              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-yellow-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-yellow-300 hover:text-black"
                onClick={() => router.push(`/order/${reservationsItem._id}`)}
              >
                Order
              </button>

              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-blue-300 hover:text-black"
                onClick={() => router.push(`/myorder`)}
              >
                My Order
              </button>

            </div>
          </div>
        ))
      ) : (
        <div className="text-xl text-center text-gray-600">
          No Restaurant Reservation Available.
        </div>
      )}
    </div>
  );
}