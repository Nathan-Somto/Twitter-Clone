import Layout from "@/components/layout";
import React, { useState } from "react";
import Header from "@/components/common/Header";
import TweetBox from "@/components/form/TweetBox";


import Feed from "@/components/common/Feed";
function HomePage() {
  // get the tweets server side and store in state

  return (
    <>
      <Layout>
        <div className=" h-screen overflow-auto">
          <section className="border-r dark:border-r-dark4  mb-9">
            <Header titleText="Home" />
            <TweetBox />
          </section>
          {/* Feed */}
          <Feed />
        </div>
      </Layout>
    </>
  );
}

export default HomePage;

// export get serverside function to check if user is signed in
// then get the personalized feed for the user.
