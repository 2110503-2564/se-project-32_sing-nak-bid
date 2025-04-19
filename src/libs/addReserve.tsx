export default async function addReserve(
  reservationDateTime: string,
  status:string,
  restaurantID: string,
  token: string
) {
  const response = await fetch(
    `http://localhost:5000/api/v1/restaurants/${restaurantID}/reservations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reservationDateTime,
        status
      }),
    }
  );

  if (!response.ok) {
    console.log(response.json())
    throw new Error("Failed to create reservation");
  } else {
    console.log("success");
  }
  return await response.json();
}
