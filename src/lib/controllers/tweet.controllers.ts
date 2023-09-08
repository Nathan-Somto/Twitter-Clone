import { ITweet } from "@/types";
import User from "../models/user.model";
import Tweet from "../models/tweet.model";
import Notification from "../models/notification.models";
import Comment from "../models/comment.model";
import mongoose, { SortOrder, Types } from "mongoose";
import calculateTweetScore from "../utils/calculateTweetScore";
/**
 * @todo: find a solution for _doc prop. create an interface maybe
 */
/**
 * 
 * @param userId 
 * @param tweetData 
 * @method Post
 * @route /api/users/:userId/tweet/
 * @description creates a single tweet.
 */
const create_tweet = async (userId: Types.ObjectId, tweetData: Pick<ITweet, 'text' | 'author' | 'imgUrls' | 'isPublic' | 'isRetweet'>) => {
  // validation is done before tweetData is passed to function.
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: "failed",
        message: "User not found",
      };
    }
    const tweet = new Tweet({ ...tweetData, author: userId });
    tweet.tweetScore = 0;
    await tweet.save();
    user.tweets.push(tweet._id);
    await user.save();
    return {
      status: "success",
     tweet:{
      //@ts-ignore
      ...tweet._doc,
      author:{
        username: user.username,
        profileImgUrl: user.profileImgUrl,
        _id: user._id,
        displayName: user.displayName,
        isVerified: user.isVerified
      },

     }
    };
  } catch (err) {
    console.error((err as unknown  as Error)?.message)
    return {
      status: "failed",
      message: "failed to create tweet.",
    };
  }
};
/**
 * 
 * @param tweetId 
 * @param userId 
 * @route /api/users/:userId/tweet/:tweetId
 * @method GET
 * @description gets a single tweet with it's comments.
 */
const get_tweet = async (tweetId: Types.ObjectId, userId: Types.ObjectId) => {
  try {
    const tweet = await Tweet.findById(tweetId)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username _id profileImgUrl isVerified",
        },
      })
      .populate({
        path: "author",
        select: "username _id profileImgUrl isVerified displayName",
      });
    if (!tweet) {
      return {
        status: "failed",
        message: "could not find the twet",
        notFound: true,
      };
    }
    if (!tweet.isPublic) {
      const user = await User.findById(userId).select("following");
      if (!user)
        return {
          status: "failed",
          message: "User not found",
          notFound: true
        };
      if (!user.following.includes(tweet.author._id)) {
        return {
          status: "failed",
          noAccess: false,
          message:
            "you cannot read this tweet because it is private consider following the user to gain access.",
        };
      } else {
        return {
          status: "success",
          tweet,
        };
      }
    } else {
      return {
        status: "success",
        tweet,
      };
    }
  } catch (err) {
    if(err instanceof Error){
      console.error(err.message);
    }
    return {
      status: "failed",
      message: "there was an error",
    };
  }
};
/**
 * 
 * @param userId 
 * @param pageSize 
 * @param page 
 * @param top 
 * @param latest 
 * @method GET
 * @route /api/users/:userId/tweet/feed?pageSize=:pageSize&page=:page&top=:top&latest=:latest
 * @description fetches a personalized feed for a user.
 */
const get_feed_tweets = async (
  userId: Types.ObjectId,
  pageSize = 10,
  page = 1,
  top = false,
  latest = true
) => {
  try {
    const user = await User.findById( userId ).select("following");
    if (!user) {
      return {
        status: "failed",
        message: "User not found",
      };
    }
    // basically check if a tweet is public or or if it is the user's tweet show regardless if it is private show only if the user follows the private tweeter.
    const query = {
      $or: [
        { isPublic: true },
        {author: userId},
        { isPublic: false, author: { $in: user.following } },
      ],
    };
    let sortOptions: {tweetScore: SortOrder, createdAt: SortOrder}  = {
      tweetScore: 1,
      createdAt: -1
    };
    if (top) {
      sortOptions.tweetScore = -1;
    }
    if (!latest) {
      sortOptions.createdAt = 1;
    }
    const totalTweets = await Tweet.countDocuments(query);
    // if after  counting it is 0 no need to find.
    if (totalTweets === 0) {
      return {
        status: "failed",
        message: "no tweets available.",
      };
    }
    const tweets = await Tweet.find(query)
      .populate("author", "username profileImgUrl displayName isVerified")
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return {
      status: "success",
      tweets,
      page,
      totalPages: Math.ceil(totalTweets / pageSize),
    };
  } catch (err) {
    return {
      status: "failed",
      message: "failed to fetch tweets.",
    };
  }
};
/**
 * 
 * @param tweetId 
 * @param userId 
 * @route /api/users/:userId/tweets/:tweetId
 * @method DELETE
 * @description deletes a tweet for a user.
 */
