import Link from "next/link";
import ResCard from "./ResCard";
import { RestaurantItem,RestaurantJson } from "../../interface";

export default async function RestaurantCatalog({restaurantsJson}:{restaurantsJson:RestaurantJson}){
    const restaurantJsonReady = await restaurantsJson
    return(
        <>
        <div className="text-yellow-700 font-serif text-3xl text-center items-center my-10">

      
        🔻 Explore {restaurantJsonReady.count} Restaurants in our Catalog 🔻
        </div>
        
        <div className=" flex flex-wrap justify-around gap-4">
            {
                restaurantJsonReady.data.map((restaurantItem:RestaurantItem)=>(
                    <Link href={`/restaurants/${restaurantItem._id}`}className="w-1/5 ">
                        <ResCard ResName={restaurantItem.name} imgSrc={restaurantItem.picture} Tel={restaurantItem.tel} opentime={restaurantItem.opentime} />
                    </Link>
                ))
            }
        </div>
        </>
    )
}