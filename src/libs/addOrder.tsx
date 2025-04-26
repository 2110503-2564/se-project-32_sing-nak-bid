import { OrderItem } from "../../interfaces";

export default async function addOrder(reservationId: string, orderItems: OrderItem[], totalPrice: number, token: string) {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${reservationId}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderItems: orderItems.map(item => ({
          menuItem: [{ _id: item._id }], // Assuming you only need the _id of the menuItem
          quantity: item.quantity,
          note: item.note,
        })),
        totalPrice: totalPrice,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to add order:', errorData);
      throw new Error('Failed to add order');
    }
  
    return await response.json();
  }

  /**BAckend code exports.addOrder = async (req, res, next) => {
    try {
        req.body.reservation = req.params.reservationId;
        req.body.user = req.user.id;
        console.log(req.params);
        const reservation = await Reservation.findById(req.params.reservationId).populate('orderItems');
        req.body.restaurant = reservation.restaurant;
        if(!reservation){
            return res.status(404).json({ success: false, message: `No Reservation with the id of ${req.params.reservationId}` });
        }
        if (reservation.orderItems.length >= 1 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made a order`});
            }
        const order = await Order.create(req.body);
        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot create Order" });
    }
}; */