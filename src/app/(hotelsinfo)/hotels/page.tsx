import getRestaurants from "@/libs/getRestaurants"
import HotelCatalog from "@/components/HotelCatalog"
import { Suspense } from "react"
import { LinearProgress } from "@mui/material"
import { HotelJson } from "../../../../interfaces"

export default async function Hotel(){
    const hotels:HotelJson = await getRestaurants()
    return(
        <main className="text-center p-5">
            <h1 className="text-xl font-medium">Select Your Hotel</h1>
            <Suspense fallback={<p>Loading...<LinearProgress/></p>}>
            <HotelCatalog hotelsJson={Promise.resolve(hotels)}/>
            </Suspense>
        </main>
    )
}