import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getReservations } from "@/libs/getReservations"; // You need to create/get this function
import { RestaurantJson } from "../../interface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DeleteEditBooking from "./EditDeleteReservation";
// Define the Restaurant and Reservation types
interface Restaurant {
  _id: string;
  name: string;
  address: string;
  id: string;
}

interface Reservation {
  _id: string;
  reservationDate: string;
  user: string;
  restaurant: Restaurant; // restaurant is an object of type Restaurant
  status: string;
  createdAt: string;
}

interface ReservationJson {
  success: boolean;
  count: number;
  pagination: object;
  data: Reservation[];
}

export default async function ReservationList({
  reservationJson,
  restaurantJson,
}: {
  reservationJson: Promise<ReservationJson>;
  restaurantJson: Promise<RestaurantJson>;
}) {
  const bookingsJsonResult = await reservationJson;
  const campsJsonResult = await restaurantJson;
  const session = await getServerSession(authOptions);


  if (!session) return null;



  return (
    <div >
      {bookingsJsonResult.count > 0 ? (
        // If there are bookings
        bookingsJsonResult.data.map(
          (
            booking: Reservation // Explicitly define the type of 'booking'
          ) => (
            <div
              key={booking.reservationDate} // Added a key prop to avoid React warning
              className="bg-[#f0e5da] rounded px-5 mx-5 py-2 my-9" // Changed to a brown-gray color
            >
              <div className="text-3xl px-3 font-semibold font-sans text-blue-800">
                Restaurant : {booking.restaurant.name}
              </div>
              <div className="mx-3 font-sans text-xl font-semibold py-1 text-pink-700">
                {new Date(booking.reservationDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-sm px-3 font-sans text-pink-700">user: {booking.user}</div>
              <div className="text-sm px-3 font-sans text-pink-700">
                Reservation: {booking.restaurant.name}
              </div>
              <DeleteEditBooking reservationDate={booking.reservationDate} restaurantId={booking.restaurant._id} reservationId={booking._id} />
            </div>
          )
        )
      ) : (
        // If there are no bookings
        <div className="text-center text-xl font-new-york text-red-700">
          No Restaurant Reservation
        </div>
      )}
    </div>
  );
}
