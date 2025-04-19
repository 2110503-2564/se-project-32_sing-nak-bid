import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getOrders(token:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch(``,
        {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
        }
    )
    if(!response.ok){
        throw new Error("Failed to fetch orders")
    }
    const orders = await response.json();
    return orders
}
