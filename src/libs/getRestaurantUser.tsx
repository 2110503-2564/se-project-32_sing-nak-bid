import { getToken } from "next-auth/jwt"


export default async function getRestaurantsUser() {
    await new Promise((resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("http://localhost:5000/api/v1/restaurants/user" ,{
        method: "GET",
      })
    
    
    if(!response.ok){
        throw new Error("Failed to fetch hotels")
    }
    return await response.json()
}