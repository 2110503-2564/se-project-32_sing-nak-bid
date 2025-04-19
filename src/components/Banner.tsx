"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "./search";
import styles from './Button.module.css';

export default function Banner() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full h-[0vh] flex items-center justify-start">
      
      {/* Animated Background */}
      <div className="relative animated-bg" /> 
  

      <style jsx>{
        `.animated-bg {
          width: 100%;
          height: 27%;
          --s: 100px;
          --c-inner: #ED8265;
          --c-outer: #f2c0ae;
          --c-outer2: #fff0eb;

          background: radial-gradient(
            circle at 50% 99%,
            transparent 10%,
            var(--c-inner) 10% 30%,
            var(--c-outer) 30% 60%,
            var(--c-outer2) 60% 100%,
            transparent 100%
          );
          background-size: var(--s) var(--s);
          animation: move 10s infinite linear;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        @keyframes move {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 100% 0;
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start gap-4 text-left max-w-xl ">
        <h1 className="text-3xl md:text-5xl font-bold text-[#201335]">
          Search Restaurants
        </h1>
        <div className="w-full max-w-md">
          <Input />
        </div>
      </div>

      {/* Greeting */}
      {session && (
        <div className="absolute top-5 right-10 font-semibold text-cyan-300 text-xl z-30">
          Hello {session.user?.name}
        </div>
      )}

      {/* View Button - bottom left */}
      <div className="absolute bottom-5 left-6 z-10">
        <button
          className={`group ${styles["button"]}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push("/hotels");
          }}
        >
          <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
            View Restaurants
          </span>
        </button>
      </div>
    </div>
  );
}