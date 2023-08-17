import connectDb from '@/lib/config/connectDb';
import { get_tweet, delete_tweet, update_tweet_status} from '@/lib/controllers/tweet.controllers'
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
      switch(req.method)
      {
        case 'GET':
        const getResponse = await get_tweet(tweetId as mongoose.Types.ObjectId, userId as mongoose.Types.ObjectId)
        return res.status(200).json(getResponse);
        case 'PUT':
            if(req.body.status === undefined) {
                return res.status(300).json({message: 'status is required'})
            }
            const putResponse = await update_tweet_status(req.body.status, tweetId as mongoose.Types.ObjectId)
            return res.status(201).json(putResponse)
        return 
        case 'DELETE':
            const deleteResponse = await delete_tweet(tweetId as mongoose.Types.ObjectId, userId as mongoose.Types.ObjectId)
            return res.status(300).json(deleteResponse)
        default:
            res.status(405).json({ error: "Method not allowed" });
            break;
        
      }
  }
  catch(err){
    res.status(501).json({ message: "an error just occured" });
  }
}