const delete_tweet = async (
  tweetId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    await Tweet.findByIdAndDelete({ _id: tweetId });
    await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { tweets: tweetId } }
    );
    // delete all bookmarks of deleted tweet.
      await User.updateMany(
        {bookmarks: tweetId},
        {$pull : { bookmarks: tweetId }}
      )
    // delete all comments associated with the tweet.
    await Comment.deleteMany({ tweetId });
    return {
      status: "successful",
      messsage: "successfully deleted the tweet",
    };
  } catch (err) {
    console.error((err as unknown  as Error).message);
    return {
      status: "failed",
      messsage: "failed to delete the tweet",
    };
  }
};
/**
 * 
 * @param status 
 * @param tweetId
 * @method PUT 
 * @returns 
 * @route /api/users/:userId/tweets/:tweetId
 * @description changes the tweet status from public to private, vice-versa.
 */
// you cant edit the content of a tweet only the status of public or private.
const update_tweet_status = async (status: boolean, tweetId: Types.ObjectId) => {
  try {
    const tweet = await Tweet.findById({ _id: tweetId });
    if (!tweet) {
      return {
        status: "failed",
        message: "Tweet not found",
      };
    }
    tweet.isPublic = status;
    await tweet.save();
    return {
      status: "success",
      message: status ? "made tweet public" : "made tweet private",
    };
  } catch (err) {}
};
/**
 * 
 * @param userId 
 * @method PUT
 * @param tweetId
 * @route /api/users/userId/tweets/:tweetId/like 
 * @description likes and unlikes a tweet.
 */
const toggle_tweet_like = async (
  userId: Types.ObjectId,
  tweetId: Types.ObjectId
) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return {
        status: "failed",
        message: "User not found",
      };
    }
    const tweet = await Tweet.findById({ _id: tweetId });
    if (!tweet) {
      return {
        status: "failed",
        message: "Tweet not found",
      };
    }
    const likeIndex = tweet.likes.indexOf(userId);
    if (likeIndex !== -1) {
      tweet.likes.splice(likeIndex, 1);
    } else {
      tweet.likes.unshift(userId);
      const notification = new Notification({
        parentUser: tweet.author,
        actionUser: userId,
        message: 'liked',
        tweetId: tweet._id

      });
      await notification.save();
    }
    tweet.tweetScore = calculateTweetScore(tweet);
    await tweet.save();
    return {
      status: "success",
      likes: tweet.likes,
      message: `successfully ${likeIndex !== -1 ? 'unliked': 'liked'} tweet`,
      liked: likeIndex === -1,
      userId
    };
  } catch (err) {

  }
};
/**
 * 
 * @param userId 
 * @param originalTweetId 
 * @method POST
 * @route /api/users/:userId/tweet/retweet
 * @description gets the original tweet and retweets it.
 */
const retweet = async (
  originalTweetId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    const user = await User.findById(userId)
      .populate("tweets", "originalTweetId");
    if (!user) {
      return {
        status: "failed",
        message: "User not found",
      };
    }
    const hasRetweeted = (user.tweets as unknown as ITweet[]).some(
      (item) => item.originalTweetId === originalTweetId
    );
    if (hasRetweeted) {
      return {
        status: "failed",
        message: "user has already retweeted.",
      };
    }
    const originalTweet = await Tweet.findById(originalTweetId).select(
      "comments likes retweets text imgUrls tweetScore author"
    );
    if (!originalTweet) {
      return {
        status: "failed",
        message: `a tweet with ${originalTweetId} could not be found.`,
      };
    }
    const newRetweet = new Tweet({
      isRetweet: true,
      originalTweetId,
      author: userId,
      text: originalTweet.text,
      tweetScore:0,
      imgUrls: originalTweet.imgUrls
    });
    user.tweets.unshift(newRetweet._id);
    originalTweet.retweets.unshift(userId);
    originalTweet.tweetScore = calculateTweetScore(originalTweet);
    const notification = new Notification({
      parentUser: originalTweet.author,
      actionUser: userId,
      message: 'retweeted',
      tweetId: originalTweet._id

    });
    await notification.save();
    await newRetweet.save();
    await user.save();
    await originalTweet.save();
    console.log("new retweet>>", newRetweet)
    return {
      status: "success",
      reTweet: {
        //@ts-ignore
        ...newRetweet._doc,
        author:{
          username: user.username,
          profileImgUrl: user.profileImgUrl,
          _id: user._id,
          isVerified: user.isVerified,
          displayName: user.displayName
        },
      },
    };
  } catch (err) {
    if(err instanceof Error){
    console.error("An error occurred:", err.message);
    }
    return {
      status: "failed",
      message: "An error occurred while retweeting.",
    };
  }
};

export {
  get_tweet,
  create_tweet,
  retweet,
  get_feed_tweets,
  update_tweet_status,
  toggle_tweet_like,
  delete_tweet
};
