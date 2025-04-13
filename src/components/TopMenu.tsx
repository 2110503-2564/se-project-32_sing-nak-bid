import styles from "./topmenu.module.css";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Link } from "@mui/material";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className={styles.menucontainer}>
      {
        <Link href="/">
          <Image
            src={"/img/pg1.png"}
            className={styles.logoimg}
            alt="logo"
            width={0}
            height={0}
            sizes="100vh"
          />{" "}
        </Link>
      }
      <div className="flex flex-row mr-auto text-center  items-center justify-center font-sans mx-3">
        <div className="mx-4">
          <TopMenuItem title="My Reservation" pageRef="/myreservation" />
        </div>
      </div>

      <div className="ml-auto">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">
            {" "}
            <div className="flex items-center h-full px-2 text-sm text-white">
              {" "}
              Sign-Out of {session.user.name}
            </div>{" "}
          </Link>
        ) : (
          <div className="flex flex row items-center h-full px-2 mx-2 text-sm text-white">
            <Link href="/api/auth/register">
              {" "}
              <div className="text-white px-5"> Register</div>{" "}
            </Link>{" "}
            <Link href="/api/auth/signin?callbackUrl=/">
              {" "}
              <div className="text-white"> Sign in </div>{" "}
            </Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
}
