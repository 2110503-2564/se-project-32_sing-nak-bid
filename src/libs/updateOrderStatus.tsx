export default async function updateOrderStatus(
  orderId: string,
  newStatus: "pending" | "preparing" | "completed" | "cancelled",
  token: string
) {
  const response = await fetch(
    `http://localhost:5000/api/v1/order/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 
        newStatus 
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.statusText}`);
  }

  return await response.json();
};

