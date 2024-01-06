import TweetCard from "@/components/card/TweetCard";
import { Button } from "@/components/ui/button";
import {
  filterType,
  selectFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import { TweetState, selectTweets } from "@/features/tweets/tweetsSlice";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {
  loading: boolean;
};

function Feed({ loading }: Props) {
  // get tweets from redux store.
  const tweets = useSelector(selectTweets);
  const selectedFilter = useSelector(selectFilter);
  // filtering logic for feed.
  const filteredTweets = useCallback(
    (tweetsState: TweetState, selectedFilter: filterType) => {
      const { tweets, originalTweetIndex } = tweetsState;
      let filteredTweets = tweets.slice();
      if (selectedFilter === "Top") {
        filteredTweets.sort((a, b) => b.tweetScore - a.tweetScore);
      }

      if (selectedFilter === "Latest") {
        filteredTweets.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (selectedFilter === "Following") {
        filteredTweets = filteredTweets.filter((tweet) => !tweet.isPublic);
      }
      return filteredTweets.map((tweet) => ({
        tweet: tweets[originalTweetIndex[tweet._id]],
        originalIndex: originalTweetIndex[tweet._id],
      }));
    },
    []
  );
  const filteredResults = useMemo(() => {
    return filteredTweets(tweets, selectedFilter);
  }, [tweets, selectedFilter]);
  return (
    <section className="border-t dark:border-t-dark4">
      {!!tweets.tweets.length &&
        (filteredResults.length === 0 && selectedFilter !== "Latest" ? (
          <div className="px-6 mt-4">
            <p className="!body-medium opacity-70">
              Could not find tweets for{" "}
              <span className="text-primaryBlue">{selectedFilter}</span>{" "}
            </p>
          </div>
        ) : (
          filteredResults.map(({ tweet, originalIndex }) => (
            <TweetCard
              {...tweet}
              key={tweet._id}
              isTweetPage={false}
              index={originalIndex}
            />
          ))
        ))}
      {
        <div>
          {loading ? (
            /* custom loader */
            <div className="flex items-center space-x-2 h-5 justify-center">
              <div
                style={{ animationDelay: "0.1s" }}
                className="h-[6px] w-[6px] p-[6px] rounded-full bg-primaryBlue animate-bounce shadow-[0_0_5px_#fff]"
              ></div>
              <div
                style={{ animationDelay: "0.25s" }}
                className="h-[6px] w-[6px] p-[6px] rounded-full bg-primaryBlue animate-bounce shadow-[0_0_5px_#fff]"
              ></div>
              <div
                style={{ animationDelay: "0.4s" }}
                className="h-[6px] w-[6px] p-[6px] rounded-full bg-primaryBlue animate-bounce shadow-[0_0_5px_#fff]"
              ></div>
            </div>
          ) : null}
        </div>
      }
      {tweets.tweets.length === 0 && (
        <div className="px-6 mt-4">
          <h3 className="text-[28px] font-semibold mb-1">
            Oops, Something went wrong
          </h3>
          <p className="!base-medium opacity-70">
            Could not Retrieve Tweets at this moment.
          </p>
          <Button variant="outline" className="text-lg mt-2">
            Retry
          </Button>
        </div>
      )}
    </section>
  );
}

export default Feed;
