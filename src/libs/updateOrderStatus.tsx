const updateOrderStatus = async (
    orderId: string, 
    newStatus: "pending" | "preparing" | "completed" | "cancelled", 
    token: string
  ) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
  
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }
  
    return await response.json();
  };
  
  export default updateOrderStatus;