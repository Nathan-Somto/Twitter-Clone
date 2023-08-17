import Header from "@/components/common/Header";
import Profile from "@/components/common/Profile";
import React, { useState } from "react";
import dummyData from "@/components/card/TweetCard/fakedata.json";
import TweetCard from "@/components/card/TweetCard";
type Props = {};
function TweetSection<T extends typeof dummyData>({ data }: { data: T }) {
  return (
    <section className="border-t dark:border-t-dark4">
      {data.length ? (
        data.map((data) => <TweetCard {...data} key={data._id} />)
      ) : (
        <p className="h4-semibold">No Data</p>
      )}
    </section>
  );
}
function ProfilePage({}: Props) {
  const [data, setData] = useState(dummyData);
  const [filterData, setFilterData] = useState<typeof dummyData>([]);
  function filterHandler(option: string) {
    if (option === "Tweets") {
      setFilterData([]);
    } else if (option === "Media") {
      const mediaData = data.filter((item) => item.imgUrls.length);
      setFilterData([...mediaData]);
    } else {
      const replyData = data.filter((item) => item.comments.length);
      setFilterData([...replyData]);
    }
  }
  return (
    <div className="border-r dark:border-r-dark4  h-screen overflow-auto">
      <Header titleText="Nathan Somto" subtitleText="6 tweets" />
      <Profile filterHandler={filterHandler} />
      <TweetSection data={filterData.length ? filterData : data} />
    </div>
  );
}

export default ProfilePage;
