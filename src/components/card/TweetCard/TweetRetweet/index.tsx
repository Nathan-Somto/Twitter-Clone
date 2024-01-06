import { formatNumber } from "@/utils";
import React from "react";

type Props = {
  handleRetweet: () => Promise<void>;
  disableBtn: boolean;
  hasReTweeted: boolean;
  retweets: string[];
};

export default function TweetRetweet({
  handleRetweet,
  disableBtn,
  hasReTweeted,
  retweets,
}: Props) {
  return (
    <button
      disabled={disableBtn || hasReTweeted}
      className="flex  items-center"
      onClick={async (e) => {
        e.stopPropagation();
        await handleRetweet();
      }}
    >
      <div className="rounded-full p-2 transition-all ease-in-out duration-250 flex justify-center group opacity-75 hover:bg-[#13e29d1a] hover:dark:bg-[#13aa751a] items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
        >
          <path
            d="M17.8274 9.7525C17.6084 9.53275 17.2522 9.53275 17.0324 9.7525L15.3674 11.4175V3.7375C15.3674 2.1865 14.1052 0.924997 12.5549 0.924997H8.16742C7.85692 0.924997 7.60492 1.177 7.60492 1.4875C7.60492 1.798 7.85692 2.05 8.16742 2.05H12.5549C13.4849 2.05 14.2424 2.8075 14.2424 3.7375V11.4175L12.5774 9.7525C12.3577 9.53275 12.0014 9.53275 11.7824 9.7525C11.5634 9.97225 11.5619 10.3285 11.7824 10.5475L14.4074 13.1725C14.5162 13.2827 14.6602 13.3375 14.8049 13.3375C14.9497 13.3375 15.0922 13.2835 15.2024 13.1725L17.8274 10.5475C18.0479 10.3285 18.0479 9.97225 17.8274 9.7525ZM9.83242 12.2125H5.44492C4.51492 12.2125 3.75742 11.455 3.75742 10.525V2.845L5.42242 4.51C5.53342 4.62025 5.67742 4.675 5.82142 4.675C5.96542 4.675 6.10942 4.62025 6.21892 4.51C6.43867 4.29025 6.43867 3.934 6.21892 3.715L3.59392 1.09C3.37417 0.869497 3.01792 0.869497 2.79892 1.09L0.17392 3.715C-0.0465801 3.934 -0.0465801 4.29025 0.17392 4.51C0.39442 4.72975 0.74917 4.72975 0.96892 4.51L2.63392 2.845V10.525C2.63392 12.076 3.89617 13.3375 5.44642 13.3375H9.83392C10.1444 13.3375 10.3964 13.0855 10.3964 12.775C10.3964 12.4645 10.1437 12.2125 9.83392 12.2125H9.83242Z"
            className={`${
              hasReTweeted
                ? "dark:!fill-[#008559] !fill-[#17bf63] animate-scale-up"
                : "!fill-[#8899A6]"
            } group-hover:!fill-[#17bf63] dark:group-hover:!fill-[#008559]`}
          />
        </svg>
      </div>

      <span
        className={`${
          hasReTweeted ? "dark:text-[#008559] text-[#17bf63]" : ""
        } small-regular`}
      >
        {formatNumber(retweets.length)}
      </span>
    </button>
  );
}
