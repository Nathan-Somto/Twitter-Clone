import React from "react";
import SideBar from "./SideBar";
import Widgets from "../common/Widgets";
import { useSession } from "next-auth/react";
import Loader from "../ui/loader";
import { useRouter } from "next/router";
import { CustomSession } from "@/types";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {data: session, status} = useSession()
  if (status === 'loading') {
    return <div className="dark:bg-primaryBlack h-screen grid place-items-center">
      <Loader size="lg"/>    
      </div>
  }
  if(!(session  as CustomSession)?.user?.onBoarded){
    router.push('/onboarding');
  }
  return (
    <div className="grid md:grid-cols-[100px_1fr] lg:grid-cols-[275px_1fr] mx-auto h-screen w-full  dark:bg-primaryBlack bg-primaryWhite dark:text-primaryWhite">
      <SideBar />
      <main className="grid lg:grid-cols-[1fr_310px]">
        {children}
        <Widgets />
      </main>
    </div>
  );
}

export default Layout;
