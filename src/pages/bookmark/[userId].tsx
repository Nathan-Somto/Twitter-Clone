import TweetCard from "@/components/card/TweetCard";
import Header from "@/components/common/Header";
import Layout from "@/components/layout";
import Seo from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Tweet, selectTweets, setTweets } from "@/features/tweets/tweetsSlice";
import { CustomSession } from "@/types";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authOptions } from "../api/auth/[...nextauth]";
import { toast } from "@/components/ui/use-toast";
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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
    if (!(session as CustomSession)?.user?.onBoarded) {
      return {
        redirect: {
          destination: "/onboarding",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.SITE_URL}/api/users/${
        (session as CustomSession)?.user?.id
      }/bookmarks`
    );
    console.log(response.data);
    if (response.data?.status !== "success") {
      return {
        props: {
          page: 0,
          totalPages: 0,
          bookmarks: [],
        },
      };
    }
    return {
      props: {
        ...response.data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
type Props = {
  bookmarks: Tweet[];
};

export default function BookmarkPage({ bookmarks }: Props) {
  const router = useRouter();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const { tweets } = useSelector(selectTweets);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTweets(bookmarks));
  }, [dispatch, bookmarks]);
  // handles the deletion of all user bookmarks.
  async function handleBookmarksClear() {
        setDisableBtn(true);
    try {
        const response = await axios.delete(`/api/users/${(session as CustomSession)?.user?.id}/bookmarks`);
        if(response.data?.status === 'success'){
            dispatch(setTweets([]));
            toast({
                description: "Successfully cleared user bookmarks"
            })
        }
        else {
            throw new Error(response.data);
        }
    } catch (err) {
        if(err instanceof Error){
            console.error(err.message);
            toast({
                description: 'Failed to clear user bookmarks',
                variant: 'destructive'
            })
        }
    }
    finally{
        setDisableBtn(false);
    }
  }
  return (
    <>
      <Seo
        title={`Bookmarks @${(session as CustomSession)?.user?.username} on X`}
      />
      <Layout>
        <div className=" h-screen overflow-auto border-r dark:border-r-dark4">
          <section>
            <Header
              titleText="Bookmarks"
              subtitleText={`${tweets.length} bookmarks`}
            />
            {/* Display the tweets. */}
          </section>
          <section className="border-t dark:border-t-dark4 px-6 flex items-center justify-end">
            <Button
              className="!text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              variant={"link"}
              onClick={handleBookmarksClear}
              disabled={disableBtn}
            >
              Clear all Bookmarks
            </Button>
          </section>
          <section className="border-t dark:border-t-dark4 pb-[75px] md:pb-0">
            {tweets.map((tweet, index) => (
              <TweetCard
                {...tweet}
                key={tweet._id}
                isTweetPage={false}
                index={index}
              />
            ))}
            {tweets.length === 0 && (
              <div className="px-6 mt-4">
                <h3 className="text-[28px] font-semibold mb-1">
                  No Bookmarks Available
                </h3>
                <p className="!base-medium opacity-70">
                  Find tweets that you like and bookmark
                </p>
                <Button
                  variant="outline"
                  className="text-lg mt-2"
                  onClick={() => router.push("/home")}
                >
                  Go Home
                </Button>
              </div>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}
