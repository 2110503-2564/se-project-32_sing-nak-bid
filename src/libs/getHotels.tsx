import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getHotels() {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("https://ya-seleng-back-end.vercel.app/api/v1/hotels")
    if(!response.ok){
        throw new Error("Failed to fetch hotels")
    }
    return await response.json()
}