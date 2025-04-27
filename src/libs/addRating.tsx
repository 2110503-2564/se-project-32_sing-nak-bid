export default async function addRating(
    score: Number,
    comment:string,
    restaurantID: string,
    token: string
  ) {
    const response = await fetch(
      `http://localhost:5000/api/v1/restaurants/${restaurantID}/rating`,
      {
        method: "POST",
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
      console.log(response.json())
      throw new Error("Failed to add rating");
    } else {
      console.log("success");
    }
    return await response.json();
  }
  