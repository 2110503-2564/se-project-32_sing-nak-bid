export default async function getRestaurants(){
    await new Promise((resolve)=>setTimeout(resolve,300))

    const response = await fetch("https://pompengamer.vercel.app/api/v1/restaurants")
    if(!response.ok){
        throw new Error("failed to fetch restuarants")
    }
    return await response.json()
}