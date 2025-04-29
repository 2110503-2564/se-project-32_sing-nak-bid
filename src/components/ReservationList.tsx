"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationsItem, ReservationJson } from "../../interfaces";
import getReserves from "@/libs/getReserves";
import deleteReserve from "@/libs/deleteReserve";
import styles from "../app/myreservation/myreservation.module.css";
import { CalendarIcon, ClockIcon } from 'lucide-react';

export default function ReservationList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservationsItems, setReservationsItems] = useState<ReservationsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveReservation = async (id: string) => {
    if (!session?.user?.token) return;

    const isConfirmed = window.confirm("Are you sure you want to remove this reservation?");
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
        const reservations: ReservationJson = await getReserves(session.user.token);
        setReservationsItems(reservations.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        // Make sure we have a slight delay to avoid flickering
        await new Promise((res) => setTimeout(res, 1000));
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchReservations();
    }
  }, [session?.user?.token]);

  // Format date and time for better display
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (e) {
      return { date: "Date unavailable", time: "Time unavailable" };
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">My Reservations</h1>
        
        {reservationsItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reservationsItems.map((reservationsItem, index) => {
              const { date, time } = formatDateTime(reservationsItem.reservationDateTime);
              
              return (
                <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="bg-orange-100 p-4 border-b border-orange-200">
                    <h2 className="text-xl font-bold text-gray-800">
                      {reservationsItem.restaurant?.name || "Restaurant information unavailable"}
                    </h2>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <span>{time}</span>
                      </div>
                      
                      {reservationsItem.status && (
                        <div className="mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            reservationsItem.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            reservationsItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reservationsItem.status.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Only show order button if restaurant exists */}
                      {reservationsItem.restaurant && (
                        <button
                          className="flex-1 bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                          onClick={() => router.push(`/order/${reservationsItem.restaurant._id}/${reservationsItem._id}`)}
                        >
                          Order Menu
                        </button>
                      )}
                      
                      <button
                        className="flex-1 bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-green-400 focus:ring-2 focus:ring-green-300 focus:outline-none"
                        onClick={() => router.push(`/update/${reservationsItem._id}`)}
                      >
                        Update
                      </button>
                      
                      <button
                        className="flex-1 bg-red-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-red-400 focus:ring-2 focus:ring-red-300 focus:outline-none"
                        onClick={() => handleRemoveReservation(reservationsItem._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reservations</h3>
            <p className="text-gray-500">You don't have any restaurant reservations yet.</p>
            <button 
              onClick={() => router.push('/restaurant')}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Browse Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
}