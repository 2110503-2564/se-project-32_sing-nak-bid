import getRestaurants from "@/libs/getRestaurants";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import { RestaurantJson } from "../../../../interfaces";
import RestaurantCard from "@/components/RestaurantCard"; //delete import HotelJson from interfaces.tsx
import Link from "next/link";

// แก้ไขให้ hotel -> restaurant แทน ทั้งชื่อตัวแปร ชื่อ import
export default async function Restaurantpage() {
  const restaurants: RestaurantJson = await getRestaurants();
  return (
    <main className="text-center p-5">
      <h1 className="text-3xl md:text-5xl font-bold text-[#201335]">
        Select Your Restaurant
      </h1>
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        {/* เพิ่ม RestaurantCard สำหรับโชว์ร้านอาหารแต่ละร้าน */}
        <div className="flex flex-row gap-x-12  itens-center justify-center py-6">
          {restaurants.data.map((restaurantitem: Restaurant, index) => (
            <div key={index} className="mb-4">
              <Link
                href={`/restaurant/${restaurantitem._id}`}
                className="w-1/5"
                key={index}
              >
                <RestaurantCard
                  restaurantname={restaurantitem.name}
                  imgSrc="/img/Food3.jpg"
                  restaurantaddress={restaurantitem.district}
                />
              </Link>
            </div>
          ))}
        </div>
      </Suspense>
    </main>
  );
}
