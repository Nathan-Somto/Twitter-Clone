import mongoose from "mongoose";
import { ITweet } from "@/types";
const TweetSchema = new mongoose.Schema<ITweet>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
    maxlength: 280,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isRetweet: {
    type: Boolean,
    required: true,
  },
  originalTweetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tweets" 
},
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "comments" 
}],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "users" 
}],
  retweets: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tweets" 
}],
  imgUrls: [{ 
    type: String 
}],
  isPublic: { 
    type: Boolean,
    default: true, 
    required: true 
},
tweetScore: {
    type: Number,
    min: 0,
    max: 1000,
    required: true
}
});
const Tweets = mongoose.models.tweets ||  mongoose.model("tweets", TweetSchema);
export default Tweets
