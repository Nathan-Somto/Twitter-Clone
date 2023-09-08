import React from "react";
import {
  filterType,
  setSelectedFilter,
} from "@/features/filterTweets/filterTweetsSlice";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

function ProfileFilters() {
  const dispatch = useDispatch();
  // selector for filter options.
  const selectedOption = useSelector(
    (state: RootState) => state.filterTweets.selectedFilter
  );
  const filters: filterType[] = ["Tweets", "Tweets & Replies", "Media"];
  // for filtering user tweet's.
  function handleSelect(option: (typeof filters)[number]) {
    // used index type to get type of individual filters.
    dispatch(setSelectedFilter(option));
  }

  return (
    <div className="flex items-center justify-between mt-4 min-w-[320px] w-[80%] px-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleSelect(filter)}
          className={`text-light2 border-b-2 py-3 ${
            selectedOption === filter
              ? "border-b-primaryBlue text-primaryBlue "
              : "border-b-transparent hover:border-b-light2 text-light2"
          } base-bold `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default ProfileFilters;
