import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountProfile from "@/components/form/AccountProfile";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, toggleFollowers } from "@/features/users/usersSlice";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
import UsersModal from "./UsersModal";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  filterType,
  setSelectedFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import { RootState } from "@/store";
import { formatJoinedAt } from "@/utils";

function Profile() {
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  // selector for current user info.
  const user = useSelector(selectUser);
  // selector for filter options.
  const selectedOption = useSelector(
    (state: RootState) => state.filterTweets.selectedFilter
  );
  const dispatch = useDispatch();
  // checks if it is user's (logged in) page.
  const isUser = (session as CustomSession)?.user?.id === user._id;
  // checks to see if user (logged in) is following the profile currently showing on the profile page.
  const isFollowing = useMemo(() => {
    if (!isUser) {
      return user.followers.some((follower) => follower === (session as CustomSession)?.user?.id );
    }
  }, [isUser, session, user.followers]);

  const filters: filterType[] = ["Tweets", "Tweets & Replies", "Media"];
  // for filtering user tweet's.
  function handleSelect(option: (typeof filters)[number]) {
    // used index type to get type of individual filters.
    dispatch(setSelectedFilter(option));
  }

  // for handling follow toggling.
  async function handleFollowToggle() {
    setLoading(true);
    try {
      // optimistic update.
      if (isFollowing) {
        // unfollow user.
        dispatch(
          toggleFollowers({
            _id: (session as CustomSession)?.user?.id as string,
            remove: true,
          })
        );
      } else {
        // follow user.
        dispatch(
          toggleFollowers({
            _id: (session as CustomSession)?.user?.id as string,
            remove: false,
          })
        );
      }
      const response = await axios.put(`/api/users/${user._id}/follow`, {
        targetUserId: (session as CustomSession)?.user?.id,
      });
      console.log(response.data);
      if (response.data?.status !== "success") {
        throw new Error(response.data);
      }
    } catch (err) {
      // reset if error.
      if (isFollowing) {
        // unfollow user.
        dispatch(
          toggleFollowers({
            _id: (session as CustomSession)?.user?.id as string,
            remove: true,
          })
        );
      } else {
        // follow user.
        dispatch(
          toggleFollowers({
            _id: (session as CustomSession)?.user?.id as string,
            remove: false,
          })
        );
      }
      if (err instanceof Error) {
        console.error(err);
      }
      toast({
        description: `failed to ${isFollowing ? "unfollow" : "follow"} ${
          user.username
        }`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  // for toggling either user followers modal or following modal.
  function toggleModal(modal: "Followers" | "Following") {
    if (modal === "Followers") {
      setOpenFollowersModal((prevState) => !prevState);
    } else {
      setOpenFollowingModal((prevState) => !prevState);
    }
  }
  // for closing edit modal.
  function closeEditModal() {
    setOpenEditModal(false);
  }
  return (
    <section className="border-b dark:border-b-dark4">
      <div>
        <figure className="h-[200px] w-full relative">
          {user?.profileCoverUrl ? (
            <Image
              fill
              src={user.profileCoverUrl}
              alt="cover image"
              className="object-cover"
            />
          ) : (
            <div className="absolute h-full w-full inset-0 z-3 bg-gradient-to-b from-primaryBlue to-light4 dark:to-primaryBlack"></div>
          )}
        </figure>
        <div className="sm:px-6 px-2 flex justify-between w-full">
          <div>
            <figure className="h-[139px] w-[139px] -mt-[60px] rounded-full overflow-hidden relative z-[2]">
              {user?.profileImgUrl ? (
                <Image
                  fill
                  src={user.profileImgUrl}
                  alt="profile image"
                  className="object-cover"
                />
              ) : (
                <Image
                  fill
                  src={"/profile.svg"}
                  alt="profile image"
                  className="object-cover"
                />
              )}
            </figure>
            <h3 className="h4-medium !font-semibold sm:h3-semibold mt-3">{user.displayName}</h3>
            <p className="small-medium sm:base-medium text-light2">@{user.username}</p>
            <p className="small-regular sm:base-regular mt-5 w-[80%]">{user.bio}</p>
            <p className="small-regular sm:base-regular mt-3 flex items-center gap-[0.55rem] text-light2 ">
              {/* Calender svg */}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(136 153 166)"
                  version="1.1"
                  id="Capa_1"
                  width="14px"
                  height="14px"
                  viewBox="0 0 361.77 361.77"
                >
                  <g>
                    <g>
                      <g>
                        <path d="M323.885,43.77h-27.5V25c0-13.807-11.193-25-25-25h-1c-13.807,0-25,11.193-25,25v18.77h-129V25c0-13.807-11.193-25-25-25     h-1c-13.807,0-25,11.193-25,25v18.77h-27.5c-13.807,0-25,11.193-25,25v268c0,13.809,11.193,25,25,25h286     c13.807,0,25-11.191,25-25v-268C348.885,54.963,337.691,43.77,323.885,43.77z M306.885,322.27h-252v-203h252V322.27z" />
                        <path d="M89.136,211.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4H89.136c-2.209,0-4,1.791-4,4v43.498     C85.136,209.343,86.927,211.134,89.136,211.134z" />
                        <path d="M159.136,211.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4h-43.498c-2.209,0-4,1.791-4,4v43.498     C155.136,209.343,156.927,211.134,159.136,211.134z" />
                        <path d="M229.136,211.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4h-43.498c-2.209,0-4,1.791-4,4v43.498     C225.136,209.343,226.927,211.134,229.136,211.134z" />
                        <path d="M89.136,281.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4H89.136c-2.209,0-4,1.791-4,4v43.498     C85.136,279.343,86.927,281.134,89.136,281.134z" />
                        <path d="M159.136,281.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4h-43.498c-2.209,0-4,1.791-4,4v43.498     C155.136,279.343,156.927,281.134,159.136,281.134z" />
                        <path d="M229.136,281.134h43.498c2.209,0,4-1.791,4-4v-43.498c0-2.209-1.791-4-4-4h-43.498c-2.209,0-4,1.791-4,4v43.498     C225.136,279.343,226.927,281.134,229.136,281.134z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span className="underline">
                {`joined ${formatJoinedAt(user.joinedAt)}`}
              </span>
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => toggleModal("Following")}>
                <span className="mr-2 base-bold">{user.following.length}</span>
                <span className="text-light2 base-medium">Following</span>
              </button>
              <button onClick={() => toggleModal("Followers")}>
                <span className="mr-2 base-bold">{user.followers.length}</span>
                <span className="text-light2 base-medium">
                  Follower{user.followers.length > 1 ? "s" : ""}
                </span>
              </button>
            </div>
          </div>
          {isUser ? (
            <Dialog
              open={openEditModal}
              onOpenChange={() => setOpenEditModal((prevState) => !prevState)}
            >
              <DialogTrigger asChild>
                <Button variant={"outline"} className="mt-3 min-w-[130px]">
                  {"Edit Profile"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AccountProfile
                  headingText="Edit Profile"
                  user={{
                    id: user._id,
                    bio: user.bio,
                    image: user.profileImgUrl ?? "",
                    profileCover: user.profileCoverUrl ?? "",
                    name: user.displayName,
                    username: user.username,
                  }}
                  btnTitle="Save"
                  forOnboarding={false}
                  closeModal={closeEditModal}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant={"outline"}
              disabled={loading}
              className="disabled:!cursor-not-allowed mt-3"
              onClick={handleFollowToggle}
            >
              <>{isFollowing ? "Unfollow" : "Follow"} </>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 min-w-[320px] w-[80%] px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleSelect(filter)}
              className={`text-light2 border-b-2 py-3 ${
                selectedOption === filter
                  ? "border-b-primaryBlue text-primaryBlue "
                  : "border-b-transparent hover:border-b-light2 text-light2"
              } base-bold `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <UsersModal
        forFollowers
        openModal={openFollowersModal}
        toggleModal={toggleModal}
      />
      <UsersModal
        forFollowing
        openModal={openFollowingModal}
        toggleModal={toggleModal}
      />
    </section>
  );
}

export default Profile;
