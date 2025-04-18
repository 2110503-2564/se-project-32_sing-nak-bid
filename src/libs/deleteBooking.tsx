export default async function deleteBooking(id:string,token:string) {
    const response = await fetch(`https://ya-seleng-back-end.vercel.app/api/v1/bookings/${id}`,
        {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${token}`,
            },body: JSON.stringify({
                _id : id
            }),
        }
    )
    if(!response.ok){
        throw new Error("Failed to delete")
    }
    return await response.json()
}