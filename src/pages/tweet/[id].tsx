import TweetCard from "@/components/card/TweetCard";
import Layout from "@/components/layout";
import React from "react";
import dummyData from "@/components/card/TweetCard/fakedata.json";
import Header from "@/components/common/Header";
import CommentCard from "@/components/card/CommentCard";
import CommentBox from "@/components/form/CommentBox";

function TweetPage() {
  const data = dummyData[0];
  return (
    <Layout>
      <div className="h-screen overflow-auto">
        <Header titleText={`Tweet`} subtitleText={`@${data.author.username}`} />
        <TweetCard {...data} key={data._id} isTweetPage />
        <CommentBox
          forComment
          tweetId={data._id}
          authorId={data.author._id}
          authorImage={data.author.profileImgUrl}
        />
        {data.comments.map((item) => (
          <CommentCard {...item} key={item.createdAt} />
        ))}
      </div>
    </Layout>
  );
}

export default TweetPage;
