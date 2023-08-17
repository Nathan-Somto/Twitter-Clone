import connectDb from '@/lib/config/connectDb';
import { toggle_tweet_like } from '@/lib/controllers/tweet.controllers'
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

interface dynamicParams {
    userId?:  mongoose.Types.ObjectId;
    tweetId?:  mongoose.Types.ObjectId;
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const {tweetId, userId}: dynamicParams = req.query
    connectDb()
    if (!mongoose.Types.ObjectId.isValid(userId ?? "") || !mongoose.Types.ObjectId.isValid(tweetId ?? "")) {
        return res.status(400).json({ error: "Invalid userId" });
      }
    if(req.method === 'PUT'){
        const response = await toggle_tweet_like(userId as mongoose.Types.ObjectId, tweetId as mongoose.Types.ObjectId)
        return res.status(201).json(response)
    }
  }
  catch(err){
    res.status(501).json({ message: "an error just occured" });
  }
}