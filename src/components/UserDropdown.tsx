"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-label="User Menu"
      >
        {/* User icon (SVG) */}
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A9.003 9.003 0 0112 15c2.003 0 3.847.659 5.26 1.764M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded shadow-lg"
        >
          {session ? (
            <>
              <Link href="/profile">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </div>
              </Link>
              <Link href="/api/auth/signout?callbackUrl=/">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Sign out of {session?.user?.name}
                </div>
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Sign In
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
