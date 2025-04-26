"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Hamburger.module.css";
import Link from "next/link";

export default function HamburgerButton({ onClick }: { onClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
    if (onClick) onClick();
  };

  return (
    <div className="relative inline-block z-50">
      {/* Hamburger */}
      <button
        ref={hamburgerRef}
        onClick={handleClick}
        className={styles.hamburger}
        aria-label="Menu Toggle"
      >
        <svg viewBox="0 0 32 32" className={isOpen ? styles.open : ""}>
          <path
            className={`${styles.line} ${styles.lineTopBottom}`}
            d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
          />
          <path className={styles.line} d="M7 16 27 16" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-64 overflow-y-auto bg-white border border-gray-200 shadow-lg"
        >
          {/**Add Home */}
          <Link href="/" onClick={() => setIsOpen(false)}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</div>
          </Link>
          <Link href="/myreservation" onClick={() => setIsOpen(false)}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Reservation</div>
          </Link>
          <Link href="/myorder" onClick={() => setIsOpen(false)}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Order</div>
          </Link>
          <Link href="/reserve" onClick={() => setIsOpen(false)}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Reserve</div>
          </Link>
        </div>
      )}
    </div>
  );
}