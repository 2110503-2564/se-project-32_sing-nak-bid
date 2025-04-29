"use client";
import { useState, useEffect } from "react";
import styles from "./ManagerPage.module.css";
import MenuOrdered from "../MenuOrdered";
import { useSession } from "next-auth/react";
import getReserves from "@/libs/getReserves";
import updateOrderStatus from "@/libs/updateOrderStatus";
import Link from "next/link";
// Import icons
import { ClipboardList, Clock, CheckCircle, Coffee, DollarSign, Star } from "lucide-react";

type InnerOrderItem = {
  _id: string;
  menuItem: string; // menuItem ตอนนี้เป็น String ที่เก็บ _id
  menuName: string;
  quantity: number;
  note?: string;
  // อาจมี orderCount และ stockCount ใน InnerOrderItem หรือต้องดึงจาก Menu Item
  orderCount?: number;
  stockCount?: number;
};

type OrderItem = {
  _id: string;
  reservation: string;
  restaurant: string;
  checkInStatus: boolean;
  checkInTime: string | null;
  totalPrice: number;
  phoneNumber: string;
  emailUser: string;
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

const updateMenu = async (
  token: string,
  restaurantId: string,
  menuId: string,
  updateData: { orderCount?: number; stockCount?: number }
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/restaurants/${restaurantId}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ใส่ token หาก API ต้องการ
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update menu:", errorData);
      throw new Error(`Failed to update menu: ${response.statusText}`);
    }

    const updatedMenu = await response.json();
    console.log("Menu updated successfully:", updatedMenu);
    return updatedMenu;
  } catch (error: any) {
    console.error("Error updating menu:", error.message);
    throw error;
  }
};

export default function ManagerPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [showRevenue, setShowRevenue] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

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

        // Calculate total revenue from completed orders
        const completedOrders = bookings.data
          .flatMap(reservation => reservation.orderItems || [])
          .filter(order => order?.status === "completed");

        const revenue = completedOrders.reduce((total, order) => total + (order.totalPrice || 0), 0);
        setTotalRevenue(revenue);
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
      setError("Unable to move the order back to its previous status");
      return;
    }

    // Update on the server
    try {
      await updateOrderStatus(orderItemId, newStatus, session.user.token);
      console.log(`Updated order item ${orderItemId} to status: ${newStatus}`);

      if (newStatus === "completed") {
        const completedOrder = reservations
          .flatMap(reservation => reservation.orderItems || [])
          .find(order => order._id === orderItemId);

        if (completedOrder) {
          for (const item of completedOrder.orderItems) {
            const { menuItem, quantity, orderCount: itemOrderCount, stockCount: itemStockCount } = item;
            console.log("InnerOrderItem (onDrop):", item);

            const newOrderCount = (itemOrderCount || 0) + quantity;
            const newStockCount = (itemStockCount || 0) - quantity;

            console.log(`Updating menu ${menuItem} (onDrop): orderCount=${newOrderCount}, stockCount=${newStockCount}`);
            await updateMenu(session.user.token, restaurantId, menuItem, { orderCount: newOrderCount, stockCount: newStockCount });
          }
        }
      }

      // If moving to completed, refresh data to update revenue
      fetchReservations();
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("Failed to update order status. Please try again");

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
      setError("You are not logged in. Please log in again.");
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

      if (nextStatus === "completed") {
        const completedOrder = reservations
          .flatMap(reservation => reservation.orderItems || [])
          .find(order => order._id === orderItemId);

        if (completedOrder) {
          for (const item of completedOrder.orderItems) {
            const { menuItem, quantity, orderCount: itemOrderCount, stockCount: itemStockCount } = item;
            console.log("InnerOrderItem (click):", item);

            const newOrderCount = (itemOrderCount || 0) + quantity;
            const newStockCount = (itemStockCount || 0) - quantity;

            console.log(`Updating menu ${menuItem} (click): orderCount=${newOrderCount}, stockCount=${newStockCount}`);
            await updateMenu(session.user.token, restaurantId, menuItem, { orderCount: newOrderCount, stockCount: newStockCount });
          }
        }
      }

      // Refresh data to update revenue if moving to completed
      fetchReservations();
    } catch (error: any) {
      console.error("Failed to update order status:", error.message);
      setError("Failed to update order status. Please try again");

      // Revert optimistic update
      fetchReservations();
    }
  };

  const toggleRevenueDisplay = () => {
    setShowRevenue(!showRevenue);
  };

  const renderColumn = (status: "pending" | "preparing") => {
    // Map the status to display text and icon
    const statusInfo = {
      pending: { text: "PENDING", icon: <Clock size={20} /> },
      preparing: { text: "PREPARING", icon: <Coffee size={20} /> },
    };

    const columnClass = status === "pending" ? styles.columnPending : styles.columnPreparing;

    return (
      <div
        className={`${styles.column} ${columnClass}`}
        onDrop={(e) => onDrop(e, status)}
        onDragOver={(e) => allowDrop(e, status)}
      >
        <h2 className={styles.heading}>
          {statusInfo[status].icon} {statusInfo[status].text}
        </h2>
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
                      {item.menuName} <div>(หมายเหตุ: {item.note || '-'} )
                        x {item.quantity}</div>
                    </div>
                  ))}
                  <p>Order by: {orderItem.emailUser || "ไม่ระบุอีเมล"}</p>
                  <p>Tel: {orderItem.phoneNumber}</p>
                  <p>Total: {orderItem.totalPrice} Baht</p>
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
        <h2 className={styles.heading}>
          <CheckCircle size={20} /> COMPLETE
        </h2>
        <div className={styles.dropHere}>
          Drag order here to set status to be Complete
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <ClipboardList size={28} /> Order List
          {isLoading && <span className={styles.loading}> Loading...</span>}
        </div>
        <button
          className={styles.revenueButton}
          onClick={toggleRevenueDisplay}
        >
          <DollarSign size={20} /> Revenue
        </button>
      </div>

      {showRevenue && (
        <div className={styles.revenuePanel}>
          <h3>Total Revenue from Completed Orders</h3>
          <div className={styles.revenueAmount}>
            <DollarSign size={24} />
            <span>{totalRevenue.toFixed(2)} Baht</span>
          </div>
        </div>
      )}

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

      {/* Wrap MenuOrdered in a div with menuSection class */}
      <div className={styles.menuSection}>
        {restaurantId && <MenuOrdered restaurantId={restaurantId} />}
      </div>

      {/* View Reviews Button */}
      {restaurantId && (
        <div className={styles.reviewButtonContainer}>
          <Link href={`/managerview/${restaurantId}`} passHref>
            <div className={styles.reviewButton}>
              <Star size={20} /> View Reviews
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}