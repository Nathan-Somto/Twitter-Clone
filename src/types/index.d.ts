import mongoose from 'mongoose'
import {Session} from 'next-auth'
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
interface CustomSession extends Session {
    user?:{
    onBoarded?: boolean | null;
    username?: string | null;
    id?: string | null; 
    name?: string | null | undefined; 
    email?: string | null | undefined; 
    image?: string | null | undefined;
   } | undefined
}
export {IUser, ITweet, IComment, CustomSession}