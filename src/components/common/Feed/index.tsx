import TweetCard from "@/components/card/TweetCard";
import { Button } from "@/components/ui/button";
import {
  filterType,
  selectFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import { TweetState, selectTweets } from "@/features/tweets/tweetsSlice";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";

type Props = {
  fetchMoreTweets: () => Promise<void>;
  noMoreTweets: boolean;
  loading: boolean;
};

function Feed({ fetchMoreTweets, loading, noMoreTweets }: Props) {
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
        filteredTweets = filteredTweets.filter((tweet) => tweet.isPublic);
      }
      return filteredTweets.map((tweet) => ({
        tweet: tweets[originalTweetIndex[tweet._id]],
        originalIndex: originalTweetIndex[tweet._id],
      }));
    },
    []
  );

  return (
    <section className="border-t dark:border-t-dark4 pb-[75px] md:pb-0">
      {filteredTweets(tweets, selectedFilter).map(
        ({ tweet, originalIndex }) => (
          <TweetCard
            {...tweet}
            key={tweet._id}
            isTweetPage={false}
            index={originalIndex}
          />
        )
      )}
      {noMoreTweets ? null : (
        <div>
          {loading ? (
            /* custom loader */
            <div className="flex items-center space-x-2">
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
          ) : (
            <Button disabled={loading} onClick={fetchMoreTweets}>
              {"Load More"}
            </Button>
          )}
        </div>
      )}
      {tweets.tweets.length === 0 && (
        <div>
          <p className="h4-medium font-semibold opacity-80">
            Could not Retrieve Tweets at this moment.
          </p>
          <Button variant="outline">Retry</Button>
        </div>
      )}
    </section>
  );
}

export default Feed;
