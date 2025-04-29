"use client";
import { useState, useEffect } from "react";
import styles from "./RecommendedMenu.module.css";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
  orderCount?: number;
  allergens?: {
    _id: string;
    name: string[] | string;
    description: string[];
  }[];
}

interface RecommendedMenuProps {
  menuItems: MenuItem[];
  selectedAllergens: string[];
  selectedCount: number; // จำนวนเมนูที่ถูกเลือกไปแล้ว
}

export default function RecommendedMenu({
  menuItems,
  selectedAllergens,
  selectedCount,
}: RecommendedMenuProps) {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      // Filter for recommended items first
      const onlyRecommended = menuItems.filter((item) => item.recommended === true);

      // Filter recommended items based on selectedAllergens
      const filteredByAllergens = onlyRecommended.filter((item) => {
        if (!selectedAllergens || selectedAllergens.length === 0 || !item.allergens) {
          return true;
        }
        return !item.allergens.some((allergen) => {
          if (allergen.name && Array.isArray(allergen.name)) {
            return allergen.name.some((name) => selectedAllergens.includes(name));
          } else if (allergen.name && typeof allergen.name === "string") {
            return selectedAllergens.includes(allergen.name);
          }
          return false;
        });
      });

      // Take up to 3 recommended items
      setRecommendedItems(filteredByAllergens.slice(0, 3));
    } else {
      setRecommendedItems([]);
    }
  }, [menuItems, selectedAllergens]);

  return (
    <div className={styles.recommendedSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recommended Menu</h2>
        <div className={styles.lightIcon}>🔥</div>
      </div>

      <div className={styles.menuGrid}>
        {recommendedItems.length > 0 ? (
          recommendedItems.map((item, index) => (
            <div key={item._id + '-' + index} className={styles.menuCard}>
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
          ))
        ) : (
          <div className={styles.noItems}>
            <p>No recommended items available based on your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}