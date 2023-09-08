import Header from "@/components/common/Header";
import Profile from "@/components/profile";
import React, { useEffect } from "react";
import { Profile as IProfile, setUser } from "@/features/users/usersSlice";
import UserTweets from "@/components/profile/UsersTweets";
import { useDispatch } from "react-redux";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Layout from "@/components/layout";
import { setSelectedFilter } from "@/features/filterTweets/filterTweetsSlice";
import axios from "axios";
import { CustomSession } from "@/types";
import Seo from "@/components/seo";
type Props = {
  user: IProfile;
};
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
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
    const profileData = await axios.get(
      `${process.env.SITE_URL}/api/users/${query.id}`
    );

    if (!profileData.data?.user) {
      return {
        notFound: true,
      };
    }
    console.log(profileData.data?.user);
    return {
      props: {
        user: profileData.data.user,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
function ProfilePage({ user }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUser(user));
    dispatch(setSelectedFilter("Tweets"));
  }, [dispatch, user]);
  return (
    <>
    <Seo
      title={`@${user.username + ' on'} X`}
      description={`check out ${user.username} profile on X.`}
    />
    <Layout>
      <div className="border-r dark:border-r-dark4  h-screen overflow-auto pb-[75px] md:pb-0">
        <Header
          titleText={user.displayName}
          subtitleText={`${user.tweets.length} tweet${
            user.tweets.length > 1 ? "s" : ""
          }`}
        />
        <Profile />
        <UserTweets />
      </div>
    </Layout>
    </>
  );
}

export default ProfilePage;
