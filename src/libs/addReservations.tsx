"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "./getUserProfile";
export const addReservation = async (resId:string,token: string, reservationDate: string) => {
    const session = await getServerSession(authOptions);
    
    if(!session)return null
    //    console.log('Session User add Booking:', session);
     const profile = await getUserProfile(session?.user.token)
   //  const id = session?.user._id
   const id = profile.data._id
    try {
        const response = await fetch(`https://pompengamer.vercel.app/api/v1/restaurants/${resId}/reservations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                
                reservationDate:reservationDate,
                name:id
            }),
        });

        if (!response.ok) throw new Error("Failed to add reservation");
        return await response.json();
    } catch (error) {
        console.error("Error adding reservation:", error);
        return { success: false, message: "Could not add reservation" };
    }
};