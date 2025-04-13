'use client'

import InteractiveCard from './InteractiveCardForHome';
import Image from 'next/image'
import { Rating } from '@mui/material';
import {  useState } from 'react';
 


//Card หน้า home ให้ภาพอยู่ทางซ้าย ข้อความอยู่ทางขวา
export default function AdsCard({restaurantName,imgSrc,sentence} : {restaurantName : string,imgSrc:string,sentence : string}){
    // function onCardSelected(){
    //     alert("You Select " + venueName)
    // }


// const [rating, setRating] = useState<number>( currentR ?? 0);


    
    return (
 <InteractiveCard contentName={restaurantName}>
    
    <div className="w-full h-full relative rounded-lg shadow-lg flex flex-row">
    <div className=" w-[50%] h-full relative">
 <Image src = {imgSrc} 
 alt='Restaurant Picture'
 fill = {true}
 className='object-cover rounded-lg'
 />

</div>

<div className="text-4xl text-black p-4 mx-5 font-serif flex items-center justify-center h-full">
  {sentence}
</div>



</div>
 
    
        </InteractiveCard>
    );
};

