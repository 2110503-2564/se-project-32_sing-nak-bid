"use client";
import React from "react";
import styles from "./card.module.css";
import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";

export default function Card(cards: {
  hotelName: string;
  imgsrc: string;
  onCompare?: Function;
}) {
  const [value, setValue] = React.useState<number | null>(0);
  return (
    <InteractiveCard contentName={cards.hotelName}>
      <div className="w-full h-[70%] rounded-t-lg relative">
        <Image
          src={cards.imgsrc}
          alt="card"
          fill={true}
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="w-full h-[10%] p-[10px] text-black mb-auto">
        {cards.hotelName}
      </div>
      {cards.onCompare && (
        <Rating
          className="p-[10px] h-[15%]"
          name={`${cards.hotelName} Rating`}
          id={`${cards.hotelName} Rating`}
          data-testid={`${cards.hotelName} Rating`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            cards.onCompare?.(cards.hotelName, newValue);
          }}
        />
      )}
    </InteractiveCard>
  );
}
