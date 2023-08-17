import React from 'react'
import Image from 'next/image'
type Props = {}

function ProfileBox({}: Props) {
    /* replace with session obj */
    const user = {
        displayName:"Mkparu Somtochi",
        username:"nathan_somto",
        profileImgUrl:'/dummy/avatar-3.jpg'
    }
  return (
    <div className="hidden md:block">
        <div  className="md:flex gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold">
        <figure  className="relative h-9 w-9 flex-shrink-0 block">
        <Image
              src={user.profileImgUrl ?? '/profile.svg'}
              alt="profile image"
              fill
              className="cursor-pointer rounded-full object-cover"
              />
        </figure>
        <div className="hidden lg:block">
            <h4 className="font-semibold">{user.displayName}</h4>
            <p className="opacity-80 small-medium">@{user.username}</p>
        </div>
        </div>
    </div>
  )
}

export default ProfileBox