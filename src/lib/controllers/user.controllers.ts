import { Types } from "mongoose";
import User from "../models/user.model";
import Tweet from "../models/tweet.model";
import Notification from "../models/notification.models";
import { IUser } from "@/types";
import calculateTweetScore from "../utils/calculateTweetScore";

/**
 *
 * @param userId
 * @route /api/users/:userId
 * @method GET
 * @description get's a specific user profile.
 * @returns
 */
const get_user_profile = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findOne({ _id: userId }).select(
      "-tweets, -bookmarks"
    );
    if (!user) {
      return {
        status: "failed",
        user: null,
        messsage: "could not find the user",
      };
    }
    return {
      status: "success",
      user,
      messsage: "the user's profile.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      user: null,
      message: "failed to find user's profile.",
    };
  }
};

/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/followers
 * @description gets the followers for a specific user.
 * @returns
 */
const get_user_followers = async (userId: Types.ObjectId) => {
  try {
    const userFollowers = await User.findById({ id: userId })
      .populate("followers", "username, _id, displayName, profileImgUrl")
      .select("followers");
    if (!userFollowers) {
      return {
        status: "failed",
        user: userId,
        followers: [],
        messsage: "could not find any followers",
      };
    }
    return {
      status: "success",
      user: userId,
      followers: userFollowers,
      messsage: "the users followers.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      message: "failed to find user's followers.",
    };
  }
};
/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/following
 * @description gets the users that a specific user follows.
 * @returns
 */
const get_user_following = async (userId: Types.ObjectId) => {
  try {
    const userFollowing = await User.findById(userId)
      .populate("following", "username, _id, displayName, profileImgUrl")
      .select("following");
    if (!userFollowing) {
      return {
        status: "failed",
        user: userId,
        following: [],
        messsage: "could not find any followers",
      };
    }
    return {
      status: "success",
      user: userId,
      following: userFollowing,
      messsage: "the users following.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      message: "failed to find user's following",
    };
  }
};

/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/follower-suggestion
 * @description generates followers suggestion for a specific user.
 * @returns
 * 
 */
const get_user_follower_suggestion = async (userId: Types.ObjectId) => {
  // controls the max suggestion.
  const maxSuggestion = 5;
  try {
    const user = await User.findById({ id: userId });
    const userSuggestions = [];
    if (!user) return;
    // if the user has no followers. find 10 users that are not the user
    if (user.followers.length === 0) {
      const possibleSuggestions = await User.find({ _id: { $ne: userId } })
        .select("-password, -bookmarks, -followers, -following, -email")
        .limit(10);
      if (possibleSuggestions.length === 0) {
        return {
          status: "failed",
          message: "no users available to suggest.",
        };
      }
      // get a random user  maxSuggestion times and add to suggestion array.
      for (let i = 0; i < maxSuggestion; i++) {
        const randomIndex = Math.floor(
          Math.random() * possibleSuggestions.length
        );
        userSuggestions.push(possibleSuggestions[randomIndex]);
        possibleSuggestions.splice(randomIndex, 1);
      }
    }
    // if the user has followers. get at most  10 users that are not user and user's followers.
    else {
      const possibleSuggestions = await User.find({
        _id: { $nin: [...user.followers, userId] },
      })
        .select("-password, -bookmarks, -followers, -following, -email")
        .limit(10);
      // when we have no suggestion
      if (possibleSuggestions.length === 0) {
        return {
          status: "failed",
          message: "no users available to suggest.",
        };
      }
      // shuffle the possibleSuggestions array using a cool js trick.
      const shfulledSuggestions = possibleSuggestions.sort(
        () => Math.random() - 0.5
      );
      // select the maxSuggestion users and add to userSuggestions array.
      for (
        let i = 0;
        i < maxSuggestion && i < shfulledSuggestions.length;
        i++
      ) {
        userSuggestions.push(shfulledSuggestions[i]);
      }
    }
    return {
      status: "success",
      message: "some user suggestions",
      userSuggestions,
    };
  } catch (err) {
    console.error(err);
    return {
      status: "success",
      message: "an error occured while fetching user suggestions.",
    };
  }
};
/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/tweets?pageSize=:pageSize&page=:page
 * @returns
 * @description gets a paginated list of all the tweets for a specific user.
 */
