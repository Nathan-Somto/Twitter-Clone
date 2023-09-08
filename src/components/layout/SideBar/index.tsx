import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileBox from "../ProfileBox";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
import SidebarData from "./SidebarData";
import SidebarRow from "./SidebarRow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TweetBox from "@/components/form/TweetBox";
import {useRouter} from 'next/router';
import axios from "axios";
function SideBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [numberOfUnreadNotifications, setNumberOfUnreadNotifications] =
    useState<number>(-1);
  function toggleModal() {
    setOpen((prevState) => !prevState);
  }
  // get the number of unread notifications from server and display on client.
  useEffect(() => {
    async function getNumberOfUnreadNotifications() {
      try {
        const response = await axios.get(
          `/api/users/${
            (session as CustomSession)?.user?.id ?? ""
          }/notifications/unread-notifications`
        );
        console.log(response.data);
        if (response.data?.status === "success") {
          setNumberOfUnreadNotifications(
            response.data.numberOfUnreadNotifications as unknown as number
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    }
    if(router.pathname.includes('notifications')){
      setNumberOfUnreadNotifications(0);
    }
    else {
      if(numberOfUnreadNotifications  < 0){
        getNumberOfUnreadNotifications();
      }
    }
  }, [numberOfUnreadNotifications, router.pathname, session]);
  
  return (
    <>
      <nav
        className="fixed bottom-0 md:relative 
      left-0 md:bottom-auto w-full md:top-0 z-20
      flex h-[65px] border-t border-t-light3
     dark:border-t-dark4 border-r-transparent 
       md:border-t-transparent md:h-screen  flex-col 
       justify-between md:gap-12 overflow-visible border-r
     md:border-r-light3 dark:md:border-r-dark4 dark:bg-primaryBlack
     bg-primaryWhite px-5 pt-[0.65rem]
       pb-2 md:px-5 lg:px-10 md:py-6 md:max-w-[275px]"
      >
        <ul className=" flex items-center xl:items-start relative gap-1 md:flex-col justify-between md:px-2 md:justify-center md:gap-4 xl:gap-3 xl:px-4 ">
          {/* X logo */}
          <figure className="xl:px-3 md:block hidden">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:h-[30px] md:w-[30px] h-[50px] w-[50px] hidden md:block relative dark:fill-primaryWhite fill-primaryBlack "
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </figure>

          {SidebarData(
            (session as CustomSession)?.user?.id ?? "",
            numberOfUnreadNotifications
          ).map((item) => (
            <SidebarRow {...item} key={item.text} />
          ))}

          <Button
            className="xl:block hidden w-[180px] h-[50px] "
            onClick={toggleModal}
          >
            {" "}
            Tweet{" "}
          </Button>
          <Button
            onClick={toggleModal}
            size="icon"
            style={{
              boxShadow:
                "rgba(217, 217, 217, 0.2) 0px 0px 5px, rgba(217, 217, 217, 0.25) 0px 1px 4px 1px",
            }}
            className="xl:hidden md:shadow-none w-[45px] h-[45px] rounded-[50%] fixed md:relative md:right-0 md:bottom-0 z-[400] right-[30px] bottom-[100px]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="white"
              height="20"
              width="20"
            >
              <g>
                <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
              </g>
            </svg>
          </Button>
        </ul>
        <ProfileBox
          user={{
            displayName: (session as CustomSession)?.user?.name ?? "no name",
            username:
              (session as CustomSession)?.user?.username ?? "no username",
            profileImgUrl: (session as CustomSession)?.user?.image ?? void 0
          }}
        />
      </nav>
      <Dialog open={open} onOpenChange={toggleModal}>
        <DialogContent className="!max-w-lg !h-fit">
          <div>
            <TweetBox toggleModal={toggleModal} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SideBar;
