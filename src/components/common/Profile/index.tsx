import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
type Props = {
    filterHandler: (filter:string) => void;
};

function Profile({filterHandler}: Props) {
    const [selectedOption, setSelectedOption] = useState("Tweets");
  const filters = ["Tweets", "Tweets & Replies", "Media"];
    function handleSelect(option: typeof filters[number]){
        filterHandler(option)
        setSelectedOption(option)
    }
  return (
    <section className="border-b dark:border-b-dark4">
      <div>
        <figure className="h-[200px] w-full relative">
          <Image
            fill
            src={"/bg-cover.png"}
            alt="cover image"
            className="object-cover"
          />
        </figure>
        <div className="px-6 flex justify-between w-full">
          <div>
            <figure className="h-[139px] w-[139px] -mt-[60px] rounded-full overflow-hidden relative z-[2]">
              <Image
                fill
                src={"/bg-profile.png"}
                alt="profile image"
                className="object-cover"
              />
            </figure>
            <h3 className="h3-semibold mt-3">Nathan Somto</h3>
            <p className="base-medium text-light2">@nathan_somto</p>
            <p className="base-regular mt-5 w-[80%]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
              iure harum sed excepturi accusamus aliquam laudantium esse a,
              repellat molestias?
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button>
                <span className="mr-2 base-bold">450</span>
                <span className="text-light2 base-medium">Following</span>
              </button>
              <button>
                <span className="mr-2 base-bold">120</span>
                <span className="text-light2 base-medium">Followers</span>
              </button>
            </div>
          </div>
          <Button variant={"outline"} className="mt-3 min-w-[130px]">
            {"Edit Profile"}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4 w-[80%] px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleSelect(filter)}
              className={`text-light2 border-b-2 py-3 ${selectedOption === filter ? 'border-b-primaryBlue text-primaryBlue ':'border-b-transparent hover:border-b-light2 text-light2'} base-bold `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Profile;