const get_user_tweets = async (
  userId: Types.ObjectId,
  pageSize = 15,
  page = 1
) => {
  try {
    const user = await User.findById(userId)
      .select("tweets")
      .populate("tweets")
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!user) {
      return {
        status: "failed",
        tweets: null,
        messsage: "could not find the user",
      };
    }
    const totalTweets = user.tweets.length;
    return {
      userId,
      totalPages: Math.ceil(totalTweets / pageSize),
      page,
      pageSize,
      status: "success",
      tweets: user.tweets,
      messsage: "the user's tweets",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      message: "failed to find tweets.",
    };
  }
};
/**
 *
 * @param userId
 * @method PUT
 * @route /api/users/:userId/bookmarks
 * @returns
 * @description adds a tweet to a specific user bookmarks.
 */
const add_to_user_bookmarks = async (
  userId: Types.ObjectId,
  tweetId: Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: "failed",
        message: "user not found!",
      };
    }
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return {
        status: "failed",
        message: "tweet not found!",
      };
    }
    tweet.bookmarks.unshift(userId);
    tweet.tweetScore = calculateTweetScore(tweet);
    user.bookmarks.unshift(tweetId);
    await tweet.save();
    await user.save();
    return {
      status: "success",
      tweet,
      bookmarksForTweets: tweet.bookmarks.length,
      bookmarksForUser: user.bookmarks.length,
      userId,
      tweetId,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return {
        status: "failed",
        message: "failed to bookmark tweet.",
      };
    }
  }
};
/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/bookmarks
 * @returns
 * @description gets all the bookmarks for a specific user.
 */
const get_user_bookmarks = async (
  userId: Types.ObjectId,
  pageSize = 15,
  page = 1
) => {
  try {
    const user = await User.findById(userId)
      .select("bookmarks")
      .populate("bookmarks")
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!user) {
      return {
        status: "failed",
        tweets: null,
        messsage: "could not find the user",
      };
    }
    const totalBookmarks = user.bookmarks.length;
    return {
      userId,
      totalPages: Math.ceil(totalBookmarks / pageSize),
      page,
      pageSize,
      status: "success",
      bookmarks: user.bookmarks,
      messsage: "the user's bookmarks",
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return {
        status: "failed",
        message: "failed to get user's bookmark's.",
      };
    }
  }
};
/**
 *
 * @param userId
 * @method DELETE
 * @route /api/users/:userId/bookmarks/:tweetId
 * @description deletes a bookmark for a specific user.
 * @returns
 */
const delete_from_user_bookmarks = async (
  userId: Types.ObjectId,
  tweetId: Types.ObjectId
) => {
  try {
    // find user
    const user = await User.findById(userId);
    // validate user response
    if (!user) {
      return {
        status: "failed",
        message: "user not found!",
      };
    }
    // find tweet
    const tweet = await Tweet.findById(tweetId);
    // validate tweet response
    if (!tweet) {
      return {
        status: "failed",
        message: "tweet not found!",
      };
    }
    // remove the tweet from user bookmarks.
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => !bookmark.equals(tweetId)
    );
    // remove user id from tweet bookmarks.
    tweet.bookmarks = tweet.bookmarks.filter(
      (bookmark) => !bookmark.equals(userId)
    );
    // save responses
    await user.save();
    tweet.tweetScore = calculateTweetScore(tweet);
    await tweet.save();
    // return response
    return {
      status: "success",
      message: "successfully removed bookmark",
      bookmarksForTweet: tweet.bookmarks,
      bookmarksForUser: user.bookmarks,
      tweetId,
      userId,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return {
        status: "failed",
        message: "failed to bookmark tweet.",
      };
    }
  }
};
/**
 *
 * @param userId
 * @method GET
 * @route /api/users/?searchTerm=:searchTerm&pageSize=:pageSize&page=:page&sortBy=:sortBy
 * @returns
 * @description gets the users in the db based on a search parameter returns a paginated list, allows for sorting as well.
 */
const get_users = async (
  searchTerm = "",
  pageNumber = 1,
  pageSize = 10,
  sortBy = "desc"
) => {
  const searchQuery = searchTerm.trim();
  const sortOrder = sortBy === "desc" ? -1 : 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const regExp = { $regex: searchQuery, $options: "i" };
  const q = {
    $or: [{ username: regExp }, { displayName: regExp }],
  };
  try {
    const totalUsers = await User.countDocuments(q);
    const users = await User.find(searchQuery ? q : {})
      .limit(pageSize)
      .skip(skipAmount)
      .select(
        "-tweets -bookmarks -following -email -profileCoverUrl -bio -joinedAt"
      )
      .sort({ _id: sortOrder });
    if (!users) {
      return {
        status: "failed",
        message: "no user found",
        users: [],
        pageNumber,
        totalPages: 0,
      };
    }
    return {
      totalPages: Math.ceil(totalUsers / pageSize),
      pageNumber,
      message: searchTerm
        ? `found users for ${searchTerm}`
        : "the available users",
      users,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return {
        status: "failed",
        message: "failed to  search for user's.",
        users: [],
        pageNumber,
        totalPages: 0,
      };
    }
  }
};
/**
 *
 * @param userId
 * @method PUT
 * @route /api/users/:userId
 * @description edits a specific user's profile.
 * @returns
 */
