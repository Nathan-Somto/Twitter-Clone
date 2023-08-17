import CommentBox from "@/components/form/CommentBox";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dummyData from "@/components/card/TweetCard/fakedata.json";
import ReplyCard from "@/components/card/ReplyCard";
type Props = {
  author: {
    _id: string;
    username: string;
    profileImgUrl: string;
  };
  text: string;
  createdAt: string;
  tweetId: string;
  _id: string;
};

function CommentCard({ text, _id, author, tweetId }: Props) {
  const repliesData = dummyData[0].comments[0].replies;
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replies, setReplies] = useState<typeof repliesData>([]);
  function fetchReplies() {
    //@Todo: fetch actual replies from db.
    if (!replies.length) {
      setReplies([...repliesData]);
    }
  }

  return (
    <>
      <article
        className={`flex w-full flex-col relative pb-4 pt-6 min-h-[80px] px-5 ${
          (showReplyBox || replies.length) ? replies.length ?"-mb-6":"-mb-3" : "border-b"
        } dark:border-b-dark4`}
      >
        <div className="flex gap-3">
          <Link
            href={`/profile/${author._id}`}
            className="relative h-9 w-9 flex-shrink-0 block border-l-dark3"
          >
            <Image
              src={author?.profileImgUrl ?? ""}
              alt="profile image"
              fill
              className="cursor-pointer rounded-full object-cover"
            />
          </Link>
          <div>
            <Link href={`/profile/${author._id}`}>
              <h4 className="cursor-pointer base-semibold text-dark2 dark:text-light2">
                @{author.username}
                <span className="small-medium text-dark2 dark:text-light2 ml-3">
                  {" "}
                  13s
                </span>
              </h4>
            </Link>
            <p className="mt-2 base-regular dark:text-primaryWhite">{text}</p>
          </div>
        </div>
        <div className="ml-[48px] mt-3 flex gap-4">
          <button
            onClick={() => setShowReplyBox(prevState => !prevState)}
            className="small-medium flex gap-2 items-center"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M9.53452 0.681511L6.42352 0.674011H6.42202C3.14152 0.674011 0.572021 3.24426 0.572021 6.52551C0.572021 9.59901 2.96152 11.93 6.17077 12.053V14.924C6.17077 15.005 6.20377 15.1385 6.26077 15.2263C6.36727 15.395 6.54877 15.4865 6.73477 15.4865C6.83827 15.4865 6.94252 15.458 7.03627 15.398C7.23427 15.272 11.891 12.293 13.1023 11.2685C14.5288 10.061 15.3823 8.29101 15.3845 6.53451V6.52176C15.38 3.24651 12.812 0.681511 9.53452 0.680761V0.681511ZM12.3748 10.4105C11.5243 11.1305 8.72827 12.9643 7.29577 13.8928V11.5025C7.29577 11.192 7.04452 10.94 6.73327 10.94H6.43627C3.69127 10.94 1.69777 9.08301 1.69777 6.52551C1.69777 3.87501 3.77377 1.79901 6.42277 1.79901L9.53302 1.80651H9.53452C12.1835 1.80651 14.2595 3.88101 14.261 6.52851C14.2588 7.96101 13.5545 9.41151 12.3755 10.4105H12.3748Z"
                fill="#8899A6"
              />
            </svg>
            <span>Reply</span>
          </button>
          {/* Number is dynamic */}
          <button
            onClick={fetchReplies}
            className="text-primaryBlue underline small-medium"
          >
            View <span>4</span> Replies
          </button>
        </div>
      {replies.length !== 0 &&  <div className="dark:bg-dark3 bg-light3 absolute top-[60px] left-[2.15rem] z-4 h-[calc(100%-60px)] w-[2px]"></div>}
      </article>
      {showReplyBox && (
        <CommentBox
          forReply
          commentId={_id}
          tweetId={tweetId}
          authorImage="/dummy/avatar-1.jpg"
          authorId={""}
        />
      )}
      {/* Render out the replies right here */}
      {replies.map((item, index) => (
        <ReplyCard
          commentId={_id}
          key={item._id}
          {...item}
          length={replies.length - 1}
          index={index}
        />
      ))}
    </>
  );
}

export default CommentCard;
