import React from 'react'
import Header from '../Header'
import TweetBox from '@/components/form/TweetBox'
import dummyTweetData from '@/components/card/TweetCard/fakedata.json'
import TweetCard from '@/components/card/TweetCard'
type Props = {}

export default function Feed({}: Props) {
  return (
    <div className=" h-screen overflow-auto">
        <section className="border-r dark:border-r-dark4  mb-9">
        <Header titleText="Home"/>
        <TweetBox/>

        </section>
        <section className="border-t dark:border-t-dark4">
          {
            dummyTweetData.map((data)=> (
              <TweetCard {...data}  key={data._id} isTweetPage={false}  />
            ))
          }
        </section>
    </div>
  )
}