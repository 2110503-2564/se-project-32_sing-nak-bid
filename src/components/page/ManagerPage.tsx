"use client";
import { useState, useEffect } from "react";
import styles from "./ManagerPage.module.css";
import MenuOrdered from "../MenuOrdered";
import { useSession } from "next-auth/react";
import getReserves from "@/libs/getReserves";
import updateOrderStatus from "@/libs/updateOrderStatus";

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
  user: {
    _id: string;
    email: string;
    name?: string;
  };
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchReservations = async () => {
    if (session?.user?.token) {
      setIsLoading(true);
      setError(null);
      try {
        const bookings = await getReserves(session.user.token as string);
        setReservations(bookings.data);
      } catch (error: any) {
        console.error("Failed to fetch reservations:", error.message);
        setError("ไม่สามารถดึงข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [session?.user?.token]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, orderItemId: string) => {
    e.dataTransfer.setData("text/plain", orderItemId);
  };

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: "pending" | "preparing" | "completed"
  ) => {
    e.preventDefault();
    const orderItemId = e.dataTransfer.getData("text/plain");
    
    if (!session?.user?.token) {
      setError("คุณไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    
    const reservation = reservations.find(res =>
            res.orderItems?.some(order => order._id === orderItemId)
          );
          const reservationId = reservation?._id;
      
          if (!reservationId) {
            console.error("ไม่พบ reservationId สำหรับ orderItemId:", orderItemId);
            setError("เกิดข้อผิดพลาด: ไม่พบข้อมูลการจอง");
            return;
          }
      
          // Optimistic update - update UI immediately
          setReservations((prev) =>
            prev.map((res) => ({
              ...res,
              orderItems: res.orderItems?.map((order) =>
                order._id === orderItemId ? { ...order, status: newStatus } as OrderItem : order
              ),
            }))
          );
    // Update on the server
    try {
      await updateOrderStatus(orderItemId, newStatus,reservationId, session.user.token as string);
      console.log(`Updated order item ${orderItemId} to status: ${newStatus}`);
      
      // Refresh data to ensure we have the latest state
      fetchReservations();
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
      
      // Revert optimistic update if API call fails
      fetchReservations();
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCardClick = async (orderItemId: string, currentStatus: OrderItem["status"]) => {
    if (!session?.user?.token) {
      setError("คุณไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    
    let nextStatus: OrderItem["status"] = "pending";
    
    // Determine next status based on current status
    if (currentStatus === "pending") {
      nextStatus = "preparing";
    } else if (currentStatus === "preparing") {
      nextStatus = "completed";
    } else if (currentStatus === "completed") {
      // No change if already completed
      return;
    }
    
    // Optimistic update
    setReservations((prev) =>
      prev.map((reservation) => ({
        ...reservation,
        orderItems: reservation.orderItems?.map((order) =>
          order._id === orderItemId ? { ...order, status: nextStatus } as OrderItem : order
        ),
      }))
    );
    
    // Update on server
    const reservation = reservations.find(res =>
            res.orderItems?.some(order => order._id === orderItemId)
          );
          const reservationId = reservation?._id;
      
          if (!reservationId) {
            console.error("ไม่พบ reservationId สำหรับ orderItemId:", orderItemId);
            setError("เกิดข้อผิดพลาด: ไม่พบข้อมูลการจอง");
            return;
          }

    try {
      await updateOrderStatus(orderItemId, nextStatus,reservationId ,session.user.token as string);
      console.log(`Clicked order item: ${orderItemId}, new status: ${nextStatus}`);
      
      // Refresh data
      fetchReservations();
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
      
      // Revert optimistic update
      fetchReservations();
    }
  };

  const renderColumn = (status: "pending" | "preparing" | "completed") => {
    // Map the status to display text
    const statusText = {
      pending: "PENDING",
      preparing: "PREPARING",
      completed: "COMPLETE"
    };

    return (
      <div
        className={styles.column}
        onDrop={(e) => onDrop(e, status)}
        onDragOver={allowDrop}
      >
        <h2 className={styles.heading}>{statusText[status]}</h2>
        {reservations
          .flatMap((reservation) =>
            reservation.orderItems
              ?.filter((order) => order.status === status)
              .map((orderItem) => (
                <div
                  key={orderItem._id}
                  className={styles.card}
                  draggable
                  onDragStart={(e) => onDragStart(e, orderItem._id)}
                  onClick={() => handleCardClick(orderItem._id, orderItem.status)}
                >
                  {orderItem.orderItems.map((item) => (
                    <div key={item._id}>
                      {item.menuItem.name} x {item.quantity}
                      {item.note && ` (หมายเหตุ: ${item.note})`}
                    </div>
                  ))}
                  <p>ออเดอร์โดย: {reservation.user.email || "ไม่ระบุอีเมล"}</p>
                  <p>เบอร์โทร: {orderItem.phoneNumber}</p>
                  <p>รวม: {orderItem.totalPrice} บาท</p>
                </div>
              )) || []
          )}
      </div>
    );
  };

  return (
    <div>
      <div className={styles.header}>
        Order List
        {isLoading && <span className={styles.loading}> Loading...</span>}
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => {setError(null); fetchReservations();}}>Try Again</button>
        </div>
      )}
      
      <div className={styles.board}>
        {renderColumn("pending")}
        {renderColumn("preparing")}
        {renderColumn("completed")}
      </div>
      <MenuOrdered />
    </div>
  );
}