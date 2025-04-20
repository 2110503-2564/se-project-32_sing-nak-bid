import getRestaurants from "@/libs/getRestaurants"
import { Suspense } from "react"
import { LinearProgress } from "@mui/material"
import { RestaurantJson } from "../../../../interfaces"
import RestaurantCard from "@/components/RestaurantCard"
//delete import HotelJson from interfaces.tsx


// แก้ไขให้ hotel -> restaurant แทน ทั้งชื่อตัวแปร ชื่อ import
export default async function Restaurantpage(){
    const restaurants:RestaurantJson = await getRestaurants()
    return(
        <main className="text-center p-5">
            <h1 className="text-3xl font-Kanit">Select Your Restaurant</h1>
            <Suspense fallback={<p>Loading...<LinearProgress/></p>}>


{/* เพิ่ม RestaurantCard สำหรับโชว์ร้านอาหารแต่ละร้าน */}
<div className="flex flex-row gap-x-12  itens-center justify-center py-6"> 

{restaurants.data.map((restaurant: Restaurant, index) => (
  <div key={index} className="mb-4">
    <RestaurantCard
      restaurantname={restaurant.name}
      imgSrc="/img/Food1.jpg"
    />
  </div>
))}
</div>

            </Suspense>



            
        </main>
    )
}