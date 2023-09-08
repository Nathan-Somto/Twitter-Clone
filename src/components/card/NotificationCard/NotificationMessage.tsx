import { Notification } from "@/pages/notifications/[userId]";
import Link from "next/link";

type PickMessageProps = Pick<
  Notification,
  "message" | "tweetId" | "actionUser" | "parentUser"
>;
export default function NotificationMessage({
  message,
  actionUser,
  tweetId,
  parentUser,
}: PickMessageProps) {
  const className = "text-primaryBlue";
  switch (message) {
    case "liked":
      return (
        <>
          Liked your{" "}
          <Link
            href={`/tweet/${parentUser}/${tweetId ?? "1234"}`}
            className={className}
          >
            tweet.
          </Link>
        </>
      );
    case "commented":
      return (
        <>
          Replied to your{" "}
          <Link
            href={`/tweet/${parentUser}/${tweetId ?? "1234"}`}
            className={className}
          >
            tweet.
          </Link>
        </>
      );
    case "followed":
      return (
        <>
          Started following you.{" "}
          <Link href={`/profile/${actionUser._id}`} className={className}>
            Check out!
          </Link>{" "}
          their profile for updates.
        </>
      );
    default:
      return (
        <>
          Retweeted your{" "}
          <Link
            href={`/tweet/${parentUser}/${tweetId ?? "1234"}`}
            className={className}
          >
            tweet.
          </Link>
        </>
      );
  }
}