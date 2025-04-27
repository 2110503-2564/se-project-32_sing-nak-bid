"use client";

import Banner from "../Banner";
import Homepage from "../HomepageCard"
import styles from "../Button.module.css";
import { useRouter } from "next/navigation";

export default function UserPage() {

  const router = useRouter();

    return (
      <>
      
        <div>
        <Banner />
         
         {/* เพิ่ม Component Homepage เพื่อโชว์ภาพร้านอาหารตัวอย่าง */}
         <div className="flex flex-row px-6 space-x-12 pt-2 pb-9">
        <Homepage
         restaurantName="Jeh-O Chula"
         imgSrc="/img/Food1.jpg"
         description="A small shophouse with a simple appearance that doesn't only have delicious Mama Oho, Je Oh has many other top menus, most of which are familiar Thai-Chinese comfort foods. But what makes it different is the use of quality ingredients and excellent cooking skills. Therefore, each dish is perfectly delicious. Popular menus such as crispy fried tofu with garlic, delicious duck rice soup, and Je Oh's special recipe crispy pork are really not to be missed."
        />
        
        <Homepage
         restaurantName="Louisvanich"
         imgSrc="/img/Food2.png"
         description="Louis Wanich is another famous restaurant in the Banthat Thong area. It is a restaurant that serves made-to-order dishes with delicious flavors and is decorated like a grocery store. If you go to this area, I'm telling you, you can't miss it."
        />
        
        </div>
       
        <div className="w-full flex justify-center mb-10">
          <button
            className={`group ${styles["button"]}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/restaurant");
            }}
          >
            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
              View Restaurants
            </span>
          </button>
        </div>

       </div>
      </>
    );
  }
