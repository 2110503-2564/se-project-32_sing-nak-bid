import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getReserves(token:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("http://localhost:5000/api/v1/reservations",
        {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
        }
    )
    if(!response.ok){
        throw new Error("Failed to fetch reservations")
    }
    const bookings = await response.json();
    return bookings
}
