import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getBookings(token:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("https://ya-seleng-back-end.vercel.app/api/v1/bookings",
        {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
        }
    )
    if(!response.ok){
        throw new Error("Failed to fetch bookings")
    }
    const bookings = await response.json();
    return bookings
}
