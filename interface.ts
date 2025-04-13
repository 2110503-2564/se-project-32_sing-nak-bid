export interface RestaurantItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    region: string,
    opentime : string,
    closetime : string,
    picture: string,
    reservations: ReservationItem[],
    __v: number,
    id: string
  }
  
 export interface RestaurantJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: RestaurantItem[]
  }

  export interface ReservationItem {
    _id: string;
    reservationDate: string;
    user: string; // This is a user ID
    restaurant: string; // This is a restaurant ID
    status: string;
    createdAt: string;
    __v: number;
}

  export interface User {
    _id: string;
    name: string;
    telnumber: string;
    email: string;
    role: string;
    password : string;
    createdAt : Date;
    __v: number;
    id: string;
  }
