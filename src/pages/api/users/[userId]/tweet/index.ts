import mongoose from 'mongoose';
import connectDb from "@/lib/config/connectDb";
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_user_tweets } from '@/lib/controllers/user.controllers';
import TweetValidation from '@/lib/validations/tweet';
import { create_tweet, get_feed_tweets } from '@/lib/controllers/tweet.controllers';

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
        await connectDb();
        const { userId,pageSize,pageNumber,latest,top}: dynamicParams = req.query
        if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
          return res.status(400).json({status:"failed", error: "Invalid userId" });
        }
       switch(req.method){
         case 'GET':
            const response = await get_feed_tweets(userId as mongoose.Types.ObjectId,pageSize,pageNumber,top,latest)
            return res.status(200).json(response)
        case 'POST':
            const {text, author, imgUrls,isPublic, isRetweet} = req.body
            const validationResults = TweetValidation.safeParse({
                text,
                author,
                imgUrls,
                isPublic,
                isRetweet
            })
            if(!validationResults.success){
                return res.json(validationResults.error)
            }
            if(!mongoose.Types.ObjectId.isValid(validationResults.data.author)){
                return res.status(400).json({status:"failed",  error: "Invalid  author" })
            }
            //@ts-ignore
            const postResponse =  await create_tweet(userId as mongoose.Types.ObjectId, validationResults.data)
            return res.status(201).json(postResponse) 
        default :
        res.status(405).json({ error: "Method not allowed" });
        break;
         
       }
    }
    catch(err){
        res.status(501).json({ message: "an error just occured" });
    }
}