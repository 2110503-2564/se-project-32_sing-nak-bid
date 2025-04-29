"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./MenuOrdered.module.css";
import { MenuItemOrdered } from "../../interfaces";
import getMenus from "@/libs/getMenus";
import { useSession } from "next-auth/react"; // Import useSession
// Import icons
import { Utensils, ShoppingBag, ThumbsUp } from "lucide-react";

interface MenuOrderedProps {
  restaurantId?: string;
  onMenuUpdated?: boolean; // Prop สำหรับ Trigger การ Re-fetch (optional)
}

export default function MenuOrdered({ restaurantId, onMenuUpdated }: MenuOrderedProps) {
  const params = useParams();
  const [menuItems, setMenuItems] = useState<MenuItemOrdered[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession(); // Get session data

  useEffect(() => {
    const fetchMenuItems = async () => {
      const idToUse = restaurantId || (params?.id && typeof params.id === "string" ? params.id : null);

      if (!idToUse) {
        setError("ไม่พบ ID ร้านอาหาร");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getMenus(idToUse);
        console.log("API Response (MenuOrdered):", response);

        let items: MenuItemOrdered[] = [];

        if (response?.success && Array.isArray(response.data)) {
          items = response.data;
        } else if (response?.success && response.data && typeof response.data === 'object' && Array.isArray(Object.values(response.data).find(val => Array.isArray(val)))) {
          items = Object.values(response.data).find(val => Array.isArray(val)) as MenuItemOrdered[];
        } else if (Array.isArray(response)) {
          items = response;
        } else if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
            items = response.data;
          } else if (response.menus && Array.isArray(response.menus)) {
            items = response.menus;
          } else {
            const possibleItems = Object.values(response).find(val => Array.isArray(val));
            if (possibleItems) {
              items = possibleItems as MenuItemOrdered[];
            }
          }
        }

        items = items.map(item => ({
          ...item,
          orderCount: item.orderCount !== undefined ? item.orderCount : 0,
          recommended: item.recommended !== undefined ? item.recommended : false
        }));

        console.log("Processed items (MenuOrdered):", items);
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching menu items (MenuOrdered):', err);
        setError('ไม่สามารถโหลดรายการเมนูได้');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId, params?.id, onMenuUpdated]);

  const toggleRecommended = async (itemId: string, currentRecommended: boolean) => {
    if (!session?.user?.token || !restaurantId) {
      console.error("Authentication token or restaurant ID not available.");
      alert("ไม่สามารถอัพเดทสถานะเมนูแนะนำได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    try {
      // Update UI optimistically
      setMenuItems(prev =>
        prev.map(item =>
          item._id === itemId
            ? { ...item, recommended: !currentRecommended }
            : item
        )
      );

      const apiUrl = `http://localhost:5000/api/v1/restaurants/${restaurantId}/menu/${itemId}`;
      const newRecommendedValue = !currentRecommended;

      console.log(`Sending PUT request to: ${apiUrl}`);
      console.log(`Request body:`, { recommended: newRecommendedValue });

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`, // Include authorization token
        },
        body: JSON.stringify({ recommended: newRecommendedValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error details (toggleRecommended):', errorData);
        throw new Error(`Failed to update recommendation status: ${response.status}`);
      }

      console.log('Successfully updated recommendation status (toggleRecommended)');

    } catch (err) {
      console.error('Error updating recommendation status (toggleRecommended):', err);

      // Revert UI changes on error
      setMenuItems(prev =>
        prev.map(item =>
          item._id === itemId
            ? { ...item, recommended: currentRecommended }
            : item
        )
      );

      alert('ไม่สามารถอัพเดทสถานะเมนูแนะนำได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading Menu...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!menuItems || menuItems.length === 0) {
    return <div className={styles.empty}>Menu Not Found</div>;
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => b.orderCount - a.orderCount);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <Utensils size={24} /> Menu Ordered
      </h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.nameHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Utensils size={16} /> Menu name
                </div>
              </th>
              <th className={styles.countHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={16} /> Order quantity
                </div>
              </th>
              <th className={styles.recommendHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ThumbsUp size={16} /> Set as Recommended menu
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMenuItems.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td className={styles.itemName}>
                  {item.name} ฿{item.price?.toFixed(2)}
                </td>
                <td className={styles.count}>{item.orderCount}</td>
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={item.recommended}
                    onChange={() => toggleRecommended(item._id, item.recommended)}
                    className={styles.checkbox}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}