import { RestaurantJson } from "../../interfaces";
import Rating from "@mui/material/Rating";

export default function RestaurantCard({
  restaurantname,
  imgSrc,
  restaurantaddress,
}: {
  restaurantname: string;
  imgSrc: string;
  restaurantaddress: string;
}) {
  return (
    <div className="card shadow-[0px_4px_16px_px_#367E08] h-[400px] w-[280px] group gap-[0.5em] rounded-[1.5em] relative flex justify-end flex-col p-[1.5em] z-[1] overflow-hidden">
      {" "}
      {/* Background black overlay */}
      <div className="absolute top-0 left-0 h-full w-full bg-[#111111] z-0"></div>
      {/* Background image */}
      <div
        className="absolute top-0 left-0 h-full w-full bg-cover bg-center opacity-65 z-[1]"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />
      {/* Foreground Content */}
      <div className="container text-white z-[2] relative font-nunito flex flex-col gap-[0.5em]">
        <div className="h-fit w-full">
          <h1 className="card_heading text-[1.5em] tracking-[.2em]">
            {restaurantname}
          </h1>
        </div>

        {/* Added New Rating display */}
        <div className="flex justify-left items-center h-fit w-full gap-[1.5em]">
          <div className="mt-4 flex items-center justify-end">
            <Rating
              name="read-only-rating"
              value={3}
              readOnly
              precision={0.1}
              size="medium"
            />
            <span className="ml-2 text-sm text-gray-600">
              {/* {restaurant.averageRating.toFixed(1)} */}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex justify-center items-center h-fit w-fit gap-[0.5em]">
          <div className="border-2 border-white rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer">
            <p>{restaurantaddress}</p>
          </div>
          {/* <div
        className="border-2 border-white rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer"
      >
        <p>Thai Food</p>
      </div>
      <div
        className="border-2 border-white rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer"
      >
        <p>Great Service</p>
      </div> */}
        </div>
      </div>
      {/* Description */}
      <p className="font-kanit block text-white font-bold relative h-[0em] group-hover:h-[7em] leading-[1.2em] duration-500 overflow-hidden">
        Description here
      </p>
    </div>
  );
}
