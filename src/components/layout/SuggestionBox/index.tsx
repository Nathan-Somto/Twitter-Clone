import UserCard from "@/components/card/UserCard";
import Loader from "@/components/ui/loader";
import { CustomSession } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";


type UserSuggestion = {
  _id: string;
  displayName: string;
  username: string;
  profileImgUrl: string;
};

function SuggestionBox() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserSuggestion[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function getSuggestions() {
      try {
        const response = await axios.get(
          `/api/users/${(session as CustomSession).user?.id}?q=follow-suggestion`
        );
        console.log(response.data)
        if (response.data?.status === "success") {
          setUserData((response.data as unknown as UserSuggestion[]))
        } else {
          throw new Error(response.data);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    if (typeof window === "undefined") return;
    const isXl = window.innerWidth >= 1200;
    if (isXl && userData === null && !loading) {
      setLoading(true);
      getSuggestions();
    }
  }, [session, userData]);

  return (
    <section className="dark:bg-dark3 bg-light3  rounded-lg py-3 h-fit  min-h-[300px] divide-y divide-light2 dark:divide-dark4 w-[90%]">
      <h3 className="h4-medium px-2 pb-2">Who to follow</h3>
      {loading ? 
      <div className="h-[250px] flex items-center justify-center">
        <Loader size="md" />
      </div>
         :
      userData !== null && userData.length > 0  ? (
        <div className="divide-y divide-light2 dark:divide-dark4">
          {userData.map((data) => (
            <div className="px-2" key={data._id}>
              <UserCard {...data} />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[250px] flex items-center text-center">
          <p className="text-lg opacity-80 px-5">
            No User&rsquo;s to Suggest at this time
          </p>
        </div>
      )}
    </section>
  );
}

export default SuggestionBox;
