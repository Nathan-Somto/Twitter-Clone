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
    <div className="hidden md:block">
      <div className="md:flex lg:gap-[8px] group justify-center lg:justify-start items-center dark:text-primaryWhite text-primaryBlack body-bold">
        <figure className="relative h-10 w-10 lg:h-9 lg:w-9 flex-shrink-0 block md:self-center lg:self-start">
          {user?.profileImgUrl ? (
          <Image
            src={user.profileImgUrl}
            alt="profile image"
            fill
            className="cursor-pointer rounded-full object-cover"
          />
          ) : (
            <Image
            src={'/profile.svg'}
            alt="profile image"
            fill
            className="cursor-pointer rounded-full object-cover"
          />
          )}
        </figure>
        <div className="hidden lg:block">
          <h4 className="font-semibold">{user.displayName}</h4>
          <p className="opacity-80 small-medium">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
