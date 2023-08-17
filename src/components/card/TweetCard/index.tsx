import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
interface Props {
  _id: string;
  author: {
    username: string;
    _id: string;
    profileImgUrl?: string;
  };
  text: string;
  createdAt: string;
  isRetweet: boolean;
  likes: string[];
  imgUrls: string[];
  comments: string[];
  tweetScore: number;
  retweets: string[];
  isTweetPage:boolean;
}

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
  isTweetPage
}: Props) {
  const Router = useRouter();
  return (
    <article
      className={`flex w-full flex-col  pb-4 pt-6 min-h-[80px] px-5 border-b dark:border-b-dark4`}
    >
      <div className="flex flex-col items-center w-full gap-3">
        {/* Top container */}
        <div className="flex gap-2 w-full item-center">
          <Link href={`/profile/${author._id}`} className="relative h-11 w-11">
            <Image
              src={author?.profileImgUrl ?? ""}
              alt="user_community_image"
              fill
              className="cursor-pointer rounded-full"
            />
          </Link>
          <div className="flex w-full flex-col">
            <Link
              href={`/profile/${author._id}`}
              className="flex items-center gap-2"
            >
              <h3 className="cursor-pointer body-bold  text-primaryBlack dark:text-primaryWhite">
                {"Nathan Somto"}
              </h3>
              <h4 className="cursor-pointer base-semibold text-dark2 dark:text-light2">
                @{author.username} <span>{isRetweet ? "Retweeted" : ""}</span>
                <span className="small-medium text-dark2 dark:text-light2 ml-3">
                  {" "}
                  23s
                </span>
              </h4>
            </Link>
            <p className="mt-2 base-regular dark:text-primaryWhite">{text}</p>
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
          <button
            onClick={() => Router.push(`/tweet/${_id}`)}
            className="flex gap-2 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M9.53452 0.681511L6.42352 0.674011H6.42202C3.14152 0.674011 0.572021 3.24426 0.572021 6.52551C0.572021 9.59901 2.96152 11.93 6.17077 12.053V14.924C6.17077 15.005 6.20377 15.1385 6.26077 15.2263C6.36727 15.395 6.54877 15.4865 6.73477 15.4865C6.83827 15.4865 6.94252 15.458 7.03627 15.398C7.23427 15.272 11.891 12.293 13.1023 11.2685C14.5288 10.061 15.3823 8.29101 15.3845 6.53451V6.52176C15.38 3.24651 12.812 0.681511 9.53452 0.680761V0.681511ZM12.3748 10.4105C11.5243 11.1305 8.72827 12.9643 7.29577 13.8928V11.5025C7.29577 11.192 7.04452 10.94 6.73327 10.94H6.43627C3.69127 10.94 1.69777 9.08301 1.69777 6.52551C1.69777 3.87501 3.77377 1.79901 6.42277 1.79901L9.53302 1.80651H9.53452C12.1835 1.80651 14.2595 3.88101 14.261 6.52851C14.2588 7.96101 13.5545 9.41151 12.3755 10.4105H12.3748Z"
                fill="#8899A6"
              />
            </svg>
            <span className="small-regular">61</span>
          </button>
          <button className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
            >
              <path
                d="M17.8274 9.7525C17.6084 9.53275 17.2522 9.53275 17.0324 9.7525L15.3674 11.4175V3.7375C15.3674 2.1865 14.1052 0.924997 12.5549 0.924997H8.16742C7.85692 0.924997 7.60492 1.177 7.60492 1.4875C7.60492 1.798 7.85692 2.05 8.16742 2.05H12.5549C13.4849 2.05 14.2424 2.8075 14.2424 3.7375V11.4175L12.5774 9.7525C12.3577 9.53275 12.0014 9.53275 11.7824 9.7525C11.5634 9.97225 11.5619 10.3285 11.7824 10.5475L14.4074 13.1725C14.5162 13.2827 14.6602 13.3375 14.8049 13.3375C14.9497 13.3375 15.0922 13.2835 15.2024 13.1725L17.8274 10.5475C18.0479 10.3285 18.0479 9.97225 17.8274 9.7525ZM9.83242 12.2125H5.44492C4.51492 12.2125 3.75742 11.455 3.75742 10.525V2.845L5.42242 4.51C5.53342 4.62025 5.67742 4.675 5.82142 4.675C5.96542 4.675 6.10942 4.62025 6.21892 4.51C6.43867 4.29025 6.43867 3.934 6.21892 3.715L3.59392 1.09C3.37417 0.869497 3.01792 0.869497 2.79892 1.09L0.17392 3.715C-0.0465801 3.934 -0.0465801 4.29025 0.17392 4.51C0.39442 4.72975 0.74917 4.72975 0.96892 4.51L2.63392 2.845V10.525C2.63392 12.076 3.89617 13.3375 5.44642 13.3375H9.83392C10.1444 13.3375 10.3964 13.0855 10.3964 12.775C10.3964 12.4645 10.1437 12.2125 9.83392 12.2125H9.83242Z"
                fill="#8899A6"
              />
            </svg>
            <span className="small-regular">1.2K</span>
          </button>
          <button className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
            >
              <path
                d="M7.9999 14.2285H7.9894C6.05215 14.1925 0.462402 9.14203 0.462402 4.35853C0.462402 2.06053 2.35615 0.0430298 4.51465 0.0430298C6.23215 0.0430298 7.38715 1.22803 7.99915 2.09053C8.60965 1.22953 9.76465 0.0430298 11.4829 0.0430298C13.6429 0.0430298 15.5359 2.06053 15.5359 4.35928C15.5359 9.14128 9.9454 14.1918 8.00815 14.227H7.9999V14.2285Z"
                fill="#F4245E"
              />
            </svg>
            <span className="text-[#F4245E] small-regular">2.1K</span>
          </button>
          <button className="flex gap-2 items-center">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 18 21"
              fill="none"
            >
              <path
                fill="#8899A6"
                d="M16.9 20.5C16.743 20.5 16.588 20.45 16.458 20.356L8.99998 14.928L1.54198 20.358C1.31398 20.522 1.01198 20.548 0.759976 20.418C0.509976 20.291 0.349976 20.033 0.349976 19.751V2.60001C0.349976 1.36001 1.35998 0.350006 2.59998 0.350006H15.398C16.638 0.350006 17.648 1.36001 17.648 2.60001V19.75C17.648 20.032 17.49 20.29 17.238 20.418C17.132 20.473 17.015 20.5 16.898 20.5H16.9ZM8.99998 13.25C9.15497 13.25 9.30998 13.298 9.43998 13.394L16.15 18.277V2.60001C16.15 2.18801 15.813 1.85001 15.4 1.85001H2.59998C2.18698 1.85001 1.84998 2.18801 1.84998 2.60001V18.277L8.55998 13.394C8.68998 13.298 8.84498 13.25 8.99998 13.25Z"
              />
            </svg>
            <span>
              1.5K
            </span>
          </button>
        </div>
     {(!isTweetPage && comments.length)? (<Link className="text-primaryBlue body-medium block w-[80%] text-left" href={`/tweet/${_id}`}>Show this thread</Link>): null}   
      </div>
    </article>
  );
}

export default TweetCard;
