"use client";
import Card from "./Card";
import { useReducer, useState } from "react";
import { Link } from "@mui/material";
import { useRef, useEffect } from "react";
import getHotels from "@/libs/getHotels";
import { HotelItem, HotelJson } from "../../interfaces";

export default function CardPanel() {
  const [hotelResponse, setHotelResponse] = useState<HotelJson | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const hotels = await getHotels();
      setHotelResponse(hotels);
    };
    fetchData();
  }, []);

  const cardReducer = (
    hotelList: Map<string, number>,
    action: { type: string; hotelName: string; rating?: number }
  ) => {
    switch (action.type) {
      case "add": {
        const newHotelList = new Map(hotelList);
        newHotelList.set(action.hotelName, action.rating ?? 0);
        return newHotelList;
      }
      case "remove": {
        const newHotelList = new Map(hotelList);
        newHotelList.delete(action.hotelName);
        return newHotelList;
      }
      default:
        return hotelList;
    }
  };

  let defaultHotel = new Map<string, number>([
    ["The Bloom Pavilion", 0],
    ["Spark Space", 0],
    ["The Grand Table", 0],
  ]);

  const [hotelList, dispatchCompare] = useReducer(cardReducer, defaultHotel);

  if (!hotelResponse) return <p>Hotel Panel is Loading ...</p>;

  return (
    <div>
      <div className="max-w-screen-xl mx-auto grid grid-cols-4 gap-6 p-5">
        {hotelResponse.data.map((hotelItem: HotelItem) => (
          <Link
            href={`/hotel/${hotelItem.id}`}
            key={hotelItem.id}
            className="block w-full"
          >
            <Card
              hotelName={hotelItem.name}
              imgsrc={hotelItem.picture}
              onCompare={(hotel: string, rating: number) =>
                dispatchCompare({
                  type: "add",
                  hotelName: hotel,
                  rating: rating,
                })
              }
            />
          </Link>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-xl font-bold">
          Hotel List with Ratings : {hotelList.size}
        </div>
        <div className="border rounded-lg p-3">
          {Array.from(hotelList).map(([hotel, rating]) => (
            <div
              key={hotel}
              data-testid={`${hotel}`}
              onClick={() =>
                dispatchCompare({ type: "remove", hotelName: hotel })
              }
              className="cursor-pointer p-2 border-b hover:bg-gray-100"
            >
              {hotel} : {rating}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
