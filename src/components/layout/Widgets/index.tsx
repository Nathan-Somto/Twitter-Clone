import React from "react";
import HomeFilters from "../../filters/HomeFilters";
import SuggestionBox from "../SuggestionBox";
import SearchBar from "@/components/form/SearchBar";
import { useRouter } from "next/router";
import Attribution from "@/components/common/Attribution";


function Widgets() {
  const router = useRouter();
  const isSearchPage = router.pathname.includes("search");
  const isHomePage = router.pathname === "/home";

  return (
    <aside className=" hidden space-y-8 px-[10px] w-[310px] fixed top-0 right-0 py-4 xl:flex flex-col h-screen overflow-auto">
      {!isSearchPage && <SearchBar isSearchPage={false} />}
      {isHomePage && <HomeFilters />}
      <SuggestionBox />
      <Attribution containerStyles="text-sm font-semibold" />
    </aside>
  );
}

export default Widgets;
