"use client";

import InteractiveCardforRes from "./InteractiveCardForRestaurant";
import Image from "next/image";


export default function ResCard({
  ResName,
  imgSrc,
  Tel,
  opentime,
}: {
  ResName: string;
  imgSrc: string;
  Tel: string;
  opentime : string;
}) {
  return (
    <InteractiveCardforRes contentName={ResName}>
      <div className="w-full h-[70%] relative rounded-lg shadow-lg">
        <Image
          src={imgSrc}
          alt="Package Picture"
          fill={true}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="w-full h-[15%] font-bold text-blue-900 text-center my-2">
        {" "}
        {ResName}
        <div className="items-center justify-center">
          <div className="text-green-700 text-center text-md font-sans"> 
             Open at : {opentime}
             <div> 
            Tel : {Tel}
             </div>
          </div>
      </div>
      <div>
     
        </div>
      </div>
    </InteractiveCardforRes>
  );
}
