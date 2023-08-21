import TweetCard from "@/components/card/TweetCard";
import { Button } from "@/components/ui/button";
import { selectTweets } from "@/features/tweets/tweetsSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

function Feed({}: Props) {
  // get tweets from redux store.
  const {tweets} = useSelector(selectTweets);
  const [page, setPage] = useState<number>(1);
  async function fetchMoreTweets() {
    // when user reaches the end of feed , have a load more button to fetch more tweets.
  }
  //on first load dispatch tweets to tweets slice
  return (
    <section className="border-t dark:border-t-dark4">
      {tweets.map((data) => (
        <TweetCard {...data} key={data._id} isTweetPage={false} />
      ))}
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
      <div>
        <p className="h3-semibold opacity-80">No more Tweets</p>
      </div>
      <div>
        <Button onClick={fetchMoreTweets}>Load More</Button>
      </div>
      {tweets.length !== 0 && (
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
