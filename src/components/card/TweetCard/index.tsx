import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Tweet,
  addNewTweet,
  bookmarkTweet,
  deleteTweet,
  likeTweet,
  reTweet,
} from "@/features/tweets/tweetsSlice";
import { formatFromNow, formatNumber } from "@/utils";
import { CustomSession } from "@/types";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import TweetReply from "./TweetReply";
import TweetRetweet from "./TweetRetweet";
import TweetLike from "./TweetLike";
import TweetBookmark from "./TweetBookmark";
import MoreActions from "./MoreActions";
interface Props extends Tweet {
  isTweetPage: boolean;
  index: number;
}
/**
 *
 *
 * @description used to display tweet created by a user can contain an image. supports liking, retweeting, bookmarking and comments.
 * @returns
 */
function TweetCard({
  _id,
  author,
  comments,
  createdAt,
  imgUrls,
  isRetweet,
  likes,
  text,
  retweets,
  bookmarks,
  isTweetPage,
  index,
  isPublic,
}: Props) {
  const [isLoading, setIsLoading] = useState({
    retweet: false,
    like: false,
    bookmark: false,
  });
  // to avoid spaming my api
  const disableBtn = isLoading.retweet || isLoading.like || isLoading.bookmark;
  const { data: session } = useSession();
  const Router = useRouter();
  const dispatch = useDispatch();
  const hasLiked = useMemo(
    () =>
      likes.find((id) => id === (session as CustomSession)?.user?.id) !==
      undefined,
    [likes, session]
  );
  const hasReTweeted = useMemo(
    () =>
      retweets.find((id) => id === (session as CustomSession)?.user?.id) !==
      undefined,
    [retweets, session]
  );
  const hasBookmarked = useMemo(
    () =>
      bookmarks.find((id) => id === (session as CustomSession)?.user?.id) !==
      undefined,
    [bookmarks, session]
  );
  const isUserTweet = useMemo(() => {
    return (session as CustomSession)?.user?.id === author._id;
  }, [author._id, session]);
  const handleLike = async () => {
    setIsLoading((prevState) => ({ ...prevState, like: true }));
    try {
      // Optimistic Update
      // dispatch to the redux store.
      if (hasLiked) {
        dispatch(
          likeTweet({
            _id: (session as CustomSession)?.user?.id ?? "",
            index,
            remove: true,
          })
        );
      } else {
        dispatch(
          likeTweet({
            _id: (session as CustomSession)?.user?.id ?? "",
            index,
            remove: false,
          })
        );
      }
      // call the toggle like endpoint
      const response = await axios.put(
        `/api/users/${(session as CustomSession)?.user?.id}/tweet/${_id}/like`
      );
      console.log(response.data);
      if (response.data?.status !== "success") {
        throw new Error(response.data);
      }
    } catch (err) {
      console.error((err as unknown as Error).message);
      toast({
        description: `failed to ${hasLiked ? "unlike" : "like"} ${
          author.username ?? ""
        } tweet`,
      });
      if (hasLiked) {
        dispatch(
          likeTweet({
            _id: (session as CustomSession)?.user?.id ?? "",
            index,
            remove: true,
          })
        );
      } else {
        dispatch(
          likeTweet({
            _id: (session as CustomSession)?.user?.id ?? "",
            index,
            remove: false,
          })
        );
      }
    } finally {
      setIsLoading((prevState) => ({ ...prevState, like: false }));
    }
  };
  const handleBookmark = async () => {
    setIsLoading((prevState) => ({ ...prevState, bookmark: true }));
    const isBookmarkPage = Router.pathname.includes("bookmark");
    try {
      // if the user has bookmarked call delete from user bookmarks endpoint.
      if (hasBookmarked) {
        // optimistic update.
        // unbookmark as per usual
        dispatch(
          bookmarkTweet({
            index,
            _id: (session as CustomSession)?.user?.id ?? "",
            remove: true,
          })
        );

        const response = await axios.delete(
          `/api/users/${(session as CustomSession)?.user?.id}/bookmarks/${_id}`
        );
        if (response.data?.status === "success") {
          // we cant go back once we have done this so that is why it cannot be optimistically done.
          // if bookmark page remove tweet from page
          if (isBookmarkPage) {
            // call delete tweet function on dispatch
            dispatch(deleteTweet({ _id, index }));
          }
        } else {
          throw new Error(response.data);
        }
      }
      // else add to user bookmarks.
      else {
        const response = await axios.put(
          `/api/users/${(session as CustomSession)?.user?.id}/bookmarks/`,
          { tweetId: _id }
        );
        if (response.data?.status === "success") {
          // update the bookmark prop for tweet.
          dispatch(
            bookmarkTweet({
              index,
              _id: response.data.userId as string,
              remove: false,
            })
          );
        } else {
          throw new Error(response.data);
        }
      }
    } catch (err) {
      console.error((err as unknown as Error).message);
      // we optimistically updated a delete we should put it back
      if (hasBookmarked) {
        dispatch(
          bookmarkTweet({
            index,
            _id: (session as CustomSession)?.user?.id ?? "",
            remove: true,
          })
        );
      } else {
        dispatch(
          bookmarkTweet({
            index,
            _id: (session as CustomSession)?.user?.id ?? "",
            remove: false,
          })
        );
      }
      toast({
        description: `failed to ${hasBookmarked ? "unbookmark" : "bookmark"} ${
          author.username
        } tweet`,
        variant: "destructive",
      });
    } finally {
      setIsLoading((prevState) => ({ ...prevState, bookmark: false }));
    }
  };
  const handleRetweet = async () => {
    setIsLoading((prevState) => ({ ...prevState, retweet: true }));
    try {
      // think about if the user has retweeted he/she has created a new tweet. so you have to go to your profile to delete the tweet.
      if (!hasReTweeted) {
        // update reTweet count
        dispatch(
          reTweet({
            _id: (session as CustomSession)?.user?.id ?? "",
            index,
            remove: false,
          })
        );
        // create the tweet with the info. pass originalTweetId.
        const response = await axios.post(
          `/api/users/${(session as CustomSession)?.user?.id}/tweet/retweet`,
          { originalTweetId: _id }
        );
        if (response.data?.status === "success") {
          // update the tweet retweet prop in redux store.
          // check what page we are in if it is the home page add the new tweet to the store.
          if (Router.pathname === "/home") {
            dispatch(addNewTweet(response.data.reTweet as Tweet));
          }
        } else {
          throw new Error(response.data);
        }
      }
    } catch (err) {
      dispatch(
        reTweet({
          index,
          remove: true,
          _id: undefined,
        })
      );
      console.error((err as unknown as Error).message);
      toast({
        description: `failed to retweet ${author.username} tweet.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading((prevState) => ({ ...prevState, retweet: false }));
    }
  };
  // only runs if it is for the logged in user.
  // changing the status does not affect the ui, only a server change.
  const handleStatusUpdate = async (str: "Everyone" | "Followers") => {
    try {
      const isPublic = str === "Everyone";
      const response = await axios.put(
        `/api/users/${(session as CustomSession)?.user?.id}/tweet/${_id}`,
        { status: isPublic }
      );
      console.log('from status update >>',response.data);
      if(response.data?.status === 'success'){
        toast({
          description: `successfully changed the status to ${
            isPublic ? "Everyone" : "Followers"
          }.`,
        });
      }
    } catch (err) {}
  };
  // affects the ui and a whole lot on the server.
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/users/${(session as CustomSession)?.user?.id}/tweet/${_id}`
      );
      console.log('from delete >>',response.data);
      if (response.data?.status === "success") {
        if (Router.pathname.includes("tweet")) {
          Router.push("/home");
          return;
        }
        dispatch(deleteTweet({ _id, index }));
      } else {
        throw new Error(response.data);
      }
      toast({
        description: "succesfully deleted tweet.",
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast({
        description: "failed to delete tweet.",
        variant: "destructive",
      });
    }
  };
  return (
    <article
      className={`flex w-full flex-col  pb-4 pt-6 min-h-[80px] px-5 border-b dark:border-b-dark4`}
    >
      <div className="flex flex-col items-center w-full gap-3">
        {/* Top container */}
        <div className="flex gap-2 w-full item-center">
          <Link
            href={`/profile/${author._id}`}
            className="relative h-11 w-11 overflow-hidden"
          >
            {author?.profileImgUrl ? (
              <Image
                src={author.profileImgUrl}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            ) : (
              <Image
                src={"/profile.svg"}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            )}
          </Link>
          <div className="flex w-full flex-col">
            {/* Visual clue for if a user retweeted. */}
            {isRetweet && (
              <p className="small-semibold text-[#8899A6] flex items-center mb-[0.35rem]">
                {" "}
                {/* Retweet Icon */}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    className="w-3 h-3 mr-1"
                  >
                    <path
                      d="M17.8274 9.7525C17.6084 9.53275 17.2522 9.53275 17.0324 9.7525L15.3674 11.4175V3.7375C15.3674 2.1865 14.1052 0.924997 12.5549 0.924997H8.16742C7.85692 0.924997 7.60492 1.177 7.60492 1.4875C7.60492 1.798 7.85692 2.05 8.16742 2.05H12.5549C13.4849 2.05 14.2424 2.8075 14.2424 3.7375V11.4175L12.5774 9.7525C12.3577 9.53275 12.0014 9.53275 11.7824 9.7525C11.5634 9.97225 11.5619 10.3285 11.7824 10.5475L14.4074 13.1725C14.5162 13.2827 14.6602 13.3375 14.8049 13.3375C14.9497 13.3375 15.0922 13.2835 15.2024 13.1725L17.8274 10.5475C18.0479 10.3285 18.0479 9.97225 17.8274 9.7525ZM9.83242 12.2125H5.44492C4.51492 12.2125 3.75742 11.455 3.75742 10.525V2.845L5.42242 4.51C5.53342 4.62025 5.67742 4.675 5.82142 4.675C5.96542 4.675 6.10942 4.62025 6.21892 4.51C6.43867 4.29025 6.43867 3.934 6.21892 3.715L3.59392 1.09C3.37417 0.869497 3.01792 0.869497 2.79892 1.09L0.17392 3.715C-0.0465801 3.934 -0.0465801 4.29025 0.17392 4.51C0.39442 4.72975 0.74917 4.72975 0.96892 4.51L2.63392 2.845V10.525C2.63392 12.076 3.89617 13.3375 5.44642 13.3375H9.83392C10.1444 13.3375 10.3964 13.0855 10.3964 12.775C10.3964 12.4645 10.1437 12.2125 9.83392 12.2125H9.83242Z"
                      className={`fill-[#8899A6]`}
                    />{" "}
                  </svg>
                </span>{" "}
                <span>retweeted</span>{" "}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Link
                href={`/profile/${author._id}`}
                className="flex items-center gap-2"
              >
                <h3 className="cursor-pointer small-bold md:body-bold  text-primaryBlack dark:text-primaryWhite">
                  {author.displayName}
                </h3>
                {/* Verified badge */}
                {author.isVerified && (
                  <figure className="w-3 h-3 md:h-5 md:w-5 relative flex-shrink-0 -ml-[6px]">
                    <Image
                      src={"/Twitter_Verified_Badge.svg"}
                      alt="user verified logo"
                      fill
                    />
                  </figure>
                )}
                <h4 className="cursor-pointer small-semibold md:base-semibold text-dark2 dark:text-light2">
                  @{author.username}
                  <span className="subtle-medium md:small-medium text-dark2 dark:text-light2 ml-3">
                    {" "}
                    {formatFromNow(createdAt)}
                  </span>
                </h4>
              </Link>
              <MoreActions
                isUserTweet={isUserTweet}
                handleDelete={handleDelete}
                handleStatusUpdate={handleStatusUpdate}
                isPublic={isPublic}
                author={{ displayName: author.displayName }}
              />
            </div>
            <Link href={`/tweet/${author._id}/${_id}`} >
              <p className="mt-2 md:base-regular whitespace-pre-line  small-regular dark:text-primaryWhite"> {text} </p>
            </Link>
          </div>
        </div>
        {/* Tweet Image */}
        {imgUrls.length ? (
          <figure className="relative h-[300px] w-[80%] overflow-hidden rounded-lg">
            <Image
              fill
              alt="tweet image"
              src={imgUrls[0]}
              className="object-cover"
            />
          </figure>
        ) : null}
        {/* Button container */}
        <div className="w-[80%] mx-auto flex justify-between items-center">
          {/* Comment Btn */}
          <TweetReply
            _id={_id}
            author={{ _id: author._id }}
            comments={comments as string[]}
          />
          {/* Retweet Button */}
          <TweetRetweet
            disableBtn={disableBtn}
            handleRetweet={handleRetweet}
            hasReTweeted={hasReTweeted}
            retweets={retweets}
          />
          {/* Likes */}
          <TweetLike
            disableBtn={disableBtn}
            likes={likes}
            hasLiked={hasLiked}
            handleLike={handleLike}
          />
          {/* Bookmark Button */}
          <TweetBookmark
            bookmarks={bookmarks}
            disableBtn={disableBtn}
            hasBookmarked={hasBookmarked}
            handleBookmark={handleBookmark}
          />
        </div>
        {!isTweetPage && comments.length ? (
          <Link
            className="text-primaryBlue body-medium block w-[80%] text-left"
            href={`/tweet/${author._id}/${_id}`}
          >
            Show this thread
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default TweetCard;
