import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getRating(restaurantId:string,ratingId:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}/rating/${ratingId}`)
    if(!response.ok){
        console.log(response)
        throw new Error("Failed to fetch rating")
    }
    return await response.json();
}
