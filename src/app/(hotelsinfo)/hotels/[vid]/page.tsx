import getHotel from "@/libs/getHotel";
import Image from "next/image";
import { HotelJson, HotelItem } from "../../../../../interfaces";
import Link from "next/link";

export default async function VenueDetailPage({
  params,
}: {
  params: { vid: string };
}) {
  const hotelJson = await getHotel(params.vid);
  const hotelDetail = hotelJson.data;

  return (
    <main className="p-8 bg-gray-50 font-kanit">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-8">
        {hotelDetail.name}
      </h1>

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg p-6">
        <div className="w-full md:w-1/3">
          <Image
            src={hotelDetail.picture}
            alt={`${hotelDetail.name} Image`}
            width={600}
            height={400}
            sizes="100vw"
            className="rounded-lg object-cover shadow-md"
          />
        </div>

        <div className="w-full md:w-2/3 md:ml-8 mt-6 md:mt-0 text-gray-700">
          <div className="text-2xl font-semibold text-gray-800 mb-4">
            Hotel Information
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-medium">Name: </span>
              <span>{hotelDetail.name}</span>
            </div>
            <div>
              <span className="font-medium">Address: </span>
              <span>{hotelDetail.address}</span>
            </div>
            <div>
              <span className="font-medium">District: </span>
              <span>{hotelDetail.district}</span>
            </div>
            <div>
              <span className="font-medium">Province: </span>
              <span>{hotelDetail.province}</span>
            </div>
            <div>
              <span className="font-medium">Postal Code: </span>
              <span>{hotelDetail.postalcode}</span>
            </div>
            <div>
              <span className="font-medium">Tel: </span>
              <span>{hotelDetail.tel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/hotels"
          className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-gray-800 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-white hover:text-black"
        >
          <span className="absolute top-full left-full w-[200px] h-[150px] bg-white rounded-full transition-all duration-700 hover:top-[-30px] hover:left-[-30px]"></span>
          <span className="relative z-10 flex items-center justify-center h-full w-full">
            Back to All Hotels
          </span>
        </Link>
        <Link
          href="/booking"
          className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-gray-800 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-white hover:text-black ml-6"
        >
          <span className="absolute top-full left-full w-[200px] h-[150px] bg-white rounded-full transition-all duration-700 hover:top-[-30px] hover:left-[-30px]"></span>
          <span className="relative z-10 flex items-center justify-center h-full w-full">
            To Booking
          </span>
        </Link>
      </div>
    </main>
  );
}
