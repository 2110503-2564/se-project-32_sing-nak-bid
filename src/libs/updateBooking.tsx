export default async function updateBooking(
    id: string,
    bookingDate: string,
    token: string
  ) {
    const response = await fetch(
      `https://ya-seleng-back-end.vercel.app/api/v1/bookings/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingDate,
        }),
      }
    );
  
    if (!response.ok) {
      console.log(await response.json()); 
      throw new Error("Failed to update booking");
    }
  
    return await response.json();
  }  