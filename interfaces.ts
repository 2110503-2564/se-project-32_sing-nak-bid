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

export interface OrdersItem {
  _id: string;
  name: string;
  quantity: number;
  note?: string; 
}

export interface OrderJson {
  success: boolean;
  count: number;
  data: OrdersItem[];
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  opentime: string;
  closetime: string;
  managerId: string;
  reservations?: any[];
  menuItems?: any[];   
}

export interface ReservationJson {
  success: boolean;
  count: number;
  pagination: object;
  data: ReservationsItem[];
}


export interface ReservationsItem {
  _id: string;
  reservationDate: string;
  user: string;
  restaurant: Restaurant; 
  status: string;
  createdAt: string;
}

export interface RestaurantJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: Restaurant[]
}