import { error } from "console"
import { TIMEOUT } from "dns"

export default async function getOrder(token:string,orderId:string) {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch(`http://localhost:5000/api/v1/order/${orderId}`,
        {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
        }
    )
    if(!response.ok){
        console.log(response)
        throw new Error("Failed to fetch orders")
    }
    const orders = await response.json();
    return orders
}
