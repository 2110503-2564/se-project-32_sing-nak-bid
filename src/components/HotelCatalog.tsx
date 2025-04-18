import Link from "next/link";
import Card from "./Card";
import { HotelItem, HotelJson } from "../../interfaces";


export default async function HotelCatalog({ hotelsJson }: { hotelsJson: Promise<HotelJson> }) {
  const hotelsJsonReady = await hotelsJson
  return (
    <>
      Explore {hotelsJsonReady.count} hotels in our catalog
      <div
        style={{
          margin: "20px",
          display: "flex",
          flexDirection: "row",
          alignContent: "space-around",
          justifyContent: "space-around",
          flexWrap: "wrap",
          padding: "10px",
        }}
      >
        {hotelsJsonReady.data.map((hotelItem: HotelItem , index) => (
          <Link href={`/hotels/${hotelItem.id}`} className="w-1/5" key={index}>
            <Card hotelName={hotelItem.name} imgsrc={hotelItem.picture}></Card>
          </Link>
        ))}
      </div>
    </>
  );
}
