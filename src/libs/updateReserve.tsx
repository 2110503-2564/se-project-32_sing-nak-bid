export default async function updateReserve(
    id: string,
    reservationDateTime: string,
    token: string
  ) {
    const response = await fetch(
      `http://localhost:5000/api/v1/reservations/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationDateTime
        }),
      }
    );
  
    if (!response.ok) {
      console.log(await response.json()); 
      throw new Error("Failed to update reservation");
    }
  
    return await response.json();
  }  