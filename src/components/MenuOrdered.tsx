"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./MenuOrdered.module.css";
import { MenuItemOrdered } from "../../interfaces";
import getMenus from "@/libs/getMenus";
// Import icons
import { Utensils, ShoppingBag, ThumbsUp } from "lucide-react";

interface MenuOrderedProps {
  restaurantId?: string;
}

export default function MenuOrdered({ restaurantId }: MenuOrderedProps) {
  const params = useParams();
  const [menuItems, setMenuItems] = useState<MenuItemOrdered[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      // Try to get restaurant ID from props first, then from params
      const idToUse = restaurantId || (params?.id && typeof params.id === "string" ? params.id : null);
      
      if (!idToUse) {
        setError("ไม่พบ ID ร้านอาหาร");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // เรียกใช้ getMenus และรับข้อมูล
        const response = await getMenus(idToUse);
        
        // Debug: แสดง log เพื่อดูโครงสร้างข้อมูล
        console.log("API Response:", response);
        
        let items: MenuItemOrdered[] = [];
        
        // ตรวจสอบว่าข้อมูลมีโครงสร้างแบบไหน
        if (Array.isArray(response)) {
          items = response;
        } else if (response && typeof response === 'object') {
          // ลองตรวจสอบว่ามี data field หรือไม่
          if (Array.isArray(response.data)) {
            items = response.data;
          } else if (response.menus && Array.isArray(response.menus)) {
            items = response.menus;
          } else {
            // หากไม่พบรูปแบบที่รู้จัก ให้ลองแปลงเป็น array
            const possibleItems = Object.values(response).find(val => Array.isArray(val));
            if (possibleItems) {
              items = possibleItems as MenuItemOrdered[];
            }
          }
        }
        
        // สำคัญ: เพิ่มเงื่อนไขให้ orderCount เป็น 0 ถ้าไม่มีค่า และตรวจสอบค่า recommended
        items = items.map(item => ({
          ...item,
          orderCount: item.orderCount !== undefined ? item.orderCount : 0,
          recommended: item.recommended !== undefined ? item.recommended : false
        }));
        
        // Debug: แสดงข้อมูลหลังจากแปลงแล้ว
        console.log("Processed items:", items);
        
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('ไม่สามารถโหลดรายการเมนูได้');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId, params?.id]);

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

      // Debug: แสดงข้อมูลการเรียก API
      const apiUrl = `/api/menu-items/${itemId}/recommend`;
      console.log(`Sending PATCH request to: ${apiUrl}`);
      console.log(`Request body:`, { recommended: newRecommendedValue });
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommended: newRecommendedValue }),
      });

      if (!response.ok) {
        // พยายามอ่านข้อมูล error จาก response
        const errorData = await response.json().catch(() => null);
        console.error('API error details:', errorData);
        throw new Error(`Failed to update recommendation status: ${response.status}`);
      }

      console.log('Successfully updated recommendation status');

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
      
      // แสดง alert เพื่อแจ้งผู้ใช้
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

  // สร้าง sorted array แยกออกมา
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