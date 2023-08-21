import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '@/features/theme/themeSlice'
import tweetReducer from '@/features/tweets/tweetsSlice'
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tweets: tweetReducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch