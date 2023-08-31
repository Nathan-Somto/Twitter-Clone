import TweetCard from "@/components/card/TweetCard";
import Layout from "@/components/layout";
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import CommentCard from "@/components/card/CommentCard";
import CommentBox from "@/components/form/CommentBox";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { CustomSession } from "@/types";

import {
  Tweet,
  selectTweet,
  setTweets,
  Comment,
} from "@/features/tweets/tweetsSlice";
import { useDispatch, useSelector } from "react-redux";
import Seo from "@/components/seo";
import axios from "axios";
// export get serverside function to check if user is signed in
// get the specified tweet check if the user has access to block malicious users from accessing tweets that are not public.
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
    if (!((session as CustomSession)?.user?.onBoarded)){
      return {
        redirect: {
          destination: "/onboarding",
          permanent: false,
        },
      };
    }
    const response = await axios.get(`${process.env.SITE_URL}/api/users/${query.userId}/tweet/${query.id}`)
    console.log(response.data);
    if (response.data?.notFound) {
      return {
        notFound: true,
      };
    }
    if (response.data?.noAccess) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
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
  status: string;
  tweet: Tweet;
};
function TweetPage({ tweet }: Props) {
  const dispatch = useDispatch();
  const tweetData = useSelector(selectTweet);
  useEffect(() => {
    console.log(tweet);
    dispatch(setTweets([tweet]));
  }, [dispatch, tweet]);
  const seoData = !Array.isArray(tweetData) || tweetData.length
    ? {
        username: tweetData[0].author.username,
        text: tweetData[0].text,
      }
    : { username: "", text: "" };
  return (
    <>
      <Seo title={`@${seoData.username + " on "} X : '${seoData.text}'`} />
      <Layout>
        <div className="h-screen overflow-auto border-r dark:border-r-dark4">
          {!Array.isArray(tweetData) || tweetData.length ? (
            <>
              <Header
                titleText={`Tweet`}
                subtitleText={`@${tweetData[0].author.username}`}
              />
              <TweetCard {...tweetData[0]} index={0} isTweetPage />
              <CommentBox forComment tweetId={tweetData[0]._id} />
              {/* Check if the comment is not a string of id's so as not to crash the app. */}
              {tweetData[0].comments.length > 0 &&
                (typeof tweetData[0].comments[0] !== "string" ? (
                  (tweetData[0].comments as Comment[]).map((comment) => (
                    <CommentCard {...comment} key={comment._id} />
                  ))
                ) : (
                  <div>
                    <h3>No Comments for Tweet</h3>
                  </div>
                ))}
            </>
          ) : (
            <div>
              {" "}
              <h3>Could not Fetch Tweet </h3>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default TweetPage;
