import { error } from "console"
import { TIMEOUT } from "dns"
import { MenuItemOrdered } from "../../interfaces"

export default async function getMenuOrdered(restaurantId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  //fetch correct???
  const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}/menu-items/ordered`)
  
  if (!response.ok) {
    console.log(response)
    throw new Error("Failed to fetch ordered menu items")
  }
  
  return await response.json();
}