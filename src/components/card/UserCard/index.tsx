import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { CustomSession } from "@/types";
import axios from "axios";
import { toggleFollow } from "@/features/users/usersSlice";
import { toast } from "@/components/ui/use-toast";

type Props = {
  _id: string;
  displayName: string;
  username: string;
  profileImgUrl: string;
  followers?: string[];
};

function UserCard({ _id, displayName, username, profileImgUrl, followers }: Props) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    if (followers) {
      setIsFollowing(
        followers.find(
          (user_id) => user_id === (session as CustomSession)?.user?.id
        ) !== undefined
      );
    }
  }, [followers, session]);
  const isCurrentUserPage =
    router.query?.id === (session as CustomSession)?.user?.id;
  const handleAction = useCallback(async () => {
    // call the api and follow user.
    setLoading(true);
    try {
      if (!(session as CustomSession)?.user?.id) {
        throw new Error("user not Logged in.");
      }
      setIsFollowing((prevState) => !prevState);
      if(followers){
        if (!isFollowing && !isCurrentUserPage) {
         followers?.push((session as CustomSession)?.user?.id ?? "");
        } 
      }
      const response = await axios.put(`/api/users/${_id}/follow`, {
        targetUserId: (session as CustomSession)?.user?.id,
      });
      console.log(response.data);
      if (response.data?.status === "success") {
        // if it is the user's (logged in) profile page dispatch this actions.
        /**
         *  think about it if it is the logged in user page an he/she is viewing the cards on the modal
         *  and unfollows or follows, when he/she exits the data should be updated realtime.
         * */
        if(followers){

          if (isCurrentUserPage) {
            if (isFollowing) {
              // unfollow user.
              dispatch(
                toggleFollow({
                  _id: (session as CustomSession)?.user?.id as string,
                  remove: true,
                })
              );
            } else {
              // follow user.
              dispatch(
                toggleFollow({
                  _id: (session as CustomSession)?.user?.id as string,
                  remove: false,
                })
              );
            }
          }
        }
        }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        if(followers){
          if(isFollowing){
            followers.pop();
          }
          else{
            followers.push((session as CustomSession)?.user?.id ?? "");
          }
        }
        setIsFollowing((prevState) => !prevState);
        toast({
          description: `failed to ${
            isFollowing ? "unfollow" : "follow"
          } ${username}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    _id,
    dispatch,
    followers,
    isCurrentUserPage,
    isFollowing,
    session,
    username,
  ]);
  return (
    <article className="flex min-h-[60px] justify-between gap-4   max-xs:p-4 flex-row items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <Link href={`/profile/${_id}`}>
          <div className="relative h-12 w-12">
            <Image
              src={profileImgUrl}
              alt="user_logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <Link href={`/profile/${_id}`} className="flex-1 w-[60px] block overflow-hidden">
          <h4 className="base-semibold text-dark1 dark:text-light1 text-ellipsis w-full">
            {displayName}
          </h4>
          <p className={`small-medium text-dark2 dark:text-light2`}>
            @{username}
          </p>
          {followers && (
            <p className="small-semibold text-dark2 dark:text-light2 mt-1">
              {followers.length} Follower{followers.length > 1 ? "s" : ""}
            </p>
          )}
        </Link>
      </div>
      <Button
        variant={"outline"}
        onClick={handleAction}
        disabled={loading}
        className="!disabled:cursor-not-allowed"
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </article>
  );
}

export default UserCard;
