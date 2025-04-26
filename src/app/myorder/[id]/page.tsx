'use client';

import Image from "next/image";
import getOrder from "@/libs/getOrder";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Interfaces based on your schema
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
}

interface OrderItem {
  _id: string;
  menuItem: MenuItem;
  quantity: number;
  note: string;
}

interface Reservation {
  _id: string;
  reservationDateTime: string;
  user: string;
  restaurant: string;
  status: string;
  createdAt: string;
}

interface OrdersItem {
  _id: string;
  reservation: Reservation;
  checkInStatus: boolean;
  checkInTime: string | null;
  totalPrice: number;
  phoneNumber: string;
  status: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [orderDetail, setOrderDetail] = useState<OrdersItem>();

  useEffect(() => {
    const fetchOrder = async () => {
      if (session?.user?.token) {
        try {
          const res = await getOrder(session.user.token, params.id);
          console.log("Order Detail (raw response):", res);
          setOrderDetail(res.data);
        } catch (error) {
          console.error("Failed to fetch order:", error);
        }
      }
    };

    fetchOrder();
  }, [session, params.id]);

  if (status === "loading" || !orderDetail) return <div>Loading...</div>;
  if (!session) return <div>Access denied. Please log in.</div>;

  return (
    <main className="bg-amber-50 min-h-screen p-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Order</h1>
          {orderDetail?.totalPrice && (
            <p className="text-lg text-green-600 font-semibold">
              Total: {orderDetail.totalPrice} THB
            </p>
          )}
          {orderDetail?.status && (
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                orderDetail.status === 'completed' ? 'bg-green-100 text-green-800' :
                orderDetail.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {orderDetail.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderDetail?.orderItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.menuItem.name}</h3>
                <p className="text-green-600 font-medium mb-3">{item.menuItem.price} THB</p>
                <p className="text-gray-600 text-sm mb-3">{item.menuItem.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    Qty: {item.quantity}
                  </span>
                  {item.note && (
                    <span className="text-red-500 text-sm italic">
                      {item.note}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!orderDetail || orderDetail.orderItems.length === 0) && (
          <div className="text-center py-10">
            <p className="text-gray-500">No items in this order.</p>
          </div>
        )}
      </div>
    </main>
  );
}