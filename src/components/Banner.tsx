'use client'

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css'

export default function Banner(){
    // const {data : session} = useSession()
    // console.log(session?.user.token)

    const router = useRouter();

    return (
<div className={styles.banner} >
<video src='/vdo/restaurant.mp4' className=' absolute top-0 left-0 w-full h-full object-cover '
autoPlay loop muted/>
<div className='relative px-5 py-4 mt-24 z-20 text-center text-pink-100  '> 
    <h1 className={styles.text_shadow} >Pom Pen Gamer</h1>
<div>
    <h3 className={styles.text_smaller}>A Restaurant Reservation for Gamer & Cat Lover ᓚ₍ ^. .^₎</h3> </div>
</div>

{/* {
    session ? <div className='z-30 absolute top-5 right-10 font-semibold text-white text-xl'>  Welcome {session.user.name} </div> : null
} */}
   <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2  mt-10">
<button className='bg-yellow-300 text-yellow-900 border-yellow-900 
font-semibold py-2 px-2 mx-5 my-5 rounded  text-4xl font-serif
hover:bg-red-600 hover:text-white hover:border-transparent'
onClick={(e)=>{e.stopPropagation(); router.push('/restaurants')}}>Select Restaurant</button>
   </div>
</div>


    );
}


