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
    <main className="text-center p-5 ">
  <h1 className="text-xl font-bold mb-4">My Order</h1>

  {orderDetail.orderItems.map((item, index) => (
    <div
      key={item._id}
      className="bg-white text-left p-4 rounded-lg shadow-md my-4"
    >
      <div><strong>Name:</strong> {item.menuItem.name}</div>
      <div><strong>Price:</strong> {item.menuItem.price} THB</div>
      <div><strong>Description:</strong> {item.menuItem.description}</div>
      <div><strong>Quantity:</strong> {item.quantity}</div>
      <div><strong>Note:</strong> {item.note || '-'}</div>
    </div>
  ))}
</main>

  );
}
