import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
type Props = {
    author:{
        _id:string;
        username:string;
        profileImgUrl:string;
    },
    text:string;
    createdAt:string;
    tweetId:string;
    commentId:string;
    length:number;
    index:number
}

function ReplyCard({author,text,createdAt,length,index}: Props) {
  return (
    <article
    className={`flex w-full flex-col relative pb-4 pt-6 min-h-[80px] px-5 ${length === index ? 'border-b':"-mb-6"} dark:border-b-dark4`}
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
    {!(length === index) &&  <div className="dark:bg-dark3 bg-light3 absolute top-[60px] left-[2.15rem] z-4 h-[calc(100%-60px)] w-[2px]"></div>}
    </article>
  )
}

export default ReplyCard