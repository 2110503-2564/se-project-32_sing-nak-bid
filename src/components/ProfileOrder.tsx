'use client'
import { useSession } from "next-auth/react";

export default function ProfileOrder(){
      const { data: session} = useSession();
    
    return(
        <div className="w-[220px] bg-[#ED8265] text-[#201335] border-[4px] border-[#AC6643] shadow-md rounded-[10px] p-6 text-center font-['Poppins'] transition-all duration-300 hover:-translate-y-2 mt-[60px] ml-[100px] mr-[100px] sticky top-[100px]">
        <div className="w-20 h-20 border-[4px] border-[#AC6643] rounded-full flex justify-center items-center mx-auto overflow-hidden">
            <svg className="w-10 h-10 text-[#201335]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
            </svg>
        </div>
        <p className="mt-5 font-semibold text-lg">user</p>
        <span className="block text-sm font-light">{session?.user.name}</span>

        <div className="mt-4 w-full h-[2px] bg-[#AC6643] mb-3"></div>
        </div>
    )
}