import { createSlice } from '@reduxjs/toolkit'
export interface Tweet{
        _id: string;
        author: {
          username: string;
          _id: string;
          profileImgUrl?: string;
        };
        text: string;
        createdAt: string;
        isRetweet: boolean;
        likes: string[];
        imgUrls: string[];
        comments: string[];
        tweetScore: number;
        retweets: string[];
     
}
interface TweetState  {
    tweets: Tweet[];
  };

  const initialState: TweetState ={
    tweets: []
  }
  type mutateTweetAction ={
    type:string,
    payload: Tweet[]
  }
  type addNewTweetAction = {
    type:string,
    payload: Tweet
  }
export const tweetSlice = createSlice({
    name:"tweets",
    initialState,
    reducers:{
        setTweets : (state, action:mutateTweetAction) => {
            state.tweets = action.payload;
        },
        addNewTweet: (state, action: addNewTweetAction) => {
            state.tweets.unshift(action.payload)
        },
        updateTweets: (state, action: mutateTweetAction) => {
          state.tweets = [...state.tweets, ...action.payload];
        },
        deleteTweet: (state) => {

        },
        likeTweet: (state) => {

        }
    }
});
export const {addNewTweet, updateTweets} = tweetSlice.actions;
export const selectTweets = (state:TweetState) => state.tweets;
export default tweetSlice.reducer