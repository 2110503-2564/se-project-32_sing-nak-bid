"use client";
import { useState, useEffect } from "react";
import styles from "./MenuOrdered.module.css";
import { MenuItemOrdered } from "../../interfaces";
import getMenuOrdered from "@/libs/getMenuOrdered";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  orderCount: number;
  recommended: boolean;
}

interface MenuOrderedProps {
  restaurantId?: string;
}

export default function MenuOrdered({ restaurantId }: MenuOrderedProps) {
  const [menuItems, setMenuItems] = useState<MenuItemOrdered[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurantId) return;
      
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data.data || []);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const toggleRecommended = async (itemId: string) => {
    try {
      const itemToUpdate = menuItems.find(item => item._id === itemId);
      if (!itemToUpdate) return;

      const newRecommendedValue = !itemToUpdate.recommended;
      
      // Update UI optimistically
      setMenuItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, recommended: newRecommendedValue } 
            : item
        )
      );

      // Send update to API
      const response = await fetch(`/api/menu-items/${itemId}/recommend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommended: newRecommendedValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update recommendation status');
      }

    } catch (err) {
      console.error('Error updating recommendation status:', err);
      // Revert UI changes on error
      setMenuItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, recommended: !item.recommended } 
            : item
        )
      );
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading menu...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (menuItems.length === 0) {
    return <div className={styles.empty}>No menu found.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Menu Ordered</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.nameHeader}>Menu Item</th>
              <th className={styles.countHeader}>count</th>
              <th className={styles.recommendHeader}>
                make<br/>recommended
              </th>
            </tr>
          </thead>
          <tbody>
            {menuItems
              .sort((a, b) => b.orderCount - a.orderCount)
              .map((item) => (
                <tr key={item._id} className={styles.tableRow}>
                  <td className={styles.itemName}>
                    {item.name} ฿{item.price.toFixed(2)}
                  </td>
                  <td className={styles.count}>{item.orderCount}</td>
                  <td className={styles.checkboxCell}>
                    <input 
                      type="checkbox" 
                      checked={item.recommended}
                      onChange={() => toggleRecommended(item._id)}
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