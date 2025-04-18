import styles from "./topmenu.module.css";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Link } from "@mui/material";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed top-0 left-0 right-0 h-[50px] bg-white z-30 border-t border-b border-gray-300 flex items-center px-4 font-kanit">
      <div className="flex items-center space-x-4">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">
            <div className="text-cyan-600 text-sm">
              Sign-Out of {session?.user?.name}
            </div>
          </Link>
        ) : (
          <Link href="/api/auth/signin?callbackUrl=/">
            <div className="text-cyan-600 text-sm">Sign-In</div>
          </Link>
        )}
        <TopMenuItem title="Register" pageRef="/register" />
        <TopMenuItem title="My Booking" pageRef="/mybooking" />
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <TopMenuItem title="Booking" pageRef="/booking" />
        <div className="flex justify-center items-center">
          <Link href="/">
            <Image
              src={"/img/logo.png"}
              className={`${styles.logoimg}`}
              alt="logo"
              width={60}
              height={100}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
