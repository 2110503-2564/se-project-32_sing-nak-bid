import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getRestaurants() {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("http://localhost:5000/api/v1/restaurants")
    if(!response.ok){
        throw new Error("Failed to fetch restaurants")
    }
    return await response.json()
}