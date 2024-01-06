import UserCard from "@/components/card/UserCard";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import { selectUser } from "@/features/users/usersSlice";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

type Props =
  | {
      forFollowers: true;
      forFollowing?: undefined;
      openModal: boolean;
      toggleModal: (modal: 'Followers' |'Following') => void;
    }
  | {
      forFollowers?: undefined;
      forFollowing: true;
        openModal: boolean;
        toggleModal: (modal: 'Followers' |'Following') => void;
    };
type UserList = {
  _id: string;
  displayName: string;
  username: string;
  profileImgUrl: string;
  actionType: "Follow";
  followers: string[];
};
function UsersModal({ forFollowers,openModal,toggleModal }: Props) {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector(selectUser);
  useEffect(() => {
    async function getUsers() {
      try {
        let response;
        if (!!forFollowers) {
          response = await axios.get(`/api/users/${user._id}?q=followers`);
        } else {
          response = await axios.get(`/api/users/${user._id}?q=following`);
        }

        if (response.data?.status === "success") {
          const data = response.data?.following ?? response.data.followers;
          console.log(data);
          setUserList(data as unknown as UserList[]);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          toast({
            description: `failed to fetch ${user.username} ${
              forFollowers ? "followers" : "following"
            }`,
            variant: "destructive",
          });
        }
      }
      finally{
        setLoading(false);
      }
    }
    setLoading(true)
    if(openModal){
        getUsers();
    }
  }, [forFollowers, openModal, user._id, user.username]);

  return (
    <Dialog open={openModal} onOpenChange={() => toggleModal(`${forFollowers ? 'Followers':"Following"}`)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primaryBlack dark:text-light3">
            {`@${user.username} `}
            {forFollowers ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <>
          <div className="flex flex-col h-fit">
            {loading ? (
              <div className="self-center">
                <Loader size="md" />
              </div>
            ) : (
              <>
                {userList.map((user) => (
                  <UserCard {...user} key={user._id} />
                ))}
                {userList.length === 0 && (
                  <div className="text-primaryBlack dark:text-light3 base-medium">
                    <p>{`No ${
                      forFollowers ? "Followers" : "Following"
                    } found for User.`}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}

export default UsersModal;
