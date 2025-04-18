export interface HotelItem {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
  __v: number;
  id: string;
}

export interface HotelJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: HotelItem[];
}

export interface BookingItem {
  nameLastname: string;
  tel: string;
  hotel: string;
  bookDate: string;
  night: number;
}

export interface BookingsItem {
  _id: string;
  bookingDate: string;
  user: UserJSON;
  hotel: HotelJSON;
  nights: number;
  createAt: string;
}

export interface HotelJSON {
  id: string;
  name: string;
  province: string;
  tel: string;
  _id: string;
}

export interface BookingJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: BookingsItem[]
}

export interface HotelItemJson {
  success: boolean;
  data: HotelItem;
}

export interface UserJSON{
  _id: string
  name: string
  email: string
  role: string
  password: string
  tel: string
  isBanned: boolean
  createAt: string
}
