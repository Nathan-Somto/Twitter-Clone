import SearchBar from "@/components/form/SearchBar";
import Header from "@/components/common/Header";
import { useRouter } from "next/router";
import React, { useState } from "react";
import UserCard from "@/components/card/UserCard";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { CustomSession } from "@/types";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }
    const { searchTerm } = query;
    // Fetch data based on the search term
    console.log("searchTerm >>", searchTerm);
    const response = await axios.get(
      `${process.env.SITE_URL}/api/users?searchTerm=${searchTerm}`
    );
    response.data.users = (response.data.users as Props["users"]).filter(
      (item) => item._id !== (session as CustomSession)?.user?.id
    );
    return {
      props: {
        ...response.data,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
type Props = {
  totalPages: number;
  pageNumber: number;
  users: {
    _id: string;
    displayName: string;
    username: string;
    profileImgUrl: string;
    followers: string[];
  }[];
};

function SearchPage({ totalPages, pageNumber, users }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [userData, setUserData] = useState<typeof users>(users);
  const [filterData, setFilterData] = useState<typeof users>([]);
  const [currPage, setCurrPage] = useState<number>(pageNumber);
  const [loading, setLoading] = useState<boolean>(false);
  const { searchTerm } = router.query;

  async function fetchMoreUsers() {
    setLoading(true);
    try {
      if (currPage < totalPages) {
        const response = await axios.get(
          `/api/users/searchTerm=${searchTerm}&pageNumber=${pageNumber}`
        );
        if (response.data?.user) {
          setUserData((prevState) => [...prevState, ...response.data.user]);
          setCurrPage((prevState) => prevState + 1);
        } else {
          throw new Error(response.data);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast({
        description: "could not retrieve more users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  function filterResult(str: string) {
    setSearch(str);
    setFilterData(userData.filter((user) => user.username.includes(str)));
  }
  const noMoreUsers = currPage === totalPages;
  const data = search ? filterData : userData;
  return (
    <>
      <Layout>
        <div className="border-r dark:border-r-dark4 overflow-auto h-screen md:mb-0  mb-9">
          <Header titleText="Search" />
          <div className="w-[90%] mx-auto mb-5 flex justify-center mt-7">
            <SearchBar isSearchPage filterResult={filterResult} />
          </div>
          {userData.length === 0  && (
            <div className="mt-5 text-center">
              <p className="text-dark2 dark:text-light2 h4-medium">
                Nothing matches{" "}
                <span className="font-semibold">{`${
                  searchTerm
                }`}</span>
              </p>
            </div>
          )}
           {(filterData.length === 0 && search)  && (
            <div className="mt-5 text-center">
              <p className="text-dark2 dark:text-light2 h4-medium">
                Nothing matches{" "}
                <span className="font-semibold">{`${
                  search
                }`}</span>
              </p>
            </div>
          )}
          <div className="divide-y divide-light2 dark:divide-dark4 border-t border-b dark:border-dark4 border-light2">
            {data.map((data) => (
              <div className="px-5 py-3" key={data._id}>
                <UserCard name={data.displayName} {...data} />
              </div>
            ))}
          </div>
          {noMoreUsers ? null : (
            <div>
              <Button disabled={loading} onClick={fetchMoreUsers}>
                {loading ? <Loader size="sm" /> : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default SearchPage;
