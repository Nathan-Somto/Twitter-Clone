import React from "react";
import SideBar from "../SideBar";
import Widgets from "../Widgets";
import { useSession } from "next-auth/react";
import Loader from "../../ui/loader";
import { useRouter } from "next/router";
import { CustomSession } from "@/types";
import { SecondaryLayout } from "..";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <SecondaryLayout>
        <Loader size="lg" />
      </SecondaryLayout>
    );
  }
  if (status === "unauthenticated") {
    return (
      <SecondaryLayout>
        <h1 className="text-red-700 dark:text-red-400 font-semibold text-2xl">
          Not Authorized
        </h1>
      </SecondaryLayout>
    );
  }
  // user not onboarded
  if (!(session as CustomSession)?.user?.onBoarded) {
    router.push("/onboarding");
  }
  const isSettingsPage = router.pathname === "/settings";
  return (
    <div className="min-h-screen w-full flex flex-col  dark:bg-primaryBlack bg-primaryWhite dark:text-primaryWhite">
      <SideBar />
      <main
        className={`${
          !isSettingsPage
            ? "xl:w-[calc(100%-585px)] "
            : "xl:w-[calc(100%-275px)]"
        } w-[100%] xl:ml-[275px] md:ml-[100px] min-h-screen border-r dark:border-r-dark4  pb-[75px] md:pb-0 md:w-[calc(100%-100px)]`}
      >
        {children}
      </main>
      {!isSettingsPage && <Widgets />}
    </div>
  );
}

export default RootLayout;
