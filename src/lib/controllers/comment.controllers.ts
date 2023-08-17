import { Types } from "mongoose"
import Comment from '../models/comment.model'
import Tweet from '../models/tweet.model'
import {IComment} from '@/types'
/**
 * 
 * @param commentId 
 * @returns 
 * @route /api/comments/:commentId/replies
 * @method GET
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
            replies: comment
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
 */
const add_comment_to_tweet = async (tweetId: Types.ObjectId, commentData: Pick<IComment, 'author' | "text"| 'tweetId'>) => {
    try{
    const tweet = await Tweet.findById(tweetId)
    const comment = new Comment(commentData)
    if(!comment || !tweet)
        {
            return {
                status: 'failed',
                message: "could not find comment or tweet."
            }
        }
    await comment.save();
    tweet.comments.push(comment._id as unknown as Types.ObjectId)
    await tweet.save();
    return {
        status: 'success',
        comment
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
 */
const add_reply_to_comment = async (commentId:Types.ObjectId, commentData: Pick<IComment, 'author' | "text"| "parentComment"| 'tweetId'>)=> {
    try{
        const comment = await Comment.findById(commentId)
        if(!comment)
        {
            return {
                status: 'failed',
                message: "could not find comment"
            }
        }
        commentData.parentComment = comment._id as unknown as Types.ObjectId
        const reply = new Comment(commentData)
        await reply.save()
        comment.replies.push(comment._id)
        await comment.save()
        return {
            status: 'success',
            reply
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