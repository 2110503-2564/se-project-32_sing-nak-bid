export default async function deleteOrder(id:string,token:string,) {
    const response = await fetch(`/api/v1/reservations/:reservationId/order/:orderId`,
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