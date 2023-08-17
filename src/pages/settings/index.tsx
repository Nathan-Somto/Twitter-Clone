import {
  Logout,
  ThemeChanger,
  DeleteAccount,
} from "@/components/common/Settings";
import SideBar from "@/components/layout/SideBar";
import React from "react";
import Header from "@/components/common/Header";

function SettingsPage() {
  return (
    <div className="grid md:grid-cols-[100px_1fr] lg:grid-cols-[275px_1fr] mx-auto h-screen w-full  dark:bg-primaryBlack bg-primaryWhite dark:text-primaryWhite">
      <SideBar />
      <main>
        <Header titleText="Settings" />
        <section className="w-[90%] mx-auto mt-8 space-y-7">
          <ThemeChanger />
          <Logout />
          <DeleteAccount />
        </section>
      </main>
    </div>
  );
}

export default SettingsPage;
