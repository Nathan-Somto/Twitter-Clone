import Image from "next/image";
import { useRouter } from "next/router";
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  actionType: "View Profile" | "Follow";
  followers?:string[]
}

function UserCard({ id, name, username, imgUrl, actionType,followers }: Props) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const viewProfile = actionType === "View Profile";
 function handleAction() {
    if(viewProfile){
        return router.push(`/profile/${id}`)
    }
    // call the api and follow user.
 }
  return (
    <article className='flex min-h-[60px] justify-between gap-4   max-xs:p-4 flex-row items-center'>
      <div className='flex flex-1 items-start justify-start gap-3 xs:items-center'>
        <div className='relative h-12 w-12'>
          <Image
            src={imgUrl}
            alt='user_logo'
            fill
            className='rounded-full object-cover'
          />
        </div>

        <Link href={`/profile/${id}`} className='flex-1 w-[60px]'>
          <h4 className='base-semibold text-dark1 dark:text-light1 text-clip w-full'>{name}</h4>
          <p className={`${actionType === "View Profile" ? "subtle-medium":"small-medium"}small-medium text-dark2 dark:text-light2`}>@{username}</p>
          {followers && <p className='small-semibold text-dark2 dark:text-light2 mt-1'>{followers.length} Followers</p>}
        </Link>
      </div>

      <Button
        variant={'outline'}
        onClick={handleAction}
      >
        {viewProfile ? 'View': isFollowing ? 'Following': 'Follow'}
      </Button>
    </article>
  );
}

export default UserCard;