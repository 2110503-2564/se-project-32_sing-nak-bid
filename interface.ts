interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    __v: number,
    id: string
  }
  
  interface VenueJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: VenueItem[]
  }

  interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }

  interface Restaurant {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    region: string;
    opentime: string; // expected format: "HH:mm"
    closetime: string; // expected format: "HH:mm"
    managerId: string
  }
  
  interface Reservation {
    
    _id: string;
    reservationDate: string;
    user: string;
    restaurant: Restaurant; // restaurant is an object of type Restaurant
    status: string;
    createdAt: string;
  }
  
  interface ReservationJson {
    success: boolean;
    count: number;
    pagination: object;
    data: Reservation[];
  }
  