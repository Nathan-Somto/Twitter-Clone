import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import TweetBox from "@/components/form/TweetBox";

import Feed from "@/components/common/Feed";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import connectDb from "@/lib/config/connectDb";
import { get_feed_tweets } from "@/lib/controllers/tweet.controllers";
import { CustomSession } from "@/types";
import mongoose from "mongoose";
import { Tweet, setTweets, updateTweets } from "@/features/tweets/tweetsSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Seo from "@/components/seo";
// export get serverside function to check if user is signed in
// then get the personalized feed for the user.
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
    if (!((session as CustomSession)?.user?.onBoarded)){
      return {
        redirect: {
          destination: "/onboarding",
          permanent: false,
        },
      };
    }
    
    const response = await axios.get(`${process.env.SITE_URL}/api/users/${(session as CustomSession)?.user?.id}/tweet/feed`)
    console.log(response.data)
    if (response.data?.status !== "success") {
      return {
        props: {
          page: 0,
          totalPages: 0,
          tweets: [],
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
      notFound: true,
    };
  }
};
type Props = {
  page: number;
  totalPages: number;
  tweets: Tweet[];
};
function HomePage({ page, totalPages, tweets }: Props) {
  // get the tweets server side and store in state
  const [loading, setLoading] = useState<boolean>(false);
  const [currPage, setCurrPage] = useState<number>(page);
  const session = useSession();
  const dispatch = useDispatch();
  // on first load dispatch tweets to tweets slice
  // i am sure you must be thinking why not pass it as props.
  // i have some components higher up the tree that needs access to the tweet state for filtering.
  // react's one way data flow is a pain in the ass, so redux to the rescue :)
  useEffect(() => {
    dispatch(setTweets(tweets));
  }, [dispatch, tweets]);
  async function fetchMoreTweets() {
    setLoading(true)
    try {
      // when user reaches the end of feed , have a load more button to fetch more tweets.
      if (currPage < totalPages) {
        // /api/users/:userId/tweet/feed?pageSize=:pageSize&page=:page&top=:top&latest=:latest
        const response = await axios.get(
          `/api/${
            (session as unknown as CustomSession)?.user?.id ?? ""
          }/tweet/feed/?page=${currPage + 1}`
        );
        if(response.data?.status !== 'success'){
          throw new Error(response.data)
        }
        else{
          setCurrPage(prevState => prevState + 1);
          dispatch(updateTweets(response.data.tweets as unknown as Tweet[]))
        }
      }
    } catch (err) {
     toast({
      description:"could not retrieve more tweets.",
      variant:'destructive'
     })
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <>
      <Seo
        title="Home / X"
      />
      <Layout>
        <div className=" h-screen overflow-auto border-r dark:border-r-dark4">
          <section className="mb-9">
            <Header titleText="Home" />
            <TweetBox />
          </section>
          {/* Feed */}
          <Feed
            fetchMoreTweets={fetchMoreTweets}
            noMoreTweets={currPage === totalPages}
            loading={loading}
          />
        </div>
      </Layout>
    </>
  );
}

export default HomePage;
