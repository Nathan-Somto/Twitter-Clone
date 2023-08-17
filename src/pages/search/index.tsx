import SearchBar from "@/components/form/SearchBar";
import Header from "@/components/common/Header";
import { useRouter } from "next/router";
import React from "react";
import UserCard from "@/components/card/UserCard";
import Layout from "@/components/layout";

type Props = {};

function SearchPage({}: Props) {
  const router = useRouter();
  const { searchTerm } = router.query;
  const dummyData = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      imgUrl: "/dummy/avatar-1.jpg",
      actionType: "View Profile",
      followers:["","","","",""]
    },
    {
      id: "2",
      name: "Jane gill",
      username: "gill04",
      imgUrl: "/dummy/avatar-2.jpg",
      actionType: "View Profile",
      followers:["","","","",""]
    },
    {
      id: "3",
      name: "Alice jones",
      username: "alice",
      imgUrl: "/dummy/avatar-3.jpg",
      actionType: "View Profile",
      followers:["","","","",""]
    },
    {
      id: "4",
      name: "Bob martin",
      username: "martin",
      imgUrl: "/dummy/avatar-4.jpg",
      actionType: "View",
      followers:["","","","",""]
    },
    {
      id: "5",
      name: "Stephaine Brown",
      username: "eve",
      imgUrl: "/dummy/avatar-1.jpg",
      actionType: "View",
      followers:["","","","",""]
    },
  ];
  return (
    <>
      <Layout>
        <div className="border-r dark:border-r-dark4 overflow-auto h-screen md:mb-0  mb-9">
          <Header titleText="Search" />
          <div className="w-[90%] mx-auto flex justify-center mt-7">
            <SearchBar />
          </div>
          <div className="mt-5 text-center">
            <p className="text-dark2 dark:text-light2 h4-medium">Nothing matches <span className="font-semibold">{searchTerm}</span></p>
          </div>
          <div className="divide-y divide-light2 dark:divide-dark4 border-t border-b dark:border-dark4 border-light2">
            {dummyData.map((data) => (
              <div className="px-5 py-3" key={data.id}>
                <UserCard {...data} actionType={"View Profile"} />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SearchPage;
