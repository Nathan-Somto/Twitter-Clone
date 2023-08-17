import React, { useState } from "react";
import { Button } from "@/components/ui/button";
type Props = {};

function FilterBox({}: Props) {
  const [selectedOption, setSelectedOption] = useState("Latest");
  const options = ["Latest", "Top", "Following"];
  return (
    <div className="dark:bg-dark3 bg-light3 rounded-lg py-3 px-5 h-[90px] w-[90%]">
      <h3 className="h4-medium">Filter Tweets</h3>
      <div className="flex mt-3 items-center  justify-between ">
        {options.map((option) => (
          <Button
            key={option}
            variant="link"
            className={`max-w-fit h-fit p-0 body-medium ${
              selectedOption === option
                ? "!text-primaryBlue underline"
                : "text-light2"
            }`}
            onClick={()=> setSelectedOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default FilterBox;
