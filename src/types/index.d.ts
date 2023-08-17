import mongoose from 'mongoose'
interface IUser {
    username: string,
    email:string,
    password: string,
    joinedAt: Date,
    profileImgUrl?: string,
    profileCoverUrl: string,
    followers?:IUser[],
    displayName: string,
    isVerfied: boolean,
    bio: string,
    onBoarded: boolean
}
 interface ITweet {
    author: mongoose.Types.ObjectId,
    text: string,
    createdAt: Date,
    isRetweet: boolean,
    likes: mongoose.Types.ObjectId[],
    retweets: mongoose.Types.ObjectId[],
    imgUrls?: string[],
    tweetScore: number,
    comments: mongoose.Types.ObjectId[],
    originalTweetId?: mongoose.Types.ObjectId,
    isPublic: boolean
 }
interface IComment {
    author: mongoose.Types.ObjectId,
    text: string,
    createdAt: Date,
    tweetId: mongoose.Types.ObjectId,
    parentComment?: mongoose.Types.ObjectId,
    replies: mongoose.Types.ObjectId[]
}
export {IUser, ITweet, IComment}