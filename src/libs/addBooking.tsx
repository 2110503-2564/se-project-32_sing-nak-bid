export default async function addBooking(
  night: number,
  bookingDate: string,
  user: string,
  hotelID: string,
  token: string
) {
  const response = await fetch(
    `https://ya-seleng-back-end.vercel.app/api/v1/hotels/${hotelID}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingDate,
        user,
        nights: night,
      }),
    }
  );

  if (!response.ok) {
    console.log(response.json())
    throw new Error("Failed to create booking");
  } else {
    console.log("success");
  }
  return await response.json();
}
