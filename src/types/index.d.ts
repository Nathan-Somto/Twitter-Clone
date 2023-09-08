import mongoose from 'mongoose'
import {Session} from 'next-auth'
interface IUser {
    username: string,
    email:string,
    password: string,
    profileImgUrl?: string,
    profileCoverUrl: string,
    followers:mongoose.Types.ObjectId[],
    following:mongoose.Types.ObjectId[],
    displayName: string,
    isVerified: boolean,
    bio: string,
    onBoarded: boolean,
    joinedAt?:Date,
    tweets: mongoose.Types.ObjectId[],
    bookmarks: mongoose.Types.ObjectId[]
}
 interface ITweet {
    author: mongoose.Types.ObjectId,
    text: string,
    createdAt: Date,
    isRetweet: boolean,
    likes: mongoose.Types.ObjectId[],
    retweets: mongoose.Types.ObjectId[],
    bookmarks: mongoose.Types.ObjectId[],
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
interface INotification {
    message: 'followed' | 'liked' | 'commented' | 'retweeted',
    parentUser: mongoose.Types.ObjectId,
    actionUser: mongoose.Types.ObjectId,
    read:boolean,
    tweetId: mongoose.Types.ObjectId,
    createdAt: Date
}
interface CustomSession extends Session {
    user?:{
    onBoarded?: boolean | null;
    username?: string | null;
    id?: string | null; 
    name?: string | null | undefined; 
    email?: string | null | undefined; 
    image?: string | null | undefined;
    isVerified?: boolean | undefined;
   } | undefined
}
export {IUser, ITweet, IComment,INotification, CustomSession}