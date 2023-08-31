import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

type Props = {
  isSearchPage: true;
  filterResult: (str: string) => void;
} |
{
  isSearchPage: false;
  filterResult?:never;
}

function Searchbar({isSearchPage,filterResult}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const Router = useRouter();
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!isSearchPage){
      Router.push(`/search?searchTerm=${searchTerm}`);
    }
    else {
      filterResult(searchTerm);
    }
  }
  return (
    <form
      onSubmit={onSubmit}
      className={`w-[90%] min-w-[100px] bg-light3  flex items-center py-5  rounded-full ${isSearchPage ? 'h-[45px]':'h-[40px]'}  px-4 dark:bg-dark3`}
    >
      <div className="flex items-center">
        <button type="submit" className="w-[30px] h-[30px] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 17 17"
            fill="none"
          >
            <path
              d="M16.0445 15.2054L13.147 12.3079C14.196 11.065 14.8333 9.46108 14.8333 7.70833C14.8333 3.77375 11.6428 0.583328 7.70825 0.583328C3.77367 0.583328 0.583252 3.77375 0.583252 7.70833C0.583252 11.6429 3.77367 14.8333 7.70825 14.8333C9.46179 14.8333 11.0649 14.1968 12.3063 13.1471L15.2038 16.0446C15.3201 16.1602 15.4729 16.2187 15.6233 16.2187C15.7738 16.2187 15.9281 16.161 16.0429 16.0446C16.2765 15.8126 16.2765 15.4374 16.0445 15.2054ZM1.77075 7.70833C1.77075 4.43479 4.43471 1.77083 7.70825 1.77083C10.9818 1.77083 13.6458 4.43479 13.6458 7.70833C13.6458 10.9819 10.9818 13.6458 7.70825 13.6458C4.43471 13.6458 1.77075 10.9819 1.77075 7.70833Z"
              fill="#8899A6"
            />
          </svg>
        </button>
        <input
          placeholder="Search Twitter"
          id="search"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block base-medium placeholder:base-medium w-full bg-transparent focus:bg-transparent  active:bg-transparent outline-none h-[30px]"
        />
      </div>
    </form>
  );
}

export default Searchbar;
