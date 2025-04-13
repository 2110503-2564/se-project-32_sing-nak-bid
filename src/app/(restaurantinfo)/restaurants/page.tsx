import ResCard from "@/components/ResCard";
import { RestaurantItem } from "../../../../interface";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getRestaurants from "@/libs/getRestaurants";
import RestaurantCatalog from "@/components/RestaurantCatalog";

export default async function Restuarant() {
  const restaurant = await getRestaurants()
  console.log(restaurant)
  return (
    <main>
      
      <RestaurantCatalog restaurantsJson={restaurant}/>
      
    </main>
  );
}
