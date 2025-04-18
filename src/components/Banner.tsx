"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Banner() {
  const covers = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg",
  ];
  const [index, setIndex] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div
      className="relative w-screen h-[50vh] p-1 overflow-hidden cursor-pointer flex items-center justify-center"
      onClick={() => setIndex(index + 1)}
    >
      <Image
        src={covers[index % 4]}
        alt="cover"
        fill
        className="object-cover"
      />

      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white text-center p-4 z-20">

        <h1 className="text-5xl font-medium">Find Your Perfect Stay</h1>
        <h3 className="text-2xl font-medium">Book. Relax. Enjoy.</h3>
      </div>

      {session && (
        <div className="absolute top-5 right-10 font-semibold text-cyan-800 text-xl z-30">
          Hello {session.user?.name}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center z-30 mt-10 mt-10">
        <button
          className="relative inline-block w-40 h-12 text-[17px] font-medium border-2 border-black bg-gray-800 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-white hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/hotels");
          }}
        >
          <span className="absolute top-full left-full w-[200px] h-[150px] bg-white rounded-full transition-all duration-700 hover:top-[-30px] hover:left-[-30px]"></span>
          <span className="relative z-10">View Our Hotels</span>
        </button>
      </div>
    </div>
  );
}
