import BookingList from "@/components/BookingList"
import getRestaurants from "@/libs/getRestaurants";
import { getReservations } from "@/libs/getReservations";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
export default async function CartPage(){
    const session = await getServerSession(authOptions);

    if(!session) return null
    const bookings = await getReservations(session?.user.token)
    const campgrounds = await getRestaurants()
    return(
        <main>
           

            <BookingList reservationJson={bookings} restaurantJson={campgrounds}></BookingList>
           
        </main>
    )
}