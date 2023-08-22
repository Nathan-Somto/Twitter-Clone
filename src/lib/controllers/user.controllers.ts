import { Types } from "mongoose";
import User from "../models/user.model";
import Tweet from "../models/tweet.model";
import { IUser } from "@/types";
 
/**
 *
 * @param userId
 * @route /api/users/:userId
 * @method GET
 * @returns
 */
const get_user_profile = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findOne({ _id: userId })
      .populate("followers", "username, _id")
      .populate("following", "username, _id")
      .select("-email");
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
      message: "failed to find user's profile.",
    };
  }
};

/**
 *
 * @param userId
 * @method GET
 * @route /api/users/:userId/followers
 * @returns
 */
const get_user_followers = async (userId: Types.ObjectId) => {
  try {
    const userFollowers = await User.findById({ id: userId })
      .populate("followers", "username, _id")
      .select("followers");
    if (!userFollowers) {
      return {
        user: userId,
        followers: [],
        messsage: "could not find any followers",
      };
    }
    return {
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
 * @returns
 */
const get_user_following = async (userId: Types.ObjectId) => {
  try {
    const userFollowing = await User.findById(userId)
      .populate("following", "username, _id")
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
 * @returns
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
    tweet.bookmarks.push(userId);
    user.bookmarks.push(tweetId);
    await tweet.save();
    await user.save();
    return {
      status: "success",
      tweet,
      bookmarksForTweets: tweet.bookmarks.length,
      bookmarksForUser: user.bookmarks.length,
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
    await tweet.save();
    // return response
    return {
      status: "success",
      message: "successfully removed bookmark",
      bookmarksForTweet: tweet.bookmarks,
      bookmarksForUser: user.bookmarks
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
      .select("-password, -bookmarks, -followers, -following, -email")
      .sort({ _id: sortOrder });
    if (!users) {
      return {
        status: "failed",
        message: "no user found",
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
      };
    }
  }
};
/**
 *
 * @param userId
 * @method PUT
 * @route /api/users/:userId
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
    const foundUser = await User.findById(userId).select(
      "bio, email, username, profileImgUrl, profileCoverUrl"
    );
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
 * @returns
 */
const follow_user = async (
  newFollowerId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    // look for the user , check if the user is already following
    const foundUser = await User.findById({ id: userId });
    const newFollower = await User.findById({ id: newFollowerId });
    if (!foundUser || !newFollower) return null;
    const isFollowing = foundUser.followers.indexOf(newFollowerId);
    // if the user is already following unfollow
    if (isFollowing !== -1) {
      foundUser.followers.splice(isFollowing, 1);
      newFollower.following.splice(isFollowing, 1);
    } else {
      foundUser.followers.push(newFollowerId);
      newFollower.following.push(userId);
    }
    await foundUser.save();
    await newFollower.save();
    return {
      success: true,
      message: isFollowing
        ? "successfully unfollowed the user"
        : "successfully followed the user.",
    };
  } catch (err) {
    return {
      success: false,
      message: "an error occured while trying to follow",
    };
  }
};
const delete_user_profile = async (userId: Types.ObjectId) => {
  try {
    // Delete the user
    await User.findByIdAndDelete(userId);

    // Delete all tweets linked to the user through the author property
    await Tweet.deleteMany({ author: userId });

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
  delete_from_user_bookmarks
};
