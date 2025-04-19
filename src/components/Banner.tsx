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
          animation: move 40s infinite linear;
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

      {/* Top-centered Title & Search */}
<div className="absolute z-10 top-22 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 text-center">
  <h1 className="text-3xl md:text-5xl font-bold text-[#201335]">
    Finding Restaurants
  </h1>
  <div className="w-full max-w-md">
    <Input />
  </div>
</div>

      {/* Greeting User*/}
      {session && (
        <div className="absolute top-5 right-10 font-semibold text-cyan-400 text-xl z-3 mx-10">
          Hello {session.user?.name}
        </div>
      )}

    </div>
  );
}