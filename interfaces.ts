export interface UserJSON {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  tel: string;
  isBanned: boolean;
  createAt: string;
}


export interface OrderJson {
  success: boolean;
  count: number;
  data: OrdersItem[];
}

export interface Restaurant {
  _id: string; // MongoDB's ObjectId is often represented as a string
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  opentime: string;
  closetime: string;
  picture: string; //add picture
  managerId: string; // Or potentially a User interface if you have one
  // You might include virtuals here if you intend to use them on the client-side
  reservations?: any[]; // Adjust type if you have a Reservation interface
  menuItems?: any[];    // Adjust type if you have a MenuItem interface
}

export interface ReservationJson {
  success: boolean;
  count: number;
  pagination: object;
  data: ReservationsItem[];
}


export interface ReservationsItem {
  _id: string;
  reservationDateTime: string;
  user: string; // This is a user ID
  restaurant: Restaurant; // This is a restaurant ID
  status: string;
  createdAt: string;
}

export interface RestaurantJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: Restaurant[]
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  picture: string; //add picture for menu
}

export interface OrderItem {
  _id: string;
  menuItem: MenuItem[];
  quantity: number;
  note?: string;
}

export interface OrdersItem {
  _id: string;
  restaurant: Restaurant;
  checkInTime: Date;
  checkInStatus: boolean;
  reservation: ReservationsItem;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface MenuItemOrdered {
  _id: string;
  name: string;
  price: number;
  orderCount: number;
  recommended: boolean;
}

export interface A {
  b: B[];
}

export interface B {
  c: C[];
}

export interface C {
  c: string;
}
// export interface HotelItem {
//   _id: string;
//   name: string;
//   address: string;
//   district: string;
//   province: string;
//   postalcode: string;
//   tel: string;
//   picture: string;
//   __v: number;
//   id: string;
// }

// export interface HotelJson {
//   success: boolean;
//   count: number;
//   pagination: Object;
//   data: HotelItem[];
// }

// export interface BookingItem {
//   nameLastname: string;
//   tel: string;
//   hotel: string;
//   bookDate: string;
//   night: number;
// }

// export interface BookingsItem {
//   _id: string;
//   bookingDate: string;
//   user: UserJSON;
//   hotel: HotelJSON;
//   nights: number;
//   createAt: string;
// }

// export interface HotelJSON {
//   id: string;
//   name: string;
//   province: string;
//   tel: string;
//   _id: string;
// }

// export interface BookingJson {
//   success: boolean;
//   count: number;
//   pagination: Object;
//   data: BookingsItem[];
// }

// export interface HotelItemJson {
//   success: boolean;
//   data: HotelItem;
// }