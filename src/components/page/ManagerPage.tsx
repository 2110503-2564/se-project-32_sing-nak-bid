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

// Define workflow order
const ORDER_STATES = ["pending", "preparing", "completed"];

export default function ManagerPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (session?.user?.token) {
      setIsLoading(true);
      setError(null);
      try {
        const bookings = await getReserves(session.user.token as string);
        setReservations(bookings.data);
        
        // Extract restaurant ID from the first reservation if available
        if (bookings.data.length > 0 && bookings.data[0].restaurant?._id) {
          setRestaurantId(bookings.data[0].restaurant._id);
        }
      } catch (error: any) {
        console.error("Failed to fetch reservations:", error.message);
        setError("Unable to retrieve reservations data, please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [session?.user?.token]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, orderItemId: string, currentStatus: string) => {
    e.dataTransfer.setData("text/plain", orderItemId);
    e.dataTransfer.setData("currentStatus", currentStatus);
  };

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: "pending" | "preparing" | "completed"
  ) => {
    e.preventDefault();
    const orderItemId = e.dataTransfer.getData("text/plain");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    
    if (!session?.user?.token) {
      setError("You are not logged in. Please log in again.");
      return;
    }
    
    // Prevent backward movement in workflow
    const currentIndex = ORDER_STATES.indexOf(currentStatus);
    const newIndex = ORDER_STATES.indexOf(newStatus);
    
    if (newIndex < currentIndex) {
      setError("ไม่สามารถย้ายออเดอร์ย้อนกลับไปยังสถานะก่อนหน้าได้");
      return;
    }
    
    // Update on the server
    try {
      await updateOrderStatus(orderItemId, newStatus, session.user.token);
      console.log(`Updated order item ${orderItemId} to status: ${newStatus}`);
      
      // If moving to completed, remove from UI
      if (newStatus === "completed") {
        // Refresh the entire data
        fetchReservations();
      } else {
        // For other statuses, update UI optimistically
        setReservations((prev) =>
          prev.map((reservation) => ({
            ...reservation,
            orderItems: reservation.orderItems?.map((order) =>
              order._id === orderItemId ? { ...order, status: newStatus } as OrderItem : order
            ),
          }))
        );
      }
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
      
      // Revert optimistic update if API call fails
      fetchReservations();
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    // Get the current status from dataTransfer
    const currentStatus = e.dataTransfer.getData("currentStatus");
    
    // Only allow drop if it's a forward movement in the workflow
    const currentIndex = ORDER_STATES.indexOf(currentStatus);
    const targetIndex = ORDER_STATES.indexOf(targetStatus);
    
    if (currentIndex < targetIndex || currentStatus === "") {
      e.preventDefault(); // Allow the drop
    }
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
    
    // Update on server
    try {
      await updateOrderStatus(orderItemId, nextStatus, session.user.token as string);
      console.log(`Clicked order item: ${orderItemId}, new status: ${nextStatus}`);
      
      // If moving to completed, remove from UI by refreshing data
      if (nextStatus === "completed") {
        fetchReservations();
      } else {
        // For other statuses, update UI optimistically
        setReservations((prev) =>
          prev.map((reservation) => ({
            ...reservation,
            orderItems: reservation.orderItems?.map((order) =>
              order._id === orderItemId ? { ...order, status: nextStatus } as OrderItem : order
            ),
          }))
        );
      }
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
      
      // Revert optimistic update
      fetchReservations();
    }
  };

  const renderColumn = (status: "pending" | "preparing") => {
    // Map the status to display text
    const statusText = {
      pending: "PENDING",
      preparing: "PREPARING",
    };

    return (
      <div
        className={styles.column}
        onDrop={(e) => onDrop(e, status)}
        onDragOver={(e) => allowDrop(e, status)}
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
                  onDragStart={(e) => onDragStart(e, orderItem._id, orderItem.status)}
                  onClick={() => handleCardClick(orderItem._id, orderItem.status)}
                >
                  {orderItem.orderItems.map((item) => (
                    <div key={item._id}>
                      {item.note} x {item.quantity}
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

  // Special column for Complete that only catches drops
  const renderCompleteColumn = () => {
    return (
      <div
        className={`${styles.column} ${styles.completeColumn}`}
        onDrop={(e) => onDrop(e, "completed")}
        onDragOver={(e) => allowDrop(e, "completed")}
      >
        <h2 className={styles.heading}>COMPLETE</h2>
        <div className={styles.dropHere}>
          Drag order here to set status to be Complete
        </div>
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
        {renderCompleteColumn()}
      </div>
      
      {/* Pass the restaurantId to MenuOrdered component */}
      {restaurantId && <MenuOrdered restaurantId={restaurantId} />}
    </div>
  );
}