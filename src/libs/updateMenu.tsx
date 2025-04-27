export default async function updateMenu(
    token: string,
    restaurantId: string,
    menuId:string,
    orderCount:Number
  ) {
    const response = await fetch(
      `http://localhost:5000/api/v1/restaurants/${restaurantId}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        orderCount
        }),
      }
    );
  
    if (!response.ok) {
      console.log(await response.json()); 
      throw new Error("Failed to update rating");
    }
  
    return await response.json();
  }  