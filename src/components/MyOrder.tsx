"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  ReservationsItem,
  ReservationJson,
  OrdersItem,
  OrderJson,
} from "../../interfaces";
import getOrders from "@/libs/getOrders";
import getOrder from "@/libs/getOrder";
import deleteOrder from "@/libs/deleteOrder";
import { useRouter } from "next/navigation";

{
  /* <div class="w-[250px] bg-white rounded-[10px] border border-silver p-[10px] m-[5px]">
  <!-- content -->
</div> */
}

export default function MyOrder() {
  const { data: session, status } = useSession();
  const [ordersItems, setOrdersItems] = useState<OrdersItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.token) return;
      try {
        setLoading(true);
        const orders: OrderJson = await getOrders(session.user.token);
        console.log("Fetched orders:", orders);
        setOrdersItems(orders.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchOrders();
    }
  }, [session?.user?.token]);

  const handleRemoveOrder = async (orderId: string) => {
    if (!session?.user?.token) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to remove this Order?"
    );
    if (!isConfirmed) return;

    try {
      for (const ordersItem of ordersItems) {
        await deleteOrder(
          ordersItem.reservation._id,
          orderId,
          session.user.token
        );
      }

      setOrdersItems([]);
    } catch (error) {
      console.error("Failed to delete Order:", error);
    }
  };

  //Loading
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4ecdd]">
        <style>
          {`
            @keyframes page-flip {
              0% { transform: rotateY(0deg); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: rotateY(180deg); opacity: 0; }
            }
          `}
        </style>
        <div className="relative w-[200px] h-[140px]">
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-900 blur-md rounded-full opacity-30" />
          <div className="relative w-full h-full bg-[#AC6643] rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[90%] h-[90%] bg-white/60 rounded-md"
                  style={{
                    animation: `page-flip 2.5s ease-in-out ${
                      i * 0.3
                    }s infinite`,
                    transformOrigin: "left",
                    backfaceVisibility: "hidden",
                  }}
                />
              ))}
            </div>
            <div className="absolute top-5 left-5 right-5 space-y-2">
              <div className="h-2 bg-white/70 rounded w-3/4" />
              <div className="h-2 bg-white/50 rounded w-1/2" />
              <div className="h-2 bg-white/40 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-10 space-y-5 min-h-screen"
      style={{ backgroundColor: "#f4ecdd" }}
    >
      {ordersItems.length > 0 ? (
        ordersItems.map((ordersItem, index) => (
          <div
            key={index}
            className="w-full rounded-[10px] border p-6 shadow"
            style={{
              backgroundColor: "#DEB887",
              borderColor: "#AC6643",
              color: "#201335",
            }}
          >
            
              
            <div key={ordersItem._id} className="mb-4 bg-white/40 p-3 rounded-md flex items-start">
  <img src="/img/Food3.jpg" alt="Food" className="w-[30%] h-auto mr-4 rounded border border-gray-300" />
  <div>
   <div className="text-lg mb-1">
    <span className="font-semibold">Restaurant:</span>{" "}
    {ordersItem.restaurant.name}
   </div>

   <div className="text-lg mb-1">
    <span className="font-semibold">Check-in Date & Time:</span>{" "}
    {ordersItem.checkInTime ? new Date(ordersItem.checkInTime).toLocaleString() : "-"}
   </div>
   <div className="text-lg mb-1">
    <span className="font-semibold">Check-in Status:</span>{" "}
    {ordersItem.checkInStatus?"Checked-in":"Not Check-in yet"}
   </div>
   <div className="text-lg mb-1">
    <span className="font-semibold">
     Order Status: {ordersItem.status}
    </span>{" "}
   </div>
  </div>
 </div>


                <div className="flex space-x-2 mt-4">
  <button
    className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 rounded-md overflow-hidden transition-colors duration-300 bg-[#AC6643] border-[#201335] text-[#f4ecdd] hover:bg-[#8a4f35] hover:text-white"
    onClick={() => {
      handleRemoveOrder(ordersItem._id);
    }}
  >
    <span className="relative z-10">Remove Orders</span>
  </button>

  <button
    className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 rounded-md overflow-hidden transition-colors duration-300 bg-[#AC6643] border-[#201335] text-[#f4ecdd] hover:bg-[#8a4f35] hover:text-white"
    onClick={() => router.push(`/myorder/${ordersItem._id}`)}
  >
    <span className="relative z-10">View Details</span>
  </button>
</div>

                  
          </div>
        ))
      ) : (
        <div className="text-xl text-center" style={{ color: "#201335" }}>
          No Order on this Reservation.
        </div>
      )}
    </div>
  );
}
