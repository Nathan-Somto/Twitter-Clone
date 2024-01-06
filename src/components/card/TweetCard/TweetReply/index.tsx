import { formatNumber } from "@/utils";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  _id: string;
  author: {
    _id: string;
  };
  comments: string[];
};

export default function TweetReply({ _id, author, comments }: Props) {
  const Router = useRouter();
  return (
    <button
      onClick={() => Router.push(`/tweet/${author._id}/${_id}`)}
      className="flex  items-center"
      role="navigation"
    >
      <div className="rounded-full p-2 transition-all ease-in-out duration-250 flex justify-center group opacity-75 hover:bg-[#158cd11a] hover:dark:bg-[#1c455f70] items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className=" group-hover:!opacity-100"
        >
          <path
            d="M9.53452 0.681511L6.42352 0.674011H6.42202C3.14152 0.674011 0.572021 3.24426 0.572021 6.52551C0.572021 9.59901 2.96152 11.93 6.17077 12.053V14.924C6.17077 15.005 6.20377 15.1385 6.26077 15.2263C6.36727 15.395 6.54877 15.4865 6.73477 15.4865C6.83827 15.4865 6.94252 15.458 7.03627 15.398C7.23427 15.272 11.891 12.293 13.1023 11.2685C14.5288 10.061 15.3823 8.29101 15.3845 6.53451V6.52176C15.38 3.24651 12.812 0.681511 9.53452 0.680761V0.681511ZM12.3748 10.4105C11.5243 11.1305 8.72827 12.9643 7.29577 13.8928V11.5025C7.29577 11.192 7.04452 10.94 6.73327 10.94H6.43627C3.69127 10.94 1.69777 9.08301 1.69777 6.52551C1.69777 3.87501 3.77377 1.79901 6.42277 1.79901L9.53302 1.80651H9.53452C12.1835 1.80651 14.2595 3.88101 14.261 6.52851C14.2588 7.96101 13.5545 9.41151 12.3755 10.4105H12.3748Z"
            fill="#8899A6"
            className="group-hover:dark:!fill-[#4179a9] group-hover:!fill-[#1da1f2]"
          />
        </svg>
      </div>
      <span className="small-regular">{formatNumber(comments.length)}</span>
    </button>
  );
}