const update_user_profile = async (
  userId: Types.ObjectId,
  userProfile: Partial<
    Pick<
      IUser,
      | "bio"
      | "username"
      | "profileImgUrl"
      | "profileCoverUrl"
      | "onBoarded"
      | "displayName"
      | "email"
    >
  >
) => {
  try {
    // validate the user Payload before calling this function
    const foundUser = await User.findById(userId).select("-tweets, -bookmarks");
    if (!foundUser)
      return {
        status: "failed",
        message: "failed to update user profile.",
      };
    foundUser.bio = userProfile.bio || foundUser.bio;
    foundUser.username = userProfile.username || foundUser.username;
    foundUser.profileImgUrl =
      userProfile.profileImgUrl || foundUser.profileImgUrl;
    foundUser.profileCoverUrl =
      userProfile.profileCoverUrl || foundUser.profileCoverUrl;
    foundUser.onBoarded = userProfile.onBoarded || foundUser.onBoarded;
    foundUser.displayName = userProfile.displayName || foundUser.displayName;
    foundUser.email = userProfile.email || foundUser.email;
    await foundUser.save();
    return {
      status: "success",
      updatedUser: foundUser,
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      message: "failed to update user profile.",
    };
  }
};
/**
 *
 * @param userId
 * @method PUT
 * @route /api/users/:userId/follow
 * @description allows for following and unfollowing a specific user.
 * @returns
 */
const follow_user = async (
  newFollowerId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    // look for the user , check if the user is already following
    const foundUser = await User.findById(userId);
    const newFollower = await User.findById(newFollowerId);
    if (!foundUser || !newFollower) {
      return {
        status: "failed",
        message: "invalid user id's",
      };
    }
    const followerIndex = foundUser.followers.indexOf(newFollowerId);
    const followingIndex = newFollower.following.indexOf(userId);
    const isFollowing = followerIndex !== -1 && followingIndex !== -1;
    // if the user is already following unfollow
    if (isFollowing) {
      foundUser.followers.splice(followerIndex, 1);
      newFollower.following.splice(followingIndex, 1);
    } else {
      foundUser.followers.push(newFollowerId);
      newFollower.following.push(userId);
      const notification = new Notification({
        parentUser: foundUser._id,
        actionUser: newFollower._id,
        message: "followed",
      });
      await notification.save();
    }
    await foundUser.save();
    await newFollower.save();
    return {
      status: "success",
      message: isFollowing
        ? "successfully unfollowed the user"
        : "successfully followed the user.",
    };
  } catch (err) {
    return {
      status: "failed",
      message: "an error occured while trying to follow",
    };
  }
};
/**
 * 
 * @param userId 
 * @route /api/users/:userId
 * @method DELTE
 * @description deletes a specific user account.
 * @returns 
 */
const delete_user_profile = async (userId: Types.ObjectId) => {
  try {
    // Delete the user
    await User.findByIdAndDelete(userId);

    // Delete all tweets linked to the user through the author property
    await Tweet.deleteMany({ author: userId });
    // Delete all comments linked to the user
    // Delete all notifications linked to the user
    return {
      status: "success",
      message: "User profile and linked tweets deleted successfully.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      message:
        "An error occurred while deleting the user profile and linked tweets.",
    };
  }
};
/**
 * @todo implement functionality
 * @param userId 
 * @param secretKey
 * @route /api/users/:userId/verify
 * @method PUT
 * @description verifies a user if they have the secret key.
 */
const verify_user = async (userId: Types.ObjectId, secretKey: string) => {
  return("Verified")
};
export {
  get_users,
  get_user_follower_suggestion,
  get_user_followers,
  get_user_following,
  get_user_profile,
  follow_user,
  delete_user_profile,
  update_user_profile,
  get_user_tweets,
  add_to_user_bookmarks,
  get_user_bookmarks,
  delete_from_user_bookmarks,
  verify_user
};
