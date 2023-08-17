import UserCard from '@/components/card/UserCard';
import React from 'react'

type Props = {}

function SuggestionBox({}: Props) {
  const dummyData = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      imgUrl: "/dummy/avatar-1.jpg",
      actionType: "Follow",
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      imgUrl: "/dummy/avatar-2.jpg",
      actionType: "Follow",
    },
    {
      id: "3",
      name: "Alice Johnson",
      username: "alice",
      imgUrl: "/dummy/avatar-3.jpg",
      actionType: "Follow",
    },
    {
      id: "4",
      name: "Bob Anderson",
      username: "bob",
      imgUrl: "/dummy/avatar-4.jpg",
      actionType: "Follow",
    },
    {
      id: "5",
      name: "Eve Brown",
      username: "eve",
      imgUrl: "/dummy/avatar-1.jpg",
      actionType: "Follow",
    },
  ];
  
  return (
    <div className="dark:bg-dark3 bg-light3  rounded-lg py-3 h-fit  min-h-[300px] divide-y divide-light2 dark:divide-dark4 w-[90%]">
        <h3 className="h4-medium px-5 pb-2">Who to follow</h3>
        <div className="divide-y divide-light2 dark:divide-dark4">
            {dummyData.map((data)=>(
              <div className="px-5" key={data.id}>
                <UserCard {...data}  actionType={data.actionType as "View Profile" | "Follow"} />
              </div>
            ))}
        </div>
    </div>
  )
}

export default SuggestionBox