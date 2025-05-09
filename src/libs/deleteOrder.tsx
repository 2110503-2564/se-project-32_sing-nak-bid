export default async function deleteOrder(reservationId:string,orderId:string,token:string,) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${reservationId}/order/${orderId}`,
        {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${token}`,
            },body: JSON.stringify({
                _id : orderId
            }),
        }
    )
    if(!response.ok){
        throw new Error("Failed to delete")
    }
    return await response.json()
}