import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Notification } from "@/pages/notifications/[userId]";
import NotificationMessage from "./NotificationMessage";
import NotificationSvg from "./NotificationSvg";

type Props = Notification & {
  handleDelete: (id: string) => Promise<void>;
};

function NotificationCard({
  message,
  tweetId,
  actionUser,
  parentUser,
  handleDelete,
  _id,
  read,
}: Props) {
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  async function deleteNotification() {
    setDisableBtn(true);
    try {
      // removes it from the ui
      await handleDelete(_id);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setDisableBtn(false);
    }
  }
  return (
    <article
      className={`relative flex w-full min-h-[80px] pb-4 pt-6 px-5 gap-8 ${
        read ? "opacity-40" : "opacity-100"
      } border-b dark:border-b-dark4`}
    >
      {/* Svg icon */}
      <figure className="self-center">
        <NotificationSvg message={message} size={"25px"} />
      </figure>
      <div>
        <Link href={`/profile/${actionUser._id}`}>
          {/* Profile Image */}
          <figure className="relative rounded-full h-[35px] w-[35px]">
            {actionUser?.profileImgUrl ? (
              <Image
                src={actionUser.profileImgUrl}
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
          </figure>
          {/* Display Name , username  and twitter blue*/}
          <div className="flex items-center gap-[6px]  mb-[0.125rem]">
            <h3 className="text-[18px] font-semibold">
              {actionUser.displayName}{" "}
              <span className="opacity-80 font-medium text-[15px]">
                (@{actionUser.username})
              </span>
            </h3>
            {actionUser.isVerified && (
              <figure className="relative h-[18px] w-[18px]">
                <Image
                  src={"/Twitter_Verified_Badge.svg"}
                  alt="twitter blue"
                  fill
                  className="object-contain"
                />
              </figure>
            )}
          </div>
        </Link>
        {/* Message */}
        <p className="opacity-80 small-regular">
          <NotificationMessage
            message={message}
            tweetId={tweetId}
            actionUser={actionUser}
            parentUser={parentUser}
          />
        </p>
      </div>
      {/* X icon */}
      <button
        onClick={deleteNotification}
        disabled={disableBtn}
        className="absolute top-3 right-3 hover:scale-125 ease-out disabled:opacity-50 disabled:cursor-not-allowed  duration-250 transition-all"
      >
        <X color="#8899A6" size="25" />
      </button>
    </article>
  );
}

export default NotificationCard;
