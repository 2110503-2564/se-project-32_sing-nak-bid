import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getOrder(restaurantId:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}/menu`)
    if(!response.ok){
        console.log(response)
        throw new Error("Failed to fetch menu")
    }
    return await response.json();
}
