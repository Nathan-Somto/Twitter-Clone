import TweetCard from "@/components/card/TweetCard";
import Loader from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import {
  filterType,
  selectFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import {
  Tweet,
  TweetState,
  selectTweets,
  setTweets,
} from "@/features/tweets/tweetsSlice";
import { selectUser } from "@/features/users/usersSlice";
import { CustomSession } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserTweets() {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  // get tweets from redux store.
  const tweets = useSelector(selectTweets);
  const selectedFilter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  // filtering logic for profile page.
  const filteredTweets = useCallback(
    (tweetsState: TweetState, selectedFilter: filterType) => {
      const { tweets, originalTweetIndex } = tweetsState;
      let filteredTweets = tweets.slice();
      if (selectedFilter === "Tweets & Replies") {
        filteredTweets = filteredTweets.filter(
          (tweet) => tweet.comments.length
        );
      }
      if (selectedFilter === "Media") {
        filteredTweets = filteredTweets.filter((tweet) => tweet.imgUrls.length);
      }
      return filteredTweets.map((tweet) => ({
        tweet: tweets[originalTweetIndex[tweet._id]],
        originalIndex: originalTweetIndex[tweet._id],
      }));
    },
    []
  );
  // opportunity to contribute
  // implement the pagination for user tweet's that is load more. too lazy to implement.
  // call a useEffect on first mount to fetch the tweets.
  useEffect(() => {
    async function getUserTweets() {
      try {
        const response = await axios.get(`/api/users/${user._id}?q=tweets`);
        console.log(response.data);
        if (response.data?.status === "success") {
          const accessibleTweets = (
            response.data.tweets as unknown as Tweet[]
          ).filter((tweet) => {
            if (tweet.isPublic) {
              return tweet;
            }
            if (
              !tweet.isPublic &&
              ((user._id !== (session as unknown as CustomSession)?.user?.id ??
                "") ||
                user.followers.includes(user._id))
            ) {
              return tweet;
            }
          });
          dispatch(setTweets(accessibleTweets));
        } else {
          dispatch(setTweets([]));
        }
      } catch (err) {
        console.error(err);
        toast({
          description: `failed to fetch tweets for ${user.username}`,
        });
        dispatch(setTweets([]));
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    if (user?._id && user._id !== "1234") {
      getUserTweets();
    }
  }, [dispatch, user._id, user.username]);

  return (
    <section className="border-t dark:border-t-dark4">
      {loading ? (
        <div className="mt-7 grid place-items-center">
          <Loader size="md" />
        </div>
      ) : tweets.tweets.length ? (
        filteredTweets(tweets, selectedFilter).map(
          ({ tweet, originalIndex }) => (
            <TweetCard
              {...tweet}
              key={tweet._id}
              index={originalIndex}
              isTweetPage={false}
            />
          )
        )
      ) : (
        <p className="text-[20px] font-semibold mt-7 text-center">
          No Tweets Found
        </p>
      )}
    </section>
  );
}
