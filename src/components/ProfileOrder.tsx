'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileOrder(){
    
    const { data: session} = useSession();
    const router = useRouter();
    
    return(
        <div className="w-[350px] bg-[#ED8265] text-[#201335] border-[4px] border-[#AC6643] shadow-md rounded-[10px] p-6 text-center font-['Poppins'] transition-all duration-300 hover:-translate-y-2 mt-[60px] ml-[100px] mr-[100px] sticky top-[100px]">
            <div className="w-24 h-24 border-[4px] border-[#AC6643] rounded-full flex justify-center items-center mx-auto overflow-hidden">
                <svg className="w-12 h-12 text-[#201335]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
                </svg>
            </div>
            <p className="mt-5 font-semibold text-xl">{session?.user.name}</p>
            <span className="block text-base font-light">{session?.user.name}</span>

            <div className="mt-6 w-full h-[2px] bg-[#AC6643] mb-4"></div>

            <button className="mt-2 bg-[#AC6643] text-white px-6 py-2 rounded-[8px] font-semibold hover:bg-[#8a4f30] transition-all duration-200"
                onClick={() => router.push(`/mybooking`)}>
                My Reservation
            </button>
        </div>
    )
}