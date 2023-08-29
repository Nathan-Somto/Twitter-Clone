import React from "react";
import { Button } from "@/components/ui/button";
import {
  filterType,
  setSelectedFilter,
  selectFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import { useDispatch, useSelector } from "react-redux";

function FilterBox() {
  const selectedOption = useSelector(selectFilter);
  const dispatch = useDispatch();
  const options: filterType[] = ["Latest", "Top", "Following"];
  function handleSelectOption(option: filterType) {
    dispatch(setSelectedFilter(option));
  }
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
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default FilterBox;
