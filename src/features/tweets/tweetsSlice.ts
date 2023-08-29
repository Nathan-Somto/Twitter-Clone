import calculateTweetScore from "@/lib/utils/calculateTweetScore";
import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";
interface Author {
  _id: string;
  username: string;
  profileImgUrl: string;
  displayName: string;
}
export interface Comment {
  author: Author;
  text: string;
  createdAt: string;
  tweetId: string;
  _id: string;
  replies: string[] | Replies[];
}
export interface Replies extends Omit<Comment, "replies"> {
  commentId: string;
}
export interface Tweet {
  _id: string;
  author: Author;
  text: string;
  createdAt: string;
  isRetweet: boolean;
  likes: string[];
  imgUrls: string[];
  comments: string[] | Comment[];
  tweetScore: number;
  retweets: string[];
  bookmarks: string[];
  isPublic: boolean;
  
}

export interface TweetState {
  tweets: Tweet[];
  originalTweetIndex: Record<string, number>;
}

const initialState: TweetState = {
  tweets: [],
  originalTweetIndex: {},
};
type mutateTweetAction = {
  type: string;
  payload: Tweet[];
};
type addNewTweetAction = {
  type: string;
  payload: Tweet;
};
type updateLikesAction = {
  type: string;
  payload: {
    index: number;
    _id: string;
    remove: boolean;
  };
};
type updateBooksmarkAction = updateLikesAction;
type reTweetAction = {
  type: string;
  payload: Omit<updateLikesAction["payload"], "remove">;
};
type deleteTweetAction = reTweetAction;
type AddCommentAction = {
  type: string;
  payload: Comment;
};
type DeleteCommentAction = {
  type: string;
  payload: {
    _id: string;
  };
};
type AddReplyAction = {
  type: string;
  payload: {
    comment_id: string;
    reply: Replies;
  };
};
type SetRepliesAction = {
  type: string;
  payload: {
    comment_id: string;
    replies: Replies[];
  };
};
type DeleteReplyAction = {
  type: string;
  payload: {
    comment_id: string;
    _id: string;
  };
};
export const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    setTweets: (state, action: mutateTweetAction) => {
      state.tweets = action.payload;
      const copyOriginalTweetIndex: Record<string, number> = {};
      action.payload.forEach((tweet, index) => {
        copyOriginalTweetIndex[tweet._id] = index;
      });
      state.originalTweetIndex = copyOriginalTweetIndex;
    },
    addNewTweet: (state, action: addNewTweetAction) => {
      state.tweets.unshift(action.payload);
      const copyOriginalTweetIndex: Record<string, number> = {};
      copyOriginalTweetIndex[action.payload._id] = 0;
      state.tweets.slice(1).forEach((tweet, index) => {
        copyOriginalTweetIndex[tweet._id] = index + 1;
      });
      state.originalTweetIndex = copyOriginalTweetIndex;
    },
    updateTweets: (state, action: mutateTweetAction) => {
      const newTweets = action.payload;
      const startIndex = state.tweets.length;
      const copyOriginalTweetIndex: Record<string, number> = {};
      state.tweets = [...state.tweets, ...action.payload];
      newTweets.forEach((tweet, index) => {
        copyOriginalTweetIndex[tweet._id] = startIndex + index;
      });
      state.originalTweetIndex = {
        ...state.originalTweetIndex,
        ...copyOriginalTweetIndex,
      };
    },
    deleteTweet: (state, action: deleteTweetAction) => {
      const { _id, index } = action.payload;
      delete state.originalTweetIndex[_id];
      state.tweets.splice(index, 1);
      const copyOriginalTweetIndex: Record<string, number> = {};
      state.tweets.slice(index + 1).forEach((tweet) => {
        copyOriginalTweetIndex[tweet._id] = index - 1;
      });
      state.originalTweetIndex = copyOriginalTweetIndex;
    },
    // Tweet score calculation is done on server as well this is just to update the ui for filtering.
    likeTweet: (state, action: updateLikesAction) => {
      const { _id, index, remove } = action.payload;
      if (!remove) {
        state.tweets[index].likes.push(_id);
      } else {
        state.tweets[index].likes = state.tweets[index].likes.filter(
          (like_id) => like_id !== _id
        );
      }
      state.tweets[index].tweetScore = calculateTweetScore(state.tweets[index]);
    },
    reTweet: (state, action: reTweetAction) => {
      // you can't remove a retweet unless you delete the actual tweet was retweeted.
      const { _id, index } = action.payload;
      state.tweets[index].retweets.push(_id);
      state.tweets[index].tweetScore = calculateTweetScore(state.tweets[index]);
    },
    bookmarkTweet: (state, action: updateBooksmarkAction) => {
      // removing of bookmark color state should only be done the home page.
      // on bookmark page if you want to unBookmark delete tweet instead
      const { _id, index, remove } = action.payload;
      if (!remove) {
        state.tweets[index].bookmarks.push(_id);
      } else {
        state.tweets[index].bookmarks = state.tweets[index].bookmarks.filter(
          (like_id) => like_id !== _id
        );
      }
      state.tweets[index].tweetScore = calculateTweetScore(state.tweets[index]);
    },
    // the following reducers should only be used in the tweet details page, don't try anything funny.
    // i am using  the zero index because in the tweet details page we only have one tweet.
    // i am asserting that is a Comment[] becuase in the details page the comments are populated from the server.
    addCommentToTweet: (state, action: AddCommentAction) => {
      (state.tweets[0].comments as Comment[]).unshift(action.payload);
    },
    deleteCommentfromTweet: (state, action: DeleteCommentAction) => {
      state.tweets[0].comments = (state.tweets[0].comments as Comment[]).filter(
        (comment) => comment._id !== action.payload._id
      );
    },
    // this function is called when we load the replies underneath a comment.
    setRepliesToComment: (state, action: SetRepliesAction) => {
      const comment = (state.tweets[0].comments as Comment[]).find(
        (comment) => comment._id === action.payload.comment_id
      );
      if (comment) {
        comment.replies = action.payload.replies;
      }
    },
    addReplyToComment: (state, action: AddReplyAction) => {
      const comment = (state.tweets[0].comments as Comment[]).find(
        (comment) => comment._id === action.payload.comment_id
      );
      if (comment) {
        (comment.replies as Replies[]).unshift(action.payload.reply);
      }
    },
    deleteReplyToComment: (state, action: DeleteReplyAction) => {
      const comment = (state.tweets[0].comments as Comment[]).find(
        (comment) => comment._id === action.payload.comment_id
      );
      if (comment) {
        comment.replies = (comment.replies as Replies[]).filter(
          (reply) => reply._id !== action.payload._id
        );
      }
    },
  },
});
export const {
  addNewTweet,
  updateTweets,
  setTweets,
  deleteTweet,
  likeTweet,
  bookmarkTweet,
  reTweet,
  addCommentToTweet,
  setRepliesToComment,
  deleteCommentfromTweet,
  deleteReplyToComment,
  addReplyToComment
} = tweetSlice.actions;
export const selectTweet = (state:RootState) => state.tweets.tweets;
export const selectReplies = (state:RootState,comment_id: string) => {
  const comment = (state.tweets.tweets[0].comments as Comment[]).find((comment) => comment._id === comment_id);
  if(comment) return comment.replies;
  return [];
}
export const selectTweets = (state: RootState) => state.tweets;
export default tweetSlice.reducer;
