import styles from "./topmenu.module.css";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Link } from "@mui/material";
import HamburgerButton from "./HamburgerButton";
import UserDropdown from "./UserDropdown";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed top-0 left-0 right-0 h-[50px] bg-white z-30 border-t border-b border-gray-300 flex items-center px-4 font-kanit">
      <div className="flex items-center space-x-4">
        <HamburgerButton />
      </div>

      {/* Added User Dropdown */}
      <div className="flex items-center space-x-4 ml-auto">
        <UserDropdown />
      </div>
    </div>
  );
}
