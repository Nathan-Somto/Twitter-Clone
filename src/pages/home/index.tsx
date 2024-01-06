import {RootLayout} from "@/components/layout";
import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/common/Header";
import TweetBox from "@/components/form/TweetBox";
import Feed from "@/components/home/Feed";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { CustomSession } from "@/types";
import { Tweet, setTweets, updateTweets } from "@/features/tweets/tweetsSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Seo from "@/components/seo";
import { useInView } from "react-intersection-observer";
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
      }/tweet`
    );
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
    console.log((err as Error).message)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
type Props = {
  page: number;
  totalPages: number;
  tweets: Tweet[];
};
function HomePage({ page=0, totalPages=0, tweets }: Props) {
  // get the tweets server side and store in state
  const [currPage, setCurrPage] = useState<number>(page);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noMoreData, setNoMoreData] = useState<boolean>(page === totalPages);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  // on first load dispatch tweets to tweets slice
  // i am sure you must be thinking why not pass it as props.
  // i have some components higher up the tree that needs access to the tweet state for filtering.
  // react's one way data flow is a pain in the ass, so redux to the rescue :)
  useEffect(() => {
    dispatch(setTweets(tweets));
  }, [dispatch, tweets]);

  const fetchMoreTweets = useCallback(async () => {
    if (noMoreData) return;
    setIsLoading(true);
    try {
      // calls the backend to fetch more tweets.
      // /api/users/:userId/tweet/feed?pageSize=:pageSize&pageNumber=:page&top=:top&latest=:latest
      const response = await axios.get(
        `/api/users/${
          (session as unknown as CustomSession)?.user?.id ?? ""
        }/tweet?pageNumber=${currPage + 1}`
      );
      if (response.data?.status !== "success") {
        throw new Error(response.data);
      } else {
        setNoMoreData(currPage + 1 === totalPages);
        setCurrPage((prevState) => prevState + 1);
        dispatch(updateTweets(response.data.tweets as unknown as Tweet[]));
      }
    } catch (err) {
      toast({
        description: "could not retrieve more tweets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currPage, dispatch, noMoreData, session, totalPages]);
  useEffect(() => {
    // when user reaches the end of feed . check if the placeholder element is in view and add more tweets.
    if (inView && !noMoreData) {
      fetchMoreTweets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, noMoreData]);

  return (
    <>
      <Seo title="Home / X" />
      <RootLayout>
        <div>
          <section className="mb-9">
            <Header titleText="Home" />
            <TweetBox />
          </section>
          {/* Feed */}
          <Feed loading={isLoading} />
          {/* Placeholder element for infinite scroll */}
          <div className="h-5" ref={ref}></div>
        </div>
      </RootLayout>
    </>
  );
}

export default HomePage;
