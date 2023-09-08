import Header from "@/components/common/Header";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import NotificationCard from "@/components/card/NotificationCard";
import NotificationsFilter from "@/components/filters/NotificationsFilters";
import { CustomSession } from "@/types";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import Seo from "@/components/seo";
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }
    if (!(session as CustomSession)?.user?.onBoarded) {
      return {
        redirect: {
          destination: "/onboarding",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.SITE_URL}/api/users/${
        (session as CustomSession)?.user?.id
      }/notifications`
    );
    console.log(response.data);
    if (response.data?.status !== "success") {
      return {
        props: {
          notifications: [],
        },
      };
    }
    return {
      props: {
        notifications: response.data?.notifications ?? [],
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
type Message = ["followed", "liked", "commented", "retweeted"];
export interface Notification {
  read: boolean;
  tweetId?: string;
  message: Message[number];
  actionUser: {
    profileImgUrl: string;
    displayName: string;
    username: string;
    isVerified: boolean;
    _id: string;
  };
  parentUser: string;
  _id: string;
}
export type Filters = "All" | "Verified" | "Mentions" | "";
type Props = {
  notifications: Notification[];
};

function NotificationsPage({ notifications }: Props) {
  const [notificationsData, setNotificationsData] =
    useState<typeof notifications>(notifications);
  const [filteredData, setFilteredData] = useState<typeof notifications>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Filters>("");
  const { data: session } = useSession();
  // function for handling the filtering of notifications.
  function handleSelect(option: Filters) {
    if (option === "Verified") {
      setFilteredData(
        notificationsData.filter((data) => data.actionUser.isVerified)
      );
    } else if (option === "Mentions") {
      setFilteredData(
        notificationsData.filter((data) => data.message === "commented")
      );
    } else {
      setFilteredData([]);
    }
    setSelectedOption(option);
  }
  const data = selectedOption ? filteredData : notificationsData;
  // check if the user has any unread notifications
  useEffect(() => {
    if (notificationsData.length) {
      setHasUnread(notificationsData.some((data) => !data.read));
    }
  }, [notificationsData]);
  // handle reading of notifications after a specified time limit and if certain conditions are met.
  useEffect(() => {
    async function readNotifications() {
      try {
        const response = await axios.put(
          `/api/users/${(session as unknown as CustomSession)?.user?.id ?? ""}/notifications`
        );
        if (response.data?.status === "success") {
          setHasUnread(false);
          console.log(response.data);
        } else {
          throw new Error(response.data?.message);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
        setHasUnread(false);
      }
    }
    let id: NodeJS.Timeout | number = 0;
    if (notificationsData.length && hasUnread) {
      id = setTimeout(() => {
        readNotifications();
      }, 4000);
    }
    return () => clearTimeout(id);
  }, [notificationsData, session, hasUnread]);
  // handle deleting a specific notification
  async function handleDelete(id: string) {
    try {
      const response = await axios.delete(
        `/api/users/${(session as CustomSession)?.user?.id}/notifications/${id}`
      );
      if (response.data?.status === "success") {
        setNotificationsData(
          notificationsData.filter((data) => data._id !== id)
        );
        toast({
          description: "successfully deleted the notification.",
        });
      } else {
        throw new Error(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast({
          description: "Failed to delete the notification",
        });
      }
    }
  }
  console.log("hasUnread >> ", hasUnread)
  return (
    <>
      <Seo
        title={`(${notificationsData.length}) Notifications for @${
          (session as CustomSession)?.user?.username ?? ""
        } on X`}
      />
      <Layout>
        <section className=" h-screen overflow-auto border-r dark:border-r-dark4 pb-[75px] md:pb-0">
          <Header titleText="Notifications" />
          <NotificationsFilter
            selectedOption={selectedOption}
            handleSelect={handleSelect}
          />
          <div>
            {data.map((item) => (
              <NotificationCard
                handleDelete={handleDelete}
                {...item}
                key={item._id}
                message={item.message as Message[number]}
              />
            ))}
          </div>
          {notificationsData.length === 0 ? (
            <div className="px-6 mt-4">
              <p className="text-[20px] font-semibold">
                No Notifications yet for user, keep exploring X to get noticed.
              </p>
            </div>
          ) : filteredData.length === 0 && selectedOption ? (
            <div className="px-6 mt-4">
              <p className="text-[20px] font-semibold">
                No Notifications fall under{" "}
                <span className="text-primaryBlue"> {selectedOption}</span>{" "}
              </p>
            </div>
          ) : null}
        </section>
      </Layout>
    </>
  );
}

export default NotificationsPage;
