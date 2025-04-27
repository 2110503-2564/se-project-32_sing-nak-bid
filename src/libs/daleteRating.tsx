export default async function deleteRating(restaurantId:string,ratingId:string,token:string) {
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}/rating/${ratingId}`,
        {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${token}`,
            },
        }
    )
    if(!response.ok){
        throw new Error("Failed to delete rating")
    }
    return await response.json()
}