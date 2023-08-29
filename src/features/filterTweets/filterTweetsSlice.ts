import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";
export type filterType = "Latest" | "Top" | "Following" | "Tweets" |  "Tweets & Replies" | "Media";
type FilteredState = {
    selectedFilter: filterType
}
const initialState : FilteredState = {
    selectedFilter: 'Latest'
}
type Actions = {
    type:string,
    payload: filterType
    }

const FilteredTweetsSlice = createSlice({
     name:"filterTweets",
     initialState,
     reducers : {
       setSelectedFilter : (state, action:Actions) =>{
        state.selectedFilter = action.payload;
       }
     }
});

export const selectFilter = (state: RootState) => state.filterTweets.selectedFilter;
export const {
  setSelectedFilter
  } = FilteredTweetsSlice.actions;
  export default FilteredTweetsSlice.reducer;