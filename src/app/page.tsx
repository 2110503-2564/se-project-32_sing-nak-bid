import Image from "next/image";
import Banner from "../components/Banner";
import styles from "./page.module.css";
import Card from "../components/Card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import ManagerPage from "@/components/page/ManagerPage";
import UserPage from "@/components/page/UserPage";

// Direct User and Manager to different
export default async function Home() {

  const session = await getServerSession(authOptions);
  const role = session?.user.role ;

  return (
    <main className={styles.main}>
      {role === "admin" ? <ManagerPage /> : <UserPage />}
    </main>
  );
}
