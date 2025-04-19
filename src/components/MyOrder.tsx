'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingsItem, BookingJson, OrdersItem, OrderJson } from "../../interfaces";
import getOrders from "@/libs/getOrders";
import deleteOrder from "@/libs/deleteOrder";

{/* <div class="w-[250px] bg-white rounded-[10px] border border-silver p-[10px] m-[5px]">
  <!-- content -->
</div> */}

export default function MyOrder() {

  

  const { data: session, status } = useSession();
  const router = useRouter();
  const [ordersItems, setOrdersItems] = useState<OrdersItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveOrder = async (id: string) => {
    if (!session?.user?.token) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to remove this Order?"
    );
    if (!isConfirmed) return;

    try {
      await deleteOrder(id, session.user.token);
      setOrdersItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete Order:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.token) return;
      try {
        setLoading(true);
        const orders: OrderJson = await getOrders(session.user.token);
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

  if (status === "loading" || loading) {
    return <div className="text-[#201335] mt-[100px] text-center">Loading orders...</div>;
  }

    return (
      <div className="p-10 space-y-5 min-h-screen" style={{ backgroundColor: '#f4ecdd' }}>

        {ordersItems.length > 0 ?(
          ordersItems.map((ordersItem, index) => (
          <div key={index} className="w-full rounded-[10px] border p-6 shadow"
          style={{
            backgroundColor: '#ED8265',
            borderColor: '#AC6643',
            color: '#201335'
          }}>
            <div className="text-lg mb-4">
              <span className="font-semibold">Menu:</span>{" "}
              {ordersItem.name}
            </div>
            <div className="text-lg mb-4">
              <span className="font-semibold">Quantity:</span>{" "}
              {ordersItem.quantity}
            </div>
            {ordersItem.note === "" ? ( 
            <div className="text-lg mb-4">
              <span className="font-semibold">Note:</span> {ordersItem.note}
            </div>
            ): "" };
            <div className="flex space-x-2">
              <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 rounded-md overflow-hidden transition-colors duration-500"
                style={{
                  backgroundColor: '#AC6643',
                  borderColor: '#201335',
                  color: '#f4ecdd'
                }}
                onClick={() => handleRemoveOrder(ordersItem._id)}
              >
                <span className="relative z-10">Remove Orders</span>
              </button>


              {/* <button
                className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-500 hover:bg-blue-300 hover:text-black"
                onClick={() => router.push(`/update/${ordersItem._id}`)}
              >
                Update
              </button> */}
            </div>
          </div>
          ))
        ):(<div className="text-xl text-center" style={{ color: '#201335' }}>
          No Order on this Reservation.
        </div>
        )}


      </div>
    )
  }