import connectDb from '@/lib/config/connectDb';
import { get_feed_tweets} from '@/lib/controllers/tweet.controllers'
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

interface dynamicParams {
    userId?:  mongoose.Types.ObjectId;
    pageSize?:number,
    pageNumber?:number,
    latest?: boolean,
    top?:boolean

  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const { userId,pageSize,pageNumber,latest,top}: dynamicParams = req.query
    connectDb()
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
        return res.status(400).json({ error: "Invalid userId" });
      }
    if(req.method === 'GET'){
        const response = await get_feed_tweets(userId as mongoose.Types.ObjectId,pageSize,pageNumber,top,latest)
        return res.status(200).json(response)
    }
  }
  catch(err){
    res.status(501).json({ message: "an error just occured" });
  }
}