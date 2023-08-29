import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/theme/themeSlice";
import tweetReducer from "@/features/tweets/tweetsSlice";
import filterTweetsReducer from "@/features/filterTweets/filterTweetsSlice";
import userReducer from "@/features/users/usersSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tweets: tweetReducer,
    filterTweets: filterTweetsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
