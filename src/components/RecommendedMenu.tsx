"use client";
import { useState, useEffect } from "react";
import styles from "./RecommendedMenu.module.css";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  orderCount?: number;
  allergens?: {
    _id: string;
    name: string[] | string;
    description: string[];
  }[];
}

interface RecommendedMenuProps {
  menuItems: MenuItem[];
}

export default function RecommendedMenu({ menuItems }: RecommendedMenuProps) {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Sort menu items by orderCount (highest first) and take top 3
    if (menuItems && menuItems.length > 0) {
      const sorted = [...menuItems]
        .filter(item => item.orderCount && item.orderCount > 0)
        .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
        .slice(0, 3);
      
      setRecommendedItems(sorted);
    }
  }, [menuItems]);

  if (recommendedItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.recommendedSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recommended Menu</h2>
        <div className={styles.lightIcon}>🔥</div>
      </div>
      
      <div className={styles.menuGrid}>
        {recommendedItems.map((item) => (
          <div key={item._id} className={styles.menuCard}>
            <img 
              src="/img/menu.png" 
              alt={item.name} 
              className={styles.menuImage} 
            />
            <div className={styles.menuContent}>
              <h3 className={styles.menuName}>{item.name}</h3>
              <p className={styles.menuDescription}>{item.description}</p>
              <div className={styles.menuFooter}>
                <p className={styles.price}>฿{item.price.toFixed(2)}</p>
                {item.allergens && item.allergens.length > 0 && (
                  <div className={styles.allergens}>
                    Contains: {item.allergens
                      .map((allergen) => {
                        if (allergen.name && Array.isArray(allergen.name)) {
                          return allergen.name.join(", ");
                        } else if (
                          allergen.name &&
                          typeof allergen.name === "string"
                        ) {
                          return allergen.name;
                        }
                        return "";
                      })
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}