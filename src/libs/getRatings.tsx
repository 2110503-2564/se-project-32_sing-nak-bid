import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getRatings(restaurantId:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}/rating`)
    if(!response.ok){
        console.log(response)
        throw new Error("Failed to fetch ratings")
    }
    return await response.json();
}
