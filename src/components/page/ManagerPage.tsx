"use client";
import { useState, useEffect } from "react";
import styles from "./ManagerPage.module.css";
import MenuOrdered from "../MenuOrdered";
import { useSession } from "next-auth/react";
import getReserves from "@/libs/getReserves";

type InnerOrderItem = {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
  };
  quantity: number;
  note?: string;
};

type OrderItem = {
  _id: string;
  reservation: string;
  restaurant: string;
  checkInStatus: boolean;
  checkInTime: string | null;
  totalPrice: number;
  phoneNumber: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  orderItems: InnerOrderItem[];
  createdAt: string;
  __v: number;
};

type Reservation = {
  _id: string;
  reservationDateTime: string;
  user: string;
  restaurant: {
    _id: string;
    name: string;
    address: string;
    tel: string;
    id: string;
  };
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  __v: number;
  orderItems?: OrderItem[];
  id: string;
};

export default function ManagerPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReservations = async () => {
      if (session?.user?.token) {
        try {
          const bookings = await getReserves(session.user.token as string);
          setReservations(bookings.data);
        } catch (error: any) {
          console.error("Failed to fetch reservations:", error.message);
          // Optionally set an error state to display a message to the user
        }
      }
    };

    fetchReservations();
  }, [session?.user?.token]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, orderItemId: string) => {
    e.dataTransfer.setData("text/plain", orderItemId);
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: "pending" | "preparing" | "complete"
  ) => {
    const orderItemId = e.dataTransfer.getData("text/plain");
    setReservations((prev) =>
      prev.map((reservation) => ({
        ...reservation,
        orderItems: reservation.orderItems?.map((order) =>
          order._id === orderItemId ? ({ ...order, status: newStatus } as OrderItem) : order
        ),
      }))
    );
    // คุณจะต้องเรียก API เพื่ออัปเดตสถานะบนเซิร์ฟเวอร์ด้วย
    console.log(`Dropped order item ${orderItemId} to status: ${newStatus}`);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCardClick = (orderItemId: string) => {
    setReservations((prev) =>
      prev.map((reservation) => ({
        ...reservation,
        orderItems: reservation.orderItems?.map((order) => {
          if (order._id === orderItemId) {
            const nextStatus: OrderItem["status"] =
              order.status === "pending"
                ? "preparing"
                : order.status === "preparing"
                ? "complete"
                : "complete";
            return { ...order, status: nextStatus } as OrderItem;
          }
          return order;
        }),
      }))
    );
    // คุณจะต้องเรียก API เพื่ออัปเดตสถานะบนเซิร์ฟเวอร์ด้วย
    console.log(`Clicked order item: ${orderItemId}`);
  };

  const renderColumn = (status: "pending" | "preparing" | "complete") => (
    <div
      className={styles.column}
      onDrop={(e) => onDrop(e, status)}
      onDragOver={allowDrop}
    >
      <h2 className={styles.heading}>{status.toUpperCase()}</h2>
      {reservations
        .map((reservation) =>
          reservation.orderItems
            ?.filter((order) => order.status === status)
            .map((orderItem) => (
              <div
                key={orderItem._id}
                className={styles.card}
                draggable
                onDragStart={(e) => onDragStart(e, orderItem._id)}
                onClick={() => handleCardClick(orderItem._id)}
              >
                {orderItem.orderItems.map((item) => (
                  <div key={item.menuItem._id}>
                    {item.menuItem.name} x {item.quantity}
                    {item.note && ` (หมายเหตุ: ${item.note})`}
                  </div>
                ))}
                <p>ออเดอร์โดย: {reservation.user}</p>
                <p>เบอร์โทร: {orderItem.phoneNumber}</p>
                <p>รวม: {orderItem.totalPrice} บาท</p>
              </div>
            ))
        )
        .filter((item) => item !== undefined)}
    </div>
  );

  return (
    <div>
      <div className={styles.header}>Order List</div>
      <div className={styles.board}>
        {renderColumn("pending")}
        {renderColumn("preparing")}
        {renderColumn("complete")}
      </div>
      <MenuOrdered />
    </div>
  );
}