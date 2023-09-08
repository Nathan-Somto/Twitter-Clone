import React from "react";
import Image from "next/image";
type Props = {
  user: {
    displayName: string;
    username: string;
    profileImgUrl: string | undefined;
  };
};
// just gives a visual cue to the user that he or she is logged in
// no available on mobile, if you want to contribute you can start here and find a place.
function ProfileBox({ user }: Props) {
  return (
    <div className="hidden md:block dark:xl:bg-dark4 xl:bg-light2 xl:rounded-full xl:px-3 xl:py-2">
      <div className="md:flex xl:gap-[8px] group justify-center xl:justify-start items-center dark:text-primaryWhite text-primaryBlack text-[15px]">
        <figure className="relative h-10 self-center w-10 xl:h-9 xl:w-9 flex-shrink-0 block">
          {user?.profileImgUrl ? (
            <Image
              src={user.profileImgUrl}
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
        <div className="hidden xl:block">
          <h4 className="font-semibold text-ellipsis">{user.displayName}</h4>
          <p className="opacity-80 text-[12px] font-medium">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
