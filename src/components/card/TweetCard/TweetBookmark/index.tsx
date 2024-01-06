import { formatNumber } from "@/utils";
import React from "react";

type Props = {
  disableBtn: boolean;
  handleBookmark: () => Promise<void>;
  bookmarks: string[];
  hasBookmarked: boolean;
};

export default function TweetBookmark({
  disableBtn,
  handleBookmark,
  bookmarks,
  hasBookmarked,
}: Props) {
  return (
    <button
      disabled={disableBtn}
      className="flex  items-center"
      onClick={async (e) => {
        e.stopPropagation();
        await handleBookmark();
      }}
    >
      <div className="rounded-full p-2 transition-all ease-in-out duration-250 flex justify-center group opacity-75 hover:bg-[#158cd11a] hover:dark:bg-[#1c455f70] items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="15"
          viewBox="0 0 18 21"
          fill="none"
        >
          <path
            className={`${
              hasBookmarked
                ? "!fill-[#1da1f2] animate-scale-up dark:!fill-[#4179a9]"
                : "!fill-[#8899A6]"
            } group`}
            d="M16.9 20.5C16.743 20.5 16.588 20.45 16.458 20.356L8.99998 14.928L1.54198 20.358C1.31398 20.522 1.01198 20.548 0.759976 20.418C0.509976 20.291 0.349976 20.033 0.349976 19.751V2.60001C0.349976 1.36001 1.35998 0.350006 2.59998 0.350006H15.398C16.638 0.350006 17.648 1.36001 17.648 2.60001V19.75C17.648 20.032 17.49 20.29 17.238 20.418C17.132 20.473 17.015 20.5 16.898 20.5H16.9ZM8.99998 13.25C9.15497 13.25 9.30998 13.298 9.43998 13.394L16.15 18.277V2.60001C16.15 2.18801 15.813 1.85001 15.4 1.85001H2.59998C2.18698 1.85001 1.84998 2.18801 1.84998 2.60001V18.277L8.55998 13.394C8.68998 13.298 8.84498 13.25 8.99998 13.25Z"
          />
        </svg>
      </div>
      <span
        className={`${
          hasBookmarked ? "text-[#1da1f2] dark:text-[#4179a9]" : ""
        } small-regular`}
      >
        {formatNumber(bookmarks.length)}
      </span>
    </button>
  );
}
