import { Types } from "mongoose"
import Comment from '../models/comment.model'
import Tweet from '../models/tweet.model'
import {IComment} from '@/types'
import User from "../models/user.model"
import Notification from "../models/notification.models";
/**
 * 
 * @param commentId 
 * @returns 
 * @route /api/comments/:commentId/replies
 * @method GET
 * @description get's the replies to a particular comment.
 */
const get_replies_to_comment = async (commentId:Types.ObjectId) => {
    try{
        const comment = await Comment.findById(commentId)
        .select('replies')
        .populate({
            path: "replies",
            populate: {
              path: "author",
              select: "username profileImgUrl text createdAt",
            },
          })
        if(!comment) {
            return {
                status: 'failed',
                message: "no replies for comment."
            }
        }
        return {
            status: 'success',
            //@ts-ignore
            replies:comment._doc.replies
        }
    }
    catch(err){
        console.error(err);
        return {
            status: 'failed',
            message: 'An error occurred while getting the replies to the comment.'
        };
    }
}
/**
 * 
 * @param tweetId 
 * @param commentData 
 * @returns 
 * @route /api/comments/
 * @method POST
 * @description adds a comment to a specific tweet.
 */
const add_comment_to_tweet = async (tweetId: Types.ObjectId, commentData: Pick<IComment, 'author' | "text"| 'tweetId'>) => {
    try{
    const tweet = await Tweet.findById(tweetId);
    const user = await User.findById(commentData.author).populate('profileImgUrl displayName username');
    const comment = new Comment(commentData);
    if(!user){
        return {
            status: 'failed',
            message: 'could not find author.',
            author: commentData.author
        }
    }
    if(!comment || !tweet)
        {
            return {
                status: 'failed',
                message: "could not find comment or tweet."
            }
        }
    await comment.save();
    tweet.comments.push(comment._id as unknown as Types.ObjectId)
    const notification = new Notification({
        parentUser: tweet.author,
        actionUser: user._id,
        message: 'commented',
        tweetId: tweet._id
      });
    await notification.save();
    await tweet.save();
    return {
        status: 'success',
        comment:{
            //@ts-ignore
            ...comment._doc,
            author: {
                username: user.username,
                displayName: user.displayName,
                profileImgUrl: user.profileImgUrl,
                _id: user._id
            }
        }
    }
    }
    catch(err)
    {
        console.error(err);
        return {
            status: 'failed',
            message: 'An error occurred while adding the comment to the tweet.'
        };
    }
    
}
/**
 * 
 * @param commentId 
 * @param commentData 
 * @route /api/comments/:commentId/replies
 * @returns 
 * @method POST
 * @description adds a reply to a specific comment.
 */
const add_reply_to_comment = async (commentId:Types.ObjectId, commentData: Pick<IComment, 'author' | "text"| "parentComment"| 'tweetId'>)=> {
    try{
        const comment = await Comment.findById(commentId)
        const user = await User.findById(commentData.author).populate('profileImgUrl displayName username');
        if(!user){
            return {
                status: 'failed',
                message: 'could not find author.',
                author: commentData.author
            }
        }
        if(!comment)
        {
            return {
                status: 'failed',
                message: "could not find comment"
            }
        }
        const reply = new Comment(commentData)
        comment.replies.push(reply._id);
        await reply.save();
        await comment.save();
        return {
            status: 'success',
            reply:{
                //@ts-ignore
                 ...reply._doc,
                author: {
                    username: user.username,
                    displayName: user.displayName,
                    profileImgUrl: user.profileImgUrl,
                    _id: user._id
                }
            }
        }
    }
    catch(err)
    {
        console.error(err);
        return {
            status: 'failed',
            message: 'An error occurred while posting the reply.'
        };
    }
}
/**
 * @route /api/comments/:commentId/replies/:replyId
 * @method DELETE
 * @description deletes a reply to a specific comment.
 */
const delete_reply_to_comment = async (commentId: Types.ObjectId, replyId: Types.ObjectId) => {
    try{
        const reply = await Comment.findById(replyId)
        const comment = await Comment.findById(commentId)
        if (!reply || !comment) {
            return {
                status: 'failed',
                message: 'Comment or reply not found.'
            };
        }
        if (reply?.parentComment !== comment._id)
        {
            return {
                status:'failed',
                message: 'reply is not a child of comment.'
            }
        }
        await Comment.findByIdAndDelete(replyId);
        await Comment.updateOne({_id: comment._id},{$pull: replyId});
        return {
            status: 'success',
            message: 'Reply deleted successfully.'
        };
        
    }
    catch(err)
    {
        console.error(err);
        return {
            status: 'failed',
            message: 'An error occurred while deleting the reply.'
        };
    }
}
/**
 * @route /api/comments/:commentId
 * @method DELETE
 * @description deletes a specific comment.
 */
const delete_comment = async (commentId: Types.ObjectId,) => {
    try{
        const comment = await Comment.findByIdAndDelete(commentId)
        if (!comment) {
            return {
                status: 'failed',
                message: 'Comment or reply not found.'
            };
        }
        await Comment.deleteMany({ parentComment: commentId });
        return {
            status: 'success',
            message: 'Comment and its children deleted successfully.'
        };
    }
    catch(err)
    {
        console.error(err);
        return {
            status: 'failed',
            message: 'An error occurred while deleting the comment and its children.'
        };
    }
}

export {
    get_replies_to_comment,
    add_reply_to_comment,
    delete_reply_to_comment,
    delete_comment,
    add_comment_to_tweet
}