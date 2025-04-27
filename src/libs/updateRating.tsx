export default async function updateRating(
    restaurantID: string,
    ratingId: string,
    score:Number,
    comment:string,
    token: string
  ) {
    const response = await fetch(
      `http://localhost:5000/api/v1/restaurants/${restaurantID}/rating/${ratingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score,
          comment
        }),
      }
    );
  
    if (!response.ok) {
      console.log(await response.json()); 
      throw new Error("Failed to update rating");
    }
  
    return await response.json();
  }  