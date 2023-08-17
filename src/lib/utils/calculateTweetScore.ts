import { ITweet } from "@/types";

const calculateTweetScore = (tweet: ITweet) => {
    const likeWeight = 1;
    const commentWeight = 2;
    const retweetWeight = 5;
    const maxWeight = 1000
    const likesScore = tweet.likes.length * likeWeight;
    const commentsScore = tweet.comments.length * commentWeight;
    const retweetsScore = tweet.retweets.length * retweetWeight;

    const cumulativeScore = (likesScore + commentsScore + retweetsScore) %  maxWeight;

    return cumulativeScore;
};

export default calculateTweetScore