"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "./search";
import styles from './Button.module.css';
import { Utensils } from "lucide-react";

export default function Banner() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-[0vh] flex items-center justify-start">
      {/* Animated Background */}
      <div className="relative animated-bg" />
      
      <style jsx>{`
        .animated-bg {
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
        
        /* Adding subtle pulsing effect to enhance background */
        .animated-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 70%,
            rgba(237, 130, 101, 0.4) 0%,
            transparent 60%
          );
          animation: pulse 8s infinite alternate ease-in-out;
        }
        
        @keyframes pulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.5; }
        }
      `}</style>
      
      {/* Top-centered Title & Search */}
      <div className="absolute z-10 top-22 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 text-center">
        {/* Title with Icon */}
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 shadow-lg transform transition-all duration-300 hover:rotate-12">
            <Utensils size={24} color="white" strokeWidth={2.5} />
          </div>
          
          <h1
            className={`text-3xl md:text-5xl font-bold transition-all duration-300 ease-in-out ${
              isHovered
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-500 scale-110'
                : 'text-white'
            }`}
            style={{
              fontFamily: "'Kanit', sans-serif",
              textShadow: isHovered ? '0 0 15px rgba(237, 130, 101, 0.8)' : '0 0 2px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            SNB Dine
          </h1>
        </div>
        
        <div className="w-full max-w-md backdrop-blur-sm">
          <Input />
        </div>
      </div>
    </div>
  );
}