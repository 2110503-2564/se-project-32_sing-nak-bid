'use client'

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function BannerDown(){
    // const {data : session} = useSession()
    // console.log(session?.user.token)

    return (
       <div  className='flex flex-row'>
   <div className="fixed  w-full bg-red-100  p-4 shadow-lg relative  mt-24 z-20">
   <h1 className="text-lg font-bold text-pink-900">Contact Us</h1>

    <div className='text-md text-blue-700'>
    <h3 >Gmail : 123PomPenGamer321@gmail.com</h3> 
    <h3 >Tel : 12-1231-2121 </h3>
    <h3 > Instragram : Pom_PenGamer </h3></div>
    <div className='text-black'> 
     © Pom Pen Gamer. No rights reserved.</div>
   </div>

   <div className="fixed  w-full bg-red-100  p-4 shadow-lg relative  mt-24 z-20">
   <h1 className="text-lg font-bold text-pink-900">About Us</h1>

    <div className='text-md text-blue-700'>
    <h3 >We are the Cat Lover Because its so cute 
    and fluffy.</h3> 
    <div className='flex flex-row'> 
      
    
   
     </div>

   </div>
 
   </div>
 
{/* {
    session ? <div className='z-30 absolute top-5 right-10 font-semibold text-white text-xl'>  Welcome {session.user.name} </div> : null
} */}

</div>

   



    );

  


}


