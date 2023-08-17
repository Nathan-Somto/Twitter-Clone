import React from "react";
import SideBar from "./SideBar";
import Widgets from "../common/Widgets";

function Layout({ children }: { children: React.ReactNode }) {
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
